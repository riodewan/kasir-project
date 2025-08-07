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
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">📂 Manajemen Kategori</h1>
        <button
          onClick={() => openModal()}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm shadow"
        >
          <PlusCircle size={18} />
          Tambah
        </button>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2 max-w-sm">
        <input
          type="text"
          placeholder="Cari kategori..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 focus:ring-blue-500 focus:border-blue-500 px-3 py-2 rounded-lg w-full text-sm"
        />
        <button
          type="submit"
          className="inline-flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-sm px-3 py-2 rounded-lg"
        >
          <Search size={18} /> Cari
        </button>
      </form>

      {/* Tabel */}
      <div className="overflow-x-auto rounded-lg shadow border border-gray-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-600 uppercase tracking-wider text-xs">
            <tr>
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Nama Kategori</th>
              <th className="px-4 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="3" className="text-center px-4 py-6 text-gray-500">🔄 Memuat data...</td>
              </tr>
            ) : kategoriList.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center px-4 py-6 text-gray-500">Belum ada data kategori.</td>
              </tr>
            ) : (
              kategoriList.map((kat, index) => (
                <tr key={kat.id} className="hover:bg-gray-50 border-t">
                  <td className="px-4 py-3 text-gray-700">{(pagination.current_page - 1) * 10 + index + 1}</td>
                  <td className="px-4 py-3 text-gray-900 font-medium">{kat.nama}</td>
                  <td className="px-4 py-3 text-center space-x-2">
                    <button
                      onClick={() => openModal(kat)}
                      className="inline-flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <Pencil size={16} className="mr-1" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(kat.id)}
                      className="inline-flex items-center text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={16} className="mr-1" /> Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center pt-4 text-sm text-gray-600">
        <p>
          Halaman <strong>{pagination.current_page}</strong> dari <strong>{pagination.last_page}</strong>
        </p>
        <div className="space-x-2">
          <button
            onClick={() => fetchKategori(pagination.current_page - 1, search)}
            disabled={pagination.current_page === 1}
            className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
          >
            ← Sebelumnya
          </button>
          <button
            onClick={() => fetchKategori(pagination.current_page + 1, search)}
            disabled={pagination.current_page === pagination.last_page}
            className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
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
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              <X />
            </button>
            <h2 className="text-xl font-semibold mb-4">
              {form.id ? "Edit Kategori" : "Tambah Kategori"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kategori</label>
                <input
                  type="text"
                  value={form.nama}
                  onChange={(e) => setForm({ ...form, nama: e.target.value })}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm shadow"
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
