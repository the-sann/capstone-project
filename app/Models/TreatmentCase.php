<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TreatmentCase extends Model
{
    protected $fillable = [
        'case_id',
        'patient_id',
        'dentist_id',
        'diagnosis',
        'notes',
        'status',
        'total_amount',
        'paid_amount',
        'balance_amount',
    ];

    protected $casts = [
        'total_amount' => 'decimal:2',
        'paid_amount' => 'decimal:2',
        'balance_amount' => 'decimal:2',
    ];

    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }

    public function dentist()
    {
        return $this->belongsTo(Dentist::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(TreatmentCaseItem::class);
    }
    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class);
    }
    public function invoice()
    {
        return $this->hasOne(Invoice::class);
    }
}
