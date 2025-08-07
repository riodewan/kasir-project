<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\Api\LaporanController;
use App\Http\Controllers\Api\DashboardController;
use App\Models\User;

Route::post('/login', [AuthController::class, 'login']);
Route::get('/auth/google/redirect', [AuthController::class, 'redirect']);
Route::get('/auth/google/callback', [AuthController::class, 'callback']);
Route::post('/register', [AuthController::class, 'register']);

// Logout
Route::middleware('auth:sanctum')->post('/logout', function (Request $request) {
    $request->user()->currentAccessToken()->delete();
    return response()->json(['message' => 'Logged out']);
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('produk', ProductController::class);
    Route::prefix('kategori')->group(function () {
        Route::get('/', [CategoryController::class, 'index']);
        Route::post('/', [CategoryController::class, 'store']);
        Route::put('/{id}', [CategoryController::class, 'update']);
        Route::delete('/{id}', [CategoryController::class, 'destroy']);
        Route::get('/all', [CategoryController::class, 'all']);
    });
    Route::prefix('transaksi')->group(function () {
        Route::get('/', [TransactionController::class, 'index']);
        Route::post('/', [TransactionController::class, 'store']);
        Route::get('/{id}', [TransactionController::class, 'show']);
        Route::delete('/{id}', [TransactionController::class, 'destroy']);
    });
    Route::get('/laporan', [\App\Http\Controllers\Api\LaporanController::class, 'index']);
    Route::get('/dashboard/summary', [DashboardController::class, 'summary']);
});

//pdf-cetak
Route::get('/cetak-struk/{id}', [TransactionController::class, 'cetakStruk']);
Route::get('/laporan/export-pdf', [LaporanController::class, 'exportPDF']);

//excel
Route::get('/laporan/export-excel', [LaporanController::class, 'exportExcel']);