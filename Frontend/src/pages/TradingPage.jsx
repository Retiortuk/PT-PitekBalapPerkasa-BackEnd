import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Info, MapPin, Phone, Building, User, ShoppingCart, Ruler, Search, MessageSquare, Lock } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useChat } from '@/contexts/ChatContext';
import { toast } from '@/components/ui/use-toast';

const TradingPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { sendMessage } = useChat('admin');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = () => {
      try {
        let savedProducts = JSON.parse(localStorage.getItem('admin_products') || '[]');
        
        // Update stock based on completed orders
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const completedOrders = orders.filter(o => o.status === 'completed');
        
        savedProducts = savedProducts.map(p => {
            const quantitySold = completedOrders.reduce((acc, order) => {
                const item = order.items.find(i => i.id === p.id);
                return acc + (item ? item.quantity : 0);
            }, 0);
            return {...p, stock: p.initialStock - quantitySold};
        });

        setProducts(savedProducts);
      } catch (error) {
        console.error("Failed to parse products from localStorage", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    
    // Initial fetch
    fetchProducts();
    
    // Listen for storage changes to keep data fresh
    window.addEventListener('storage', fetchProducts);
    return () => {
      window.removeEventListener('storage', fetchProducts);
    };
  }, []);

  const handleOrderClick = (product) => {
    if (!user) {
      toast({
        title: "Harap Login Terlebih Dahulu",
        description: "Anda harus login untuk dapat melakukan pemesanan.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    
    addToCart(product, 1);
    toast({
      title: "Berhasil Ditambahkan!",
      description: `1 ekor ayam ukuran ${product.weight} telah ditambahkan ke keranjang.`,
    });
    navigate('/cart');
  };
  
  const handleChatWithAdmin = (product) => {
    if (!user) {
      navigate('/login');
      return;
    }
    const message = `Halo, saya ingin bertanya tentang stok:
Lokasi: ${product.location}
Ukuran: ${product.weight} kg`;
    
    const attachment = {
        type: 'product_inquiry',
        productId: product.id,
        location: product.location,
        weight: product.weight,
        price: product.price,
        stock: product.stock,
        image: 'https://images.unsplash.com/photo-1538971663141-21dd09b2c3dd'
    };

    sendMessage(message, user.id, attachment);
    navigate('/chat');
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      const sizeMatch = product.weight.toLowerCase().includes(lowerCaseSearchTerm);
      const locationMatch = product.location.toLowerCase().includes(lowerCaseSearchTerm);
      return (sizeMatch || locationMatch);
    });
  }, [products, searchTerm]);

  const getConditionClass = (condition) => {
    if (!condition) return 'bg-gray-100 text-gray-800';
    const lowerCaseCondition = condition.toLowerCase();
    if (lowerCaseCondition.includes('sakit')) return 'bg-red-200 text-red-800 border-red-400';
    if (lowerCaseCondition.includes('penjarangan')) return 'bg-yellow-200 text-yellow-800 border-yellow-400';
    if (lowerCaseCondition.includes('sehat')) return 'bg-green-200 text-green-800 border-green-400';
    return 'bg-gray-200 text-gray-800 border-gray-400';
  };

  return (
    <>
      <Helmet>
        <title>Informasi Stok - Pitek Balap</title>
        <meta name="description" content="Lihat informasi stok ayam yang tersedia untuk diperdagangkan." />
      </Helmet>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                Informasi Stok Ayam
              </h1>
              <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                Data ketersediaan ayam terkini dari berbagai kandang mitra kami.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="shadow-lg mb-8 border-0 bg-transparent">
                <CardContent className="p-2 md:p-4">
                  <div className="max-w-2xl mx-auto">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400" />
                      <Input 
                        id="search-all" 
                        placeholder="Cari berdasarkan ukuran atau lokasi..." 
                        className="pl-14 pr-4 py-3 h-16 text-lg rounded-full shadow-inner" 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl">Daftar Stok Tersedia</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-semibold text-gray-600">Ukuran (Kg)</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-600">Lokasi</th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-600">Harga/Satuan</th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-600">Stok</th>
                          <th className="text-center py-3 px-4 font-semibold text-gray-600">Keterangan</th>
                          <th className="text-center py-3 px-4 font-semibold text-gray-600">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <tr>
                            <td colSpan="6" className="text-center py-10 text-gray-500">Memuat data...</td>
                          </tr>
                        ) : filteredProducts.length > 0 ? (
                          filteredProducts.map((product) => (
                            <tr key={product.id} className={`border-b hover:bg-gray-50 transition-colors ${product.stock < 1 ? 'opacity-50' : ''}`}>
                              <td className="py-4 px-4 text-gray-600">{product.weight}</td>
                              <td className="py-4 px-4 font-medium text-gray-800">{product.location}</td>
                              <td className="py-4 px-4 text-right text-gray-600">{user ? `Rp ${Number(product.price).toLocaleString('id-ID')} / ${product.sellingMethod || 'kg'}` : '******'}</td>
                              <td className="py-4 px-4 text-right text-gray-600">{user ? (product.stock > 0 ? `${Number(product.stock).toLocaleString('id-ID')} ekor` : <span className="font-bold text-red-500">Habis</span>) : '******'}</td>
                              <td className="py-4 px-4 text-center">
                                <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getConditionClass(product.condition)}`}>
                                  {product.condition}
                                </span>
                              </td>
                              <td className="py-4 px-4 text-center">
                                {user ? (
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                        <Info className="h-4 w-4 mr-2" />
                                        Rincian
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[650px]">
                                      <DialogHeader>
                                        <DialogTitle className="text-2xl font-bold">{product.location}</DialogTitle>
                                      </DialogHeader>
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                                        <div className="space-y-4">
                                          <div><span className="font-semibold text-gray-500 text-sm">Ukuran</span><p className="font-bold text-lg text-gray-900 flex items-center"><Ruler className="h-5 w-5 mr-2 text-blue-500"/>{product.weight} kg</p></div>
                                          <div><span className="font-semibold text-gray-500 text-sm">Stok Tersedia</span><p className={`font-bold text-lg ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>{product.stock > 0 ? `${Number(product.stock).toLocaleString('id-ID')} ekor` : 'Habis'}</p></div>
                                          <div><span className="font-semibold text-gray-500 text-sm">Kondisi</span><p><span className={`px-3 py-1 text-sm font-semibold rounded-full border ${getConditionClass(product.condition)}`}>{product.condition}</span></p></div>
                                        </div>
                                        <div className="space-y-4">
                                          <div><span className="font-semibold text-gray-500 text-sm">Harga per Satuan</span><p className="font-bold text-lg text-gray-900">Rp {Number(product.price).toLocaleString('id-ID')} / {product.sellingMethod || 'kg'}</p></div>
                                          <div><span className="font-semibold text-gray-500 text-sm">Deskripsi Kandang</span><p className="text-gray-700 flex items-center"><Building className="h-5 w-5 mr-2 text-blue-500"/>{product.kandang_desc || '-'}</p></div>
                                        </div>
                                      </div>
                                      <div className="mt-6 border-t pt-6 space-y-4">
                                        <div><span className="font-semibold text-gray-500 text-sm flex items-center mb-1"><MapPin className="h-5 w-5 mr-2 text-blue-500"/> Alamat</span><p className="text-gray-700">{product.address}</p>{product.maps_link && (<a href={product.maps_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm font-semibold">Lihat di Google Maps</a>)}</div>
                                        <div><span className="font-semibold text-gray-500 text-sm flex items-center mb-2"><User className="h-5 w-5 mr-2 text-blue-500"/> Penanggung Jawab</span><div className="text-sm space-y-1"><p className="flex items-center text-gray-700"><span className="w-8">TS</span>: {product.pic?.ts_name || '-'} {product.pic?.ts_phone && <a href={`tel:${product.pic.ts_phone}`} className="ml-auto flex items-center text-blue-600 hover:underline"><Phone className="h-4 w-4 mr-1"/>{product.pic.ts_phone}</a>}</p><p className="flex items-center text-gray-700"><span className="w-8">FO</span>: {product.pic?.fo_name || '-'} {product.pic?.fo_phone && <a href={`tel:${product.pic.fo_phone}`} className="ml-auto flex items-center text-blue-600 hover:underline"><Phone className="h-4 w-4 mr-1"/>{product.pic.fo_phone}</a>}</p></div></div>
                                      </div>
                                      <div className="mt-6 flex justify-between items-center">
                                        <Button variant="outline" onClick={() => handleChatWithAdmin(product)}><MessageSquare className="h-5 w-5 mr-2"/> Tanya Admin</Button>
                                        <Button onClick={() => handleOrderClick(product)} className="btn-gradient" disabled={product.stock < 1}><ShoppingCart className="h-5 w-5 mr-2"/> Lanjutkan ke Pemesanan</Button>
                                      </div>
                                    </DialogContent>
                                  </Dialog>
                                ) : (
                                  <Button size="sm" variant="outline" onClick={() => navigate('/login')}>
                                    <Lock className="h-4 w-4 mr-2" /> Login untuk Lihat
                                  </Button>
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6" className="text-center py-10 text-gray-500">Tidak ada stok yang cocok dengan pencarian Anda.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default TradingPage;