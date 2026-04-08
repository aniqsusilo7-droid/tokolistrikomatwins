import { Link } from 'react-router-dom';
import { Zap, MapPin, Phone, Mail, Facebook, Instagram, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-primary-dark text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand & About */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-6">
              <Zap className="h-8 w-8 text-accent" />
              <span className="font-bold text-2xl text-white tracking-tight">Toko Listrik Oma Twins</span>
            </Link>
            <p className="text-sm leading-relaxed mb-6">
              Toko Listrik Oma Twins menyediakan berbagai kebutuhan alat listrik rumah tangga dan industri dengan kualitas terjamin, harga grosir, dan pelayanan profesional selama lebih dari 20 tahun.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-accent transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-accent transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-accent transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Tautan Cepat</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="hover:text-accent transition-colors">Beranda</Link>
              </li>
              <li>
                <Link to="/produk" className="hover:text-accent transition-colors">Katalog Produk</Link>
              </li>
              <li>
                <Link to="/promo" className="hover:text-accent transition-colors">Promo & Diskon</Link>
              </li>
              <li>
                <Link to="/kontak" className="hover:text-accent transition-colors">Tentang Kami</Link>
              </li>
              <li>
                <Link to="/kontak" className="hover:text-accent transition-colors">Hubungi Kami</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Informasi Kontak</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                <span>Komplek Bukit pelamunan permai / perum Sankyu C5 NO 4 Kramatwatu</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-accent shrink-0" />
                <span>082213102085</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-accent shrink-0" />
                <span>aniqsusilo7@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Berlangganan Promo</h3>
            <p className="text-sm mb-4">Dapatkan info diskon dan penawaran spesial langsung ke email Anda.</p>
            <form className="flex flex-col gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Alamat Email Anda"
                className="bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-md focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                required
              />
              <button
                type="submit"
                className="bg-accent text-primary font-semibold px-4 py-2 rounded-md hover:bg-accent-hover transition-colors"
              >
                Daftar Sekarang
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Toko Listrik Oma Twins. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</a>
            <a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
