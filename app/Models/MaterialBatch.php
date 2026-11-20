<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MaterialBatch extends Model
{
    protected $fillable = [
        'material_id',
        'purchase_item_id',
        'batch_no',
        'expiry_date',
        'quantity_received',
        'quantity_remaining',
        'unit_cost',
    ];

    protected function casts(): array
    {
        return [
            'expiry_date' => 'date',
            'quantity_received' => 'decimal:2',
            'quantity_remaining' => 'decimal:2',
            'unit_cost' => 'decimal:2',
        ];
    }

    public function material(): BelongsTo
    {
        return $this->belongsTo(Material::class);
    }

    public function purchaseItem(): BelongsTo
    {
        return $this->belongsTo(PurchaseItem::class);
    }

    public function movements(): HasMany
    {
        return $this->hasMany(StockMovement::class);
    }

    public function scopeInStock(Builder $query): Builder
    {
        return $query->where('quantity_remaining', '>', 0);
    }

    // Not expired yet (or no expiry date)
    public function scopeUsable(Builder $query): Builder
    {
        return $query->where(function ($q) {
            $q->whereNull('expiry_date')->orWhere('expiry_date', '>=', today());
        });
    }

    public function scopeExpiringWithin(Builder $query, int $days = 30): Builder
    {
        return $query->inStock()
            ->whereNotNull('expiry_date')
            ->whereBetween('expiry_date', [today(), today()->addDays($days)]);
    }

    public function scopeExpired(Builder $query): Builder
    {
        return $query->inStock()
            ->whereNotNull('expiry_date')
            ->where('expiry_date', '<', today());
    }
}
