<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Transaction;
use App\Models\User;
use App\Models\Product;

class DashboardController extends Controller
{
    public function summary()
    {
        $today = now()->toDateString();
        $sevenDays = now()->subDays(6);

        return response()->json([
            'total_transaksi' => Transaction::count(),
            'pendapatan_hari_ini' => Transaction::whereDate('created_at', $today)->sum('total_harga'),
            'total_produk' => Product::count(),
            'total_pelanggan' => User::where('role', 'user')->count(),

            'top_products' => \DB::table('transaction_items')
                ->join('products', 'transaction_items.product_id', '=', 'products.id')
                ->select('products.nama', \DB::raw('SUM(transaction_items.qty) as terjual'))
                ->groupBy('products.nama')
                ->orderByDesc('terjual')
                ->limit(5)
                ->get(),

            'last_transactions' => Transaction::latest()->take(5)->get()->map(fn($tx) => [
                'nama_pembeli' => $tx->nama_pembeli,
                'tanggal' => $tx->created_at->format('d M Y H:i'),
                'total_harga' => $tx->total_harga,
            ]),

            'daily_sales' => Transaction::whereDate('created_at', '>=', $sevenDays)
                ->selectRaw('DATE(created_at) as tanggal, SUM(total_harga) as total')
                ->groupByRaw('DATE(created_at)')
                ->orderBy('tanggal')
                ->get(),
        ]);
    }

}
