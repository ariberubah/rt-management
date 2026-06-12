<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Models\ExpenseCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExpenseController extends Controller
{
    public function index()
    {
        $bulan = request('bulan', now()->month);
        $tahun = request('tahun', now()->year);

        $expenses = Expense::with('category')
            ->where('bulan', $bulan)
            ->where('tahun', $tahun)
            ->latest()
            ->paginate(10);

        return Inertia::render('Expenses/Index', [
            'expenses'   => $expenses,
            'categories' => ExpenseCategory::all(),
            'bulan'      => $bulan,
            'tahun'      => $tahun,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'expense_category_id' => 'required|exists:expense_categories,id',
            'nominal'             => 'required|numeric|min:1',
            'deskripsi'           => 'required|string',
            'bukti'               => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'tanggal'             => 'required|date',
        ]);

        if ($request->hasFile('bukti')) {
            $validated['bukti_path'] = $request->file('bukti')->store('bukti-pengeluaran', 'public');
        }

        $date = \Carbon\Carbon::parse($request->tanggal);
        $validated['bulan'] = $date->month;
        $validated['tahun'] = $date->year;

        unset($validated['bukti']);

        Expense::create($validated);

        return redirect()->back()->with('success', 'Pengeluaran berhasil dicatat.');
    }

    public function update(Request $request, Expense $expense)
    {
        $validated = $request->validate([
            'expense_category_id' => 'required|exists:expense_categories,id',
            'nominal'             => 'required|numeric|min:1',
            'deskripsi'           => 'required|string',
            'bukti'               => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'tanggal'             => 'required|date',
        ]);

        if ($request->hasFile('bukti')) {
            $validated['bukti_path'] = $request->file('bukti')->store('bukti-pengeluaran', 'public');
        }

        $date = \Carbon\Carbon::parse($request->tanggal);
        $validated['bulan'] = $date->month;
        $validated['tahun'] = $date->year;

        unset($validated['bukti']);

        $expense->update($validated);

        return redirect()->back()->with('success', 'Pengeluaran berhasil diupdate.');
    }

    public function destroy(Expense $expense)
    {
        $expense->delete();
        return redirect()->back()->with('success', 'Pengeluaran berhasil dihapus.');
    }
}