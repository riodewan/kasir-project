<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Transaction;
use App\Models\TransactionItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $query = Transaction::with('items.product')->latest();

        if ($request->has('search') && $request->search !== '') {
            $query->where('nama_pembeli', 'like', '%' . $request->search . '%');
        }

        return response()->json($query->paginate(10));
    }

    private function generateKodeTransaksi(): string
    {
        $tanggal = now()->format('Ymd');
        $count = \App\Models\Transaction::whereDate('created_at', now())->count() + 1;
        $urutan = str_pad($count, 4, '0', STR_PAD_LEFT);

        $user = auth()->user();
        $inisial = strtoupper(substr($user->name, 0, 1)); // ambil huruf pertama nama kasir

        return "TRX-$tanggal-$urutan-$inisial";
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama_pembeli' => 'nullable|string|max:255',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.qty' => 'required|integer|min:1',
        ]);

        DB::beginTransaction();

        try {
            $total_item = 0;
            $total_harga = 0;

            foreach ($request->items as $item) {
                $product = Product::findOrFail($item['product_id']);

                if ($product->stok < $item['qty']) {
                    return response()->json([
                        'message' => 'Stok produk "' . $product->nama . '" tidak mencukupi.'
                    ], 422);
                }

                $total_item += $item['qty'];
                $total_harga += $product->harga * $item['qty'];
            }

            $transaction = Transaction::create([
                'kode' => $this->generateKodeTransaksi(),
                'user_id' => Auth::id(),
                'nama_pembeli' => $request->nama_pembeli,
                'total_item' => $total_item,
                'total_harga' => $total_harga,
            ]);

            foreach ($request->items as $item) {
                $product = Product::findOrFail($item['product_id']);

                TransactionItem::create([
                    'transaction_id' => $transaction->id,
                    'product_id' => $product->id,
                    'qty' => $item['qty'],
                    'harga_satuan' => $product->harga,
                    'subtotal' => $product->harga * $item['qty'],
                ]);

                $product->decrement('stok', $item['qty']);
            }

            DB::commit();

            return response()->json([
                'message' => 'Transaksi berhasil disimpan',
                'data' => $transaction->load('items.product')
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Gagal menyimpan transaksi',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        $transaction = Transaction::with(['items.product', 'kasir'])->findOrFail($id);
        return response()->json($transaction);
    }

    public function destroy($id)
    {
        $transaction = Transaction::with('items')->findOrFail($id);

        foreach ($transaction->items as $item) {
            $item->product->increment('stok', $item->qty);
        }

        $transaction->items()->delete();
        $transaction->delete();

        return response()->json(['message' => 'Transaksi berhasil dihapus.']);
    }
}
