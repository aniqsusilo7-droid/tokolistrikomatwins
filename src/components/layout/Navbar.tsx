import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Zap, ShoppingCart, Phone, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../../context/CartContext';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const location = useLocation();
  const { cart, cartCount, cartTotal, removeFromCart, updateQuantity } = useCart();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Produk', path: '/produk' },
    { name: 'Promo', path: '/promo' },
    { name: 'Kontak', path: '/kontak' },
    { name: 'Admin', path: '/admin' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const itemsText = cart.map(item => `- ${item.product.name} (${item.quantity}x)`).join('%0A');
    const text = `Halo Toko Listrik Oma Twins, saya ingin memesan:%0A${itemsText}%0A%0ATotal: ${formatPrice(cartTotal)}%0A%0AMohon info ketersediaan dan ongkirnya. Terima kasih.`;
    window.open(`https://wa.me/6282213102085?text=${text}`, '_blank');
  };

  return (
    <nav className="bg-primary text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Zap className="h-8 w-8 text-accent" />
              <span className="font-bold text-xl tracking-tight">Toko Listrik Oma Twins</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`font-medium transition-colors hover:text-accent ${
                  isActive(link.path) ? 'text-accent' : 'text-gray-200'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex items-center gap-4 ml-4 border-l border-primary-dark pl-4">
              <button onClick={() => setIsCartOpen(true)} className="relative text-gray-200 hover:text-accent transition-colors">
                <ShoppingCart className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-danger text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
              <a
                href="https://wa.me/6282213102085"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-accent text-primary font-bold px-4 py-2 rounded-md flex items-center gap-2 hover:bg-accent-hover transition-colors"
              >
                <Phone className="h-4 w-4" />
                Hubungi Kami
              </a>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
            <button onClick={() => setIsCartOpen(true)} className="relative text-gray-200 hover:text-accent transition-colors">
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-danger text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-200 hover:text-white focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-primary-dark">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(link.path)
                    ? 'bg-primary text-accent'
                    : 'text-gray-200 hover:bg-primary hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <a
              href="https://wa.me/6282213102085"
              target="_blank"
              rel="noopener noreferrer"
              className="block px-3 py-2 mt-4 text-center rounded-md text-base font-bold bg-accent text-primary"
            >
              Hubungi Kami via WA
            </a>
          </div>
        </div>
      )}

      {/* Cart Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsCartOpen(false)}></div>
          <div className="relative w-full max-w-md bg-white h-full shadow-xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <ShoppingCart className="h-6 w-6 text-primary" /> Keranjang Belanja
              </h2>
              <button onClick={() => setIsCartOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="flex-grow overflow-y-auto p-4">
              {cart.length === 0 ? (
                <div className="text-center text-gray-500 mt-10">
                  <ShoppingCart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <p>Keranjang Anda masih kosong.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex gap-4 border-b border-gray-100 pb-4">
                      <img src={item.product.image} alt={item.product.name} className="w-20 h-20 object-cover rounded-md bg-gray-100" referrerPolicy="no-referrer" />
                      <div className="flex-grow">
                        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">{item.product.name}</h3>
                        <div className="text-primary font-bold mt-1">{formatPrice(item.product.price)}</div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-gray-200 rounded-md">
                            <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="px-2 py-1 text-gray-600 hover:bg-gray-100">-</button>
                            <span className="px-2 py-1 text-sm font-medium">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="px-2 py-1 text-gray-600 hover:bg-gray-100">+</button>
                          </div>
                          <button onClick={() => removeFromCart(item.product.id)} className="text-danger hover:bg-red-50 p-1 rounded">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {cart.length > 0 && (
              <div className="p-4 border-t border-gray-100 bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold text-gray-600">Total Harga:</span>
                  <span className="text-xl font-bold text-primary">{formatPrice(cartTotal)}</span>
                </div>
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
                >
                  <Phone className="h-5 w-5" /> Checkout via WhatsApp
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
