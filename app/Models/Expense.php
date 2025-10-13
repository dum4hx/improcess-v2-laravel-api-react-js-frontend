<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Expense extends Model
{
    use HasUuids;

    public $incrementing = false;

    /**
     * Navigation method to expense_types for eager loading 
     */
    public function types()
    {
        return $this->belongsToMany(ExpenseType::class)
            ->withTimestamps();
    }
}
