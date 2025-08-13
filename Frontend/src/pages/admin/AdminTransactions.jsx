import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Eye, MoreVertical, Upload, Check, X, Search, BadgeCheck } from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [weighingData, setWeighingData] = useState({ actualTonnage: '', actualPrice: '' });
  const [isWeighModalOpen, setWeighModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchTransactions = () => {
     const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
     const sorted = allOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
     setTransactions(sorted);
     setFilteredTransactions(sorted);
  };

  useEffect(() => {
    fetchTransactions();
    const interval = setInterval(fetchTransactions, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
      const lowerCaseSearch = searchTerm.toLowerCase();
      const filtered = transactions.filter(t => 
        t.id.toLowerCase().includes(lowerCaseSearch) ||
        t.customerName.toLowerCase().includes(lowerCaseSearch)
      );
      setFilteredTransactions(filtered);
  }, [searchTerm, transactions]);

  const saveTransactions = (updatedTransactions) => {
    localStorage.setItem('orders', JSON.stringify(updatedTransactions));
    fetchTransactions();
  };
  
  const handlePaymentConfirm = (orderId, isConfirmed) => {
    const newStatus = isConfirmed ? 'pending_approval' : 'rejected_payment';
    const updatedTransactions = transactions.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
    );
    saveTransactions(updatedTransactions);
    toast({ title: `Pembayaran ${isConfirmed ? 'Dikonfirmasi' : 'Ditolak'}`});
  };

  const handleStatusChange = (orderId, newStatus) => {
    let updatedTransactions = transactions.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    saveTransactions(updatedTransactions);
    toast({ title: `Status Diperbarui menjadi: ${newStatus.replace(/_/g, ' ')}` });
  };
  
  const handleWeighSubmit = (e) => {
    e.preventDefault();
    const updatedTransactions = transactions.map(order =>
      order.id === selectedOrder.id ? { ...order, weighingData: weighingData, actualTotal: weighingData.actualTonnage * weighingData.actualPrice, status: 'payment_pending' } : order
    );
    saveTransactions(updatedTransactions);
    toast({ title: "Data Timbang Dikirim", description: "Invoice dibuat, menunggu pembayaran dari pembeli." });
    setWeighModalOpen(false);
    setSelectedOrder(null);
  };
  
  const getStatusBadge = (status) => {
    const statusMap = {
      pending_approval: { text: 'Menunggu Persetujuan', color: 'bg-gray-100 text-gray-800' },
      payment_review: { text: 'Tinjau Pembayaran', color: 'bg-cyan-100 text-cyan-800' },
      rejected_payment: { text: 'Pembayaran Ditolak', color: 'bg-red-200 text-red-800' },
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
      <Helmet><title>Kelola Transaksi - Admin</title></Helmet>
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Kelola Transaksi</h1>
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>Daftar Semua Transaksi</CardTitle>
                    <div className="w-full max-w-xs relative">
                        <Input placeholder="Cari SPPA atau Pembeli..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto"><table className="w-full">
                    <thead><tr className="border-b"><th className="text-left p-3 font-semibold">No. SPPA / Pembeli</th><th className="text-right p-3 font-semibold">Total Aktual</th><th className="text-center p-3 font-semibold">Status</th><th className="text-center p-3 font-semibold">Aksi</th></tr></thead>
                    <tbody>
                      {filteredTransactions.length > 0 ? filteredTransactions.map(order => {
                        const status = getStatusBadge(order.status);
                        return (
                          <tr key={order.id} className="border-b hover:bg-gray-50">
                            <td className="p-3"><p className="font-medium">{order.id}</p><p className="text-sm text-gray-500">{order.customerName}</p></td>
                            <td className="p-3 text-right font-semibold">{order.actualTotal > 0 ? `Rp ${order.actualTotal.toLocaleString('id-ID')}` : `Est. Rp ${order.estimatedTotal.toLocaleString('id-ID')}`}</td>
                            <td className="p-3 text-center"><span className={`px-2 py-1 text-xs font-medium rounded-full ${status.color}`}>{status.text}</span></td>
                            <td className="p-3"><div className="flex justify-center items-center space-x-2">
                                <Link to={`/receipt/${order.id}`}><Button size="sm" variant="outline" title="Lihat Detail"><Eye className="h-4 w-4" /></Button></Link>
                                {order.status === 'pending_approval' && <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleStatusChange(order.id, 'approved')}>Setujui</Button>}
                                {order.status === 'payment_review' && (
                                    <Dialog><DialogTrigger asChild><Button size="sm" variant="outline" className="bg-cyan-100 text-cyan-800"><BadgeCheck className="h-4 w-4"/></Button></DialogTrigger>
                                        <DialogContent><DialogHeader><DialogTitle>Konfirmasi Pembayaran</DialogTitle></DialogHeader>
                                            <p>Pengguna <strong>{order.customerName}</strong> telah mengunggah bukti pembayaran.</p>
                                            {order.paymentProof?.dataUrl && <img src={order.paymentProof.dataUrl} alt="Bukti pembayaran" className="rounded-lg border"/>}
                                            <div className="flex justify-end gap-2 mt-4">
                                                <Button variant="destructive" onClick={() => handlePaymentConfirm(order.id, false)}><X className="h-4 w-4 mr-2"/>Tolak</Button>
                                                <Button className="bg-green-600 hover:bg-green-700" onClick={() => handlePaymentConfirm(order.id, true)}><Check className="h-4 w-4 mr-2"/>Konfirmasi</Button>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                )}
                                <Dialog open={isWeighModalOpen && selectedOrder?.id === order.id} onOpenChange={(isOpen) => { if(!isOpen) setSelectedOrder(null); setWeighModalOpen(isOpen);}}><DialogTrigger asChild><Button size="sm" variant="outline" onClick={() => { setSelectedOrder(order); setWeighingData({ actualTonnage: '', actualPrice: ''}); setWeighModalOpen(true); }} disabled={order.status !== 'weighing'} title="Upload Data Timbang"><Upload className="h-4 w-4" /></Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>Upload Data Timbang</DialogTitle></DialogHeader><form onSubmit={handleWeighSubmit} className="space-y-4 mt-4"><div><Label>Tonase Aktual (kg)</Label><Input type="number" step="0.01" value={weighingData.actualTonnage} onChange={(e) => setWeighingData({...weighingData, actualTonnage: e.target.value})} required/></div><div><Label>Harga Aktual (per kg)</Label><Input type="number" value={weighingData.actualPrice} onChange={(e) => setWeighingData({...weighingData, actualPrice: e.target.value})} required/></div><Button type="submit" className="w-full">Kirim Data & Buat Invoice</Button></form></DialogContent></Dialog>
                                <DropdownMenu><DropdownMenuTrigger asChild><Button size="sm" variant="ghost"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                  <DropdownMenuContent>
                                    {order.status === 'approved' && <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'weighing')}>Set: Proses Timbang</DropdownMenuItem>}
                                    {order.status === 'weighing' && <DropdownMenuItem onClick={() => setWeighModalOpen(true)}>Input Hasil Timbang</DropdownMenuItem>}
                                    {order.status === 'payment_pending' && <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'completed')}>Set: Selesai (Pembayaran Lunas)</DropdownMenuItem>}
                                    {order.status !== 'completed' && <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'completed')}>Set: Selesai (Manual)</DropdownMenuItem>}
                                    {order.status !== 'rejected' && <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'rejected')}>Set: Ditolak</DropdownMenuItem>}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                            </div></td>
                          </tr>
                        );
                      }) : (<tr><td colSpan="5" className="text-center py-10 text-gray-500">Belum ada transaksi.</td></tr>)}
                    </tbody>
                </table></div>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    </>
  );
};

export default AdminTransactions;