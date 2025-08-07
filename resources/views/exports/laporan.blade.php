<table>
    <thead>
        <tr>
            <th>Tanggal</th>
            <th>Kode</th>
            <th>Kasir</th>
            <th>Pembeli</th>
            <th>Total</th>
        </tr>
    </thead>
    <tbody>
        @foreach ($data as $trx)
            <tr>
                <td>{{ \Carbon\Carbon::parse($trx->created_at)->format('d-m-Y H:i') }}</td>
                <td>{{ $trx->kode }}</td>
                <td>{{ $trx->kasir->name ?? '-' }}</td>
                <td>{{ $trx->nama_pembeli }}</td>
                <td>{{ number_format($trx->total_harga) }}</td>
            </tr>
        @endforeach
        <tr>
            <td colspan="4" style="text-align: right;"><strong>Total Pendapatan</strong></td>
            <td><strong>{{ number_format($total) }}</strong></td>
        </tr>
    </tbody>
</table>
