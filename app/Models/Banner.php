<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Banner extends Model
{
    use HasFactory;

    protected $fillable = [
        'text',
        'background_color',
        'text_color',
        'start_date',
        'end_date',
        'is_active',
        'priority',
        'custom_class',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'is_active' => 'boolean',
        'priority' => 'integer',
        'custom_class' => 'array'
    ];

    public const AVAILABLE_CLASSES = [
        'default' => '',
        'marquee' => 'relative overflow-hidden whitespace-nowrap',
        'pulse' => 'animate-pulse',
        'gradient' => 'bg-gradient animate-gradient bg-[length:200%_100%]',
        'glass' => 'backdrop-filter backdrop-blur-md bg-opacity-80 shadow-lg'
    ];


    public function isValidForDisplay(): bool
    {
        if (!$this->is_active) {
            return false;
        }

        $today = now()->startOfDay();

        // Si no hay fechas programadas, solo verificamos is_active
        if (is_null($this->start_date) && is_null($this->end_date)) {
            return true;
        }

        // Si solo hay fecha de inicio
        if (!is_null($this->start_date) && is_null($this->end_date)) {
            return $this->start_date->startOfDay()->lte($today);
        }

        // Si solo hay fecha de fin
        if (is_null($this->start_date) && !is_null($this->end_date)) {
            return $this->end_date->endOfDay()->gte($today);
        }

        // Si hay ambas fechas
        return $this->start_date->startOfDay()->lte($today) &&
               $this->end_date->endOfDay()->gte($today);
    }
}