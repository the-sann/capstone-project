<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class DentistResource extends JsonResource
{
    public static $wrap = false;

    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'year_experienced' => $this->year_experienced,
            'user_type' => $this->user_type,
            'is_dentist' => $this->is_dentist,
            'skill' => $this->skill,
            'status' => $this->status,
            'image_path' => $this->image_path
                ? Storage::url($this->image_path)
                : '',
        ];
    }
}
