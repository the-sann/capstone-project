<?php

namespace App\Http\Controllers\Dentists;

use App\Http\Controllers\Controller;
use App\Http\Requests\DentistStoreRequest;
use App\Http\Requests\DentistUpdateRequest;
use App\Http\Resources\DentistResource;
use App\Models\Dentist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;


class DentistController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = $request->integer('per_page', 5);
        $dentists = Dentist::latest()->paginate($perPage)->withQueryString();
        return inertia(
            'dentists/index',
            [
                'dentists' => $dentists,
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
        $data['is_dentist'] = $data['user_type'] === 'dentist';
        Dentist::create($data);

        return redirect()
            ->route('dentists.index')
            ->with('success', 'Dentist created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(Dentist $dentist)
    {
        return inertia('dentists/show', [
            'dentist' => $dentist,
        ]);
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
        unset($image);
        if ($data['user_type'] === 'dentist') {
            $data['is_dentist'] = true;
        } else {
            $data['is_dentist'] = false;
        }
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
