import { SEO } from '../components/SEO';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, ShieldCheck, Truck, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';

export function Home() {
  const { products } = useProducts();
  const { addToCart } = useCart();
  const featuredProducts = products.slice(0, 4);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <>
      <SEO
        title="Toko Listrik Oma Twins - Kabel, Lampu LED, Saklar Terlengkap"
        description="Toko Listrik Oma Twins menyediakan berbagai kebutuhan alat listrik rumah tangga dan industri. Solusi Listrik Terpercaya untuk Rumah Anda Di Jamin Murah Meriah."
        keywords="toko listrik online, jual kabel listrik, lampu LED murah, saklar, mcb, alat listrik jakarta"
      />

      {/* Hero Section */}
      <section className="relative bg-primary overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://picsum.photos/seed/electrical-installation/1920/1080?blur=2"
            alt="Instalasi Listrik Modern"
            className="w-full h-full object-cover opacity-30"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-transparent"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-2xl">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
            >
              Solusi Listrik Terpercaya untuk Rumah Anda <span className="text-accent">Di Jamin Murah Meriah</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg md:text-xl text-gray-200 mb-8"
            >
              Pusat grosir dan eceran alat listrik terlengkap. Kualitas SNI, produk original, dan harga bersaing.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                to="/produk"
                className="bg-accent text-primary font-bold px-8 py-4 rounded-lg text-center hover:bg-accent-hover transition-colors flex items-center justify-center gap-2"
              >
                Belanja Sekarang
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/promo"
                className="bg-white/10 text-white border border-white/30 font-bold px-8 py-4 rounded-lg text-center hover:bg-white/20 transition-colors"
              >
                Lihat Promo
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50">
              <div className="bg-primary/10 p-3 rounded-full text-primary">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Produk Original & SNI</h3>
                <p className="text-sm text-gray-600">Kualitas terjamin aman</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50">
              <div className="bg-primary/10 p-3 rounded-full text-primary">
                <Truck className="h-8 w-8" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Pengiriman Cepat</h3>
                <p className="text-sm text-gray-600">Ke seluruh Indonesia</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50">
              <div className="bg-primary/10 p-3 rounded-full text-primary">
                <Clock className="h-8 w-8" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Layanan 24/7</h3>
                <p className="text-sm text-gray-600">Siap membantu Anda</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Produk Unggulan</h2>
              <p className="text-gray-600">Pilihan terbaik untuk kebutuhan listrik Anda</p>
            </div>
            <Link to="/produk" className="hidden sm:flex items-center gap-1 text-primary font-semibold hover:text-primary-dark">
              Lihat Semua <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-danger text-white text-xs font-bold px-2 py-1 rounded">
                    Diskon
                  </div>
                </div>
                <div className="p-5">
                  <div className="text-xs text-gray-500 mb-1">{product.category}</div>
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 h-12">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-1 mb-3">
                    <Star className="h-4 w-4 fill-accent text-accent" />
                    <span className="text-sm font-medium text-gray-700">{product.rating}</span>
                  </div>
                  <div className="flex items-end gap-2 mb-4">
                    <span className="text-lg font-bold text-primary">{formatPrice(product.price)}</span>
                    <span className="text-sm text-gray-400 line-through mb-0.5">{formatPrice(product.originalPrice)}</span>
                  </div>
                  <button 
                    onClick={() => addToCart(product)}
                    className="w-full bg-primary text-white font-medium py-2.5 rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    Beli Sekarang
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center sm:hidden">
            <Link to="/produk" className="inline-flex items-center gap-2 text-primary font-semibold hover:text-primary-dark">
              Lihat Semua Produk <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
