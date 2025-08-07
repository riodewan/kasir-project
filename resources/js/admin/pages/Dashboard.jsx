import { useEffect, useState } from "react";
import axios from "../../axios";
import {
  ShoppingCart,
  Package,
  Users,
  BarChart3,
  PlusCircle,
  FileBarChart2,
  FolderKanban,
  TrendingUp,
  Clock,
} from "lucide-react";
import { Line } from "react-chartjs-2";
import "chart.js/auto"; // agar chart.js bisa langsung pakai

export default function Dashboard() {
  const [user, setUser] = useState({ name: "" });
  const [summary, setSummary] = useState({
    total_transaksi: 0,
    pendapatan_hari_ini: 0,
    total_produk: 0,
    total_pelanggan: 0,
    top_products: [],
    last_transactions: [],
    daily_sales: [],
  });

  const formatRupiah = (value) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, summaryRes] = await Promise.all([
          axios.get("/api/user"),
          axios.get("/api/dashboard/summary"),
        ]);

        setUser(userRes.data);
        setSummary(summaryRes.data);
      } catch (error) {
        console.error("Gagal mengambil data dashboard:", error);
      }
    };

    fetchData();
  }, []);


  const dailyChartData = {
    labels: summary.daily_sales.map((d) => d.tanggal),
    datasets: [
      {
        label: "Pendapatan",
        data: summary.daily_sales.map((d) => d.total),
        fill: false,
        borderColor: "#3b82f6",
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h1 className="text-2xl font-bold text-gray-800">📊 Dashboard Kasir</h1>
        <p className="text-sm text-gray-500">
          Selamat datang kembali, {user.name ?? "Admin"} 👋
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard title="Total Transaksi" value={summary.total_transaksi} icon={<ShoppingCart size={28} />} />
        <SummaryCard title="Pendapatan Hari Ini" value={formatRupiah(summary.pendapatan_hari_ini)} icon={<BarChart3 size={28} />} />
        <SummaryCard title="Produk Tersedia" value={summary.total_produk} icon={<Package size={28} />} />
        <SummaryCard title="Pelanggan" value={summary.total_pelanggan} icon={<Users size={28} />} />
      </div>

      {/* Chart & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow col-span-2">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">📈 Pendapatan Harian</h2>
          <Line data={dailyChartData} height={220} />
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">🔥 Produk Terlaris</h2>
          <ul className="divide-y">
            {summary.top_products.map((product, index) => (
              <li key={index} className="py-2 flex justify-between text-sm text-gray-700">
                <span>{product.nama}</span>
                <span className="text-blue-600 font-medium">{product.terjual}x</span>
              </li>
            ))}
            {summary.top_products.length === 0 && <li className="text-gray-400">Belum ada data</li>}
          </ul>
        </div>
      </div>

      {/* Last Transactions */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">🕓 Transaksi Terbaru</h2>
        <table className="w-full text-sm">
          <thead className="text-gray-500 border-b">
            <tr>
              <th className="text-left py-2">Pembeli</th>
              <th className="text-left py-2">Tanggal</th>
              <th className="text-left py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {summary.last_transactions.map((tx, index) => (
              <tr key={index} className="border-b last:border-none">
                <td className="py-2">{tx.nama_pembeli}</td>
                <td className="py-2">{tx.tanggal}</td>
                <td className="py-2">{formatRupiah(tx.total_harga)}</td>
              </tr>
            ))}
            {summary.last_transactions.length === 0 && (
              <tr>
                <td colSpan={3} className="py-4 text-center text-gray-400">
                  Belum ada transaksi
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">🚀 Aksi Cepat</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <QuickAction label="Transaksi Baru" icon={<PlusCircle size={24} />} onClick={() => window.location.href = "/admin/transaksi"} />
          <QuickAction label="Manajemen Produk" icon={<Package size={24} />} onClick={() => window.location.href = "/admin/produk"} />
          <QuickAction label="Kategori Produk" icon={<FolderKanban size={24} />} onClick={() => window.location.href = "/admin/kategori"} />
          <QuickAction label="Laporan Transaksi" icon={<FileBarChart2 size={24} />} onClick={() => window.location.href = "/admin/laporan"} />
          <QuickAction label="Riwayat Transaksi" icon={<Clock size={24} />} onClick={() => window.location.href = "/admin/transaksi"} />
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ title, value, icon }) {
  return (
    <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4 hover:shadow-md transition">
      <div className="bg-blue-100 text-blue-600 p-3 rounded-full">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-xl font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  );
}

function QuickAction({ label, icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-xl shadow p-5 flex items-center gap-4 hover:bg-blue-50 hover:shadow-md transition text-left w-full"
    >
      <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
        {icon}
      </div>
      <div className="flex-1">
        <span className="text-base font-medium text-gray-800">{label}</span>
      </div>
    </button>
  );
}
