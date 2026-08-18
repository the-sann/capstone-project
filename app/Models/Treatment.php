<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Treatment extends Model
{
    protected $fillable = [
        'name',
        'description',
        'price',
        'duration',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'duration' => 'integer',
        ];
    }
}
