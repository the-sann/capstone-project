<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

class Appointment extends Model
{
    protected $fillable = [
        'appointment_id',
        'patient_id',
        'dentist_id',
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
    public function reminders()
    {
        return $this->hasOne(AppointmentReminder::class);
    }
    public function dentist()
    {
        return $this->belongsTo(Dentist::class);
    }
    protected static function booted()
    {

        static::created(function ($appointment) {
            $appointmentDateTime = Carbon::parse(
                $appointment->appointment_date->format('Y-m-d') . ' ' .
                    $appointment->appointment_time
            );
            $appointment->reminders()->create([
                'reminder_at' => $appointmentDateTime->copy()->subMinutes(30),
                'status' => 'pending',
            ]);
        });
    }
}
