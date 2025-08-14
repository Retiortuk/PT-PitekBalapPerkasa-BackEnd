import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Phone, Building, User, Ruler, Tag, ShoppingCart, Minus, Plus, MessageSquare, Truck } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '../hooks/useAuth.jsx';
import { toast } from '@/components/ui/use-toast';

const StockDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const savedProducts = JSON.parse(localStorage.getItem('admin_products') || '[]');
    const foundProduct = savedProducts.find(p => p.id === id);
    if (foundProduct) {
      setProduct(foundProduct);
    } else {
      navigate('/trading');
    }
  }, [id, navigate]);

  const handleOrder = () => {
    if (!user) {
      toast({
        title: "Harap Login Terlebih Dahulu",
        description: "Anda harus login untuk dapat memesan.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    if (quantity > product.stock) {
      toast({
        title: "Stok Tidak Cukup",
        description: `Stok yang tersedia hanya ${product.stock} ekor.`,
        variant: "destructive",
      });
      return;
    }
    addToCart(product, quantity);
    toast({
      title: "Berhasil Ditambahkan!",
      description: `${quantity} ekor ayam ukuran ${product.weight} telah ditambahkan ke keranjang.`,
    });
    navigate('/cart');
  };

  const getConditionClass = (condition) => {
    if (!condition) return 'bg-gray-100 text-gray-800';
    const lowerCaseCondition = condition.toLowerCase();
    if (lowerCaseCondition.includes('sakit')) return 'bg-red-200 text-red-800 border-red-400';
    if (lowerCaseCondition.includes('penjarangan')) return 'bg-yellow-200 text-yellow-800 border-yellow-400';
    if (lowerCaseCondition.includes('sehat')) return 'bg-green-200 text-green-800 border-green-400';
    return 'bg-gray-200 text-gray-800 border-gray-400';
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Helmet>
        <title>Detail Stok: {product.location} - Pitek Balap</title>
        <meta name="description" content={`Detail stok ayam di ${product.location} dengan ukuran ${product.weight}.`} />
      </Helmet>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link to="/trading" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" /> Kembali ke Daftar Stok
            </Link>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-3xl font-bold">{product.location}</CardTitle>
                    <p className="text-gray-500 flex items-center"><Building className="h-5 w-5 mr-2" />{product.kandang_desc}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div><span className="font-semibold text-gray-500 text-sm flex items-center"><Ruler className="h-5 w-5 mr-2 text-blue-500"/>Ukuran</span><p className="font-bold text-xl">{product.weight} kg</p></div>
                      <div><span className="font-semibold text-gray-500 text-sm flex items-center"><Tag className="h-5 w-5 mr-2 text-blue-500"/>Harga per Kg</span><p className="font-bold text-xl">Rp {Number(product.price).toLocaleString('id-ID')}</p></div>
                      <div><span className="font-semibold text-gray-500 text-sm">Stok Tersedia</span><p className="font-bold text-xl text-green-600">{Number(product.stock).toLocaleString('id-ID')} ekor</p></div>
                      <div><span className="font-semibold text-gray-500 text-sm">Kondisi</span><p><span className={`px-3 py-1 text-sm font-semibold rounded-full border ${getConditionClass(product.condition)}`}>{product.condition}</span></p></div>
                    </div>
                    <div className="border-t pt-6 space-y-4">
                      <div>
                        <span className="font-semibold text-gray-500 text-sm flex items-center mb-1"><MapPin className="h-5 w-5 mr-2 text-blue-500"/>Alamat</span>
                        <p className="text-gray-700">{product.address}</p>
                        {product.maps_link && <a href={product.maps_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm font-semibold">Lihat di Google Maps</a>}
                      </div>
                      <div>
                        <span className="font-semibold text-gray-500 text-sm flex items-center mb-2"><User className="h-5 w-5 mr-2 text-blue-500"/>Penanggung Jawab</span>
                        <div className="text-sm space-y-1">
                          <p className="flex items-center text-gray-700"><span className="w-8">TS</span>: {product.pic?.ts_name || '-'} {product.pic?.ts_phone && <a href={`tel:${product.pic.ts_phone}`} className="ml-auto flex items-center text-blue-600 hover:underline"><Phone className="h-4 w-4 mr-1"/>{product.pic.ts_phone}</a>}</p>
                          <p className="flex items-center text-gray-700"><span className="w-8">FO</span>: {product.pic?.fo_name || '-'} {product.pic?.fo_phone && <a href={`tel:${product.pic.fo_phone}`} className="ml-auto flex items-center text-blue-600 hover:underline"><Phone className="h-4 w-4 mr-1"/>{product.pic.fo_phone}</a>}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="lg:col-span-1">
                <Card className="shadow-lg sticky top-24">
                  <CardHeader><CardTitle>Form Pemesanan</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="quantity">Jumlah Ayam (ekor)</Label>
                      <div className="flex items-center mt-2">
                        <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus className="h-4 w-4" /></Button>
                        <Input id="quantity" type="number" value={quantity} onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))} className="w-20 text-center mx-2" />
                        <Button variant="outline" size="icon" onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}><Plus className="h-4 w-4" /></Button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Stok tersedia: {product.stock} ekor</p>
                    </div>
                    <div className="border-t pt-4 space-y-2">
                      <div className="flex justify-between font-semibold">
                        <span>Estimasi Total</span>
                        <span>Rp {(product.price * quantity).toLocaleString('id-ID')}</span>
                      </div>
                      <p className="text-xs text-gray-500">Harga final berdasarkan berat timbang aktual.</p>
                    </div>
                  </CardContent>
                  <div className="p-6 pt-0 space-y-2">
                    <Button onClick={handleOrder} className="w-full btn-gradient text-lg py-6">
                      <Truck className="h-5 w-5 mr-2" /> Lanjutkan ke Pemesanan
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => user ? navigate('/chat') : navigate('/login')}>
                      <MessageSquare className="h-5 w-5 mr-2" /> Tanya Admin
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </>
  );
};

export default StockDetailPage;