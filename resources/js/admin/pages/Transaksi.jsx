import { useEffect, useState } from "react";
import axios from "../../axios";
import { PlusCircle, X, Trash2, Printer } from "lucide-react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const formatRupiah = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);

export default function Transaksi() {
  const [transaksiList, setTransaksiList] = useState([]);
  const [produkList, setProdukList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [namaPembeli, setNamaPembeli] = useState("");
  const [tunai, setTunai] = useState(0);

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
    setTunai(0);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setItems([]);
    setNamaPembeli("");
    setTunai(0);
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

  const kembalian = tunai - getTotal();

  const handlePrint = (id) => {
    const url = `http://127.0.0.1:8000/api/cetak-struk/${id}`;
    window.open(url, '_blank');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const total = getTotal();

    if (tunai < total) {
      MySwal.fire("Gagal", "Uang tunai tidak cukup untuk membayar!", "error");
      return;
    }

    const payload = {
      nama_pembeli: namaPembeli,
      tunai: tunai,
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
      const trx = res.data?.data;
      if (!trx || !trx.kode) throw new Error("Respon transaksi tidak valid");

      MySwal.fire({
        title: "Transaksi berhasil",
        html: `
          <p>Kode: <strong>${trx.kode}</strong></p>
          <p>Total: ${formatRupiah(trx.total_harga)}</p>
          <p>Tunai: ${formatRupiah(tunai)}</p>
          <p>Kembalian: ${formatRupiah(tunai - trx.total_harga)}</p>
        `,
        icon: "success",
      });

      fetchTransaksi();
      closeModal();
      handlePrint(trx.id);
    } catch (err) {
      console.error("GAGAL SIMPAN:", err.response?.data || err.message);
      const msg = err.response?.data?.message || "Terjadi kesalahan saat menyimpan transaksi.";
      MySwal.fire("Gagal", msg, "error");
    }
  };

 return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <h1 className="text-xl font-semibold text-gray-700">🧾 Transaksi Kasir</h1>
        <button
          onClick={openModal}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <PlusCircle size={18} /> Transaksi Baru
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-y-1 text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="text-left px-4 md:px-6 py-3 border-b">#</th>
              <th className="text-left px-4 md:px-6 py-3 border-b">Kode</th>
              <th className="text-left px-4 md:px-6 py-3 border-b">Tanggal</th>
              <th className="text-left px-4 md:px-6 py-3 border-b">Pembeli</th>
              <th className="text-left px-4 md:px-6 py-3 border-b">Total</th>
              <th className="text-left px-4 md:px-6 py-3 border-b">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {transaksiList.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  Belum ada transaksi.
                </td>
              </tr>
            ) : (
              transaksiList.map((trx, i) => (
                <tr key={trx.id} className="hover:bg-gray-50 border-b">
                  <td className="px-4 md:px-6 py-3">{i + 1}</td>
                  <td className="px-4 md:px-6 py-3 font-mono text-blue-700">{trx.kode}</td>
                  <td className="px-4 md:px-6 py-3">{new Date(trx.created_at).toLocaleString()}</td>
                  <td className="px-4 md:px-6 py-3">{trx.nama_pembeli || "-"}</td>
                  <td className="px-4 md:px-6 py-3 font-semibold">{formatRupiah(trx.total_harga)}</td>
                  <td className="px-4 md:px-6 py-3">
                    <button
                      onClick={() => handlePrint(trx.id)}
                      className="flex items-center gap-1 px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      <Printer size={16} /> Cetak
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Transaksi Baru */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-start overflow-y-auto px-4 py-6">
          <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-xl relative">
            <button onClick={closeModal} className="absolute top-3 right-3 text-gray-500 hover:text-black">
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
                <div key={index} className="flex flex-col md:flex-row items-stretch gap-2">
                  <select
                    value={item.produk_id}
                    onChange={(e) => handleChangeItem(index, "produk_id", e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                    required
                  >
                    <option value="">Pilih produk</option>
                    {produkList.map((produk) => (
                      <option key={produk.id} value={produk.id}>
                        {produk.nama} - {formatRupiah(produk.harga)}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={item.jumlah}
                    onChange={(e) => handleChangeItem(index, "jumlah", parseInt(e.target.value))}
                    className="w-full md:w-24 border px-3 py-2 rounded"
                    min="1"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 />
                  </button>
                </div>
              ))}
              <div className="flex justify-between items-center">
                <button type="button" onClick={handleAddItem} className="text-sm text-blue-600 hover:underline">
                  + Tambah Produk
                </button>
                <p className="font-semibold">Total: {formatRupiah(getTotal())}</p>
              </div>

              <div>
                <label className="block font-medium text-gray-600 mb-1">Uang Tunai</label>
                <input
                  type="number"
                  value={tunai}
                  onChange={(e) => setTunai(parseInt(e.target.value))}
                  className="w-full border px-3 py-2 rounded"
                  placeholder="Jumlah uang tunai"
                  min={getTotal()}
                  required
                />
                {tunai > 0 && (
                  <p className="text-right font-semibold text-green-600 mt-1">
                    Kembalian: {kembalian >= 0 ? formatRupiah(kembalian) : formatRupiah(0)}
                  </p>
                )}
              </div>

              <div className="flex justify-end">
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
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