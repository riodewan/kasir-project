import { ShoppingCart, Package, Users, BarChart3, PlusCircle } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="bg-white shadow px-6 py-4 flex items-center justify-between rounded-md">
        <h1 className="text-xl font-semibold text-gray-700">Dashboard Kasir</h1>
        <div className="text-sm text-gray-500">Selamat datang, Admin</div>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard title="Total Transaksi" value="120" icon={<ShoppingCart />} />
        <SummaryCard title="Pendapatan Hari Ini" value="Rp 3.500.000" icon={<BarChart3 />} />
        <SummaryCard title="Produk Tersedia" value="320" icon={<Package />} />
        <SummaryCard title="Pelanggan" value="85" icon={<Users />} />
      </div>

      {/* Quick Actions */}
      <section>
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Aksi Cepat</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <QuickAction label="Transaksi Baru" icon={<PlusCircle />} onClick={() => alert('Arahkan ke transaksi')} />
          <QuickAction label="Manajemen Produk" icon={<Package />} onClick={() => alert('Arahkan ke produk')} />
          <QuickAction label="Riwayat Transaksi" icon={<ShoppingCart />} onClick={() => alert('Arahkan ke riwayat')} />
        </div>
      </section>
    </div>
  );
}

function SummaryCard({ title, value, icon }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
      <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-lg font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  );
}

function QuickAction({ label, icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-lg shadow p-4 flex items-center gap-4 hover:bg-blue-50 transition"
    >
      <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
        {icon}
      </div>
      <span className="font-medium text-gray-700">{label}</span>
    </button>
  );
}
