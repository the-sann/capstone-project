<?php

namespace App\Http\Controllers\Dentists;

use App\Http\Controllers\Controller;
use App\Http\Requests\DentistStoreRequest;
use App\Http\Requests\DentistUpdateRequest;
use App\Models\Dentist;


class DentistController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $dentists = Dentist::all();
        return inertia(
            'dentists/index',
            [
                'dentists' => $dentists
            ]
        );
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {


        return inertia(
            'dentists/create',
            []
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(DentistStoreRequest $request)
    {

        $data = $request->validated();
        if ($request->hasFile('profile_image')) {
            $data['profile_image'] = $request->file('profile_image')->store('dentists', 'public');
        }
        Dentist::create($data);
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
    public function edit(Dentist $dentist)
    {
        return inertia(
            'dentists/edit',
            [
                'dentist' => $dentist
            ]
        );
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
