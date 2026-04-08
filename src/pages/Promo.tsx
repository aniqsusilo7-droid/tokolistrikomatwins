import { useState, useEffect } from 'react';
import { SEO } from '../components/SEO';
import { Timer, Gift, Tag, MessageCircle, ShoppingCart } from 'lucide-react';
import { motion } from 'motion/react';
import { usePromo } from '../context/PromoContext';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';

export function Promo() {
  const { promoSettings } = usePromo();
  const { products } = useProducts();
  const { addToCart } = useCart();
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!promoSettings.isActive) {
      setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(promoSettings.endDate).getTime();
      const distance = end - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      } else {
        const hours = Math.floor(distance / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft({ hours, minutes, seconds });
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [promoSettings]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
  };

  const handleWhatsAppClick = (promoTitle: string) => {
    const message = encodeURIComponent(`Halo Toko Listrik Oma Twins, saya tertarik dengan promo: ${promoTitle}. Apakah masih tersedia?`);
    window.open(`https://wa.me/6282213102085?text=${message}`, '_blank');
  };

  return (
    <>
      <SEO
        title="Promo & Diskon Alat Listrik - Toko Listrik Oma Twins"
        description="Dapatkan diskon hingga 30% untuk kabel listrik, lampu LED, dan alat listrik lainnya. Promo terbatas, buruan order!"
      />

      {/* Flash Sale Banner */}
      <section className={`py-12 relative overflow-hidden ${promoSettings.isActive ? 'bg-danger text-white' : 'bg-gray-800 text-white'}`}>
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`inline-block font-bold px-4 py-1 rounded-full text-sm mb-4 uppercase tracking-wider ${promoSettings.isActive ? 'bg-warning text-white' : 'bg-gray-600 text-white'}`}
              >
                {promoSettings.isActive ? 'Flash Sale' : 'Info'}
              </motion.div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {promoSettings.isActive ? 'Diskon 30% Kabel Listrik' : 'Belum Ada Promo Saat Ini'}
              </h1>
              <p className={`text-xl ${promoSettings.isActive ? 'text-red-100' : 'text-gray-300'}`}>
                {promoSettings.isActive ? 'Stok terbatas! Dapatkan harga grosir termurah se-Jakarta.' : 'Saat ini sedang tidak ada promo yang berlangsung. Nantikan kejutan diskon dari kami selanjutnya!'}
              </p>
            </div>
            
            {promoSettings.isActive && (
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-6 rounded-2xl text-center min-w-[300px]">
                <div className="flex items-center justify-center gap-2 mb-4 text-warning">
                  <Timer className="h-6 w-6" />
                  <span className="font-semibold text-lg text-white">
                    Berakhir Dalam:
                  </span>
                </div>
                <div className="flex justify-center gap-4">
                  <div className="bg-white rounded-lg p-3 w-20 shadow-lg text-danger">
                    <div className="text-3xl font-bold">{timeLeft.hours.toString().padStart(2, '0')}</div>
                    <div className="text-xs font-medium uppercase mt-1">Jam</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 w-20 shadow-lg text-danger">
                    <div className="text-3xl font-bold">{timeLeft.minutes.toString().padStart(2, '0')}</div>
                    <div className="text-xs font-medium uppercase mt-1">Menit</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 w-20 shadow-lg text-danger">
                    <div className="text-3xl font-bold">{timeLeft.seconds.toString().padStart(2, '0')}</div>
                    <div className="text-xs font-medium uppercase mt-1">Detik</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {promoSettings.isActive ? (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Promo Menarik Lainnya</h2>
              <p className="text-gray-600">Jangan lewatkan penawaran spesial minggu ini.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(promoSettings.promos || []).map((promo) => (
                <div key={promo.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={promo.image}
                      alt={promo.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 right-4 bg-warning text-white font-bold px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1">
                      <Tag className="h-4 w-4" />
                      {promo.discount}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{promo.title}</h3>
                    <p className="text-gray-600 mb-4 flex-grow">{promo.description}</p>
                    <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-500 mb-6 border border-gray-100">
                      <span className="font-semibold text-gray-700">S&K:</span> {promo.terms}
                    </div>
                    <button 
                      onClick={() => handleWhatsAppClick(promo.title)}
                      className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="h-5 w-5" />
                      Ambil Promo via WA
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Produk Pilihan Kami</h2>
              <p className="text-gray-600">Meskipun sedang tidak ada promo, Anda tetap bisa mendapatkan produk berkualitas dengan harga terbaik dari kami.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.slice(0, 8).map((product) => (
                <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="text-xs text-primary font-semibold mb-2">{product.category}</div>
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 flex-grow">{product.name}</h3>
                    <div className="flex items-center justify-between mt-auto pt-4">
                      <div className="flex flex-col">
                        <span className="text-lg font-bold text-primary">{formatPrice(product.price)}</span>
                        {product.originalPrice > product.price && (
                          <span className="text-sm text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                        )}
                      </div>
                      <button 
                        onClick={() => addToCart(product)}
                        className="bg-primary text-white p-2.5 rounded-lg hover:bg-primary-dark transition-colors"
                        title="Tambah ke Keranjang"
                      >
                        <ShoppingCart className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Loyalty Section */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center p-4 bg-accent/20 rounded-full mb-6">
            <Gift className="h-12 w-12 text-warning" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Program Pelanggan Setia</h2>
          <p className="text-lg text-gray-600 mb-8">
            Kumpulkan poin setiap pembelanjaan minimal Rp 100.000 dan tukarkan dengan berbagai hadiah menarik atau potongan harga langsung!
          </p>
          <button className="bg-warning text-white font-bold px-8 py-4 rounded-xl hover:bg-orange-600 transition-colors shadow-lg shadow-warning/30">
            Daftar Member Sekarang
          </button>
        </div>
      </section>
    </>
  );
}
