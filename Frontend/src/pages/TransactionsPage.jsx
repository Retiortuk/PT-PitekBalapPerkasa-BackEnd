import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Eye, Banknote, FileText, Star, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '../hooks/useAuth.jsx';

const TransactionsPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user) {
      const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      const userOrders = allOrders.filter(order => order.userId === user.id);
      setOrders(userOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
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
      <Helmet><title>Semua Transaksi - PT. Pitek Balap Perkasa</title></Helmet>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link to="/dashboard" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Dashboard
          </Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardHeader><CardTitle>Semua Riwayat Transaksi</CardTitle></CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold">No. SPPA</th>
                        <th className="text-left py-3 px-4 font-semibold">Tanggal</th>
                        <th className="text-right py-3 px-4 font-semibold">Total Aktual</th>
                        <th className="text-center py-3 px-4 font-semibold">Status</th>
                        <th className="text-center py-3 px-4 font-semibold">Penilaian</th>
                        <th className="text-center py-3 px-4 font-semibold">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.length > 0 ? orders.map(order => {
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
                                  <div className="flex justify-center">
                                      {[...Array(5)].map((_, i) => (
                                          <Star key={i} className={`h-4 w-4 ${i < (order.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                                      ))}
                                  </div>
                              </td>
                              <td className="py-3 px-4 text-center">
                                  <div className="flex justify-center items-center space-x-2">
                                    <Link to={`/receipt/${order.id}`}>
                                      <Button variant="outline" size="sm"><Eye className="h-4 w-4" /></Button>
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
                        <tr><td colSpan="6" className="text-center py-10 text-gray-500">Anda belum memiliki transaksi.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    </>
  );
};

export default TransactionsPage;