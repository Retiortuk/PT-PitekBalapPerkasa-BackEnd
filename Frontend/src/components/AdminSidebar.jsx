import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Package, ShoppingCart, CheckSquare, Home, LogOut, MessageSquare, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const AdminSidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const navLinks = [
    { icon: LayoutDashboard, text: 'Dasbor', path: '/admin' },
    { icon: Users, text: 'Kelola Pengguna', path: '/admin/users' },
    { icon: Home, text: 'Kelola Kandang', path: '/admin/coops' },
    { icon: Package, text: 'Kelola Stok', path: '/admin/stock' },
    { icon: ShoppingCart, text: 'Kelola Transaksi', path: '/admin/transactions' },
    { icon: CheckSquare, text: 'Persetujuan SPPA', path: '/admin/approvals' },
    { icon: ShieldCheck, text: 'Verifikasi Pengguna', path: '/admin/verification' },
    { icon: MessageSquare, text: 'Pesan', path: '/admin/chat' },
  ];

  return (
    <div className="w-64 bg-white shadow-md h-screen flex flex-col">
      <div className="p-6 border-b">
        <Link to="/" className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          <div>
            <h1 className="text-md font-bold text-gray-900">PITEK BALAP</h1>
          </div>
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`flex items-center px-4 py-2.5 rounded-lg transition-colors ${
              location.pathname.startsWith(link.path)
                ? 'bg-blue-100 text-blue-700 font-semibold'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <link.icon className="h-5 w-5 mr-3" />
            <span>{link.text}</span>
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t">
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-2.5 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="h-5 w-5 mr-3" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;