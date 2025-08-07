<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Laporan Transaksi</title>
    <style>
        body { font-family: sans-serif; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #ddd; padding: 6px; text-align: left; }
        th { background-color: #f2f2f2; }
        h2 { text-align: center; }
        .total { font-weight: bold; text-align: right; }
    </style>
</head>
<body>
    <h2>Laporan Transaksi</h2>
    @if ($dari && $sampai)
        <p><strong>Periode:</strong> {{ date('d-m-Y', strtotime($dari)) }} s/d {{ date('d-m-Y', strtotime($sampai)) }}</p>
    @endif

    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>Tanggal</th>
                <th>Kode</th>
                <th>Kasir</th>
                <th>Pembeli</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($data as $i => $trx)
                <tr>
                    <td>{{ $i + 1 }}</td>
                    <td>{{ \Carbon\Carbon::parse($trx->created_at)->format('d-m-Y H:i') }}</td>
                    <td>{{ $trx->kode }}</td>
                    <td>{{ $trx->kasir->name ?? '-' }}</td>
                    <td>{{ $trx->nama_pembeli }}</td>
                    <td>Rp {{ number_format($trx->total_harga) }}</td>
                </tr>
            @endforeach
            <tr>
                <td colspan="5" class="total">Total Pendapatan</td>
                <td class="total">Rp {{ number_format($total) }}</td>
            </tr>
        </tbody>
    </table>
</body>
</html>
