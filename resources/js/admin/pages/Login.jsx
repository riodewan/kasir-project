import { useState } from 'react';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import axios from '../../axios';
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert({ type: '', message: '' });
    setLoading(true);

    try {
      const res = await axios.post('/api/login', { email, password });
      const token = res.data.token;
      localStorage.setItem('token', token);

      const userRes = await axios.get('/api/user', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const role = (res.data.user?.role || '').toLowerCase();
      localStorage.setItem('role', role);

      setAlert({ type: 'success', message: 'Login berhasil!' });

      setTimeout(() => {
        if (['admin', 'editor'].includes(role)) {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      }, 1000);

    } catch (err) {
      setAlert({
        type: 'error',
        message: err.response?.data?.message || 'Email atau password salah'
      });
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className={`bg-white border border-gray-200 rounded-xl shadow-lg w-full max-w-md p-8 transition-transform ${shake ? 'animate-shake' : ''}`}>
        
        <div className="text-center mb-6">
          <img
            src="https://www.creativefabrica.com/wp-content/uploads/2018/10/Coffe-cafe-logo-by-DEEMKA-STUDIO-5.jpg" // 👉 Ganti sesuai path/logo aplikasi kasir kamu
            alt="Kasir App Logo"
            className="mx-auto w-16 h-16 mb-2"
          />
          <h2 className="text-2xl font-semibold text-gray-800">Login Kasir</h2>
          <p className="text-sm text-gray-500">Masuk untuk melanjutkan</p>
        </div>

        {alert.message && (
          <div className={`mb-4 p-3 rounded-lg text-sm text-center ${
            alert.type === 'error'
              ? 'bg-red-100 text-red-600 border border-red-300'
              : 'bg-green-100 text-green-600 border border-green-300'
          }`}>
            {alert.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            {loading ? "Memproses..." : <><LogIn size={20} /> Masuk</>}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Belum punya akun?{' '}
          <a href="/register" className="text-blue-600 hover:underline">
            Daftar
          </a>
        </div>
      </div>
    </div>
  );
}
