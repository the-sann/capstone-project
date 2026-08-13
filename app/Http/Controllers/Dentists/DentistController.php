<?php

namespace App\Http\Controllers\Dentists;

use App\Http\Controllers\Controller;
use App\Http\Requests\DentistStoreRequest;
use App\Http\Requests\DentistUpdateRequest;
use App\Models\Dentist;
use App\Models\User;


class DentistController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $dentist = Dentist::all();
        return inertia(
            'dentists/index',
            [
                'dentists' => $dentist
            ]
        );
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {


        return inertia('dentists/create', []);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(DentistStoreRequest $request)
    {
        Dentist::create($request->validated());
        return redirect()->route('dentists.index')->with('success', 'Dentist created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(DentistUpdateRequest $request, Dentist $dentist)
    {
        $dentist->update($request->validated());
        return redirect()->route('dentists.index')->with('success', 'Dentist Updated Successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Dentist $dentist)
    {
        $dentist->delete();
        return redirect()->route('dentists.index')->with('success', 'Dentist Deleted Successfully');
    }
}
