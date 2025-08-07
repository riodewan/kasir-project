import { useEffect, useState } from "react";
import axios from "../../axios";
import { FileDown, FileSpreadsheet } from "lucide-react";
import { format } from "date-fns";

export default function Laporan() {
  const [dari, setDari] = useState("");
  const [sampai, setSampai] = useState("");
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const ITEMS_PER_PAGE = 10;

  const formatRupiah = (angka) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);

  const fetchLaporan = async () => {
    try {
      const res = await axios.get("/api/laporan", {
        params: { dari, sampai },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const laporan = res.data.data || [];
      setData(laporan);

      const totalHarga = laporan.reduce(
        (acc, trx) => acc + parseInt(trx.total_harga || 0),
        0
      );
      setTotal(totalHarga);
      setPage(1); // reset ke halaman pertama setiap pencarian
    } catch (err) {
      console.error("Gagal ambil laporan:", err);
      setData([]);
      setTotal(0);
    }
  };

  const handleExport = (type) => {
    const url =
      type === "excel"
        ? "/api/laporan/export-excel"
        : "/api/laporan/export-pdf";

    const params = new URLSearchParams();
    if (dari) params.append("dari", dari);
    if (sampai) params.append("sampai", sampai);

    window.open(`${url}?${params.toString()}`, "_blank");
  };

  useEffect(() => {
    fetchLaporan();
  }, [dari, sampai]);

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const paginatedData = data.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-xl font-semibold text-gray-700">📊 Laporan Transaksi</h1>

      {/* FILTER & EXPORT */}
      <div className="flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-sm text-gray-600">Dari Tanggal</label>
          <input
            type="date"
            value={dari}
            onChange={(e) => setDari(e.target.value)}
            className="border px-3 py-2 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600">Sampai Tanggal</label>
          <input
            type="date"
            value={sampai}
            onChange={(e) => setSampai(e.target.value)}
            className="border px-3 py-2 rounded-md"
          />
        </div>
        <div className="flex gap-2 ml-auto">
          <button
            onClick={() => handleExport("excel")}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            <FileSpreadsheet size={16} /> Excel
          </button>
          <button
            onClick={() => handleExport("pdf")}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            <FileDown size={16} /> PDF
          </button>
        </div>
      </div>

      {/* TABEL */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-gray-600">#</th>
              <th className="px-4 py-3 text-left text-gray-600">Tanggal</th>
              <th className="px-4 py-3 text-left text-gray-600">Kode</th>
              <th className="px-4 py-3 text-left text-gray-600">Kasir</th>
              <th className="px-4 py-3 text-left text-gray-600">Pembeli</th>
              <th className="px-4 py-3 text-right text-gray-600">Total</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  Tidak ada data.
                </td>
              </tr>
            ) : (
              paginatedData.map((trx, i) => (
                <tr key={trx.id} className="hover:bg-gray-50 border-b">
                  <td className="px-4 py-2">
                    {(page - 1) * ITEMS_PER_PAGE + i + 1}
                  </td>
                  <td className="px-4 py-2">
                    {format(new Date(trx.created_at), "dd-MM-yyyy HH:mm")}
                  </td>
                  <td className="px-4 py-2 font-mono text-blue-700">{trx.kode}</td>
                  <td className="px-4 py-2">{trx.kasir?.name || "-"}</td>
                  <td className="px-4 py-2">{trx.nama_pembeli || "-"}</td>
                  <td className="px-4 py-2 text-right">
                    {formatRupiah(trx.total_harga)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
          {data.length > 0 && (
            <tfoot>
              <tr className="bg-gray-100 font-semibold">
                <td colSpan="5" className="px-4 py-3 text-right">Total Pendapatan</td>
                <td className="px-4 py-3 text-right text-green-700">
                  {formatRupiah(total)}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center pt-4 text-sm">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            disabled={page === 1}
          >
            ← Sebelumnya
          </button>
          <span>Halaman {page} dari {totalPages}</span>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            disabled={page === totalPages}
          >
            Selanjutnya →
          </button>
        </div>
      )}
    </div>
  );
}
