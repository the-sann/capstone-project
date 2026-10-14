<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TreatmentCaseItem extends Model
{
    protected $fillable = [
        'treatment_case_id',
        'treatment_service_id',
        'tooth_number',
        'quantity',
        'unit_price',
        'total_price',
        'status',
        'completed_at',
        'notes',
    ];

    protected $casts = [
        'unit_price' => 'decimal:2',
        'total_price' => 'decimal:2',
        'completed_at' => 'datetime',
    ];

    public function treatmentCase(): BelongsTo
    {
        return $this->belongsTo(TreatmentCase::class);
    }


    public function treatmentService(): BelongsTo
    {
        return $this->belongsTo(
            Treatment::class,
            'treatment_service_id'
        );
    }
}
