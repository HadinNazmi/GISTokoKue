import { useEffect, useRef, useState } from "react";
import { X, MapPin, Phone, Star, Clock, Calendar, Layers, Eye, EyeOff, RefreshCw, Store, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { getAllToko } from "../lib/SupabaseClient";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import TokoSidebar from "../components/layout/TokoSideBar";

export default function MapPage() {
  // State untuk data dari Supabase
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Responsive panel: default open on desktop (>=1024px), closed on mobile/tablet
  const [isPanelOpen, setIsPanelOpen] = useState(
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : false
  );
  const [selectedStore, setSelectedStore] = useState(null);

  // Floating controls toggles for mobile
  const [isLayerControlOpen, setIsLayerControlOpen] = useState(false);
  const [isLegendOpen, setIsLegendOpen] = useState(false);

  // Layer visibility states
  const [layerVisibility, setLayerVisibility] = useState({
    markers: true,
    heatmap: false
  });

  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);
  const markersRef = useRef([]);
  const heatmapRef = useRef(null);

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

  // ===== FETCH DATA DARI SUPABASE =====
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
          jalan: item.jalan || item.alamat || '-',
          produk: item.produk || 'Kue',
          jamBuka: item.jam_buka || item.jamBuka || '-',
          tahunBerdiri: item.tahun_berdiri || item.tahunBerdiri,
          rating: item.rating || 0,
          telp: item.telp || '-',
          menuFavorit: item.menu_favorit || item.menuFavorit || '-',
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

  /* ===== INIT MAP ===== */
  useEffect(() => {
    if (loading || error) return;
    if (leafletMapRef.current) return;
    if (!mapRef.current) return;

    leafletMapRef.current = L.map(mapRef.current).setView(
      [0.5333, 101.4333],
      12
    );

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap",
    }).addTo(leafletMapRef.current);
  }, [loading, error]);

  /* ===== LAYER 1: MARKERS dengan Icon & Size berbeda ===== */
  useEffect(() => {
    if (!leafletMapRef.current) return;

    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    if (!layerVisibility.markers) return;

    data.forEach(t => {
      if (!t.lat || !t.lng) return;

      const productIcon = getProductIcon(t.produk);
      const iconHtml = `<div style="font-size: 26px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">${productIcon}</div>`;
      const iconSize = t.rating >= 4.5 ? 36 : t.rating >= 4.0 ? 32 : 28;

      const customIcon = L.divIcon({
        html: `<div style="
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        ">${iconHtml}</div>`,
        className: 'custom-marker',
        iconSize: [iconSize, iconSize],
        iconAnchor: [iconSize/2, iconSize/2]
      });

      const marker = L.marker([t.lat, t.lng], { icon: customIcon })
        .addTo(leafletMapRef.current)
        .bindPopup(`
          <div style="width: 240px;">
            ${t.gambar ? `
              <img 
                src="/images/${t.gambar}" 
                alt="${t.nama}" 
                style="width: 100%; height: 120px; object-fit: cover; border-radius: 8px 8px 0 0; margin: 0;"
                onerror="this.parentElement.innerHTML='<div style=\\"width:100%;height:120px;background:linear-gradient(135deg,#fce7f3,#fbcfe8);display:flex;align-items:center;justify-content:center;font-size:42px;border-radius:8px 8px 0 0\\">${productIcon}</div>'"
              />
            ` : `<div style="width:100%;height:120px;background:linear-gradient(135deg,#fce7f3,#fbcfe8);display:flex;align-items:center;justify-content:center;font-size:42px;border-radius:8px 8px 0 0">${productIcon}</div>`}
            <div style="padding: 10px;">
              <strong style="font-size: 15px; display: block; margin-bottom: 6px; color: #1f2937;">${t.nama}</strong>
              <div style="font-size: 12px; color: #64748b; line-height: 1.6;">
                <div style="margin-bottom: 4px; display: flex; align-items: center; gap: 4px;">
                  <span>📍</span>
                  <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${t.kecamatan}, ${t.kelurahan}</span>
                </div>
                <div style="margin-bottom: 4px; display: flex; align-items: center; gap: 4px;">
                  <span>⭐</span>
                  <span><strong>${t.rating}/5</strong></span>
                </div>
                <div style="display: flex; align-items: center; gap: 4px;">
                  <span>🕒</span>
                  <span>${t.jamBuka}</span>
                </div>
              </div>
              <button 
                onclick="window.dispatchEvent(new CustomEvent('selectStore', {detail: ${t.id}}))"
                style="
                  margin-top: 8px;
                  width: 100%;
                  padding: 7px;
                  background: linear-gradient(135deg, #f43f5e, #ec4899);
                  color: white;
                  border: none;
                  border-radius: 6px;
                  cursor: pointer;
                  font-weight: 600;
                  font-size: 12px;
                "
              >
                Lihat Detail
              </button>
            </div>
          </div>
        `, {
          maxWidth: 260,
          className: 'custom-popup'
        });

      markersRef.current.push(marker);
    });
  }, [data, layerVisibility.markers]);

  // Handle custom event untuk select store
  useEffect(() => {
    const handleSelectStore = (e) => {
      const storeId = e.detail;
      const store = data.find(t => t.id === storeId);
      if (store) {
        setSelectedStore(store);
      }
    };

    window.addEventListener('selectStore', handleSelectStore);
    return () => window.removeEventListener('selectStore', handleSelectStore);
  }, [data]);

  /* ===== LAYER 2: HEATMAP Density ===== */
  useEffect(() => {
    if (!leafletMapRef.current) return;

    if (heatmapRef.current) {
      leafletMapRef.current.removeLayer(heatmapRef.current);
      heatmapRef.current = null;
    }

    if (!layerVisibility.heatmap || data.length === 0) return;

    const heatPoints = data.map(t => [t.lat, t.lng, t.rating / 5]);

    heatmapRef.current = L.heatLayer(heatPoints, {
      radius: 30,
      blur: 40,
      maxZoom: 17,
      max: 1.0,
      gradient: {
        0.0: '#3b82f6',
        0.3: '#06b6d4',
        0.5: '#10b981',
        0.7: '#fbbf24',
        1.0: '#ef4444'
      }
    }).addTo(leafletMapRef.current);

  }, [data, layerVisibility.heatmap]);

  const toggleLayer = (layer) => {
    setLayerVisibility(prev => ({
      ...prev,
      [layer]: !prev[layer]
    }));
  };

  const handleTokoSelect = (toko) => {
    setSelectedStore(toko);
    // Di mobile, tutup sidebar agar peta langsung terlihat
    if (window.innerWidth < 1024) {
      setIsPanelOpen(false);
    }
    // Fly to marker location
    if (leafletMapRef.current && toko.lat && toko.lng) {
      leafletMapRef.current.flyTo([toko.lat, toko.lng], 16, {
        duration: 1.5
      });
    }
  };

  // Loading & Error States
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-rose-50 to-pink-50 px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-rose-500 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Memuat data toko kue...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-rose-50 to-pink-50 px-4">
        <div className="text-center p-6 sm:p-8 bg-white rounded-2xl shadow-xl max-w-md w-full">
          <div className="text-5xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Gagal Memuat Data</h3>
          <p className="text-slate-600 mb-6 text-sm">{error}</p>
          <button
            onClick={fetchData}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all font-semibold"
          >
            <RefreshCw className="w-4 h-4 inline mr-2" />
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 relative pt-16 overflow-hidden">
      {/* Mobile Backdrop saat Drawer Toko Terbuka */}
      {isPanelOpen && (
        <div 
          onClick={() => setIsPanelOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-[1100] transition-opacity"
        />
      )}

      {/* Sidebar Toko (Drawer di Mobile, Kolom di Desktop) */}
      <aside 
        className={`
          fixed lg:static inset-y-0 left-0 z-[1200] lg:z-auto
          ${isPanelOpen ? 'w-[85vw] max-w-sm lg:w-96 translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-0'}
          transition-all duration-300 overflow-hidden h-full pt-16 lg:pt-0 bg-white shadow-2xl lg:shadow-none
        `}
      >
        <TokoSidebar
          tokoList={data}
          onTokoSelect={handleTokoSelect}
          selectedToko={selectedStore}
          onClose={() => setIsPanelOpen(false)}
          filteredCount={data.length}
          totalCount={data.length}
        />
      </aside>

      {/* Map Container */}
      <main className="flex-1 relative h-full">
        {/* Map Canvas */}
        <div ref={mapRef} className="absolute inset-0" />

        {/* Floating Controls Bar (Kiri Atas) */}
        <div className="absolute top-3 left-3 z-[1000] flex flex-col gap-2">
          {/* Tombol Buka/Tutup Sidebar Toko */}
          <button
            onClick={() => setIsPanelOpen(!isPanelOpen)}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-white text-slate-800 rounded-xl shadow-lg hover:shadow-xl hover:bg-rose-50 border border-slate-200 transition-all font-semibold text-xs sm:text-sm"
          >
            <Store className="w-4 h-4 text-rose-600" />
            <span>{isPanelOpen ? "Tutup Daftar" : "Daftar Toko"}</span>
            <span className="hidden xs:inline-block px-1.5 py-0.5 bg-rose-100 text-rose-700 rounded-full text-xs font-bold">
              {data.length}
            </span>
          </button>

          {/* Tombol Toggle Kontrol Layer */}
          <div className="relative">
            <button
              onClick={() => setIsLayerControlOpen(!isLayerControlOpen)}
              className="flex items-center gap-2 px-3.5 py-2.5 bg-white text-slate-800 rounded-xl shadow-lg hover:shadow-xl hover:bg-rose-50 border border-slate-200 transition-all font-semibold text-xs sm:text-sm"
            >
              <Layers className="w-4 h-4 text-rose-600" />
              <span>Layer</span>
            </button>

            {/* Dropdown Kontrol Layer */}
            {isLayerControlOpen && (
              <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-2xl border-2 border-slate-200 p-3 w-48 animate-fadeUp z-[1010]">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-slate-800 text-xs">Pilih Layer</h4>
                  <button onClick={() => setIsLayerControlOpen(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="space-y-1.5">
                  {[
                    { key: 'markers', label: 'Marker Toko', icon: '📍' },
                    { key: 'heatmap', label: 'Heatmap', icon: '🔥' }
                  ].map(layer => (
                    <button
                      key={layer.key}
                      onClick={() => toggleLayer(layer.key)}
                      className={`w-full flex items-center justify-between p-2 rounded-lg transition-all text-xs ${
                        layerVisibility[layer.key]
                          ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-700 hover:bg-rose-50'
                      }`}
                    >
                      <span className="flex items-center gap-1.5 font-medium">
                        <span>{layer.icon}</span>
                        <span>{layer.label}</span>
                      </span>
                      {layerVisibility[layer.key] ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Floating Legenda (Kanan Atas) */}
        <div className="absolute top-3 right-3 z-[1000]">
          {/* Tombol buka legenda di mobile jika ditutup */}
          <button
            onClick={() => setIsLegendOpen(!isLegendOpen)}
            className="sm:hidden flex items-center gap-1.5 px-3 py-2 bg-white text-slate-800 rounded-xl shadow-lg border border-slate-200 text-xs font-semibold"
          >
            <span>📊</span>
            <span>Legenda</span>
          </button>

          {/* Box Legenda (Selalu terlihat di desktop, modal/toggle di mobile) */}
          <div className={`
            ${isLegendOpen ? 'block' : 'hidden sm:block'}
            bg-white rounded-xl shadow-xl border-2 border-slate-200 p-3 sm:p-4 max-w-[210px] sm:max-w-xs text-xs sm:text-sm animate-fadeUp
          `}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-slate-800 flex items-center gap-1.5">
                <span>📊</span> Legenda
              </h3>
              <button 
                onClick={() => setIsLegendOpen(false)} 
                className="sm:hidden p-1 text-slate-400 hover:text-slate-600 rounded"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg">🍰</span>
                <span className="text-slate-600">Toko Kue</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg">🍫</span>
                <span className="text-slate-600">Toko Brownies</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg">🍬</span>
                <span className="text-slate-600">Toko Coklat</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg">🥧</span>
                <span className="text-slate-600">Toko Pie</span>
              </div>
              <div className="pt-2 border-t text-[11px] text-slate-500">
                <p>💡 Ukuran = Rating</p>
                <p>🔥 Heatmap = Kepadatan</p>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Store Card (Bottom Sheet di HP, Floating Card di Desktop) */}
        {selectedStore && (
          <div className="fixed sm:absolute bottom-3 left-3 right-3 sm:bottom-auto sm:top-16 sm:right-4 sm:left-auto sm:w-80 z-[1050] max-h-[80vh] overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl border-2 border-rose-200 overflow-hidden animate-fadeUp">
              {/* Header Image & Close */}
              <div className="relative">
                <button
                  onClick={() => setSelectedStore(null)}
                  aria-label="Tutup detail"
                  className="absolute top-2 right-2 z-10 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors shadow-md"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Gambar Toko */}
                {selectedStore.gambar ? (
                  <div className="relative h-28 sm:h-36 overflow-hidden bg-slate-100">
                    <img 
                      src={`/images/${selectedStore.gambar}`} 
                      alt={selectedStore.nama}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const icon = getProductIcon(selectedStore.produk);
                        e.target.parentElement.innerHTML = `<div class="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-rose-100 to-pink-100">${icon}</div>`;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-2 left-3 right-8">
                      <h3 className="text-base sm:text-lg font-bold text-white drop-shadow-md truncate">
                        {selectedStore.nama}
                      </h3>
                      <p className="text-rose-200 text-xs truncate">
                        {selectedStore.kelurahan}, {selectedStore.kecamatan}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="relative h-28 sm:h-36 bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center">
                    <div className="text-4xl">{getProductIcon(selectedStore.produk)}</div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-2 left-3 right-8">
                      <h3 className="text-base sm:text-lg font-bold text-white drop-shadow-md truncate">
                        {selectedStore.nama}
                      </h3>
                      <p className="text-rose-200 text-xs truncate">
                        {selectedStore.kelurahan}, {selectedStore.kecamatan}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Detail Content Ringkas */}
              <div className="p-3 sm:p-4 space-y-2 text-xs">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                  <p className="font-medium text-slate-700 line-clamp-1">{selectedStore.jalan}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="flex items-center gap-1.5 text-slate-700 font-semibold bg-amber-50 p-1.5 rounded-lg border border-amber-100">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                    <span>{selectedStore.rating}/5</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600 bg-blue-50 p-1.5 rounded-lg border border-blue-100 truncate">
                    <Clock className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                    <span className="truncate">{selectedStore.jamBuka}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="truncate pr-2">
                    <span className="text-[10px] text-slate-500 block">Menu Favorit</span>
                    <span className="text-xs font-semibold text-rose-600 truncate block">
                      {selectedStore.menuFavorit}
                    </span>
                  </div>

                  <Link
                    to={`/detail/${selectedStore.id}`}
                    className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-md transition-all text-xs"
                  >
                    <span>Detail</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}