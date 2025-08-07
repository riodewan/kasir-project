import { useEffect, useState } from "react";
import axios from "../../axios";
import { PlusCircle, X, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export default function Transaksi() {
  const [transaksiList, setTransaksiList] = useState([]);
  const [produkList, setProdukList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [namaPembeli, setNamaPembeli] = useState("");

  const fetchTransaksi = () => {
    axios
      .get("/api/transaksi", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setTransaksiList(res.data.data))
      .catch(() => {
        MySwal.fire("Gagal", "Tidak bisa memuat transaksi", "error");
      });
  };

  const fetchProduk = () => {
    axios
      .get("/api/produk", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setProdukList(res.data.data))
      .catch(() => {
        MySwal.fire("Gagal", "Tidak bisa memuat produk", "error");
      });
  };

  useEffect(() => {
    fetchTransaksi();
    fetchProduk();
  }, []);

  const openModal = () => {
    setItems([]);
    setNamaPembeli("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setItems([]);
    setNamaPembeli("");
  };

  const handleAddItem = () => {
    setItems([...items, { produk_id: "", jumlah: 1 }]);
  };

  const handleRemoveItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleChangeItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const getTotal = () => {
    return items.reduce((acc, item) => {
      const produk = produkList.find((p) => p.id == item.produk_id);
      const harga = produk ? produk.harga : 0;
      return acc + harga * item.jumlah;
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
        nama_pembeli: namaPembeli,
        items: items.map((item) => ({
        product_id: item.produk_id,
        qty: item.jumlah,
        })),
    };

    try {
        const res = await axios.post("/api/transaksi", payload, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        });

        console.log("RESPON TRANSAKSI:", res.data);

        const trx = res.data?.data;
        if (!trx || !trx.kode) {
        throw new Error("Respon transaksi tidak valid");
        }

        MySwal.fire({
        title: "Transaksi berhasil",
        html: `<p>Kode: <strong>${trx.kode}</strong></p><p>Total: Rp ${trx.total_harga.toLocaleString()}</p>`,
        icon: "success",
        });

        fetchTransaksi();
        closeModal();
    } catch (err) {
        console.error("GAGAL SIMPAN:", err.response?.data || err.message);
        const msg = err.response?.data?.message || "Terjadi kesalahan saat menyimpan transaksi.";
        MySwal.fire("Gagal", msg, "error");
    }
    };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-700">🧾 Transaksi Kasir</h1>
        <button
          onClick={openModal}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <PlusCircle size={18} /> Transaksi Baru
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">#</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Kode</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Tanggal</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Pembeli</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Total</th>
            </tr>
          </thead>
          <tbody>
            {transaksiList.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  Belum ada transaksi.
                </td>
              </tr>
            ) : (
              transaksiList.map((trx, i) => (
                <tr key={trx.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{i + 1}</td>
                  <td className="px-6 py-4 font-mono text-blue-700 text-sm">{trx.kode}</td>
                  <td className="px-6 py-4">{new Date(trx.created_at).toLocaleString()}</td>
                  <td className="px-6 py-4">{trx.nama_pembeli || "-"}</td>
                  <td className="px-6 py-4">Rp {trx.total_harga.toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Transaksi */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xl relative">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              <X />
            </button>
            <h2 className="text-lg font-semibold mb-4">Transaksi Baru</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                value={namaPembeli}
                onChange={(e) => setNamaPembeli(e.target.value)}
                placeholder="Nama pembeli (opsional)"
                className="w-full border px-3 py-2 rounded"
              />

              {items.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <select
                    value={item.produk_id}
                    onChange={(e) =>
                      handleChangeItem(index, "produk_id", e.target.value)
                    }
                    className="w-full border px-3 py-2 rounded"
                    required
                  >
                    <option value="">Pilih produk</option>
                    {produkList.map((produk) => (
                      <option key={produk.id} value={produk.id}>
                        {produk.nama} - Rp {produk.harga}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={item.jumlah}
                    onChange={(e) =>
                      handleChangeItem(index, "jumlah", parseInt(e.target.value))
                    }
                    className="w-24 border px-3 py-2 rounded"
                    min="1"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="text-red-600"
                  >
                    <Trash2 />
                  </button>
                </div>
              ))}
              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="text-sm text-blue-600 hover:underline"
                >
                  + Tambah Produk
                </button>
                <p className="font-semibold">
                  Total: Rp {getTotal().toLocaleString()}
                </p>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Simpan Transaksi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
