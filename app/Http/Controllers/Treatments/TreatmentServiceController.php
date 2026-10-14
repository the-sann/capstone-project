<?php

namespace App\Http\Controllers\Treatments;

use App\Http\Controllers\Controller;
use App\Models\Treatment;
use Illuminate\Http\Request;

class TreatmentServiceController extends Controller
{
    public function services()
    {
        return inertia(
            'treatments/services-show',
            [
                'treatments' => Treatment::where('status', 'available')
                    ->latest()
                    ->get(),
            ]
        );
    }
}
