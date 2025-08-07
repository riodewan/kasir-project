import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  FolderKanban,   // ✅ Tambahkan icon
  FileBarChart2,
  LogOut,
} from "lucide-react";

const menu = [
  { name: "Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard size={20} /> },
  { name: "Transaksi", path: "/admin/transaksi", icon: <ShoppingCart size={20} /> },
  { name: "Produk", path: "/admin/produk", icon: <Package size={20} /> },
  { name: "Kategori", path: "/admin/kategori", icon: <FolderKanban size={20} /> }, // ✅ Tambahkan ini
  { name: "Laporan", path: "/admin/laporan", icon: <FileBarChart2 size={20} /> },
];

export default function Sidebar() {
  return (
    <aside className="h-screen w-64 bg-white border-r border-gray-200 shadow-sm fixed top-0 left-0 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-gray-200">
        <h1 className="text-xl font-bold text-blue-600">KasirApp</h1>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menu.map((item) => (
          <NavLink
            to={item.path}
            key={item.name}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition ${
                isActive
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100 hover:text-blue-500"
              }`
            }
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
          className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
        >
          <LogOut size={20} />
          Keluar
        </button>
      </div>
    </aside>
  );
}
