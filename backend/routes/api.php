<?php

use App\Http\Controllers\Api\AdminTicketController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\TicketController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function (): void {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/tickets', [TicketController::class, 'index']);
    Route::post('/tickets', [TicketController::class, 'store']);

    Route::middleware('admin')->group(function (): void {
        Route::get('/admin/tickets', [AdminTicketController::class, 'index']);
        Route::patch('/admin/tickets/{ticket}', [AdminTicketController::class, 'update']);
        Route::delete('/admin/tickets/{ticket}', [AdminTicketController::class, 'destroy']);
    });
});
