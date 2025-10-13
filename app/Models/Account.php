<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Account extends Model
{
    use HasUuids, HasFactory;
    /**
     * @var bool
     */
    public $incrementing = false;

    /**
     * Navigation method to account_types eager loading
     */
    public function account_type()
    {
        return $this->belongsTo(AccountType::class);
    }
}
