import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '../../hooks/useAuth';

const AdminStock = () => {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const {token} = useAuth();

  const initialFormState = {
    id: null,namaKandang: '', location: '', kandang_desc: '', address: '', maps_link: '',
    pic: { ts_name: '', ts_phone: '', fo_name: '', fo_phone: '' },
    weight: '', size: '', price: '', stock: '', condition: 'Sehat', sellingMethod: 'kg', initialStock: 0
  };
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    const fetchStocks = async () => {
      if(!token) {
        setLoading(false);
        return;
      }
      try {
        const response =  await fetch('http://localhost:5000/stok', {
          headers : {'Authorization': `Bearer ${token}`}
        })
        if(!response.ok) throw new Error('Gagal Mengambil Data Stok');
        const data = await response.json()
        setProducts(data)
      } catch (error) {
        toast({title: "Error", description: error.message, variant: "destructive"});
      } finally {
        setLoading(false)
      }
    };
    fetchStocks();
  }, [token]);

  const saveProductsToLocalStorage = (updatedProducts) => {
    localStorage.setItem('admin_products', JSON.stringify(updatedProducts));
    setProducts(updatedProducts);
  };

  const openModal = (product = null) => {
    if (product) {
      setCurrentProduct(product);
      setFormData({ ...product, pic: product.pic || { ts_name: '', ts_phone: '', fo_name: '', fo_phone: '' } });
    } else {
      setCurrentProduct(null);
      setFormData(initialFormState);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = currentProduct
    ? `http://localhost:5000/stok/${currentProduct._id}`
    : 'http://localhost:5000/stok';
    const method = currentProduct ? 'PATCH' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers : {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          _id : formData.id,
          namaKandang: formData.namaKandang,
          deskripsi: formData.kandang_desc,
          alamatLengkap: formData.address,
          ukuran: formData.size,
          stokAwal: formData.stock,
          metodeJual: formData.sellingMethod,
          hargaSatuan: formData.price,
          kondisi: formData.condition
        }) 
      });
      if(!response.ok) throw new Error(result.error ||"Gagal Upload Data Stok");
      const result = await response.json();

      if(currentProduct) {
        setProducts(products.map(c => c._id === currentProduct._id ? result : c));
        toast({title: "Update Berhasil!", description: "Stok Berhasil Di Update!", variant: "success"})
      } else {
        setProducts([...products, result]);
        toast({title: "Stok Baru Ditambahkan!", description: "Berhasil Menambahkan Stok!", variant: "success"})
      }
      setIsModalOpen(false)
    } catch (error) {
      toast({title: "Error", description: error.message, variant: "destructive"});
    }
  };

  const handleDelete = async(productId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus stok ini?')) {
      try {
        const response =  await fetch(`http://localhost:5000/stok/${productId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}`}
        });
        if(!response.ok) throw new Error("Gagal Menghapus Stok");
        setProducts(products.filter(p => p._id !== productId));
        toast({title: "Berhasil Menghapus!", description: "Stok Berhasil Dihapus", variant: "success"})
      } catch (error) {
        toast({title: "Error", description: error.message, variant: "destructive"})
      }
    }
  };
  
  const getConditionClass = (condition) => {
    const lowerCaseCondition = (condition || '').toLowerCase();
    if (lowerCaseCondition.includes('sakit')) return 'bg-red-100 text-red-800';
    if (lowerCaseCondition.includes('penjarangan')) return 'bg-yellow-100 text-yellow-800';
    if (lowerCaseCondition.includes('sehat')) return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <>
      <Helmet><title>Kelola Stok - Admin</title></Helmet>
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800">Kelola Stok Kandang</h1>
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild><Button className="btn-gradient"><PlusCircle className="mr-2 h-5 w-5" /> Tambah Stok</Button></DialogTrigger>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader><DialogTitle>{currentProduct ? 'Edit Stok' : 'Tambah Stok Baru'}</DialogTitle></DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div><Label>Nama Kandang</Label><Input name="location" value={formData.namaKandang} onChange={e => setFormData({...formData, namaKandang: e.target.value})} required /></div>
                          <div><Label>Deskripsi Kandang</Label><Input name="kandang_desc" value={formData.kandang_desc} onChange={e => setFormData({...formData, kandang_desc: e.target.value})} /></div>
                        </div>
                        <div><Label>Alamat Lengkap</Label><Textarea name="address" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} /></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> 
                            <div><Label>Bobot Rata-rata (cth: 0.8-1.0 Kg)</Label><Input name="weight" value={formData.size} onChange={e => setFormData({...formData, size: e.target.value})} required /></div>
                            <div><Label>Stok Awal (Ekor)</Label><Input name="stock" type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value, initialStock: currentProduct ? formData.initialStock : Number(e.target.value)})} required /></div>
                            <div><Label>Metode Jual</Label><Select onValueChange={v => setFormData({...formData, sellingMethod: v})} value={formData.sellingMethod}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="Per Kg">Per Kg</SelectItem><SelectItem value="Per Ekor">Per Ekor</SelectItem></SelectContent></Select></div>
                            <div><Label>Harga per Satuan</Label><Input name="price" type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required /></div>
                        </div>
                        <div><Label>Kondisi</Label><Select onValueChange={v => setFormData({...formData, condition: v})} value={formData.condition}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="Sehat">Sehat</SelectItem><SelectItem value="Penjarangan">Penjarangan</SelectItem><SelectItem value="Sakit">Sakit</SelectItem></SelectContent></Select></div>
                        <div className="flex justify-end space-x-2 pt-4"><Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Batal</Button><Button type="submit">{currentProduct ? 'Simpan' : 'Tambah'}</Button></div>
                    </form>
                </DialogContent>
              </Dialog>
            </div>
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Daftar Stok Saat Ini</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Container ini yang membuat tabel bisa digulir ke samping di layar kecil */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm"> {/* Memberi ukuran teks dasar */}
                      <thead>
                        <tr className="border-b">
                          {/* Terapkan perataan teks yang konsisten di header */}
                          <th className="p-3 text-left font-semibold">Kandang</th>
                          <th className="p-3 text-left font-semibold max-w-[305px]">Lokasi</th> {/* CONTOH KOLOM BARU */}
                          <th className="p-3 text-left font-semibold">Ukuran</th>
                          <th className="p-3 text-right font-semibold">Harga</th> {/* Rata kanan untuk angka */}
                          <th className="p-3 text-right font-semibold">Stok</th> {/* Rata kanan untuk angka */}
                          <th className="p-3 text-center font-semibold">Kondisi</th>
                          <th className="p-3 text-center font-semibold">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Tampilkan loading atau data */}
                        {loading ? (
                          <tr><td colSpan="7" className="text-center py-10 text-gray-500">Memuat data...</td></tr>
                        ) : products.length > 0 ? products.map(product => (
                          <tr key={product._id} className="border-b hover:bg-gray-50">
                            {/* Sel untuk data Kandang */}
                            <td className="p-3 align-top"> {/* align-top agar rapi jika teks panjang */}
                              <div className="font-semibold text-gray-800">{product.namaKandang}</div>
                            </td>
                            
                            {/* Sel untuk data Lokasi*/}
                            <td className="p-3 text-left align-top max-w-[305px]">
                              <div className="font-medium text-gray-800">
                                {product.alamatLengkap}
                              </div>
                            </td>

                            {/* Sel untuk data Ukuran */}
                            <td className="p-3 text-left align-top font-semibold">{product.ukuran} Kg</td>
                            
                            {/* Sel untuk data Harga (RATA KANAN) */}
                            <td className="p-3 text-right align-top font-semibold">
                              Rp {Number(product.hargaSatuan).toLocaleString('id-ID')} / {product.metodeJual}
                            </td>
                            
                            {/* Sel untuk data Stok (RATA KANAN) */}
                            <td className="p-3 text-right align-top font-semibold">
                              {Number(product.stokAwal).toLocaleString('id-ID')} ekor
                            </td>
                            
                            {/* Sel untuk data Kondisi (RATA TENGAH) */}
                            <td className="p-3 text-center align-top">
                              <span className={`px-2 py-1 text-xs rounded-full ${getConditionClass(product.kondisi)}`}>
                                {product.kondisi}
                              </span>
                            </td>
                            
                            {/* Sel untuk Tombol Aksi (RATA TENGAH) */}
                            <td className="p-3 text-center align-top">
                              <div className="flex justify-center items-center space-x-2">
                                <Button size="sm" variant="outline" onClick={() => openModal(product)}><Edit className="h-4 w-4" /></Button>
                                <Button size="sm" variant="destructive" onClick={() => handleDelete(product._id)}><Trash2 className="h-4 w-4" /></Button>
                              </div>
                            </td>
                          </tr>
                        )) : (
                          <tr><td colSpan="7" className="text-center py-10 text-gray-500">Belum ada data stok.</td></tr>
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

export default AdminStock;