import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Printer, ArrowLeft, Star, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '../hooks/useAuth.jsx';

const OrderReceipt = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const foundOrder = allOrders.find(o => o.id.toString() === orderId);
    setOrder(foundOrder);
    if(foundOrder && foundOrder.rating) {
        setRating(foundOrder.rating);
    }
  }, [orderId]);

  const handleRatingSubmit = () => {
     const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
     const updatedOrders = allOrders.map(o => 
        o.id === orderId ? { ...o, rating: rating } : o
     );
     localStorage.setItem('orders', JSON.stringify(updatedOrders));
     setOrder(prev => ({...prev, rating: rating}));
     toast({
         title: "Terima Kasih!",
         description: "Penilaian Anda telah kami simpan."
     });
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      pending_approval: { text: 'Menunggu Persetujuan', color: 'text-yellow-600', icon: <Clock/> },
      payment_review: { text: 'Pembayaran Ditinjau', color: 'text-cyan-600', icon: <Clock/> },
      approved: { text: 'Disetujui', color: 'text-blue-600', icon: <CheckCircle/> },
      weighing: { text: 'Proses Timbang', color: 'text-yellow-600', icon: <Clock/> },
      payment_pending: { text: 'Menunggu Pembayaran', color: 'text-orange-600', icon: <Clock/> },
      hold: { text: 'Mobil Ditahan', color: 'text-red-700', icon: <AlertTriangle/> },
      completed: { text: 'Selesai', color: 'text-green-600', icon: <CheckCircle/> },
      rejected: { text: 'Ditolak', color: 'text-red-600', icon: <AlertTriangle/> },
      rejected_payment: { text: 'Pembayaran Ditolak', color: 'text-red-600', icon: <AlertTriangle/> },
    };
    return statusMap[status] || { text: status.replace(/_/g, ' '), color: 'text-gray-600', icon: <Clock/> };
  };

  if (!order) {
    return (
      <>
        <Navbar />
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold">Pesanan tidak ditemukan</h1>
          <Link to={user.role === 'admin' ? '/admin/transactions' : '/dashboard'}>
            <Button className="mt-4">Kembali ke Dashboard</Button>
          </Link>
        </div>
      </>
    );
  }

  const statusInfo = getStatusInfo(order.status);
  const isPrintable = ['approved', 'weighing', 'payment_pending', 'hold', 'completed'].includes(order.status);

  return (
    <>
      <Helmet>
        <title>Surat Jalan #{order.id} - PT. Pitek Balap Perkasa</title>
      </Helmet>
      <div className="bg-gray-100 min-h-screen">
        <Navbar />
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="flex justify-between items-center mb-6 noprint">
            <Link to={user.role === 'admin' ? '/admin/transactions' : '/dashboard'} className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Link>
            <Button onClick={() => window.print()} variant="outline" disabled={!isPrintable}>
              <Printer className="h-4 w-4 mr-2" /> Cetak Surat Jalan
            </Button>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="shadow-lg sppa-document">
              <CardHeader className="bg-gray-50 p-6 border-b">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                       <img src="https://horizons-cdn.hostinger.com/e17b5b5d-3b23-492e-8a50-f08715bdc0dd/534c3c26a2b5b5906b17544c64ebfeac.png" alt="Logo" className="h-12" />
                      <div>
                        <h2 className="text-xl font-bold text-gray-800">PT. PITEK BALAP PERKASA</h2>
                        <p className="text-sm text-gray-500">Platform Trading Ayam Terpercaya</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <h3 className="text-lg font-bold text-gray-800">SURAT PERINTAH PENGAMBILAN AYAM (SPPA)</h3>
                    <p className="text-sm text-gray-600">No: {order.id}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2 border-b pb-1">INFO PEMBELI</h4>
                      <p className="text-sm"><strong>Nama:</strong> {order.customerName}</p>
                      <p className="text-sm"><strong>Tanggal Pengajuan:</strong> {new Date(order.createdAt).toLocaleDateString('id-ID')}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2 border-b pb-1">INFO KENDARAAN</h4>
                      <p className="text-sm"><strong>No. Polisi Armada:</strong> {order.driverInfo.policeNumber}</p>
                      <p className="text-sm"><strong>Nama Supir:</strong> {order.driverInfo.driverName}</p>
                      <p className="text-sm"><strong>No. HP Supir:</strong> {order.driverInfo.driverPhone}</p>
                    </div>
                  </div>
                  <div className="mb-8">
                    <h4 className="font-semibold text-gray-700 mb-3">DETAIL PERMINTAAN PENGAMBILAN</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left font-semibold p-2">Lokasi Kandang</th>
                            <th className="text-left font-semibold p-2">Ukuran Ayam (kg)</th>
                            <th className="text-right font-semibold p-2">Jumlah Diminta (Ekor)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.items.map(item => (
                            <tr key={item.id} className="border-b">
                              <td className="p-2">{item.location}</td>
                              <td className="p-2">{item.weight}</td>
                              <td className="text-right p-2">{item.quantity.toLocaleString('id-ID')}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="mb-8 p-4 border rounded-lg bg-blue-50">
                      <h4 className="font-semibold text-gray-700 mb-2">Status Proses</h4>
                      <div className={`flex items-center text-xl font-bold ${statusInfo.color}`}>
                          <div className="mr-2">{statusInfo.icon}</div>
                          <p>{statusInfo.text}</p>
                      </div>
                  </div>
                  <div className="mt-12 text-center text-xs text-gray-500">
                      <p>Dokumen ini adalah bukti perintah pengambilan yang sah. Harap tunjukkan kepada petugas di lokasi kandang.</p>
                      <p>HANYA UNTUK KEPERLUAN SUPIR & PETUGAS KANDANG - TIDAK MENUNJUKKAN HARGA.</p>
                      <p>PT. Pitek Balap Perkasa</p>
                  </div>
              </CardContent>
            </Card>

            {user.role === 'user' && order.status === 'completed' && (
              <Card className="mt-8 shadow-lg noprint">
                <CardHeader>
                  <h3 className="font-semibold text-gray-700">Beri Penilaian</h3>
                </CardHeader>
                <CardContent>
                  {order.rating > 0 ? (
                    <div className="flex items-center"><p className="mr-2">Penilaian Anda:</p><div className="flex">{[...Array(5)].map((_, i) => (<Star key={i} className={`h-6 w-6 ${i < order.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />))}</div></div>
                  ) : (
                    <Dialog>
                      <DialogTrigger asChild><Button variant="outline">Beri Penilaian</Button></DialogTrigger>
                      <DialogContent>
                        <DialogHeader><DialogTitle>Beri Penilaian Transaksi</DialogTitle></DialogHeader>
                        <div className="flex justify-center my-4">{[...Array(5)].map((_, i) => { const rVal = i + 1; return (<Star key={i} className={`h-8 w-8 cursor-pointer transition-colors ${rVal <= (hoverRating || rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} onClick={() => setRating(rVal)} onMouseEnter={() => setHoverRating(rVal)} onMouseLeave={() => setHoverRating(0)} />); })}</div>
                        <Button onClick={handleRatingSubmit}>Kirim Penilaian</Button>
                      </DialogContent>
                    </Dialog>
                  )}
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default OrderReceipt;