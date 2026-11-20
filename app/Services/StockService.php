<?php

namespace App\Services;

use App\Enums\PurchaseStatus;
use App\Enums\StockMovementType;
use App\Enums\StockReason;
use App\Models\Material;
use App\Models\MaterialBatch;
use App\Models\Purchase;
use App\Models\StockMovement;
use DomainException;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class StockService
{
    /**
     * Stock in: creates a new batch and an "in" movement.
     */
    public function stockIn(
        Material $material,
        float $quantity,
        float $unitCost = 0,
        ?string $batchNo = null,
        ?string $expiryDate = null,
        StockReason $reason = StockReason::Opening,
        ?string $note = null,
        ?Model $reference = null,
        ?int $purchaseItemId = null,
    ): StockMovement {
        if ($quantity <= 0) {
            throw new DomainException('Quantity must be greater than zero.');
        }

        return DB::transaction(function () use (
            $material,
            $quantity,
            $unitCost,
            $batchNo,
            $expiryDate,
            $reason,
            $note,
            $reference,
            $purchaseItemId
        ) {
            $material = Material::lockForUpdate()->findOrFail($material->id);

            $batch = $material->batches()->create([
                'purchase_item_id' => $purchaseItemId,
                'batch_no' => $batchNo,
                'expiry_date' => $material->track_expiry ? $expiryDate : null,
                'quantity_received' => $quantity,
                'quantity_remaining' => $quantity,
                'unit_cost' => $unitCost,
            ]);

            if ($unitCost > 0) {
                $material->unit_cost = $unitCost;
            }

            return $this->record(
                $material,
                $batch,
                StockMovementType::In,
                $reason,
                $quantity,
                $note,
                $reference
            );
        });
    }

    /**
     * Stock out: consumes batches FEFO (earliest expiry first).
     * Expired batches are skipped; write them off with adjust() instead.
     *
     * @return StockMovement[]
     */
    public function stockOut(
        Material $material,
        float $quantity,
        StockReason $reason = StockReason::Used,
        ?string $note = null,
        ?Model $reference = null,
    ): array {
        if ($quantity <= 0) {
            throw new DomainException('Quantity must be greater than zero.');
        }

        return DB::transaction(function () use ($material, $quantity, $reason, $note, $reference) {
            $material = Material::lockForUpdate()->findOrFail($material->id);

            $batches = $material->batches()
                ->inStock()
                ->usable()
                ->orderByRaw('expiry_date IS NULL')
                ->orderBy('expiry_date')
                ->orderBy('id')
                ->lockForUpdate()
                ->get();

            if ((float) $batches->sum('quantity_remaining') < $quantity) {
                throw new DomainException(
                    "Not enough usable stock for {$material->name}. "
                        . 'Available: ' . $batches->sum('quantity_remaining') . '.'
                );
            }

            $remaining = $quantity;
            $movements = [];

            foreach ($batches as $batch) {
                if ($remaining <= 0) {
                    break;
                }

                $take = min($remaining, (float) $batch->quantity_remaining);

                $batch->decrement('quantity_remaining', $take);
                $remaining -= $take;

                $movements[] = $this->record(
                    $material,
                    $batch,
                    StockMovementType::Out,
                    $reason,
                    -$take,
                    $note,
                    $reference
                );
            }

            return $movements;
        });
    }

    /**
     * Adjustment: set a batch to the counted quantity.
     * Also used to write off expired or damaged stock.
     */
    public function adjust(
        MaterialBatch $batch,
        float $countedQuantity,
        StockReason $reason = StockReason::Correction,
        ?string $note = null,
    ): ?StockMovement {
        if ($countedQuantity < 0) {
            throw new DomainException('Counted quantity cannot be negative.');
        }

        return DB::transaction(function () use ($batch, $countedQuantity, $reason, $note) {
            $material = Material::lockForUpdate()->findOrFail($batch->material_id);
            $batch = MaterialBatch::lockForUpdate()->findOrFail($batch->id);

            $difference = round($countedQuantity - (float) $batch->quantity_remaining, 2);

            if ($difference == 0) {
                return null; // nothing changed
            }

            $batch->update(['quantity_remaining' => $countedQuantity]);

            return $this->record(
                $material,
                $batch,
                StockMovementType::Adjustment,
                $reason,
                $difference,
                $note
            );
        });
    }

    /**
     * Receive a draft purchase: one batch and one "in" movement per item.
     */
    public function receivePurchase(Purchase $purchase): Purchase
    {
        return DB::transaction(function () use ($purchase) {
            $purchase = Purchase::lockForUpdate()->with('items.material')->findOrFail($purchase->id);

            if ($purchase->status !== PurchaseStatus::Draft) {
                throw new DomainException('Only draft purchases can be received.');
            }

            foreach ($purchase->items as $item) {
                $this->stockIn(
                    material: $item->material,
                    quantity: (float) $item->quantity,
                    unitCost: (float) $item->unit_cost,
                    batchNo: $item->batch_no,
                    expiryDate: $item->expiry_date?->toDateString(),
                    reason: StockReason::Purchase,
                    note: "Purchase {$purchase->reference_no}",
                    reference: $purchase,
                    purchaseItemId: $item->id,
                );
            }

            $purchase->update(['status' => PurchaseStatus::Received]);

            return $purchase;
        });
    }

    /**
     * Writes the movement and keeps materials.current_stock in sync.
     * Always call inside a transaction with the material row locked.
     */
    private function record(
        Material $material,
        ?MaterialBatch $batch,
        StockMovementType $type,
        StockReason $reason,
        float $signedQuantity,
        ?string $note = null,
        ?Model $reference = null,
    ): StockMovement {
        $material->current_stock = round((float) $material->current_stock + $signedQuantity, 2);
        $material->save();

        return StockMovement::create([
            'material_id' => $material->id,
            'material_batch_id' => $batch?->id,
            'type' => $type,
            'reason' => $reason,
            'quantity' => $signedQuantity,
            'balance_after' => $material->current_stock,
            'reference_type' => $reference?->getMorphClass(),
            'reference_id' => $reference?->getKey(),
            'note' => $note,
            'created_by' => Auth::id(),
        ]);
    }
}
