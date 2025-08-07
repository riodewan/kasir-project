// admin/components/AdminLayout.jsx
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";

export default function AdminLayout() {
  const [sidebarWidth, setSidebarWidth] = useState("w-64");

  // Optional: detect if sidebar is collapsed via custom event
  useEffect(() => {
    const handler = (e) => {
      setSidebarWidth(e.detail?.collapsed ? "w-20" : "w-64");
    };
    window.addEventListener("sidebar:toggle", handler);
    return () => window.removeEventListener("sidebar:toggle", handler);
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <main
        className={`flex-1 min-h-screen bg-gray-50 transition-all duration-300 ease-in-out ml-0 md:ml-64`}
      >
        {/* Top padding for mobile header */}
        <div className="pt-16 md:pt-0 p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
    