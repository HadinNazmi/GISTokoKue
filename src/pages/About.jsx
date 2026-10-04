import { MapPin, Target, Users, Lightbulb, Award, TrendingUp } from 'lucide-react';

export default function About() {
  const features = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Peta Interaktif",
      description: "Visualisasi lokasi toko kue dengan teknologi WebGIS modern dan mudah digunakan"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Data Akurat",
      description: "Informasi terkini tentang lokasi, produk, dan rating toko kue di Pekanbaru"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "User Friendly",
      description: "Interface yang intuitif memudahkan siapa saja menemukan toko kue favorit"
    }
  ];

  const stats = [
    { value: "27+", label: "Toko Terdaftar" },
    { value: "12+", label: "Kecamatan" },
    { value: "4.5", label: "Rating Rata-rata" }
  ];

  return (
    <section className="bg-gradient-to-br from-slate-50 via-rose-50 to-pink-50 min-h-screen">
      <div className="pt-24 pb-16">
        {/* Hero Section */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 sm:py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              <Award className="w-4 h-4" />
              Tentang Kami
            </div>
            
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-800 mb-4 sm:mb-6 leading-tight">
              WebGIS <span className="bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">Toko Kue</span> Pekanbaru
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Platform digital berbasis Geographic Information System (GIS) yang memetakan persebaran toko kue, bakery, dan brownies di Kota Pekanbaru
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="text-4xl font-bold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-slate-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Main Content */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white rounded-3xl shadow-xl border-2 border-slate-100 p-8 hover:shadow-2xl transition-all">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Tentang Sistem</h2>
              </div>
              
              <div className="space-y-4 text-slate-600 leading-relaxed">
                <p>
                  WebGIS Toko Kue Pekanbaru adalah sistem informasi geografis berbasis web yang dirancang khusus untuk memetakan dan menyajikan informasi lokasi toko kue, bakery, dan brownies di Kota Pekanbaru.
                </p>
                <p>
                  Sistem ini membantu masyarakat menemukan toko kue terdekat berdasarkan wilayah, jenis produk, dan rating dengan visualisasi peta yang interaktif dan mudah dipahami.
                </p>
                <p>
                  Platform ini diharapkan dapat mendukung promosi UMKM kuliner sekaligus memperkenalkan implementasi teknologi GIS di bidang kuliner dan retail.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl border-2 border-slate-100 p-8 hover:shadow-2xl transition-all">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Tujuan</h2>
              </div>
              
              <ul className="space-y-4">
                {[
                  "Menyediakan informasi lokasi toko kue yang akurat dan mudah diakses",
                  "Membantu masyarakat menemukan toko kue berdasarkan lokasi dan preferensi",
                  "Mendukung promosi dan pengembangan UMKM kuliner di Pekanbaru",
                  "Menerapkan teknologi GIS untuk meningkatkan layanan informasi publik",
                  "Memfasilitasi keputusan konsumen dalam memilih toko kue"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-600">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">{i + 1}</span>
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Features */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-slate-800 mb-8">
              Fitur <span className="bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">Unggulan</span>
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {features.map((feature, i) => (
                <div key={i} className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 border-2 border-slate-100">
                  <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Institution Info */}
          <div className="bg-gradient-to-br from-rose-500 to-pink-500 rounded-3xl p-6 sm:p-8 md:p-12 text-white shadow-2xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 text-center md:text-left">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Politeknik Caltex Riau</h2>
                <p className="text-rose-100 text-sm sm:text-base leading-relaxed max-w-2xl">
                  Sistem ini dikembangkan sebagai bagian dari implementasi teknologi informasi dan GIS dalam mendukung pengembangan smart city dan pemberdayaan UMKM lokal di Kota Pekanbaru.
                </p>
              </div>
              <div className="flex-shrink-0">
                <div className="w-20 h-20 sm:w-28 sm:h-28 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Award className="w-10 h-10 sm:w-14 sm:h-14" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}