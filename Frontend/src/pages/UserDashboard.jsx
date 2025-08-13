import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, ShoppingCart, Banknote, FileText, Star, MessageSquare, User, Package, CheckCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

const UserDashboard = () => {
  const { user } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ activeOrders: 0, completedOrders: 0 });

  useEffect(() => {
    if (user) {
      const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      const userOrders = allOrders.filter(order => order.userId === user.id);
      setOrders(userOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      
      const active = userOrders.filter(o => o.status !== 'completed' && o.status !== 'rejected').length;
      const completed = userOrders.filter(o => o.status === 'completed').length;
      setStats({ activeOrders: active, completedOrders: completed });
    }
  }, [user]);

  const getStatusBadge = (status) => {
    const statusMap = {
      pending_approval: { text: 'Menunggu Persetujuan', color: 'bg-gray-100 text-gray-800' },
      approved: { text: 'Disetujui', color: 'bg-blue-100 text-blue-800' },
      weighing: { text: 'Proses Timbang', color: 'bg-yellow-100 text-yellow-800' },
      payment_pending: { text: 'Menunggu Pembayaran', color: 'bg-orange-100 text-orange-800' },
      hold: { text: 'Mobil Ditahan', color: 'bg-red-200 text-red-900'},
      completed: { text: 'Selesai', color: 'bg-green-100 text-green-800' },
      rejected: { text: 'Ditolak', color: 'bg-red-100 text-red-800' },
    };
    return statusMap[status] || { text: status.replace(/_/g, ' '), color: 'bg-gray-100 text-gray-800' };
  };

  return (
    <>
      <Helmet><title>Dashboard User - PT. Pitek Balap Perkasa</title></Helmet>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dasbor Pengguna</h1>
              <p className="text-gray-600">Selamat datang kembali, {user?.name}!</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => navigate('/chat')}>
                <MessageSquare className="h-4 w-4 mr-2" /> Chat dengan Admin
              </Button>
              <Button onClick={() => navigate('/trading')} className="btn-gradient">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Cari Stok Baru
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card><CardHeader className="flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Pesanan Aktif</CardTitle><Package className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{stats.activeOrders}</div></CardContent></Card>
            <Card><CardHeader className="flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Pesanan Selesai</CardTitle><CheckCircle className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{stats.completedOrders}</div></CardContent></Card>
            <Card><CardHeader className="flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Profil Saya</CardTitle><User className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><p className={`text-sm font-semibold ${user?.isVerified ? 'text-green-600' : 'text-yellow-600'}`}>{user?.isVerified ? 'Terverifikasi' : 'Belum Diverifikasi'}</p><Button size="sm" variant="link" className="p-0 h-auto" onClick={() => navigate('/profile')}>Lihat Profil</Button></CardContent></Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Riwayat Transaksi Terbaru</CardTitle>
                <Link to="/transactions">
                  <Button variant="link">Lihat Semua</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold">No. SPPA</th>
                      <th className="text-left py-3 px-4 font-semibold">Tanggal</th>
                      <th className="text-right py-3 px-4 font-semibold">Total Aktual</th>
                      <th className="text-center py-3 px-4 font-semibold">Status</th>
                      <th className="text-center py-3 px-4 font-semibold">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length > 0 ? orders.slice(0, 5).map(order => {
                        const status = getStatusBadge(order.status);
                        return (
                          <tr key={order.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4 font-medium">{order.id}</td>
                            <td className="py-3 px-4">{new Date(order.createdAt).toLocaleDateString('id-ID')}</td>
                            <td className="py-3 px-4 text-right font-semibold">{order.actualTotal > 0 ? `Rp ${order.actualTotal.toLocaleString('id-ID')}` : '-'}</td>
                            <td className="py-3 px-4 text-center">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${status.color}`}>
                                {status.text}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center">
                                <div className="flex justify-center items-center space-x-2">
                                  <Link to={`/receipt/${order.id}`}>
                                    <Button variant="outline" size="sm" title="Lihat Detail"><Eye className="h-4 w-4" /></Button>
                                  </Link>
                                  {order.status === 'payment_pending' && (
                                    <>
                                      <Link to={`/invoice/${order.id}`}>
                                        <Button variant="outline" size="sm" title="Lihat Invoice"><FileText className="h-4 w-4" /></Button>
                                      </Link>
                                      <Link to={`/pay/${order.id}`}>
                                        <Button variant="default" size="sm" title="Bayar Sekarang"><Banknote className="h-4 w-4" /></Button>
                                      </Link>
                                    </>
                                  )}
                                </div>
                            </td>
                          </tr>
                        );
                    }) : (
                      <tr><td colSpan="5" className="text-center py-10 text-gray-500">Anda belum memiliki transaksi.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  );
};

export default UserDashboard;