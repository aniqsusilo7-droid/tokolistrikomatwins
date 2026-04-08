import { useState, useEffect } from 'react';
import { SEO } from '../components/SEO';
import { Star, ShoppingCart, Filter, ChevronDown, Search, X } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';

// Dummy data
const categories = ['Semua', 'Kabel', 'Lampu LED', 'Saklar & Stop Kontak', 'MCB', 'Kapasitor', 'Fiting', 'Lainnya'];
const brands = ['Semua', 'Shinyoku', 'Philips', 'Cahaya', 'Hannochs', 'Eterna', 'Broco', 'Schneider', 'Lainnya'];

export function Products() {
  const { products: allProducts } = useProducts();
  const { addToCart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [selectedBrand, setSelectedBrand] = useState('Semua');
  const [sortBy, setSortBy] = useState('terpopuler');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedBrand, sortBy]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Filter and sort logic
  let filteredProducts = allProducts.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = selectedCategory === 'Semua' || p.category === selectedCategory;
    const matchBrand = selectedBrand === 'Semua' || p.brand === selectedBrand;
    return matchSearch && matchCategory && matchBrand;
  });

  if (sortBy === 'termurah') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'termahal') {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else {
    // terpopuler (by rating)
    filteredProducts.sort((a, b) => b.rating - a.rating);
  }

  // Pagination logic
  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <>
      <SEO
        title="Katalog Produk - Toko Listrik Oma Twins"
        description="Katalog lengkap produk Toko Listrik Oma Twins. Beli kabel Eterna, lampu LED Philips, saklar Broco, MCB Schneider dengan harga grosir."
      />

      <div className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb & Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Katalog Produk</h1>
            <p className="text-gray-600">Temukan berbagai kebutuhan alat listrik dengan harga terbaik.</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Mobile Filter Toggle */}
            <button 
              className="lg:hidden flex items-center justify-center gap-2 bg-white border border-gray-200 py-2 px-4 rounded-lg font-medium text-gray-700"
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            >
              <Filter className="h-5 w-5" />
              Filter Produk
            </button>

            {/* Sidebar Filters */}
            <aside className={`lg:w-1/4 ${isMobileFilterOpen ? 'block' : 'hidden'} lg:block`}>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                <div className="mb-8">
                  <h3 className="font-bold text-gray-900 mb-4 text-lg border-b pb-2">Kategori</h3>
                  <ul className="space-y-2">
                    {categories.map(cat => (
                      <li key={cat}>
                        <button
                          onClick={() => setSelectedCategory(cat)}
                          className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                            selectedCategory === cat 
                              ? 'bg-primary/10 text-primary font-medium' 
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {cat}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-4 text-lg border-b pb-2">Merek</h3>
                  <ul className="space-y-2">
                    {brands.map(brand => (
                      <li key={brand}>
                        <button
                          onClick={() => setSelectedBrand(brand)}
                          className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                            selectedBrand === brand 
                              ? 'bg-primary/10 text-primary font-medium' 
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {brand}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main className="lg:w-3/4">
              {/* Search and Sorting Bar */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="relative w-full md:w-1/2">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Cari produk berdasarkan nama..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                
                <div className="flex items-center justify-between w-full md:w-auto gap-4">
                  <div className="text-gray-600 font-medium hidden md:block">
                    <span className="text-primary font-bold">{filteredProducts.length}</span> produk
                  </div>
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <span className="text-gray-600 whitespace-nowrap">Urutkan:</span>
                    <div className="relative w-full md:w-48">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      >
                        <option value="terpopuler">Terpopuler</option>
                        <option value="termurah">Harga Terendah</option>
                        <option value="termahal">Harga Tertinggi</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Grid */}
              {currentProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentProducts.map((product) => (
                    <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
                      <div className="relative aspect-square overflow-hidden bg-gray-100">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                        {product.originalPrice > product.price && (
                          <div className="absolute top-3 left-3 bg-danger text-white text-xs font-bold px-2 py-1 rounded">
                            {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                          </div>
                        )}
                      </div>
                      <div className="p-5 flex flex-col flex-grow">
                        <div className="text-xs text-gray-500 mb-1">{product.category} &bull; {product.brand}</div>
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 flex-grow">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-1 mb-3">
                          <Star className="h-4 w-4 fill-accent text-accent" />
                          <span className="text-sm font-medium text-gray-700">{product.rating}</span>
                        </div>
                        <div className="flex items-end gap-2 mb-4">
                          <span className="text-lg font-bold text-primary">{formatPrice(product.price)}</span>
                          {product.originalPrice > product.price && (
                            <span className="text-sm text-gray-400 line-through mb-0.5">{formatPrice(product.originalPrice)}</span>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-auto">
                          <button className="border border-primary text-primary font-medium py-2 rounded-lg hover:bg-primary/5 transition-colors text-sm">
                            Lihat Detail
                          </button>
                          <button 
                            onClick={() => addToCart(product)}
                            className="bg-primary text-white font-medium py-2 rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 text-sm"
                          >
                            <ShoppingCart className="h-4 w-4" />
                            Keranjang
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white p-12 rounded-2xl border border-gray-100 text-center">
                  <p className="text-gray-500 text-lg">Tidak ada produk yang sesuai dengan pencarian atau filter Anda.</p>
                  <button 
                    onClick={() => { setSearchQuery(''); setSelectedCategory('Semua'); setSelectedBrand('Semua'); }}
                    className="mt-4 text-primary font-medium hover:underline"
                  >
                    Reset Pencarian & Filter
                  </button>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-10 flex justify-center">
                  <nav className="flex items-center gap-2">
                    <button 
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Sebelumnya
                    </button>
                    
                    {[...Array(totalPages)].map((_, i) => (
                      <button 
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-10 h-10 rounded-md font-medium flex items-center justify-center ${
                          currentPage === i + 1 
                            ? 'bg-primary text-white' 
                            : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button 
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Selanjutnya
                    </button>
                  </nav>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
