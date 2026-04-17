/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { Promo } from './pages/Promo';
import { ContactAbout } from './pages/ContactAbout';
import { Admin } from './pages/Admin';
import { ProductProvider } from './context/ProductContext';
import { CartProvider } from './context/CartContext';
import { PromoProvider } from './context/PromoContext';
import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <ProductProvider>
          <CartProvider>
            <PromoProvider>
              <Router>
                <Routes>
                  <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="produk" element={<Products />} />
                    <Route path="promo" element={<Promo />} />
                    <Route path="kontak" element={<ContactAbout />} />
                    <Route path="admin" element={<Admin />} />
                  </Route>
                </Routes>
              </Router>
            </PromoProvider>
          </CartProvider>
        </ProductProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}
