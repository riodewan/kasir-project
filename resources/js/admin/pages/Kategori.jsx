import { useEffect, useState } from "react";
import { PlusCircle, Trash2, Pencil, X, Search } from "lucide-react";
import axios from "../../axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export default function Kategori() {
  const [kategoriList, setKategoriList] = useState([]);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1 });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ id: null, nama: "" });

  const fetchKategori = (page = 1, searchQuery = "") => {
    setLoading(true);
    axios
      .get(`/api/kategori?page=${page}&search=${searchQuery}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        setKategoriList(res.data.data || []);
        setPagination({
          current_page: res.data.current_page,
          last_page: res.data.last_page,
        });
      })
      .catch(() => {
        MySwal.fire("Gagal", "Tidak bisa memuat kategori.", "error");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchKategori();
  }, []);

  const openModal = (kategori = null) => {
    if (kategori) {
      setForm({ id: kategori.id, nama: kategori.nama });
    } else {
      setForm({ id: null, nama: "" });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setForm({ id: null, nama: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = form.id ? `/api/kategori/${form.id}` : "/api/kategori";
    const method = form.id ? "put" : "post";

    axios[method](url, form, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then(() => {
        fetchKategori(pagination.current_page, search);
        MySwal.fire("Berhasil", form.id ? "Kategori diperbarui." : "Kategori ditambahkan.", "success");
        closeModal();
      })
      .catch(() => {
        MySwal.fire("Gagal", "Terjadi kesalahan saat menyimpan kategori.", "error");
      });
  };

  const handleDelete = (id) => {
    MySwal.fire({
      title: "Yakin hapus kategori ini?",
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
          .delete(`/api/kategori/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          })
          .then(() => {
            fetchKategori(pagination.current_page, search);
            MySwal.fire("Berhasil", "Kategori dihapus.", "success");
          })
          .catch(() => {
            MySwal.fire("Gagal", "Tidak bisa menghapus kategori.", "error");
          });
      }
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchKategori(1, search);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-700">📂 Manajemen Kategori</h1>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <PlusCircle size={18} />
          Tambah Kategori
        </button>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          placeholder="Cari kategori..."
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

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">#</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Nama</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="3" className="text-center py-8 text-gray-500">🔄 Memuat kategori...</td>
              </tr>
            ) : kategoriList.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center py-8 text-gray-500">Belum ada kategori.</td>
              </tr>
            ) : (
              kategoriList.map((kat, index) => (
                <tr key={kat.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{(pagination.current_page - 1) * 10 + index + 1}</td>
                  <td className="px-6 py-4 font-medium text-gray-800">{kat.nama}</td>
                  <td className="px-6 py-4 space-x-3">
                    <button
                      onClick={() => openModal(kat)}
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <Pencil size={16} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(kat.id)}
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
            onClick={() => fetchKategori(pagination.current_page - 1, search)}
            disabled={pagination.current_page === 1}
            className="px-3 py-1 rounded bg-gray-100 disabled:opacity-50"
          >
            ← Sebelumnya
          </button>
          <button
            onClick={() => fetchKategori(pagination.current_page + 1, search)}
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
              {form.id ? "Edit Kategori" : "Tambah Kategori"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700">Nama Kategori</label>
                <input
                  type="text"
                  value={form.nama}
                  onChange={(e) => setForm({ ...form, nama: e.target.value })}
                  className="w-full border px-3 py-2 rounded-lg"
                  required
                />
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
