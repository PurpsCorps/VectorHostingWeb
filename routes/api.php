<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PaymentProofController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductDataController;
use App\Http\Controllers\ServicesController;
use App\Http\Controllers\TokenController;
use App\Http\Controllers\UserController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::apiResource('product', ProductDataController::class)->middleware('auth.session');
Route::apiResource('user', UserController::class)->middleware('auth.session');
Route::apiResource('cart', CartController::class)->middleware('auth.session');
Route::apiResource('token', TokenController::class)->middleware('auth.session');
Route::apiResource('order', OrderController::class)->middleware('auth.session');
Route::apiResource('payment/proof', PaymentProofController::class)->middleware('auth.session');
Route::apiResource('services', ServicesController::class)->middleware('auth.session');
