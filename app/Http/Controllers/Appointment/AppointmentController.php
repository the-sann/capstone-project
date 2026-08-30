<?php

namespace App\Http\Controllers\Appointment;

use App\Http\Controllers\Controller;
use App\Http\Requests\AppointmentStoreRequest;
use App\Http\Requests\AppointmentUpdateRequest;
use App\Models\Appointment;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = $request->integer('per_page', 5);
        $appointments = Appointment::latest()->paginate($perPage)->withQueryString();
        return inertia(
            'appointments/index',
            [
                'appointments' => $appointments,
                'filter' =>
                [
                    'per_page' => $perPage
                ]
            ]
        );
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia(
            'appointments/create',
            [
                ''
            ]
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(AppointmentStoreRequest $request)
    {
        $data = $request->validated();
        $data['appointment_id'] = 'ap-' . substr(uniqid(), -6);
        Appointment::create($data);
        return to_route('appointments.index')->with('success', 'Appointment created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Appointment $appointment)
    {
        return inertia(
            'appointments/show',
            [
                'appointment' => $appointment,
            ]
        );
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Appointment $appointment)
    {
        return inertia(
            'appointments/edit',
            [
                'appointment' => $appointment,
            ]
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(AppointmentUpdateRequest $request, Appointment $appointment)
    {
        $data = $request->validated();
        $appointment->update($data);
        return to_route('appointments.index')->with('success', "Appointment \"{$appointment->name}\" Was updated");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Appointment $appointment)
    {
        $appointment->delete();
        return to_route('appointments.index')->with('success', "Appointment \"{$appointment->name}\" Was Deleted");
    }
}
