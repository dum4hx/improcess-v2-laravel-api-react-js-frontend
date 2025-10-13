<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class AccountType extends Model
{
    use HasUuids;

    /**
     * @var bool
     */
    public $incrementing = false;

    /**
     * Navigation method to account eager loading 
     */
    public function accounts()
    {
        return $this->hasMany(Account::class);
    }
}
