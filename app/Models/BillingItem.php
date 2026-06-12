<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BillingItem extends Model
{
    protected $fillable = [
        'billing_period_id',
        'house_id',
        'resident_id',
        'jenis_iuran',
        'nominal',
        'status',
    ];

    public function billingPeriod()
    {
        return $this->belongsTo(BillingPeriod::class);
    }

    public function house()
    {
        return $this->belongsTo(House::class);
    }

    public function resident()
    {
        return $this->belongsTo(Resident::class);
    }

    public function payment()
    {
        return $this->hasOne(Payment::class);
    }
}