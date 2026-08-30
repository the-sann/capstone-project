<?php

namespace App\Http\Controllers\Treatments;

use App\Http\Controllers\Controller;
use App\Http\Requests\TreatmentStoreRequest;
use App\Models\Treatment;
use Illuminate\Http\Request;

class TreatmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = $request->integer('per_page', 5);
        $treatments = Treatment::latest()->paginate($perPage)->withQueryString();
        return inertia(
            'treatments/index',
            [
                'treatments' => $treatments,
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
            'treatments/create',
            []
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(TreatmentStoreRequest $request)
    {
        $data = $request->validated();
        Treatment::create($data);
        return redirect()->route(
            'treatments.index'
        )->with('success', 'Treatment Create successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(Treatment $treatment)
    {
        return inertia(
            'treatments/show',
            [
                'treatment' => $treatment
            ]
        );
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Treatment $treatment)
    {
        return inertia(
            'treatments/edit',
            [
                'treatment' => $treatment
            ]
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(TreatmentStoreRequest $request, Treatment $treatment)
    {
        $data = $request->validated();
        $treatment->update($data);
        return to_route('treatments.index')->with('success', "Treatment \"{$treatment->name}\" Was updated");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Treatment $treatment)
    {
        $treatment->delete();
        return to_route('treatments.index')->with('success', 'Treatment Deleted Successfully');
    }
}
