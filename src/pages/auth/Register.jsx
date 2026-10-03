// src/pages/auth/Register.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { supabase, registerUser } from '../../lib/SupabaseClient';
import CustomAlert from '../../components/dashboard/CustomAlert';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nama_lengkap: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setAlert(null);

    // Validasi
    if (formData.password !== formData.confirmPassword) {
      setAlert({ type: 'error', message: 'Password dan Konfirmasi Password tidak sama!' });
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setAlert({ type: 'error', message: 'Password minimal 6 karakter!' });
      setIsLoading(false);
      return;
    }

    try {
      const result = await registerUser({
        nama_lengkap: formData.nama_lengkap,
        email: formData.email,
        password: formData.password,
        role: 'owner'
      });

      if (!result.success) {
        setAlert({ type: 'error', message: result.error || 'Terjadi kesalahan saat registrasi.' });
        setIsLoading(false);
        return;
      }

      setAlert({ type: 'success', message: 'Registrasi berhasil! Mengalihkan ke halaman login...' });
      
      // Redirect ke login setelah 2 detik
      setTimeout(() => {
        navigate('/login', { 
          state: { 
            message: 'Registrasi berhasil! Silakan login dengan akun baru Anda.',
            email: formData.email 
          } 
        });
      }, 2000);
    } catch (error) {
      console.error('Registration error:', error);
      setAlert({ 
        type: 'error', 
        message: error.message || 'Terjadi kesalahan saat registrasi. Silakan coba lagi.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Alert */}
      {alert && (
        <CustomAlert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-rose-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur hover:bg-white rounded-full shadow-lg transition-all z-10"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="font-medium">Kembali</span>
      </button>

      {/* Register Card */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-8 text-center">
          <div className="w-20 h-20 bg-white rounded-2xl mx-auto mb-4 flex items-center justify-center text-4xl">
            🍰
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Daftar Akun</h1>
          <p className="text-rose-50">WebGIS Toko Kue Pekanbaru</p>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="p-8 space-y-5">
          {/* Nama Lengkap */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Nama Lengkap
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                name="nama_lengkap"
                value={formData.nama_lengkap}
                onChange={handleChange}
                required
                className="w-full pl-11 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all outline-none"
                placeholder="Nama lengkap Anda"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-11 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all outline-none"
                placeholder="email@example.com"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
                className="w-full pl-11 pr-12 py-3 border-2 border-slate-200 rounded-xl focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all outline-none"
                placeholder="Minimal 6 karakter"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Konfirmasi Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength="6"
                className="w-full pl-11 pr-12 py-3 border-2 border-slate-200 rounded-xl focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all outline-none"
                placeholder="Ulangi password Anda"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Mendaftar...
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                Daftar Sekarang
              </>
            )}
          </button>

          {/* Link to Login */}
          <div className="text-center pt-4 border-t border-slate-200">
            <p className="text-sm text-slate-600">
              Sudah punya akun?{' '}
              <Link 
                to="/login" 
                className="text-rose-600 font-semibold hover:text-rose-700 hover:underline transition-colors"
              >
                Login di sini
              </Link>
            </p>
          </div>

          {/* Info Box */}
          <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-xs text-blue-800">
              <strong>📝 Catatan:</strong> Akun yang didaftarkan otomatis sebagai <strong>Owner</strong>. 
              Anda bisa mengelola toko kue setelah request disetujui admin.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}