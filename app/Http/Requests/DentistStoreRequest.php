<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class DentistStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'year_experienced' => ['required', 'integer', 'min:0'],
            'skill' => ['required', 'string', 'max:255'],
            'status' => ['boolean'],
            'profile_image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'user_type' => 'required|in:admin,dentist,cashier,receptionist',
            'is_dentist' => 'required|boolean',
        ];
    }
}
