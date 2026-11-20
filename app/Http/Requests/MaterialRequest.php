<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MaterialRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }
    protected function prepareForValidation(): void
    {
        if ($this->has('sku')) {
            $this->merge(['sku' => strtoupper(trim((string) $this->input('sku')))]);
        }
    }

    public function rules(): array
    {
        $material = $this->route('material');

        return [
            'material_category_id' => ['required', 'exists:material_categories,id'],
            'sku' => ['required', 'string', 'max:50', Rule::unique('materials', 'sku')->ignore($material)],
            'name' => ['required', 'string', 'max:255'],
            'unit' => ['required', 'string', 'max:30'],
            'min_stock' => ['required', 'numeric', 'min:0'],
            'unit_cost' => ['nullable', 'numeric', 'min:0'],
            'track_expiry' => ['boolean'],
            'is_active' => ['boolean'],
            'description' => ['nullable', 'string'],
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'], // 2 MB
            // Only used on create
            'opening_stock' => ['nullable', 'numeric', 'min:0'],
            'opening_expiry_date' => ['nullable', 'date', 'after:today'],
        ];
    }
}
