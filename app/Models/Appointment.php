<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    protected $fillable = [
        'appointment_id',
        'patient_id',
        'appointment_date',
        'appointment_time',
        'status',
        'reason',
        'note',
    ];

    protected function casts(): array
    {
        return [
            'appointment_date' => 'date',
        ];
    }
    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }
    public function reminder()
    {
        return $this->hasOne(AppointmentReminder::class);
    }
}
