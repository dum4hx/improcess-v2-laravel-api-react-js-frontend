<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use Exception;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

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
            throw new HttpResponseException(response: response()->json(["message" => "Invalid credentials"], 401));
        }

        // Create access token with abilities
        try {

            $token = $user->createToken($data["device_name"] ?? "react-app", ["finances:manage"])->plainTextToken;
            // Return plaintext token
            try {
                return response()->json([
                    "user" => $user->only(["id", "email", "name"]),
                    "message" => "Logged in successfully",
                    "token" => $token
                ], 201);
            } catch (Exception $e) {
                throw new HttpResponseException(response: response()->json(["message" => $e, "from" => "user creation"]));
            }
        } catch (Exception $e) {
            throw new HttpResponseException(response: response()->json(["message" => $e, "from" => "token"]));
        }
    }

    /**
     * Registers a user into the database
     * @param Request $request 
     */
    public function register(Request $request)
    {
        // Validate data
        $data = $request->validate([
            "name" => ["required", "string"],
            "email" => ["required", "email"],
            "password" => ["required", "string"],
            "phone" => ["required", "string", "digits:10"]
        ]);

        // Ensure neither email nor phone number is in use
        $user = User::where("email", $data["email"])
            ->orWhere("phone", $data["phone"])
            ->first();

        // Return error
        if ($user) {
            throw new HttpResponseException(response: response()->json(["message" => "Email already exists"], 401));
        }

        // Save user into database
        try {
            $user = User::create([
                "name" => $data["name"],
                "email" => $data["email"],
                "password" =>  Hash::make($data["password"]),
                "phone" => $data["phone"]
            ]);
        } catch (Exception $e) {
            Log::error($e);
            throw new HttpResponseException(response: response()->json(["message" => $e, 500]));
        }

        // Return success message
        return response()->json(["message" => "User registered correctly", 201]);
    }
}
