// admin/components/AdminLayout.jsx
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="flex">
    <Sidebar />
    <main className="ml-64 flex-1 p-6 bg-gray-50 min-h-screen">
        <Outlet />
    </main>
    </div>

  );
}
