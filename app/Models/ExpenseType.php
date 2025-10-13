<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class ExpenseType extends Model
{
    use HasUuids;

    public $incrementing = false;

    /**
     * Navigation method to account eager loading 
     */
    public function expenses()
    {
        return $this->belongsToMany(Expense::class)
            ->withTimestamps();
    }
}
