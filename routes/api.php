<?php

use App\Http\Controllers\Api\V1\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Api version 1
Route::prefix("v1")->group(function () {

    // Auth endpoints
    Route::controller(AuthController::class)->prefix("auth")->group(function () {
        Route::post("login", "login");
        Route::post("register", "register");
        Route::post("logout", "logout")->middleware("auth:sanctum");
    });
});

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
