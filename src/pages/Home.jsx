// src/pages/Home.jsx
import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Cake, Store } from 'lucide-react';
import HeroSection from "../components/home/HeroSection";
import StatSection from "../components/home/StatSection";
import MapPreview from "../components/home/MapPreview";
import TokoCard from "../components/layout/TokoCard";
import { getAllToko } from "../lib/SupabaseClient";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);
  
  // State management
  const [tokoData, setTokoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Fetch data dari Supabase
  useEffect(() => {
    fetchTokoData();
  }, []);

  const fetchTokoData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getAllToko();
      
      if (result.success) {
        setTokoData(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Gagal mengambil data toko');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Check scroll position
  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollButtons();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollButtons);
      window.addEventListener('resize', checkScrollButtons);
      return () => {
        container.removeEventListener('scroll', checkScrollButtons);
        window.removeEventListener('resize', checkScrollButtons);
      };
    }
  }, [tokoData]);

  // Scroll functions
  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      const newScrollLeft = direction === 'left' 
        ? scrollContainerRef.current.scrollLeft - scrollAmount
        : scrollContainerRef.current.scrollLeft + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <HeroSection onOpenFilter={() => navigate("/map")} />
      
      {/* Stats Section */}
      <StatSection tokoData={tokoData} />

      {/* Toko Kue Slider Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-rose-500 to-pink-500 rounded-2xl shadow-lg">
              <Cake className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-800">
                Jelajahi Toko Kue
              </h2>
              <p className="text-slate-600 mt-1">
                Temukan {tokoData.length} toko kue terbaik di Pekanbaru
              </p>
            </div>
          </div>

          {/* Navigation Buttons - Desktop */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`p-3 rounded-full transition-all duration-300 ${
                canScrollLeft
                  ? 'bg-white shadow-lg hover:shadow-xl hover:scale-110 text-slate-800'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`p-3 rounded-full transition-all duration-300 ${
                canScrollRight
                  ? 'bg-gradient-to-r from-rose-500 to-pink-500 shadow-lg hover:shadow-xl hover:scale-110 text-white'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-slate-200 rounded-full"></div>
              <div className="w-16 h-16 border-4 border-rose-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
            </div>
            <p className="mt-4 text-slate-600 font-medium">Memuat data toko...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <Store className="w-12 h-12 text-red-400 mx-auto mb-3" />
            <p className="text-red-600 font-semibold mb-2">Gagal Memuat Data</p>
            <p className="text-red-500 text-sm mb-4">{error}</p>
            <button
              onClick={fetchTokoData}
              className="px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* Cards Container */}
        {!loading && !error && tokoData.length > 0 && (
          <div className="relative">
            {/* Scroll Container */}
            <div
              ref={scrollContainerRef}
              className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              {tokoData.map((toko) => (
                <div key={toko.id} className="flex-shrink-0 w-[84vw] max-w-[320px] sm:max-w-none sm:w-96">
                  <TokoCard toko={toko} />
                </div>
              ))}
            </div>

            {/* Mobile Navigation Buttons */}
            <div className="flex md:hidden items-center justify-center gap-2 mt-6">
              <button
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className={`p-3 rounded-full transition-all duration-300 ${
                  canScrollLeft
                    ? 'bg-white shadow-lg text-slate-800'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className={`p-3 rounded-full transition-all duration-300 ${
                  canScrollRight
                    ? 'bg-gradient-to-r from-rose-500 to-pink-500 shadow-lg text-white'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Scroll Indicator */}
            <div className="flex justify-center items-center gap-1 mt-4">
              {Array.from({ length: Math.min(tokoData.length, 10) }).map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    idx === 0 ? 'w-8 bg-rose-500' : 'w-4 bg-slate-300'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && tokoData.length === 0 && (
          <div className="text-center py-20">
            <Store className="w-20 h-20 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg font-medium">
              Belum ada data toko kue
            </p>
          </div>
        )}

        {/* View All Button */}
        {!loading && !error && tokoData.length > 0 && (
          <div className="text-center mt-10">
            <button
              onClick={() => navigate("/map")}
              className="px-8 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              Lihat Semua Toko di Peta
            </button>
          </div>
        )}
      </section>

      {/* Map Preview Section */}
      <MapPreview onClick={() => navigate("/map")} />
    </div>
  );
}