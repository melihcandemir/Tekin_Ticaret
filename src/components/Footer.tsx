import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#FFFFFF] border-t-2 border-[#E2E8CE] py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-600 font-medium">
            &copy; {new Date().getFullYear()} Tekin Ticaret. Tüm hakları saklıdır.
          </div>
          <div className="flex space-x-6">
            <Link to="/iletisim" className="text-gray-500 hover:text-[#FF8C00] font-medium transition-colors">
              Bize Ulaşın
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
