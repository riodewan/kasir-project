<?php

namespace App\Exports;

use App\Models\Transaction;
use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;

class LaporanExport implements FromView
{
    protected $dari;
    protected $sampai;

    public function __construct($dari = null, $sampai = null)
    {
        $this->dari = $dari;
        $this->sampai = $sampai;
    }

    public function view(): View
    {
        $query = Transaction::with('kasir');

        if ($this->dari) {
            $query->whereDate('created_at', '>=', $this->dari);
        }

        if ($this->sampai) {
            $query->whereDate('created_at', '<=', $this->sampai);
        }

        $data = $query->orderBy('created_at', 'desc')->get();
        $total = $data->sum('total_harga');

        return view('exports.laporan', [
            'data' => $data,
            'total' => $total,
        ]);
    }
}
