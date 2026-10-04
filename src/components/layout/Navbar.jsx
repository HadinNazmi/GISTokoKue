import { Link, useLocation } from "react-router-dom";
import { Cake, Menu, X, LogIn, Store } from "lucide-react";
import { useState, useEffect } from "react";

export default function Navbar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { to: "/", label: "Beranda" },
    { to: "/map", label: "Peta" },
    { to: "/about", label: "Tentang" },
    { to: "/daftar-toko", label: "Daftar Toko" }, // ✅ baru
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-lg shadow-lg border-b border-slate-200/50"
          : "bg-white border-b border-slate-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* LOGO */}
        <Link
          to="/"
          className="flex items-center gap-2 font-bold text-transparent bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text hover:scale-105 transition-transform"
        >
          <div className="p-2 bg-gradient-to-br from-rose-500 to-pink-500 rounded-lg shadow-lg">
            <Cake className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-base sm:text-lg">WebGIS Toko Kue</span>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-8">
          {menuItems.map((m) => (
            <Link key={m.to} to={m.to} className="relative group">
              <span
                className={`text-sm font-medium transition-colors ${
                  isActive(m.to)
                    ? "text-rose-600"
                    : "text-slate-600 hover:text-rose-600"
                }`}
              >
                {m.label}
              </span>
              <span
                className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-300 ${
                  isActive(m.to)
                    ? "w-full"
                    : "w-0 group-hover:w-full"
                }`}
              />
            </Link>
          ))}

          {/* LOGIN BUTTON */}
          <Link
            to="/login"
            className="flex items-center gap-2 px-4 py-2 border border-rose-500 text-rose-500 text-sm font-medium rounded-full hover:bg-rose-50 transition-all"
          >
            <LogIn className="w-4 h-4" />
            Login
          </Link>

          {/* CTA MAP */}
          <Link
            to="/map"
            className="px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-sm font-medium rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            Buka Peta
          </Link>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Menu"
          className="md:hidden p-2 text-slate-600 hover:text-rose-600 transition-colors rounded-lg hover:bg-rose-50"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6 text-rose-600" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-lg border-b border-slate-200 shadow-xl animate-fadeUp">
          <div className="px-4 py-4 space-y-2">
            {menuItems.map((m) => (
              <Link
                key={m.to}
                to={m.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl font-medium transition-all ${
                  isActive(m.to)
                    ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md"
                    : "text-slate-600 hover:bg-rose-50 hover:text-rose-600"
                }`}
              >
                {m.label}
              </Link>
            ))}

            {/* Buka Peta CTA Mobile */}
            <Link
              to="/map"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md hover:shadow-lg transition-all"
            >
              <span>🗺️ Buka Peta Interaktif</span>
            </Link>

            {/* LOGIN MOBILE */}
            <Link
              to="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-rose-600 font-semibold border-2 border-rose-200 hover:bg-rose-50 transition-all"
            >
              <LogIn className="w-5 h-5" />
              <span>Login ke Dashboard</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
