<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AppInfo extends Model
{
    use HasFactory;

    protected $fillable = [
        'legal_representative',
        'address',
        'contact_email',
        'phone_1',
        'phone_2'
    ];
}
