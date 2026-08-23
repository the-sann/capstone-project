<?php

namespace App\Http\Controllers\Dentists;

use App\Http\Controllers\Controller;
use App\Http\Requests\DentistStoreRequest;
use App\Http\Requests\DentistUpdateRequest;
use App\Http\Resources\DentistResource;
use App\Models\Dentist;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;


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
        $image = $data['image'] ?? null;
        if ($image) {
            $data['image_path'] = $image->store('dentists', 'public');
        }

        Dentist::create($data);

        return redirect()
            ->route('dentists.index')
            ->with('success', 'Dentist created successfully');
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
        return inertia('dentists/edit', [
            'dentist' => new DentistResource($dentist),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */

    public function update(DentistUpdateRequest $request, Dentist $dentist)
    {
        $data = $request->validated();
        $image = $data['image'] ?? null;
        if ($image) {
            if ($dentist->image_path) {
                Storage::disk('public')->delete($dentist->image_path);
            }
            $data['image_path'] = $image->store('dentists', 'public');
        }
        unset($data['image']);
        $dentist->update($data);
        return to_route('dentists.index')
            ->with('success', "Dentist \"{$dentist->name}\" was updated.");
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
