<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Expense extends Model
{
    protected $fillable = [
        'expense_category_id',
        'bulan',
        'tahun',
        'nominal',
        'deskripsi',
        'bukti_path',
        'tanggal',
    ];

    protected $casts = [
        'tanggal' => 'date',
    ];

    public function category()
    {
        return $this->belongsTo(ExpenseCategory::class, 'expense_category_id');
    }
}