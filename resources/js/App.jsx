import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ProtectedRoute from "./admin/components/ProtectedRoute";
import AdminLayout from "./admin/components/AdminLayout";
import Dashboard from "./admin/pages/Dashboard";
import Transaksi from "./admin/pages/Transaksi";
import Produk from "./admin/pages/Produk";
import Kategori from "./admin/pages/Kategori"; // ✅ Tambah import kategori
import Laporan from "./admin/pages/Laporan";

import Login from "./admin/pages/Login";
import Register from "./admin/pages/Register";
import GoogleCallback from "./src/pages/GoogleCallback";
import Error404 from "./src/pages/Error404";

export default function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/google/callback" element={<GoogleCallback />} />

        {/* PROTECTED ADMIN ROUTES */}
        <Route path="/admin" element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="transaksi" element={<Transaksi />} />
            <Route path="produk" element={<Produk />} />
            <Route path="kategori" element={<Kategori />} /> {/* ✅ Tambah route kategori */}
            <Route path="laporan" element={<Laporan />} />
          </Route>
        </Route>

        {/* FALLBACK */}
        <Route path="*" element={<Error404 />} />
      </Routes>
    </Router>
  );
}
