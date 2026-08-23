<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Dentist extends Model
{
    protected $fillable = [
        'name',
        'year_experienced',
        'skill',
        'status',
        'image_path',
        'user_type',
        'is_dentist'
    ];

    protected function casts(): array
    {
        return [
            'status' => 'boolean',
            'is_dentist' => 'boolean',
            'year_experienced' => 'integer',
        ];
    }
}
