import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import ScrollToTopButton from './components/ScrollToTopButton';
import Home from './pages/Home';
import Contact from './pages/Contact';
import Login from './pages/Login';
import VeresiyeDefteri from './pages/VeresiyeDefteri';
import MusteriDetay from './pages/MusteriDetay';
import AdminProducts from './pages/AdminProducts';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen bg-gray-50">
          <Navbar />
          <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/iletisim" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/veresiye" element={<VeresiyeDefteri />} />
              <Route path="/musteri/:id" element={<MusteriDetay />} />
              <Route path="/admin-products" element={<AdminProducts />} />
            </Routes>
          </main>
          <Footer />
          <ScrollToTopButton />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
