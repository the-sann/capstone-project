<?php

namespace App\Http\Controllers\Appointment;

use App\Http\Controllers\Controller;
use App\Http\Requests\AppointmentStoreRequest;
use App\Http\Requests\AppointmentUpdateRequest;
use App\Models\Appointment;
use App\Models\AppointmentReminder;
use App\Models\Dentist;
use App\Models\Patient;
use App\Models\TreatmentCase;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    public function createForTreatmentCase(TreatmentCase $treatmentCase)
    {
        $patients = Patient::select(
            'id',
            'name',
            'patient_id'
        )->get();

        $dentists = Dentist::select('id', 'name')
            ->where('status', true)
            ->orderBy('name')
            ->get();

        $treatmentCase->load([
            'patient:id,name,patient_id',
            'dentist:id,name',
        ]);

        return inertia('appointments/create', [
            'patients' => $patients,
            'dentists' => $dentists,
            'treatmentCases' => [],
            'selectedTreatmentCase' => $treatmentCase,
        ]);
    }
    public function getAllAppointments(Request $request)
    {
        $perPage = $request->integer('per_page', 5);

        $appointments = Appointment::with(['dentist', 'patient'])
            ->orderBy('appointment_date', 'asc')
            ->orderBy('appointment_time', 'asc')
            ->paginate($perPage)
            ->withQueryString();

        return inertia('appointments/all-appointments', [
            'appointments' => $appointments,
        ]);
    }
    public function due()
    {
        $reminders = AppointmentReminder::with([
            'appointment.patient',
            'appointment.dentist',
        ])
            ->where('status', 'pending')
            ->where('reminder_at', '<=', now())
            ->get();

        return response()->json($reminders);
    }
    public function remind(AppointmentReminder $reminder)
    {
        $reminder->update([
            'status' => 'reminded',
            'reminded_at' => now(),
        ]);

        return response()->json([
            'success' => true,
        ]);
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = $request->integer('per_page', 5);
        $appointments = Appointment::with(['dentist', 'patient'])
            ->where('status', 'open')
            ->orderBy('appointment_date', 'asc')
            ->paginate($perPage)->withQueryString();
        $today = now()->toDateString();
        $tomorrow = now()->addDay()->toDateString();
        $todayAppointments = Appointment::with(['dentist', 'patient'])
            ->where('status', 'open')
            ->whereDate('appointment_date', $today)
            ->orderBy('appointment_time', 'asc')
            ->get();
        $tomorrowAppointments = Appointment::with(['dentist', 'patient'])
            ->where('status', 'open')
            ->whereDate('appointment_date', $tomorrow)
            ->orderBy('appointment_time', 'asc')
            ->get();
        $missedAppointments = Appointment::with(['dentist', 'patient'])
            ->where('status', 'open')
            ->whereDate('appointment_date', '<', $today)
            ->orderBy('appointment_date', 'asc')
            ->orderBy('appointment_time', 'asc')
            ->get();
        $upcomingAppointments = Appointment::with(['dentist', 'patient'])
            ->where('status', 'open')
            ->whereDate('appointment_date', '>', $tomorrow)
            ->orderBy('appointment_date', 'asc')
            ->paginate($perPage)->withQueryString();

        return inertia(
            'appointments/index',
            [
                'todayAppointments' => $todayAppointments,
                'tomorrowAppointments' => $tomorrowAppointments,
                'missedAppointments' => $missedAppointments,
                'upcomingAppointments' => $upcomingAppointments,
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
    public function create(Request $request)
    {
        $patients = Patient::select(
            'id',
            'name',
            'patient_id'
        )
            ->orderBy('name')
            ->get();

        $dentists = Dentist::select(
            'id',
            'name'
        )
            ->where('status', true)
            ->orderBy('name')
            ->get();

        $treatmentCases = TreatmentCase::with([
            'patient:id,name,patient_id',
            'dentist:id,name',
        ])
            ->latest()
            ->get();

        $selectedTreatmentCase = null;

        if ($request->filled('treatment_case_id')) {
            $selectedTreatmentCase = $treatmentCases->firstWhere(
                'id',
                (int) $request->treatment_case_id
            );
        }

        return inertia('appointments/create', [
            'patients' => $patients,
            'dentists' => $dentists,
            'treatmentCases' => $treatmentCases,
            'selectedTreatmentCase' => $selectedTreatmentCase,
        ]);
    }

    public function close(Appointment $appointment): RedirectResponse
    {
        $appointment->update([
            'status' => 'closed',
        ]);

        return redirect()
            ->route('appointments.index')
            ->with('success', 'Appointment closed successfully.');
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
        $appointment->load([
            'patient',
            'dentist',
            'treatmentCase',
        ]);

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
        return inertia('appointments/edit', [
            'appointment' => $appointment->load([
                'patient',
                'dentist',
                'treatmentCase',
            ]),

            'patients' => Patient::select(
                'id',
                'name',
                'patient_id'
            )->get(),

            'dentists' => Dentist::select(
                'id',
                'name'
            )->get(),

            'treatmentCases' => TreatmentCase::with([
                'patient:id,name,patient_id',
            ])
                ->select('id', 'patient_id')
                ->get(),
        ]);
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
