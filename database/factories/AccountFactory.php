<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\AccountType;
use App\Models\User;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Account>
 */
class AccountFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $names = ["debit bancolombia", "credit lulo", "credit banco bogota"];

        // Choose random name
        $name_index = mt_rand(0, count($names));

        $name = $names[$name_index];
        $type_id = AccountType::inRandomOrder()->first()->id;
        $user_id = User::inRandomOrder()->first()->id;

        return [
            "name" => $name,
            "type_id" => $type_id,
            "owner_id" => $user_id
        ];
    }
}
