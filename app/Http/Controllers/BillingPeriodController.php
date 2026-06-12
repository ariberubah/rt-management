<?php

namespace App\Http\Controllers;

use App\Models\BillingItem;
use App\Models\BillingPeriod;
use App\Models\House;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BillingPeriodController extends Controller
{
    public function index()
    {
        $periods = BillingPeriod::withCount('billingItems')
            ->orderByDesc('tahun')
            ->orderByDesc('bulan')
            ->paginate(12);

        return Inertia::render('BillingPeriods/Index', [
            'periods' => $periods,
        ]);
    }

    public function create()
    {
        return Inertia::render('BillingPeriods/Form');
    }

    public function store(Request $request)
    {
        $request->validate([
            'bulan' => 'required|integer|min:1|max:12',
            'tahun' => 'required|integer|min:2000',
        ]);

        $period = BillingPeriod::firstOrCreate([
            'bulan' => $request->bulan,
            'tahun' => $request->tahun,
        ]);

        return redirect()->route('billing-periods.show', $period)->with('success', 'Periode berhasil dibuat.');
    }

    public function show(BillingPeriod $billingPeriod)
    {
        $billingPeriod->load([
            'billingItems.house',
            'billingItems.resident',
            'billingItems.payment',
        ]);

        return Inertia::render('BillingPeriods/Show', [
            'period' => $billingPeriod,
        ]);
    }

    public function generate(BillingPeriod $billingPeriod)
    {
        $houses = House::where('status', 'dihuni')
            ->with(['houseResidents' => fn($q) => $q->where('is_active', true)])
            ->get();

        foreach ($houses as $house) {
            $activeResident = $house->houseResidents->first();
            if (!$activeResident)
                continue;

            foreach (['satpam', 'kebersihan'] as $jenis) {
                $nominal = config('iuran.' . $jenis);

                BillingItem::firstOrCreate(
                    [
                        'billing_period_id' => $billingPeriod->id,
                        'house_id' => $house->id,
                        'jenis_iuran' => $jenis,
                    ],
                    [
                        'resident_id' => $activeResident->resident_id,
                        'nominal' => $nominal,
                        'status' => 'belum_lunas',
                    ]
                );
            }
        }

        $billingPeriod->update(['generated_at' => now()]);

        return redirect()->back()->with('success', 'Tagihan berhasil digenerate.');
    }

    public function destroy(BillingPeriod $billingPeriod)
    {
        $billingPeriod->delete();
        return redirect()->route('billing-periods.index')->with('success', 'Periode berhasil dihapus.');
    }
}