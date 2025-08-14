import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { ChatProvider } from '@/contexts/ChatContext';
import HomePage from '@/pages/HomePage';
import TradingPage from '@/pages/TradingPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import AdminDashboard from '@/pages/AdminDashboard';
import UserDashboard from '@/pages/UserDashboard';
import CheckoutPage from '@/pages/CheckoutPage';
import ProtectedRoute from '@/components/ProtectedRoute';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import AdminTransactions from '@/pages/admin/AdminTransactions';
import AdminUsers from '@/pages/admin/AdminUsers';
import AdminStock from '@/pages/admin/AdminStock';
import AdminApprovals from '@/pages/admin/AdminApprovals';
import AdminCoops from '@/pages/admin/AdminCoops';
import OrderReceipt from '@/pages/OrderReceipt';
import InvoicePage from '@/pages/InvoicePage';
import FinalPaymentPage from '@/pages/FinalPaymentPage';
import StockDetailPage from '@/pages/StockDetailPage';
import ProfilePage from '@/pages/ProfilePage';
import EditProfilePage from '@/pages/EditProfilePage';
import ChatPage from '@/pages/ChatPage';
import TransactionsPage from '@/pages/TransactionsPage';
import AdminChatPage from '@/pages/admin/AdminChatPage';
import AdminVerification from '@/pages/admin/AdminVerification';
import CartPage from '@/pages/CartPage';
import PrePaymentPage from '@/pages/PrePaymentPage';
import AdminRoute from './pages/admin/AdminRoute';
import userRoute  from './pages/userRoute';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ChatProvider>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/stok" element={<TradingPage />} />
              <Route path="/stok/:id" element={<StockDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              
              <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
              <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
              <Route path="/receipt/:orderId" element={<ProtectedRoute><OrderReceipt /></ProtectedRoute>} />
              <Route path="/invoice/:orderId" element={<ProtectedRoute><InvoicePage /></ProtectedRoute>} />
              <Route path="/pay/:orderId" element={<ProtectedRoute><FinalPaymentPage /></ProtectedRoute>} />
              <Route path="/pre-payment" element={<ProtectedRoute><PrePaymentPage /></ProtectedRoute>} />
              
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/profile/edit" element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>} />
              <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
              <Route path="/chat/:contactId" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
              <Route path="/transactions" element={<ProtectedRoute><TransactionsPage /></ProtectedRoute>} />

              <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/admin/transactions" element={<AdminRoute><AdminTransactions /></AdminRoute>} />
              <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
              <Route path="/admin/stock" element={<AdminRoute><AdminStock /></AdminRoute>} />
              <Route path="/admin/approvals" element={<AdminRoute><AdminApprovals /></AdminRoute>} />
              <Route path="/admin/coops" element={<AdminRoute><AdminCoops /></AdminRoute>} />
              <Route path="/admin/chat" element={<AdminRoute><AdminChatPage /></AdminRoute>} />
              <Route path="/admin/chat/:userId" element={<AdminRoute><AdminChatPage /></AdminRoute>} />
              <Route path="/admin/verification" element={<AdminRoute><AdminVerification /></AdminRoute>} />
              <Route path="/dashboard" element={<userRoute><UserDashboard /> </userRoute>} />
            </Routes>
          </div>
        </ChatProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;