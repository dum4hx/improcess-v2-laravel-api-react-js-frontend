<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Transfer extends Model
{
    use HasUuids;

    /**
     * Navigation method to account eager loading
     */
    public function accounts()
    {
        return $this->hasMany(Account::class);
    }
}
