import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <nav className="bg-[#FFFFFF] shadow-sm border-b-2 border-[#E2E8CE] sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-3 group">
              <div className="w-10 h-10 bg-[#FF8C00] rounded-xl flex items-center justify-center text-[#FFFFFF] font-bold text-xl shadow-md group-hover:scale-105 transition-transform duration-300">
                T
              </div>
              <span className="text-2xl font-bold text-[#FF8C00] tracking-tight">
                Tekin Ticaret
              </span>
            </Link>
          </div>

          <div className="hidden sm:flex sm:items-center sm:space-x-2">
            <Link
              to="/"
              className="text-gray-700 hover:text-[#FF8C00] hover:bg-[#E2E8CE]/60 px-4 py-2 rounded-xl text-md font-semibold transition-all duration-200"
            >
              Ana Sayfa
            </Link>
            <Link
              to="/iletisim"
              className="text-gray-700 hover:text-[#FF8C00] hover:bg-[#E2E8CE]/60 px-4 py-2 rounded-xl text-md font-semibold transition-all duration-200"
            >
              İletişim
            </Link>
            
            {user ? (
              <>
                <Link
                  to="/veresiye"
                  className="text-gray-700 hover:text-[#FF8C00] hover:bg-[#E2E8CE]/60 px-4 py-2 rounded-xl text-md font-semibold transition-all duration-200"
                >
                  Veresiye Defteri
                </Link>
                <button
                  onClick={handleLogout}
                  className="ml-4 bg-[#FF8C00] hover:bg-[#e67e00] text-white px-4 py-2 rounded-xl text-md font-bold transition-all duration-200 shadow-md hover:-translate-y-0.5"
                >
                  Çıkış Yap
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="ml-4 bg-[#FF8C00] hover:bg-[#e67e00] text-white px-4 py-2 rounded-xl text-md font-bold transition-all duration-200 shadow-md hover:-translate-y-0.5"
              >
                Giriş Yap
              </Link>
            )}
          </div>

          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-xl text-gray-500 hover:text-[#FF8C00] hover:bg-[#E2E8CE]/60 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#FF8C00] transition-colors"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Ana menüyü aç</span>
              {!isOpen ? (
                <svg className="block h-7 w-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-7 w-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`sm:hidden overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"}`}
        id="mobile-menu"
      >
        <div className="px-4 pt-2 pb-4 space-y-2 bg-[#FFFFFF] border-b border-[#E2E8CE] shadow-inner">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-3 rounded-xl text-base font-semibold text-gray-700 hover:text-[#FF8C00] hover:bg-[#E2E8CE]/60 transition-colors"
          >
            Ana Sayfa
          </Link>
          <Link
            to="/iletisim"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-3 rounded-xl text-base font-semibold text-gray-700 hover:text-[#FF8C00] hover:bg-[#E2E8CE]/60 transition-colors"
          >
            İletişim
          </Link>
          {user ? (
            <>
              <Link
                to="/veresiye"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 rounded-xl text-base font-semibold text-gray-700 hover:text-[#FF8C00] hover:bg-[#E2E8CE]/60 transition-colors"
              >
                Veresiye Defteri
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="block w-full text-left px-4 py-3 rounded-xl text-base font-bold text-white bg-[#FF8C00] hover:bg-[#e67e00] transition-colors mt-2"
              >
                Çıkış Yap
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-3 rounded-xl text-base font-bold text-white bg-[#FF8C00] hover:bg-[#e67e00] transition-colors mt-2"
            >
              Giriş Yap
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
