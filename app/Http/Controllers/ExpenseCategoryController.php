<?php

namespace App\Http\Controllers;

use App\Models\ExpenseCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExpenseCategoryController extends Controller
{
    public function index()
    {
        return Inertia::render('ExpenseCategories/Index', [
            'categories' => ExpenseCategory::withCount('expenses')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama_kategori' => 'required|string|max:255',
            'is_recurring'  => 'boolean',
        ]);

        ExpenseCategory::create($request->all());

        return redirect()->back()->with('success', 'Kategori berhasil ditambahkan.');
    }

    public function update(Request $request, ExpenseCategory $expenseCategory)
    {
        $request->validate([
            'nama_kategori' => 'required|string|max:255',
            'is_recurring'  => 'boolean',
        ]);

        $expenseCategory->update($request->all());

        return redirect()->back()->with('success', 'Kategori berhasil diupdate.');
    }

    public function destroy(ExpenseCategory $expenseCategory)
    {
        $expenseCategory->delete();
        return redirect()->back()->with('success', 'Kategori berhasil dihapus.');
    }
}