<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Transaction;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Exports\LaporanExport;
use Maatwebsite\Excel\Facades\Excel;

class LaporanController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'dari' => 'nullable|date',
            'sampai' => 'nullable|date',
        ]);

        $query = Transaction::with('kasir')->orderBy('created_at', 'desc');

        if ($request->filled('dari')) {
            $query->whereDate('created_at', '>=', $request->dari);
        }

        if ($request->filled('sampai')) {
            $query->whereDate('created_at', '<=', $request->sampai);
        }

        $data = $query->get();

        return response()->json([
            'data' => $data,
            'total_transaksi' => $data->count(),
            'total_penjualan' => $data->sum('total_harga'),
        ]);
    }

    public function exportPdf(Request $request)
    {
        $dari = $request->query('dari');
        $sampai = $request->query('sampai');

        $query = Transaction::with('kasir');

        if ($dari) {
            $query->whereDate('created_at', '>=', $dari);
        }

        if ($sampai) {
            $query->whereDate('created_at', '<=', $sampai);
        }

        $data = $query->orderBy('created_at', 'desc')->get();
        $total = $data->sum('total_harga');

        $pdf = Pdf::loadView('exports.laporan', [
            'data' => $data,
            'total' => $total,
            'dari' => $dari,
            'sampai' => $sampai,
        ])->setPaper('A4', 'portrait');

        return $pdf->download('laporan-transaksi.pdf');
    }

    public function exportExcel(Request $request)
    {
        $dari = $request->query('dari');
        $sampai = $request->query('sampai');

        return Excel::download(new LaporanExport($dari, $sampai), 'laporan-transaksi.xlsx');
    }
}
