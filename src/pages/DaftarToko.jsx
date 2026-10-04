import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, MapPin, RefreshCw } from 'lucide-react';
import { getAllToko } from '../lib/SupabaseClient';
import TokoCard from '../components/layout/TokoCard';

export default function DaftarToko() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduk, setSelectedProduk] = useState("all");
  const [selectedKecamatan, setSelectedKecamatan] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // Function untuk mendapatkan icon berdasarkan produk
  const getProductIcon = (produk) => {
    const icons = {
      "Kue": "🍰",
      "Brownies": "🍫",
      "Coklat": "🍬",
      "Pie": "🥧"
    };
    return icons[produk] || "🍰";
  };

  // Fetch data dari Supabase
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getAllToko();
      if (result.success) {
        const transformedData = result.data.map(item => ({
          id: item.id,
          nama: item.nama,
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lng),
          kecamatan: item.kecamatan || 'Tidak diketahui',
          kelurahan: item.kelurahan || 'Tidak diketahui',
          jalan: item.jalan || '-',
          produk: item.produk || 'Kue',
          jam_buka: item.jam_buka || '-',
          tahun_berdiri: item.tahun_berdiri,
          rating: item.rating || 0,
          telp: item.telp || '-',
          menu_favorit: item.menu_favorit || '-',
          gambar: item.gambar
        }));
        setData(transformedData);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Get unique values
  const produkList = ["all", ...new Set(data.map(t => t.produk))];
  const kecamatanList = ["all", ...new Set(data.map(t => t.kecamatan).filter(Boolean))];

  // Filter logic
  const filteredData = data.filter(toko => {
    const matchSearch = toko.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       toko.kecamatan.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       toko.kelurahan.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchProduk = selectedProduk === "all" || toko.produk === selectedProduk;
    const matchKecamatan = selectedKecamatan === "all" || toko.kecamatan === selectedKecamatan;

    return matchSearch && matchProduk && matchKecamatan;
  });

  const handleReset = () => {
    setSearchQuery("");
    setSelectedProduk("all");
    setSelectedKecamatan("all");
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-rose-500 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Memuat data toko kue...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-xl max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Gagal Memuat Data</h3>
          <p className="text-slate-600 mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all"
          >
            <RefreshCw className="w-4 h-4 inline mr-2" />
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white py-14 sm:py-20 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-rose-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">
              Daftar Toko Kue
            </h1>
            <p className="text-base sm:text-xl text-slate-300 mb-6 sm:mb-8">
              Temukan {data.length} toko kue terbaik di Kota Pekanbaru
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mb-4 sm:mb-8">
              <div className="text-center px-3 py-1 bg-white/5 rounded-xl border border-white/10 sm:bg-transparent sm:border-none">
                <div className="text-2xl sm:text-4xl font-bold text-rose-400">{data.length}</div>
                <div className="text-xs sm:text-sm text-slate-400">Total Toko</div>
              </div>
              <div className="text-center px-3 py-1 bg-white/5 rounded-xl border border-white/10 sm:bg-transparent sm:border-none">
                <div className="text-2xl sm:text-4xl font-bold text-pink-400">{kecamatanList.length - 1}</div>
                <div className="text-xs sm:text-sm text-slate-400">Kecamatan</div>
              </div>
              <div className="text-center px-3 py-1 bg-white/5 rounded-xl border border-white/10 sm:bg-transparent sm:border-none">
                <div className="text-2xl sm:text-4xl font-bold text-purple-400">{produkList.length - 1}</div>
                <div className="text-xs sm:text-sm text-slate-400">Kategori</div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-auto">
            <path 
              fill="#fdf2f8" 
              d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            />
          </svg>
        </div>
      </div>

      {/* Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-6 sm:-mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 mb-8 border border-slate-100">
          {/* Search Bar */}
          <div className="relative mb-3 sm:mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama toko, kelurahan, atau kecamatan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 sm:py-4 border-2 border-slate-200 rounded-xl focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all outline-none text-slate-700 text-sm sm:text-base"
            />
          </div>

          {/* Filter Toggle Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-center gap-2 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all font-medium"
          >
            <SlidersHorizontal className="w-5 h-5" />
            {showFilters ? "Sembunyikan Filter" : "Tampilkan Filter"}
          </button>

          {/* Filters */}
          {showFilters && (
            <div className="mt-4 grid md:grid-cols-3 gap-4 p-4 bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl border-2 border-rose-100">
              {/* Filter Produk */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Jenis Produk
                </label>
                <select
                  value={selectedProduk}
                  onChange={(e) => setSelectedProduk(e.target.value)}
                  className="w-full px-4 py-2.5 border-2 border-rose-200 rounded-lg focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all outline-none bg-white"
                >
                  <option value="all">Semua Produk</option>
                  {produkList.filter(p => p !== "all").map(prod => (
                    <option key={prod} value={prod}>
                      {getProductIcon(prod)} {prod}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter Kecamatan */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Kecamatan
                </label>
                <select
                  value={selectedKecamatan}
                  onChange={(e) => setSelectedKecamatan(e.target.value)}
                  className="w-full px-4 py-2.5 border-2 border-rose-200 rounded-lg focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all outline-none bg-white"
                >
                  <option value="all">Semua Kecamatan</option>
                  {kecamatanList.filter(k => k !== "all").map(kec => (
                    <option key={kec} value={kec}>{kec}</option>
                  ))}
                </select>
              </div>

              {/* Reset Button */}
              <div className="flex items-end">
                <button
                  onClick={handleReset}
                  className="w-full py-2.5 bg-white border-2 border-rose-300 text-rose-600 font-semibold rounded-lg hover:bg-rose-50 transition-all"
                >
                  Reset Filter
                </button>
              </div>
            </div>
          )}

          {/* Results Count */}
          <div className="mt-4 flex items-center justify-between px-2">
            <div className="flex items-center gap-2 text-slate-600">
              <MapPin className="w-5 h-5 text-rose-500" />
              <span className="font-medium">
                Menampilkan <span className="font-bold text-rose-600">{filteredData.length}</span> dari {data.length} toko
              </span>
            </div>
          </div>
        </div>

        {/* Toko Cards Grid */}
        {filteredData.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pb-16">
            {filteredData.map(toko => (
              <TokoCard key={toko.id} toko={toko} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Tidak ada toko ditemukan</h3>
            <p className="text-slate-600 mb-6">Coba ubah kata kunci atau filter pencarian Anda</p>
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all font-semibold"
            >
              Reset Pencarian
            </button>
          </div>
        )}
      </div>
    </div>
  );
}