import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, QrCode, Clock, Banknote } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '../hooks/useAuth.jsx';
import { toast } from '@/components/ui/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const CheckoutPage = () => {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ policeNumber: '', driverName: '', driverPhone: '', driverSim: '' });
  const [paymentMethod, setPaymentMethod] = useState('pay_later');
  
  useEffect(() => {
    if (user && !user.isVerified && paymentMethod !== 'pay_later') {
      toast({
        title: "Verifikasi Diperlukan",
        description: "Akun Anda harus terverifikasi untuk menggunakan metode pembayaran di muka.",
        variant: "destructive",
      });
      setPaymentMethod('pay_later');
    }
  }, [paymentMethod, user]);

  const handleCreateOrder = () => {
    if (!formData.policeNumber || !formData.driverName || !formData.driverPhone || !formData.driverSim) {
      toast({ title: "Data Tidak Lengkap", description: "Harap isi semua informasi pengambilan.", variant: "destructive" });
      return;
    }

    const orderStatus = paymentMethod === 'pay_later' ? 'pending_approval' : 'pending_payment';
    
    const order = {
      id: `SPPA-${Date.now()}`,
      userId: user.id,
      customerName: user.name,
      items: cartItems,
      driverInfo: formData,
      estimatedTotal: getTotalPrice(),
      actualTotal: 0,
      paymentMethod: paymentMethod,
      status: orderStatus,
      paymentProof: null,
      createdAt: new Date().toISOString(),
      weighingData: null,
      rating: 0,
    };
    
    if (paymentMethod !== 'pay_later') {
        localStorage.setItem('temp_order', JSON.stringify(order));
        navigate(`/pre-payment`);
        return;
    }

    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    existingOrders.push(order);
    localStorage.setItem('orders', JSON.stringify(existingOrders));

    clearCart();

    toast({ title: "SPPA Diajukan!", description: `Surat Jalan #${order.id} sedang menunggu persetujuan admin.` });
    navigate(`/receipt/${order.id}`);
  };

  if (cartItems.length === 0) {
    return (
      <>
        <Helmet><title>Pesan - PT. Pitek Balap Perkasa</title></Helmet>
        <div className="min-h-screen bg-gray-50"><Navbar />
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold">Keranjang Kosong</h2>
            <Link to="/stok"><Button className="mt-4 btn-gradient">Cari Stok Sekarang</Button></Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet><title>Pesan - PT. Pitek Balap Perkasa</title></Helmet>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link to="/cart" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"><ArrowLeft className="h-4 w-4 mr-2" /> Kembali ke Keranjang</Link>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Form Pengajuan SPPA</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <Card className="shadow-lg">
                  <CardHeader><CardTitle>Informasi Pengambilan</CardTitle></CardHeader>
                  <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><Label htmlFor="policeNumber">No. Polisi Armada</Label><Input id="policeNumber" name="policeNumber" value={formData.policeNumber} onChange={(e) => setFormData({...formData, policeNumber: e.target.value})} required /></div>
                        <div><Label htmlFor="driverName">Nama Supir</Label><Input id="driverName" name="driverName" value={formData.driverName} onChange={(e) => setFormData({...formData, driverName: e.target.value})} required /></div>
                        <div><Label htmlFor="driverPhone">No. HP Supir</Label><Input id="driverPhone" name="driverPhone" value={formData.driverPhone} onChange={(e) => setFormData({...formData, driverPhone: e.target.value})} required /></div>
                        <div><Label htmlFor="driverSim">No. SIM Supir</Label><Input id="driverSim" name="driverSim" value={formData.driverSim} onChange={(e) => setFormData({...formData, driverSim: e.target.value})} required /></div>
                      </div>
                  </CardContent>
                </Card>
                <Card className="shadow-lg">
                  <CardHeader><CardTitle>Metode Pembayaran</CardTitle><CardDescription>Pilih metode pembayaran Anda.</CardDescription></CardHeader>
                  <CardContent>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      <div className="space-y-4">
                        <Label htmlFor="pay_later" className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50"><RadioGroupItem value="pay_later" id="pay_later" /><div className="ml-4"><p className="font-semibold">Bayar Setelah Timbang</p><p className="text-sm text-gray-500">Total final ditagihkan setelah penimbangan selesai.</p></div><Clock className="ml-auto h-6 w-6 text-gray-600" /></Label>
                        <Label htmlFor="qris" className={`flex items-center p-4 border rounded-lg ${!user?.isVerified ? 'cursor-not-allowed bg-gray-100 opacity-60' : 'cursor-pointer hover:bg-gray-50'}`}><RadioGroupItem value="qris" id="qris" disabled={!user?.isVerified} /><div className="ml-4"><p className="font-semibold">QRIS</p><p className="text-sm text-gray-500">Bayar di muka, SPPA dibuat setelah konfirmasi.</p></div><QrCode className="ml-auto h-6 w-6 text-gray-600" /></Label>
                        <Label htmlFor="bank_transfer" className={`flex items-center p-4 border rounded-lg ${!user?.isVerified ? 'cursor-not-allowed bg-gray-100 opacity-60' : 'cursor-pointer hover:bg-gray-50'}`}><RadioGroupItem value="bank_transfer" id="bank_transfer" disabled={!user?.isVerified} /><div className="ml-4"><p className="font-semibold">Transfer Bank</p><p className="text-sm text-gray-500">Bayar di muka, SPPA dibuat setelah konfirmasi.</p></div><Banknote className="ml-auto h-6 w-6 text-gray-600" /></Label>
                         {!user?.isVerified && <p className="text-xs text-yellow-600">Verifikasi akun Anda di halaman profil untuk membuka pembayaran di muka.</p>}
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>
              </div>
              <div className="lg:col-span-1">
                <Card className="shadow-lg sticky top-24"><CardHeader><CardTitle>Ringkasan Pesanan</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                      {cartItems.map((item) => (<div key={item.id} className="flex justify-between items-start"><div className="flex-1"><p className="font-medium">{item.quantity} ekor - Ukuran {item.weight}</p><p className="text-sm text-gray-500">{item.location}</p></div></div>))}
                      <div className="border-t pt-4 mt-4 space-y-2"><div className="flex justify-between font-bold text-lg"><span>Estimasi Total</span><span>Rp {getTotalPrice().toLocaleString('id-ID')}</span></div></div>
                      <p className="text-xs text-gray-500 pt-2">Estimasi total dan detail pembayaran hanya untuk catatan Anda, tidak akan tampil di Surat Jalan.</p>
                  </CardContent>
                  <div className="p-6 pt-0"><Button onClick={handleCreateOrder} className="w-full btn-gradient text-lg py-6"><FileText className="h-5 w-5 mr-2" />{paymentMethod === 'pay_later' ? 'Ajukan SPPA' : 'Lanjut ke Pembayaran'}</Button></div>
                </Card>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </>
  );
};

export default CheckoutPage;