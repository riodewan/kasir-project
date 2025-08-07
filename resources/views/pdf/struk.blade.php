<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Struk Transaksi</title>
    <style>
        body {
            font-family: 'Courier New', monospace;
            font-size: 10px;
            margin: 0;
            padding: 0;
        }

        .container {
            width: 100%;
            padding: 8px;
        }

        .text-center {
            text-align: center;
        }

        .bold {
            font-weight: bold;
        }

        .divider {
            border-top: 1px dashed #000;
            margin: 4px 0;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        td {
            vertical-align: top;
            padding: 2px 0;
        }

        .right {
            text-align: right;
        }

        .item-line {
            font-size: 9.5px;
        }

        .footer {
            text-align: center;
            font-size: 9px;
            margin-top: 6px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="text-center bold">
            TOKO KASIRKU
        </div>
        <div class="text-center">
            {{ $transaction->kode }}<br/>
            {{ $transaction->created_at->format('d-m-Y H:i') }}
        </div>

        <div class="divider"></div>

        <div>
            <strong>Kasir:</strong> {{ $transaction->kasir->name ?? '-' }}<br/>
            <strong>Pembeli:</strong> {{ $transaction->nama_pembeli ?? '-' }}
        </div>

        <div class="divider"></div>

        <table>
            @foreach ($transaction->items as $item)
                <tr class="item-line">
                    <td colspan="2">{{ $item->product->nama }}</td>
                </tr>
                <tr class="item-line">
                    <td>{{ $item->qty }} x {{ number_format($item->harga_satuan) }}</td>
                    <td class="right">Rp {{ number_format($item->subtotal) }}</td>
                </tr>
            @endforeach
        </table>

        <div class="divider"></div>

        <table>
            <tr>
                <td>Total Item</td>
                <td class="right">{{ $transaction->total_item }}</td>
            </tr>
            <tr>
                <td><strong>Total Bayar</strong></td>
                <td class="right"><strong>Rp {{ number_format($transaction->total_harga) }}</strong></td>
            </tr>

            {{-- TUNAI DAN KEMBALIAN --}}
            @if($transaction->tunai)
                <tr>
                    <td>Tunai</td>
                    <td class="right">Rp {{ number_format($transaction->tunai) }}</td>
                </tr>
                <tr>
                    <td>Kembalian</td>
                    <td class="right">Rp {{ number_format($transaction->tunai - $transaction->total_harga) }}</td>
                </tr>
            @endif
        </table>

        <div class="divider"></div>

        <div class="footer">
            *** TERIMA KASIH ***<br/>
            Barang yang sudah dibeli tidak dapat dikembalikan.
        </div>
    </div>
</body>
</html>
