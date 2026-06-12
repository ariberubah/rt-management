<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class House extends Model
{
    protected $fillable = [
        'nomor_rumah',
        'alamat',
        'status',
    ];

    public function houseResidents()
    {
        return $this->hasMany(HouseResident::class);
    }

    public function activeResident()
    {
        return $this->hasOneThrough(
            Resident::class,
            HouseResident::class,
            'house_id',
            'id',
            'id',
            'resident_id'
        )->where('house_residents.is_active', true);
    }

    public function billingItems()
    {
        return $this->hasMany(BillingItem::class);
    }
}