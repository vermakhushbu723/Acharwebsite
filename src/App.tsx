import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { SettingsProvider } from './context/SettingsContext';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductPage from './pages/ProductPage';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderPage from './pages/OrderPage';
import TrackOrder from './pages/TrackOrder';
import Contact from './pages/Contact';
import PolicyPage from './pages/Policy';
import { About, Faqs, NotFound, Process } from './pages/ContentPages';

export default function App() {
  return (
    <BrowserRouter>
      <SettingsProvider>
        <CartProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="shop" element={<Shop />} />
              <Route path="products/:slug" element={<ProductPage />} />
              <Route path="cart" element={<Cart />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="order/:orderNumber" element={<OrderPage />} />
              <Route path="track-order" element={<TrackOrder />} />
              <Route path="about" element={<About />} />
              <Route path="our-process" element={<Process />} />
              <Route path="contact" element={<Contact />} />
              <Route path="faqs" element={<Faqs />} />
              <Route path="policies/:slug" element={<PolicyPage />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </CartProvider>
      </SettingsProvider>
    </BrowserRouter>
  );
}
