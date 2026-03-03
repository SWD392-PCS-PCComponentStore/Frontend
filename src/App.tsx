import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider, ThemeProvider, AuthProvider } from '@/context';
import { MainLayout } from '@/layouts/MainLayout';
import {
  HomePage,
  ProductListPage,
  ProductDetailPage,
  PCBuilderPage,
  CartPage,
  CheckoutPage,
} from '@/pages';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <Routes>
              <Route element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="products" element={<ProductListPage />} />
                <Route path="products/:category" element={<ProductListPage />} />
                <Route path="product/:id" element={<ProductDetailPage />} />
                <Route path="builder" element={<PCBuilderPage />} />
                <Route path="cart" element={<CartPage />} />
                <Route path="checkout" element={<CheckoutPage />} />
              </Route>
            </Routes>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
