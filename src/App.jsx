import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import MangaShop from './pages/MangaShop';
import AnimeShop from './pages/AnimeShop';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Dashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';
import Upload from './pages/admin/Upload';
import Users from './pages/admin/Users';
import OrderSuccess from './pages/OrderSuccess';
import AdminLogin from './pages/admin/AdminLogin';
import BuyHistory from './pages/BuyHistory';
import AdminOrders from './pages/admin/AdminOrder';
import AdminRoute from './components/admin/AdminRoute';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/manga" element={<MangaShop />} />
            <Route path="/anime" element={<AnimeShop />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path='order-success' element={<OrderSuccess/>}/>
            <Route path='/buy-history' element={<BuyHistory/>}/>
            
            {/* Rota de login admin - pública */}
            <Route path="/admin/login" element={<AdminLogin />} />
            
            {/* Rotas protegidas do admin */}
            <Route 
              path="/admin/dashboard" 
              element={<AdminRoute><Dashboard /></AdminRoute>} 
            />
            <Route 
              path="/admin/products" 
              element={<AdminRoute><Products /></AdminRoute>} 
            />
            <Route 
              path="/admin/upload" 
              element={<AdminRoute><Upload /></AdminRoute>} 
            />
            <Route 
              path="/admin/users" 
              element={<AdminRoute><Users /></AdminRoute>} 
            />
            <Route 
              path="/admin/admin-orders" 
              element={<AdminRoute><AdminOrders /></AdminRoute>} 
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;