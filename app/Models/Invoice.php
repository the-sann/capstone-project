<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Invoice extends Model
{
    protected $fillable = [
        'invoice_id',
        'treatment_case_id',
        'subtotal',
        'discount',
        'total_amount',
        'paid_amount',
        'balance_amount',
        'status',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'discount' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'paid_amount' => 'decimal:2',
        'balance_amount' => 'decimal:2',
    ];

    public function treatmentCase(): BelongsTo
    {
        return $this->belongsTo(TreatmentCase::class);
    }
    public function items(): HasMany
    {
        return $this->hasMany(InvoiceItem::class);
    }
    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }
}
