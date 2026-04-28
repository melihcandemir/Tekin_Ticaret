import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white border-t-2 border-[#E2E8CE] pt-12 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-10">
          {/* Brand Info */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-2xl font-bold text-gray-900">
              <span className="text-[#FF8C00]">Tekin</span> Ticaret
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed pr-4">
              Müşterilerimizle aramızdaki güven bağını dijitale taşıyoruz.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col space-y-4">
            <h4 className="text-lg font-semibold text-gray-800">
              Hızlı Bağlantılar
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/"
                  className="text-gray-600 hover:text-[#FF8C00] transition-colors duration-200 inline-flex items-center group"
                >
                  <span className="mr-2 text-[#FF8C00] group-hover:translate-x-1 transition-transform">
                    →
                  </span>{" "}
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-[#FF8C00] transition-colors duration-200 inline-flex items-center group"
                >
                  <span className="mr-2 text-[#FF8C00] group-hover:translate-x-1 transition-transform">
                    →
                  </span>{" "}
                  Defter
                </Link>
              </li>
              <li>
                <Link
                  to="/iletisim"
                  className="text-gray-600 hover:text-[#FF8C00] transition-colors duration-200 inline-flex items-center group"
                >
                  <span className="mr-2 text-[#FF8C00] group-hover:translate-x-1 transition-transform">
                    →
                  </span>{" "}
                  İletişim
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col space-y-4">
            <h4 className="text-lg font-semibold text-gray-800">İletişim</h4>
            <ul className="space-y-4 text-sm text-gray-600">
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 text-[#FF8C00] mr-3 mt-0.5 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <a
                  href="https://maps.app.goo.gl/dwzbKgo8nj6D8FfX8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#FF8C00] transition-colors"
                >
                  Kabakoz, 54500 Karasu / Sakarya
                </a>
              </li>
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 text-[#FF8C00] mr-3 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <a
                  href="tel:+905317839078"
                  className="hover:text-[#FF8C00] transition-colors"
                >
                  +90 531 783 90 78
                </a>
              </li>
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 text-[#FF8C00] mr-3 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <a
                  href="mailto:info@tekinticaret.com"
                  className="hover:text-[#FF8C00] transition-colors"
                >
                  info@tekinticaret.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[#E2E8CE] flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-500 text-sm font-medium">
            &copy; {new Date().getFullYear()} Tekin Ticaret. Tüm hakları
            saklıdır.
          </div>
          <div className="text-sm text-gray-500">
            Powered by{" "}
            <a
              href="https://wa.me/905348324940"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-gray-700 hover:text-[#FF8C00] transition-colors"
            >
              Melih Can Demir
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
