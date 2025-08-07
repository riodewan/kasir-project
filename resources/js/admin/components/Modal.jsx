import { useEffect } from "react";
import { X } from "lucide-react";

export default function Modal({ open, onClose, children, size = "max-w-xl" }) {
  useEffect(() => {
    const closeOnEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", closeOnEsc);
    return () => document.removeEventListener("keydown", closeOnEsc);
  }, [onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`relative bg-white w-full ${size} rounded-xl shadow-lg p-6 animate-scaleIn`}
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
        >
          <X size={20} />
        </button>
        {children}
      </div>
    </div>
  );
}
