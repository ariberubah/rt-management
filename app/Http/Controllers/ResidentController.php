<?php

namespace App\Http\Controllers;

use App\Models\Resident;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ResidentController extends Controller
{
    public function index()
    {
        $residents = Resident::with('houseResidents.house')
            ->latest()
            ->paginate(10);

        return Inertia::render('Residents/Index', [
            'residents' => $residents,
        ]);
    }

    public function create()
    {
        return Inertia::render('Residents/Form');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_lengkap'    => 'required|string|max:255',
            'no_telepon'      => 'required|string|max:20',
            'foto_ktp'        => 'nullable|image|max:2048',
            'status_penghuni' => 'required|in:tetap,kontrak',
            'status_menikah'  => 'required|in:menikah,belum_menikah',
        ]);

        if ($request->hasFile('foto_ktp')) {
            $validated['foto_ktp_path'] = $request->file('foto_ktp')->store('ktp', 'public');
        }

        unset($validated['foto_ktp']);

        Resident::create($validated);

        return redirect()->route('residents.index')->with('success', 'Penghuni berhasil ditambahkan.');
    }

    public function edit(Resident $resident)
    {
        return Inertia::render('Residents/Form', [
            'resident' => $resident,
        ]);
    }

    public function update(Request $request, Resident $resident)
    {
        $validated = $request->validate([
            'nama_lengkap'    => 'required|string|max:255',
            'no_telepon'      => 'required|string|max:20',
            'foto_ktp'        => 'nullable|image|max:2048',
            'status_penghuni' => 'required|in:tetap,kontrak',
            'status_menikah'  => 'required|in:menikah,belum_menikah',
        ]);

        if ($request->hasFile('foto_ktp')) {
            $validated['foto_ktp_path'] = $request->file('foto_ktp')->store('ktp', 'public');
        }

        unset($validated['foto_ktp']);

        $resident->update($validated);

        return redirect()->route('residents.index')->with('success', 'Penghuni berhasil diupdate.');
    }

    public function destroy(Resident $resident)
    {
        $resident->delete();
        return redirect()->route('residents.index')->with('success', 'Penghuni berhasil dihapus.');
    }

    public function show(Resident $resident)
    {
        $resident->load('houseResidents.house');
        return Inertia::render('Residents/Show', [
            'resident' => $resident,
        ]);
    }
}