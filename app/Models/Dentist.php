<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Dentist extends Model
{
    protected $fillable = [
        'user_id',
        'year_experienced',
        'skill',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'status' => 'boolean',
            'year_experienced' => 'integer',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
