<?php

namespace App\Http\Controllers;

use App\Models\House;
use App\Models\HouseResident;
use App\Models\Resident;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HouseController extends Controller
{
    public function index()
    {
        $houses = House::with([
            'houseResidents.resident',
        ])->paginate(10);

        return Inertia::render('Houses/Index', [
            'houses' => $houses,
        ]);
    }

    public function create()
    {
        return Inertia::render('Houses/Form');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nomor_rumah' => 'required|string|unique:houses,nomor_rumah',
            'alamat'      => 'required|string',
        ]);

        House::create($validated);

        return redirect()->route('houses.index')->with('success', 'Rumah berhasil ditambahkan.');
    }

    public function show(House $house)
    {
        $house->load([
            'houseResidents.resident',
        ]);

        return Inertia::render('Houses/Show', [
            'house'    => $house,
            'residents' => Resident::all(),
        ]);
    }

    public function edit(House $house)
    {
        return Inertia::render('Houses/Form', [
            'house' => $house,
        ]);
    }

    public function update(Request $request, House $house)
    {
        $validated = $request->validate([
            'nomor_rumah' => 'required|string|unique:houses,nomor_rumah,' . $house->id,
            'alamat'      => 'required|string',
        ]);

        $house->update($validated);

        return redirect()->route('houses.index')->with('success', 'Rumah berhasil diupdate.');
    }

    public function destroy(House $house)
    {
        $house->delete();
        return redirect()->route('houses.index')->with('success', 'Rumah berhasil dihapus.');
    }

    public function assignResident(Request $request, House $house)
    {
        $request->validate([
            'resident_id'  => 'required|exists:residents,id',
            'tanggal_masuk' => 'required|date',
        ]);

        // Nonaktifkan penghuni aktif sebelumnya
        HouseResident::where('house_id', $house->id)
            ->where('is_active', true)
            ->update([
                'is_active'     => false,
                'tanggal_keluar' => now()->toDateString(),
            ]);

        HouseResident::create([
            'house_id'     => $house->id,
            'resident_id'  => $request->resident_id,
            'tanggal_masuk' => $request->tanggal_masuk,
            'is_active'    => true,
        ]);

        $house->update(['status' => 'dihuni']);

        return redirect()->back()->with('success', 'Penghuni berhasil ditambahkan ke rumah.');
    }

    public function unassignResident(Request $request, House $house)
    {
        HouseResident::where('house_id', $house->id)
            ->where('is_active', true)
            ->update([
                'is_active'     => false,
                'tanggal_keluar' => now()->toDateString(),
            ]);

        $house->update(['status' => 'tidak_dihuni']);

        return redirect()->back()->with('success', 'Penghuni berhasil dikeluarkan dari rumah.');
    }
}