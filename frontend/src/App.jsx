import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import AdminPage from './pages/AdminPage';

export default function App() {
  return (
    <div className="min-h-screen bg-bg text-slate-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/loja" element={<ShopPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </div>
  );
}
