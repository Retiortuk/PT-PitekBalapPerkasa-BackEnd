import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Check, X, Eye } from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';

const AdminApprovals = () => {
  const [approvals, setApprovals] = useState([]);

  const fetchApprovals = () => {
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    setApprovals(allOrders.filter(order => order.status === 'pending_approval'));
  }

  useEffect(() => {
    fetchApprovals();
  }, []);

  const handleApproval = (orderId, newStatus) => {
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const updatedOrders = allOrders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    fetchApprovals();
    toast({
      title: `Pesanan ${newStatus === 'approved' ? 'Disetujui' : 'Ditolak'}`,
      description: `Pesanan #${orderId} telah berhasil diubah statusnya.`,
    });
  };

  return (
    <>
      <Helmet>
        <title>Persetujuan Transaksi - Admin</title>
      </Helmet>
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Persetujuan Transaksi</h1>
            <p className="text-gray-500 mb-8">Setujui atau tolak pengajuan surat jalan dari pembeli.</p>

            <Card>
              <CardHeader>
                <CardTitle>Daftar Pengajuan Menunggu Persetujuan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold">No. SPPA / Pembeli</th>
                        <th className="text-left py-3 px-4 font-semibold">Tanggal</th>
                        <th className="text-right py-3 px-4 font-semibold">Estimasi Total</th>
                        <th className="text-center py-3 px-4 font-semibold">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {approvals.length > 0 ? approvals.map(order => (
                        <tr key={order.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <p className="font-medium">{order.id}</p>
                            <p className="text-sm text-gray-500">{order.customerName}</p>
                          </td>
                          <td className="py-3 px-4">{new Date(order.createdAt).toLocaleDateString('id-ID')}</td>
                          <td className="py-3 px-4 text-right font-medium">Rp {order.estimatedTotal.toLocaleString('id-ID')}</td>
                          <td className="py-3 px-4">
                            <div className="flex justify-center space-x-2">
                              <Link to={`/receipt/${order.id}`}>
                                <Button size="sm" variant="outline"><Eye className="h-4 w-4" /></Button>
                              </Link>
                              <Button size="sm" variant="outline" className="text-green-600 hover:bg-green-50" onClick={() => handleApproval(order.id, 'approved')}>
                                <Check className="h-4 w-4" /> Setujui
                              </Button>
                              <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50" onClick={() => handleApproval(order.id, 'rejected')}>
                                <X className="h-4 w-4" /> Tolak
                              </Button>
                            </div>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan="4" className="text-center py-10 text-gray-500">Tidak ada pengajuan yang menunggu persetujuan.</td>
                        </tr>
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

export default AdminApprovals;