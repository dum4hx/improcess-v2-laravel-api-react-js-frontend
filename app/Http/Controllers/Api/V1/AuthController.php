<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    /**
     * Creates and returns a token
     */
    public function login(Request $request)
    {
        // Validate data
        $data = $request->validate([
            "email" => ["required", "email"],
            "password" => ["required", "string"],
            "device_name" => ["required", "string"]
        ]);

        // Validate credential correctness
        $user = User::where("email", $data["email"])->first();

        if (!$user || !Hash::check($data["password"], $user->password)) {
            // Return error status on invalid credentials
            return response()->json(["message" => "Invalid credentials"], 401);
        }

        // Create access token with abilities
        $token = $user->createToken($data["device_name"] ?? "react-app", ["finances:manage"])->plainTextToken;

        // Return plaintext token
        return response()->json([
            "user" => $user->only(["id", "email", "name"]),
            "message" => "Logged in successfully",
            "token" => $token
        ], 201);
    }
}
