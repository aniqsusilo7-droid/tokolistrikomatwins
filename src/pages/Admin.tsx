import { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { SEO } from '../components/SEO';
import { useProducts, Product } from '../context/ProductContext';
import { usePromo, PromoItem } from '../context/PromoContext';
import { Edit, Trash2, Plus, Lock, Settings, Package, Tags, LogOut } from 'lucide-react';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

export function Admin() {
  const { 
    products, addProduct, updateProduct, deleteProduct,
    categories, brands, addCategory, deleteCategory, addBrand, deleteBrand 
  } = useProducts();
  const { promoSettings, updatePromoSettings, addPromoItem, updatePromoItem, deletePromoItem } = usePromo();
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.email === 'aniqsusilo7@gmail.com') {
          setIsAuthenticated(true);
          setError('');
        } else {
          setIsAuthenticated(false);
          setError('Akses ditolak. Email tidak memiliki izin admin.');
          signOut(auth);
        }
      } else {
        setIsAuthenticated(false);
      }
      setAuthChecking(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      setError(err.message || 'Gagal login.');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err: any) {
      console.error(err);
    }
  };

  const [activeTab, setActiveTab] = useState<'products' | 'promo' | 'categories'>('products');
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageUploadMethod, setImageUploadMethod] = useState<'url' | 'file'>('url');

  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    name: '',
    category: 'Kabel',
    brand: 'Lainnya',
    price: 0,
    originalPrice: 0,
    rating: 5.0,
    image: ''
  });

  const [promoForm, setPromoForm] = useState({
    isActive: promoSettings?.isActive ?? true,
    endDate: (promoSettings?.endDate || new Date().toISOString()).slice(0, 16) // format for datetime-local input
  });

  useEffect(() => {
    if (promoSettings) {
      setPromoForm({
        isActive: promoSettings.isActive ?? true,
        endDate: (promoSettings.endDate || new Date().toISOString()).slice(0, 16)
      });
    }
  }, [promoSettings]);

  const [isEditingPromo, setIsEditingPromo] = useState(false);
  const [editingPromoId, setEditingPromoId] = useState<string | null>(null);
  const [promoItemForm, setPromoItemForm] = useState<Omit<PromoItem, 'id'>>({
    title: '',
    description: '',
    discount: '',
    image: '',
    terms: ''
  });
  const [promoImageUploadMethod, setPromoImageUploadMethod] = useState<'url' | 'file'>('url');

  const [newCategory, setNewCategory] = useState('');
  const [newBrand, setNewBrand] = useState('');

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name || '',
      category: product.category || 'Kabel',
      brand: product.brand || 'Lainnya',
      price: product.price || 0,
      originalPrice: product.originalPrice || 0,
      rating: product.rating || 5.0,
      image: product.image || ''
    });
    setEditingId(product.id);
    setImageUploadMethod((product.image || '').startsWith('data:image') ? 'file' : 'url');
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      deleteProduct(id);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateProduct(editingId, formData);
    } else {
      addProduct(formData);
    }
    
    // Reset form
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      name: '',
      category: 'Kabel',
      brand: 'Lainnya',
      price: 0,
      originalPrice: 0,
      rating: 5.0,
      image: ''
    });
    setImageUploadMethod('url');
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran gambar terlalu besar! Maksimal 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
  };

  const handleSavePromo = (e: FormEvent) => {
    e.preventDefault();
    updatePromoSettings({
      ...promoSettings,
      isActive: promoForm.isActive,
      endDate: new Date(promoForm.endDate).toISOString()
    });
    alert('Pengaturan promo berhasil disimpan!');
  };

  const handleEditPromoItem = (promo: PromoItem) => {
    setPromoItemForm({
      title: promo.title || '',
      description: promo.description || '',
      discount: promo.discount || '',
      image: promo.image || '',
      terms: promo.terms || ''
    });
    setEditingPromoId(promo.id);
    setPromoImageUploadMethod((promo.image || '').startsWith('data:image') ? 'file' : 'url');
    setIsEditingPromo(true);
  };

  const handleDeletePromoItem = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus promo ini?')) {
      deletePromoItem(id);
    }
  };

  const handleSubmitPromoItem = (e: FormEvent) => {
    e.preventDefault();
    if (editingPromoId) {
      updatePromoItem(editingPromoId, promoItemForm);
    } else {
      addPromoItem(promoItemForm);
    }
    
    // Reset form
    setIsEditingPromo(false);
    setEditingPromoId(null);
    setPromoItemForm({
      title: '',
      description: '',
      discount: '',
      image: '',
      terms: ''
    });
    setPromoImageUploadMethod('url');
  };

  const handlePromoImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran gambar terlalu besar! Maksimal 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPromoItemForm({ ...promoItemForm, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddCategory = async (e: FormEvent) => {
    e.preventDefault();
    if (newCategory.trim()) {
      await addCategory(newCategory.trim());
      setNewCategory('');
    }
  };

  const handleAddBrand = async (e: FormEvent) => {
    e.preventDefault();
    if (newBrand.trim()) {
      await addBrand(newBrand.trim());
      setNewBrand('');
    }
  };

  if (authChecking) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 px-4">
        <p>Memuat...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <SEO title="Login Admin - Toko Listrik Oma Twins" description="Login panel admin" />
        <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-4">
                <Lock className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Login Admin</h1>
              <p className="text-gray-500 mt-2">Login dengan Google untuk mengakses panel admin.</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-6">
              {error && <p className="text-danger text-sm mt-2 text-center">{error}</p>}
              <button
                type="submit"
                className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary-dark transition-colors"
              >
                Login dengan Google
              </button>
            </form>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO title="Admin Panel - Toko Listrik Oma Twins" description="Kelola produk toko" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium px-4 py-2 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex flex-wrap bg-gray-100 p-1 rounded-lg gap-1">
            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'products' ? 'bg-white text-primary shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Package className="h-4 w-4" /> Kelola Produk
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'categories' ? 'bg-white text-primary shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Tags className="h-4 w-4" /> Kategori & Merek
            </button>
            <button
              onClick={() => setActiveTab('promo')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'promo' ? 'bg-white text-primary shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Settings className="h-4 w-4" /> Pengaturan Promo
            </button>
          </div>
        </div>

        {activeTab === 'promo' && (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold mb-6">Pengaturan Banner Flash Sale</h2>
              <form onSubmit={handleSavePromo} className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div>
                    <h3 className="font-bold text-gray-900">Status Flash Sale</h3>
                    <p className="text-sm text-gray-500">Aktifkan atau nonaktifkan banner flash sale di halaman Promo.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={promoForm.isActive ?? false}
                      onChange={(e) => setPromoForm({...promoForm, isActive: e.target.checked})}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Batas Waktu Promo (Berakhir Pada)</label>
                  <input 
                    type="datetime-local" 
                    required
                    disabled={!promoForm.isActive}
                    value={promoForm.endDate || ''}
                    onChange={(e) => setPromoForm({...promoForm, endDate: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary disabled:bg-gray-100 disabled:text-gray-500"
                  />
                  <p className="text-xs text-gray-500 mt-2">Pilih tanggal dan jam kapan promo flash sale akan berakhir.</p>
                </div>

                <button type="submit" className="bg-primary text-white font-bold px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors w-full sm:w-auto">
                  Simpan Pengaturan Banner
                </button>
              </form>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Daftar Promo Menarik Lainnya</h2>
                {!isEditingPromo && (
                  <button 
                    onClick={() => setIsEditingPromo(true)}
                    className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-dark transition-colors"
                  >
                    <Plus className="h-5 w-5" /> Tambah Promo
                  </button>
                )}
              </div>

              {isEditingPromo && (
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-8">
                  <h3 className="text-lg font-bold mb-4">{editingPromoId ? 'Edit Promo' : 'Tambah Promo Baru'}</h3>
                  <form onSubmit={handleSubmitPromoItem} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Judul Promo</label>
                        <input 
                          type="text" required
                          value={promoItemForm.title || ''}
                          onChange={(e) => setPromoItemForm({...promoItemForm, title: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                          placeholder="Contoh: Paket Lampu LED Hemat"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Diskon / Label</label>
                        <input 
                          type="text" required
                          value={promoItemForm.discount || ''}
                          onChange={(e) => setPromoItemForm({...promoItemForm, discount: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                          placeholder="Contoh: Diskon 15% atau Beli 5 Gratis 1"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Promo</label>
                        <textarea 
                          required rows={2}
                          value={promoItemForm.description || ''}
                          onChange={(e) => setPromoItemForm({...promoItemForm, description: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                          placeholder="Jelaskan detail promo ini..."
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Syarat & Ketentuan</label>
                        <input 
                          type="text" required
                          value={promoItemForm.terms || ''}
                          onChange={(e) => setPromoItemForm({...promoItemForm, terms: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                          placeholder="Contoh: Berlaku kelipatan. Selama persediaan masih ada."
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Gambar Promo</label>
                        <div className="flex gap-4 mb-2">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                              type="radio" 
                              name="promoImageMethod" 
                              checked={promoImageUploadMethod === 'url'} 
                              onChange={() => setPromoImageUploadMethod('url')} 
                              className="text-primary focus:ring-primary"
                            /> 
                            <span className="text-sm">URL Gambar</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                              type="radio" 
                              name="promoImageMethod" 
                              checked={promoImageUploadMethod === 'file'} 
                              onChange={() => setPromoImageUploadMethod('file')} 
                              className="text-primary focus:ring-primary"
                            /> 
                            <span className="text-sm">Upload File</span>
                          </label>
                        </div>
                        {promoImageUploadMethod === 'url' ? (
                          <input 
                            type="url" required
                            placeholder="https://contoh.com/gambar.jpg"
                            value={promoItemForm.image || ''}
                            onChange={(e) => setPromoItemForm({...promoItemForm, image: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                          />
                        ) : (
                          <>
                            <input 
                              type="file" 
                              accept="image/*" 
                              required={!promoItemForm.image} 
                              onChange={handlePromoImageUpload}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                            />
                            {promoItemForm.image && promoItemForm.image.startsWith('data:image') && (
                              <div className="mt-2">
                                <img src={promoItemForm.image} alt="Preview" className="h-20 w-20 object-cover rounded-md border border-gray-200" />
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 pt-4">
                      <button type="submit" className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark">
                        Simpan Promo
                      </button>
                      <button 
                        type="button" 
                        onClick={() => {
                          setIsEditingPromo(false);
                          setEditingPromoId(null);
                        }}
                        className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300"
                      >
                        Batal
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="p-4 font-semibold text-gray-600">Gambar</th>
                      <th className="p-4 font-semibold text-gray-600">Judul & Diskon</th>
                      <th className="p-4 font-semibold text-gray-600">Deskripsi</th>
                      <th className="p-4 font-semibold text-gray-600 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(promoSettings.promos || []).map((promo) => (
                      <tr key={promo.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-4">
                          <img src={promo.image} alt={promo.title} className="w-20 h-16 object-cover rounded-md bg-gray-200" referrerPolicy="no-referrer" />
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-gray-900">{promo.title}</div>
                          <div className="inline-block bg-warning/10 text-warning px-2 py-0.5 rounded text-xs font-bold mt-1">{promo.discount}</div>
                        </td>
                        <td className="p-4 text-sm text-gray-600 max-w-xs">
                          <div className="line-clamp-2">{promo.description}</div>
                        </td>
                        <td className="p-4 text-right">
                          <button 
                            onClick={() => handleEditPromoItem(promo)}
                            className="text-blue-600 hover:bg-blue-50 p-2 rounded-md transition-colors mr-2"
                            title="Edit"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button 
                            onClick={() => handleDeletePromoItem(promo.id)}
                            className="text-red-600 hover:bg-red-50 p-2 rounded-md transition-colors"
                            title="Hapus"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {(!promoSettings.promos || promoSettings.promos.length === 0) && (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-gray-500">
                          Belum ada promo. Silakan tambah promo baru.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Daftar Produk</h2>
              {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-dark transition-colors"
                >
                  <Plus className="h-5 w-5" /> Tambah Produk
                </button>
              )}
            </div>

            {isEditing && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-8">
            <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Produk' : 'Tambah Produk Baru'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Produk</label>
                  <input 
                    type="text" required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gambar Produk</label>
                  <div className="flex gap-4 mb-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="imageMethod" 
                        checked={imageUploadMethod === 'url'} 
                        onChange={() => setImageUploadMethod('url')} 
                        className="text-primary focus:ring-primary"
                      /> 
                      <span className="text-sm">URL Gambar</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="imageMethod" 
                        checked={imageUploadMethod === 'file'} 
                        onChange={() => setImageUploadMethod('file')} 
                        className="text-primary focus:ring-primary"
                      /> 
                      <span className="text-sm">Upload File</span>
                    </label>
                  </div>
                  {imageUploadMethod === 'url' ? (
                    <>
                      <input 
                        type="url" required
                        placeholder="https://contoh.com/gambar.jpg"
                        value={formData.image || ''}
                        onChange={(e) => setFormData({...formData, image: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                      />
                      <p className="text-xs text-gray-500 mt-1">Masukkan link gambar (contoh dari Imgur, Postimg, dll)</p>
                    </>
                  ) : (
                    <>
                      <input 
                        type="file" 
                        accept="image/*" 
                        required={!formData.image} 
                        onChange={handleImageUpload}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                      />
                      <p className="text-xs text-gray-500 mt-1">Pilih gambar dari perangkat Anda (Maks. 2MB)</p>
                      {formData.image && formData.image.startsWith('data:image') && (
                        <div className="mt-2">
                          <img src={formData.image} alt="Preview" className="h-20 w-20 object-cover rounded-md border border-gray-200" />
                        </div>
                      )}
                    </>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                  <select 
                    value={formData.category || (categories[0]?.name || '')}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  >
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Merek</label>
                  <select 
                    value={formData.brand || (brands[0]?.name || '')}
                    onChange={(e) => setFormData({...formData, brand: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  >
                    {brands.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Harga Jual (Rp)</label>
                  <input 
                    type="number" required min="0"
                    value={formData.price ?? 0}
                    onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Harga Asli / Coret (Rp)</label>
                  <input 
                    type="number" required min="0"
                    value={formData.originalPrice ?? 0}
                    onChange={(e) => setFormData({...formData, originalPrice: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1.0 - 5.0)</label>
                  <input 
                    type="number" required min="1" max="5" step="0.1"
                    value={formData.rating ?? 5.0}
                    onChange={(e) => setFormData({...formData, rating: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <button type="submit" className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark">
                  Simpan Produk
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setIsEditing(false);
                    setEditingId(null);
                  }}
                  className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="p-4 font-semibold text-gray-600">Gambar</th>
                  <th className="p-4 font-semibold text-gray-600">Nama Produk</th>
                  <th className="p-4 font-semibold text-gray-600">Kategori & Merek</th>
                  <th className="p-4 font-semibold text-gray-600">Harga</th>
                  <th className="p-4 font-semibold text-gray-600 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4">
                      <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-md bg-gray-200" referrerPolicy="no-referrer" />
                    </td>
                    <td className="p-4 font-medium text-gray-900">{product.name}</td>
                    <td className="p-4 text-gray-600">
                      <div>{product.category}</div>
                      <div className="text-xs text-gray-400">{product.brand}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-primary font-bold">{formatPrice(product.price)}</div>
                      {product.originalPrice > product.price && (
                        <div className="text-xs text-gray-400 line-through">{formatPrice(product.originalPrice)}</div>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleEdit(product)}
                        className="text-blue-600 hover:bg-blue-50 p-2 rounded-md transition-colors mr-2"
                        title="Edit"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:bg-red-50 p-2 rounded-md transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">
                      Belum ada produk. Silakan tambah produk baru.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
          </>
        )}

        {activeTab === 'categories' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold mb-4">Kelola Kategori</h2>
              <form onSubmit={handleAddCategory} className="flex gap-2 mb-6">
                <input
                  type="text"
                  required
                  placeholder="Nama Kategori Baru"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                />
                <button type="submit" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark whitespace-nowrap">
                  Tambah
                </button>
              </form>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <tbody>
                    {categories.map((cat) => (
                      <tr key={cat.id} className="border-b border-gray-100 hover:bg-gray-50 last:border-0">
                        <td className="p-3 font-medium text-gray-900">{cat.name}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => {
                              if (window.confirm(`Yakin hapus kategori ${cat.name}?`)) {
                                deleteCategory(cat.id);
                              }
                            }}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {categories.length === 0 && (
                      <tr>
                        <td colSpan={2} className="p-4 text-center text-gray-500">Belum ada kategori.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold mb-4">Kelola Merek</h2>
              <form onSubmit={handleAddBrand} className="flex gap-2 mb-6">
                <input
                  type="text"
                  required
                  placeholder="Nama Merek Baru"
                  value={newBrand}
                  onChange={(e) => setNewBrand(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                />
                <button type="submit" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark whitespace-nowrap">
                  Tambah
                </button>
              </form>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <tbody>
                    {brands.map((brand) => (
                      <tr key={brand.id} className="border-b border-gray-100 hover:bg-gray-50 last:border-0">
                        <td className="p-3 font-medium text-gray-900">{brand.name}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => {
                              if (window.confirm(`Yakin hapus merek ${brand.name}?`)) {
                                deleteBrand(brand.id);
                              }
                            }}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {brands.length === 0 && (
                      <tr>
                        <td colSpan={2} className="p-4 text-center text-gray-500">Belum ada merek.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
