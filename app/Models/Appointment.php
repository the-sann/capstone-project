<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

class Appointment extends Model
{
    public $timestamps = false;
    protected $fillable = [
        'appointment_id',
        'patient_id',
        'dentist_id',
        'treatment_case_id',
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
    public function dentist()
    {
        return $this->belongsTo(Dentist::class);
    }

    public function treatmentCase()
    {
        return $this->belongsTo(TreatmentCase::class);
    }
    protected static function booted()
    {
        static::created(function ($appointment) {
            $date = $appointment->appointment_date->format('Y-m-d');
            $time = $appointment->appointment_time;

            $appointmentDateTime = Carbon::parse(
                $date . ' ' . $time,
                'Asia/Phnom_Penh'
            );

            $appointment->reminder()->create([
                'reminder_at' => $appointmentDateTime
                    ->copy()
                    ->subMinutes(30)
                    ->utc(),
                'status' => 'pending',
            ]);
        });
    }
}
