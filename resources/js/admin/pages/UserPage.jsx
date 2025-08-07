import { useEffect, useState } from "react";
import axios from "../../axios";
import {
  PlusCircle,
  Pencil,
  Trash2,
  UserCircle,
  Loader2,
} from "lucide-react";
import Modal from "../components/Modal";
import { toast } from "react-toastify"; // Optional, aktifkan jika pakai toastify
import "react-toastify/dist/ReactToastify.css";

export default function UserPage() {
  const [users, setUsers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    username: "",
    bio: "",
    avatar: null,
  });
  const [avatarPreview, setAvatarPreview] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    axios
      .get("/api/users")
      .then((res) => setUsers(res.data.data))
      .catch(() => toast.error("Gagal memuat data user"))
      .finally(() => setLoading(false));
  };

  const openAddModal = () => {
    setEditingUser(null);
    setForm({
      name: "",
      email: "",
      password: "",
      role: "user",
      username: "",
      bio: "",
      avatar: null,
    });
    setAvatarPreview(null);
    setModalOpen(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setForm({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      username: user.username || "",
      bio: user.bio || "",
      avatar: null,
    });
    setAvatarPreview(user.avatar ? `/storage/${user.avatar}` : null);
    setModalOpen(true);
  };

  const handleInput = (e) => {
    const { name, value, files } = e.target;
    if (name === "avatar") {
      const file = files[0];
      setForm({ ...form, avatar: file });
      setAvatarPreview(URL.createObjectURL(file));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null && value !== "") {
        formData.append(key, value);
      }
    });

    try {
      if (editingUser) {
        await axios.post(`/api/users/${editingUser.id}?_method=PUT`, formData);
        toast.success("User berhasil diperbarui");
      } else {
        await axios.post("/api/users", formData);
        toast.success("User berhasil ditambahkan");
      }
      setModalOpen(false);
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error("Terjadi kesalahan saat menyimpan user.");
    }
  };

  const deleteUser = async (id) => {
    if (confirm("Yakin ingin menghapus user ini?")) {
      try {
        await axios.delete(`/api/users/${id}`);
        toast.success("User berhasil dihapus");
        fetchUsers();
      } catch {
        toast.error("Gagal menghapus user");
      }
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <UserCircle size={28} />
          Manajemen User
        </h1>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          <PlusCircle size={20} />
          Tambah User
        </button>
      </div>

      <div className="overflow-x-auto bg-white shadow rounded-xl">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Nama</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Username</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-6">
                  <Loader2 className="mx-auto animate-spin" />
                  Memuat data...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-400">
                  Belum ada data user.
                </td>
              </tr>
            ) : (
              users.map((user, i) => (
                <tr key={user.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{i + 1}</td>
                  <td className="px-4 py-2 flex items-center gap-2">
                    {user.avatar ? (
                      <img
                        src={`/storage/${user.avatar}`}
                        alt="avatar"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <UserCircle size={28} className="text-gray-400" />
                    )}
                    {user.name}
                  </td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">{user.username}</td>
                  <td className="px-4 py-2 capitalize">{user.role}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      onClick={() => openEditModal(user)}
                      className="text-blue-600 hover:underline"
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="text-red-600 hover:underline"
                      title="Hapus"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {editingUser ? "Edit User" : "Tambah User"}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="Nama Lengkap" name="name" value={form.name} onChange={handleInput} required />
            <InputField label="Email" name="email" value={form.email} onChange={handleInput} type="email" required />
            <InputField label="Username" name="username" value={form.username} onChange={handleInput} />
            <div>
              <label className="block text-sm mb-1">Role</label>
              <select
                name="role"
                value={form.role}
                onChange={handleInput}
                className="w-full border px-3 py-2 rounded-md"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <InputField
              label="Password"
              name="password"
              value={form.password}
              onChange={handleInput}
              type="password"
              placeholder={editingUser ? "Kosongkan jika tidak diubah" : ""}
            />
            <div>
              <label className="block text-sm mb-1">Foto Profil</label>
              <input
                type="file"
                name="avatar"
                accept="image/*"
                onChange={handleInput}
                className="w-full text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">Bio</label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleInput}
              rows={3}
              className="w-full border px-3 py-2 rounded-md"
            />
          </div>

          {avatarPreview && (
            <div className="flex justify-center">
              <img
                src={avatarPreview}
                alt="preview"
                className="w-20 h-20 rounded-full object-cover ring-2 ring-blue-500"
              />
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {editingUser ? "Update" : "Simpan"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

// Komponen input umum
function InputField({ label, name, value, onChange, type = "text", required, placeholder }) {
  return (
    <div>
      <label className="block text-sm mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full border px-3 py-2 rounded-md"
      />
    </div>
  );
}
