<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    protected $fillable = [
        'patient_id',
        'name',
        'age',
        'gender',
        'phone',
        'address',
    ];

    protected function casts(): array
    {
        return [
            'age' => 'integer',
        ];
    }
    public function appoinments()
    {
        return $this->hasMany(Appointment::class);
    }
}
