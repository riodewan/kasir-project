import { useEffect, useState } from "react";
import { PlusCircle, Trash2, Pencil, X, Search } from "lucide-react";
import axios from "../../axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export default function Produk() {
    const [selectedKategori, setSelectedKategori] = useState("");
  const [produkList, setProdukList] = useState([]);
  const [kategoriList, setKategoriList] = useState([]);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1 });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ id: null, nama: "", harga: "", stok: "", kategori_id: "" });

  const fetchProduk = (page = 1, searchQuery = "", kategoriId = "") => {
    setLoading(true);
    axios
        .get(`/api/produk?page=${page}&search=${searchQuery}&kategori_id=${kategoriId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((res) => {
        setProdukList(res.data.data || []);
        setPagination({
            current_page: res.data.current_page,
            last_page: res.data.last_page,
        });
        })
        .catch(() => {
        MySwal.fire("Gagal", "Tidak bisa memuat produk.", "error");
        })
        .finally(() => setLoading(false));
    };

  const fetchKategori = () => {
    axios
      .get("/api/kategori", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        setKategoriList(res.data.data || []);
      })
      .catch(() => {
        MySwal.fire("Gagal", "Tidak bisa memuat kategori.", "error");
      });
  };

  useEffect(() => {
    fetchProduk();
    fetchKategori();
  }, []);

  const openModal = (produk = null) => {
    if (produk) {
      setForm({
        id: produk.id,
        nama: produk.nama,
        harga: produk.harga,
        stok: produk.stok,
        kategori_id: produk.kategori_id || "",
      });
    } else {
      setForm({ id: null, nama: "", harga: "", stok: "", kategori_id: "" });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setForm({ id: null, nama: "", harga: "", stok: "", kategori_id: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = form.id ? `/api/produk/${form.id}` : "/api/produk";
    const method = form.id ? "put" : "post";

    axios[method](url, form, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then(() => {
        fetchProduk(pagination.current_page, search);
        MySwal.fire("Berhasil", form.id ? "Produk diperbarui." : "Produk ditambahkan.", "success");
        closeModal();
      })
      .catch(() => {
        MySwal.fire("Gagal", "Terjadi kesalahan saat menyimpan produk.", "error");
      });
  };

  const handleDelete = (id) => {
    MySwal.fire({
      title: "Yakin hapus produk ini?",
      text: "Tindakan ini tidak bisa dibatalkan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`/api/produk/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          })
          .then(() => {
            fetchProduk(pagination.current_page, search);
            MySwal.fire("Berhasil", "Produk dihapus.", "success");
          })
          .catch(() => {
            MySwal.fire("Gagal", "Tidak bisa menghapus produk.", "error");
          });
      }
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProduk(1, search, selectedKategori);
    };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-700">📦 Manajemen Produk</h1>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <PlusCircle size={18} />
          Tambah Produk
        </button>
      </div>
        <div className="flex gap-4 items-center">
            <form onSubmit={handleSearch} className="flex gap-2">
                <input
                type="text"
                placeholder="Cari produk..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border px-3 py-2 rounded-lg w-full max-w-sm"
                />
                <button
                type="submit"
                className="flex items-center gap-1 bg-gray-100 px-3 py-2 rounded-lg hover:bg-gray-200"
                >
                <Search size={18} /> Cari
                </button>
            </form>

            <select
                value={selectedKategori}
                onChange={(e) => {
                setSelectedKategori(e.target.value);
                fetchProduk(1, search, e.target.value);
                }}
                className="border px-3 py-2 rounded-lg"
            >
                <option value="">Semua Kategori</option>
                {kategoriList.map((kategori) => (
                <option key={kategori.id} value={kategori.id}>
                    {kategori.nama}
                </option>
                ))}
            </select>
            </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">#</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Nama</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Harga</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Stok</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Kategori</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-8 text-gray-500">
                  🔄 Memuat produk...
                </td>
              </tr>
            ) : produkList.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-8 text-gray-500">Belum ada produk.</td>
              </tr>
            ) : (
              produkList.map((produk, index) => (
                <tr key={produk.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">
                    {(pagination.current_page - 1) * 10 + index + 1}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-800">{produk.nama}</td>
                  <td className="px-6 py-4 text-gray-700">Rp {produk.harga.toLocaleString()}</td>
                  <td className="px-6 py-4 text-gray-700">{produk.stok}</td>
                  <td className="px-6 py-4 text-gray-700">
                    {produk.kategori?.nama || "-"}
                  </td>
                  <td className="px-6 py-4 space-x-3">
                    <button
                      onClick={() => openModal(produk)}
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <Pencil size={16} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(produk.id)}
                      className="text-red-600 hover:underline flex items-center gap-1"
                    >
                      <Trash2 size={16} /> Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center pt-4">
        <p className="text-sm text-gray-600">
          Halaman {pagination.current_page} dari {pagination.last_page}
        </p>
        <div className="space-x-2">
          <button
            onClick={() => fetchProduk(pagination.current_page - 1, search)}
            disabled={pagination.current_page === 1}
            className="px-3 py-1 rounded bg-gray-100 disabled:opacity-50"
          >
            ← Sebelumnya
          </button>
          <button
            onClick={() => fetchProduk(pagination.current_page + 1, search)}
            disabled={pagination.current_page === pagination.last_page}
            className="px-3 py-1 rounded bg-gray-100 disabled:opacity-50"
          >
            Selanjutnya →
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              <X />
            </button>
            <h2 className="text-lg font-semibold mb-4">
              {form.id ? "Edit Produk" : "Tambah Produk"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700">Nama</label>
                <input
                  type="text"
                  value={form.nama}
                  onChange={(e) => setForm({ ...form, nama: e.target.value })}
                  className="w-full border px-3 py-2 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700">Harga</label>
                <input
                  type="number"
                  value={form.harga}
                  onChange={(e) => setForm({ ...form, harga: e.target.value })}
                  className="w-full border px-3 py-2 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700">Stok</label>
                <input
                  type="number"
                  value={form.stok}
                  onChange={(e) => setForm({ ...form, stok: e.target.value })}
                  className="w-full border px-3 py-2 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700">Kategori</label>
                <select
                  value={form.kategori_id}
                  onChange={(e) => setForm({ ...form, kategori_id: e.target.value })}
                  className="w-full border px-3 py-2 rounded-lg"
                  required
                >
                  <option value="">Pilih kategori</option>
                  {kategoriList.map((kat) => (
                    <option key={kat.id} value={kat.id}>
                      {kat.nama}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  {form.id ? "Update" : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
