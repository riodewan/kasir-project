import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  FolderKanban,
  FileBarChart2,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const menu = [
  { name: "Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard size={20} /> },
  { name: "Transaksi", path: "/admin/transaksi", icon: <ShoppingCart size={20} /> },
  { name: "Produk", path: "/admin/produk", icon: <Package size={20} /> },
  { name: "Kategori", path: "/admin/kategori", icon: <FolderKanban size={20} /> },
  { name: "Laporan", path: "/admin/laporan", icon: <FileBarChart2 size={20} /> },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white h-16 shadow-sm z-40 flex items-center justify-between px-4">
        <button onClick={() => setIsOpen(true)}>
          <Menu size={24} />
        </button>
        <h1 className="text-lg font-bold text-blue-600">KasirApp</h1>
        <div></div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed z-40 top-0 left-0 h-full w-64 bg-white border-r border-gray-200 shadow-sm transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Logo + Close button */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-blue-600">KasirApp</h1>
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
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
              onClick={() => setIsOpen(false)} // close on click (mobile)
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
    </>
  );
}
