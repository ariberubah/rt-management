<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Resident extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'nama_lengkap',
        'no_telepon',
        'foto_ktp_path',
        'status_penghuni',
        'status_menikah',
    ];

    public function houseResidents()
    {
        return $this->hasMany(HouseResident::class);
    }

    public function activeHouse()
    {
        return $this->hasOneThrough(
            House::class,
            HouseResident::class,
            'resident_id',
            'id',
            'id',
            'house_id'
        )->where('house_residents.is_active', true);
    }

    public function billingItems()
    {
        return $this->hasMany(BillingItem::class);
    }
}