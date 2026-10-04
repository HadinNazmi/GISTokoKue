import { Store, MapPin, Phone, Mail, Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 border-t-4 border-rose-400">
      {/* Decorative Wave */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none">
        <svg className="relative block w-full h-12" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
                className="fill-white"></path>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-20 pb-10">
        <div className="grid md:grid-cols-4 gap-8 text-sm">
          
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-gradient-to-br from-rose-400 to-pink-500 rounded-lg">
                <Store className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                WebGIS Toko Kue
              </h3>
            </div>
            <p className="text-slate-600 leading-relaxed mb-4">
              Sistem Informasi Geografis berbasis web untuk pemetaan lokasi toko kue, bakery, dan brownies di Kota Pekanbaru. 
              Memudahkan Anda menemukan toko kue favorit dengan visualisasi peta interaktif.
            </p>
            <div className="flex gap-3">
              <a href="#" className="p-2 bg-white rounded-full hover:bg-rose-100 transition-colors shadow-sm">
                <Facebook className="w-5 h-5 text-rose-500" />
              </a>
              <a href="#" className="p-2 bg-white rounded-full hover:bg-rose-100 transition-colors shadow-sm">
                <Instagram className="w-5 h-5 text-rose-500" />
              </a>
              <a href="#" className="p-2 bg-white rounded-full hover:bg-rose-100 transition-colors shadow-sm">
                <Twitter className="w-5 h-5 text-rose-500" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-bold text-slate-800 mb-4 text-lg">Navigasi</h4>
            <ul className="space-y-3">
              <li>
                <a href="/" className="text-slate-600 hover:text-rose-600 transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-rose-400 rounded-full group-hover:w-2 group-hover:h-2 transition-all"></span>
                  Beranda
                </a>
              </li>
              <li>
                <a href="/map" className="text-slate-600 hover:text-rose-600 transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-rose-400 rounded-full group-hover:w-2 group-hover:h-2 transition-all"></span>
                  Peta
                </a>
              </li>
              <li>
                <a href="/daftar-toko" className="text-slate-600 hover:text-rose-600 transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-rose-400 rounded-full group-hover:w-2 group-hover:h-2 transition-all"></span>
                  Daftar Toko
                </a>
              </li>
              <li>
                <a href="/about" className="text-slate-600 hover:text-rose-600 transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-rose-400 rounded-full group-hover:w-2 group-hover:h-2 transition-all"></span>
                  Tentang
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold text-slate-800 mb-4 text-lg">Institusi</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2 text-slate-600">
                <MapPin className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-800">Politeknik Caltex Riau</p>
                  <p className="text-xs mt-1">Jl. Umbansari No.1, Rumbai, Pekanbaru</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Phone className="w-5 h-5 text-rose-500 flex-shrink-0" />
                <span>(0761) 53939</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Mail className="w-5 h-5 text-rose-500 flex-shrink-0" />
                <span>info@pcr.ac.id</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-10 mb-6 border-t border-rose-200"></div>

        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <p className="text-slate-500">
            © 2025 <span className="font-semibold text-slate-700">WebGIS Toko Kue Pekanbaru</span>. All rights reserved.
          </p>
          <div className="flex gap-6 text-slate-500">
            <a href="#" className="hover:text-rose-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-rose-600 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-br from-rose-300/20 to-pink-300/20 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-0 w-24 h-24 bg-gradient-to-br from-purple-300/20 to-pink-300/20 rounded-full blur-2xl"></div>
    </footer>
  );
}