import { MapPin, Sparkles, ArrowRight } from 'lucide-react';

export default function HeroSection({ onOpenFilter }) {
  return (
    <section className="relative bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-rose-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Floating Icons (Hanya di layar sm ke atas agar tidak menumpuk di HP) */}
      <div className="hidden sm:block absolute top-32 left-1/4 animate-float">
        <div className="p-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
          🍰
        </div>
      </div>
      <div className="hidden sm:block absolute top-48 right-1/4 animate-float" style={{ animationDelay: '1s' }}>
        <div className="p-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
          🧁
        </div>
      </div>
      <div className="hidden sm:block absolute bottom-32 left-1/3 animate-float" style={{ animationDelay: '2s' }}>
        <div className="p-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
          🎂
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative py-16 sm:py-24 md:py-28 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 mb-4 sm:mb-6 px-4 py-1.5 sm:px-5 sm:py-2 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg animate-fadeUp">
          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="text-xs sm:text-sm font-medium">Sistem Informasi Geografis</span>
        </div>

        {/* Main Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-slate-800 max-w-4xl mx-auto leading-tight animate-fadeUp" style={{ animationDelay: '0.1s' }}>
          Persebaran <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">Toko Kue</span> Berbasis Peta Interaktif
        </h1>

        {/* Subtitle */}
        <p className="mt-4 sm:mt-8 text-sm sm:text-base md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed animate-fadeUp" style={{ animationDelay: '0.2s' }}>
          Temukan lokasi toko kue, bakery, dan brownies terbaik di Kota Pekanbaru dengan visualisasi peta yang modern dan mudah digunakan.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center animate-fadeUp w-full max-w-md mx-auto sm:max-w-none" style={{ animationDelay: '0.3s' }}>
          <button
            onClick={onOpenFilter}
            className="w-full sm:w-auto group relative px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <MapPin className="w-5 h-5" />
            <span>Jelajahi Peta</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-xl -z-10"></div>
          </button>
          
          <button 
            onClick={() => {
              const el = document.getElementById('statistik-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-white text-slate-700 rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 border-slate-200"
          >
            Lihat Statistik
          </button>
        </div>

        {/* Stats Preview */}
        <div className="mt-16 flex flex-wrap justify-center gap-8 animate-fadeUp" style={{ animationDelay: '0.4s' }}>
          <div className="text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">27+</div>
            <div className="text-sm text-slate-500 mt-1">Total Toko</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">12+</div>
            <div className="text-sm text-slate-500 mt-1">Kecamatan</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">4.5★</div>
            <div className="text-sm text-slate-500 mt-1">Rating Rata-rata</div>
          </div>
        </div>
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg className="relative block w-full h-20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
                className="fill-white"></path>
        </svg>
      </div>
    </section>
  );
}