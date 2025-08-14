import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '../hooks/useAuth.jsx';
import { toast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleQuantityChange = (productId, newQuantity) => {
    updateQuantity(productId, newQuantity, 'ekor');
  };
  
  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
    toast({
      title: "Item Dihapus",
      description: "Item telah dihapus dari keranjang"
    });
  };

  const handleCheckout = () => {
    if (!user) {
      toast({
        title: "Login Diperlukan",
        description: "Silakan login terlebih dahulu untuk melanjutkan.",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) {
      toast({
        title: "Keranjang Kosong",
        description: "Tambahkan item ke keranjang terlebih dahulu.",
        variant: "destructive"
      });
      return;
    }
    navigate('/checkout');
  };
  
  if (!user) {
    return (
      <>
        <Helmet><title>Keranjang - PT. Pitek Balap Perkasa</title></Helmet>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Login Diperlukan</h2>
            <p className="text-gray-600 mb-8">Silakan login untuk melihat keranjang Anda.</p>
            <Link to="/login"><Button className="btn-gradient">Login Sekarang</Button></Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet><title>Keranjang Pesanan - PT. Pitek Balap Perkasa</title></Helmet>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <Link to="/stok" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" /> Kembali ke Stok
            </Link>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Keranjang Pesanan</h1>
              <p className="text-gray-600">{cartItems.length} jenis item dalam keranjang.</p>
            </motion.div>
          </div>

          {cartItems.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
              <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Keranjang Kosong</h2>
              <Link to="/stok"><Button className="btn-gradient">Cari Stok</Button></Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                  <Card>
                    <CardHeader><CardTitle>Item Pesanan</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                      {cartItems.map((item, index) => (
                        <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                          <img alt={`Ayam ${item.weight} kg`} className="w-16 h-16 rounded-lg object-cover" src="https://images.unsplash.com/photo-1538971663141-21dd09b2c3dd" />
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">Ayam {item.weight} kg</h3>
                            <p className="text-sm text-gray-600">{item.location}</p>
                            <p className="text-lg font-bold text-green-600">Rp {item.price.toLocaleString('id-ID')}/{item.sellingMethod || 'kg'}</p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Button size="sm" variant="outline" onClick={() => handleQuantityChange(item.id, item.quantity - 1)}><Minus className="h-4 w-4" /></Button>
                            <div>
                                <Input type="number" value={item.quantity} onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))} className="w-20 text-center" />
                                <Label className="text-xs text-center block mt-1">x ekor</Label>
                            </div>
                            <Button size="sm" variant="outline" onClick={() => handleQuantityChange(item.id, item.quantity + 1)}><Plus className="h-4 w-4" /></Button>
                          </div>
                          <div className="text-right"><Button size="sm" variant="ghost" onClick={() => handleRemoveItem(item.id)} className="text-red-600 hover:text-red-700"><Trash2 className="h-4 w-4" /></Button></div>
                        </motion.div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              <div className="lg:col-span-1">
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <Card className="sticky top-24 shadow-lg">
                    <CardHeader><CardTitle>Ringkasan Pesanan</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                      <div className="border-t pt-4"><div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t"><span>Estimasi Total</span><span>Rp {getTotalPrice().toLocaleString('id-ID')}</span></div></div>
                      <p className="text-xs text-gray-500">Total final akan dihitung berdasarkan berat aktual saat penimbangan.</p>
                      <Button onClick={handleCheckout} className="w-full btn-gradient text-lg py-3">Lanjutkan ke Pemesanan</Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartPage;