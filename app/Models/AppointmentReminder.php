<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class AppointmentReminder extends Model
{
    protected $fillable = [
        'appointment_id',
        'reminder_at',
        'reminded_at',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'reminder_at' => 'datetime',
            'reminded_at' => 'datetime',
        ];
    }

    public function appointment()
    {
        return $this->belongsTo(Appointment::class);
    }
}
