import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, FolderMinus } from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '../../hooks/useAuth';

const AdminCoops = () => {
  const [coops, setCoops] = useState([]);
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoop, setEditingCoop] = useState(null);
  const [formData, setFormData] = useState({ name: '', address: '', capacity: '', contactName: '', contactPhone: '' });
  const { token } = useAuth();
  useEffect(() => {
    const fetchCoops = async() => {
      if(!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch('http://localhost:5000/kandang', {
          headers: {'Authorization': `Bearer ${token}`}
        });
        if(!response.ok) throw new Error('Gagal Mengambil Data Kandang');
        const data = await response.json()
        setCoops(data);
      } catch (error) {
        toast({title: "Error", description: error.message, variant: "destructive"})
      } finally {
        setLoading(false);
      }
    };
    fetchCoops();
  }, [token]);

  const saveCoops = (updatedCoops) => {
    localStorage.setItem('admin_coops', JSON.stringify(updatedCoops));
    setCoops(updatedCoops);
  };

  const handleOpenModal = (coop = null) => {
    setEditingCoop(coop);
    setFormData(coop ? { name: coop.name, address: coop.address, capacity: coop.capacity, contactName: coop.contactName, contactPhone: coop.contactPhone } : { name: '', address: '', capacity: '', contactName: '', contactPhone: ''});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCoop(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingCoop
      ? `http://localhost:5000/kandang/${editingCoop._id}`
      : 'http://localhost:5000/kandang';
    const method = editingCoop ? 'PATCH' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers : {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          namaKandang: formData.name,
          alamat: formData.address,
          kapasitas: formData.capacity,
          kontak : {
            nama: formData.contactName,
            nomorTelepon: formData.contactPhone
          }
        })
      });

      const result = await response.json();
      if (!response.ok) throw new Error( result.message ||'Gagal Menyimpan Data')

      if (editingCoop) {
        setCoops(coops.map(c => c._id === editingCoop._id ? result : c))
        toast({title: "Kandang Diperbarui!", description: "Data Kandang Berhasil Diperbarui", variant: "success"})
      } else {
        setCoops([...coops, result]);
        toast({title: "Kandang Ditambahkan!", description: "Data Kandang Baru Berhasil Ditambahkan", variant: "success"})
      }
      handleCloseModal();
    } catch (error) {
      toast({title: "Error", description: error.message, variant: "destructive"});
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus kandang ini?")) {
      try {
        const response = await fetch(`http://localhost:5000/kandang/${id}`, {
          method: 'DELETE',
          headers: {'Authorization': `Bearer ${token}`}
        });

        if(!response.ok) throw new Error('Gagal Menghapus Kandang')
        
        setCoops(coops.filter(c => c._id !== id));
        toast({title: "Kandang Dihapus!", description: "Berhasil Menghapus Kandang", variant: "success"});
      } catch (error) {
        toast({title: "Error", description: error.message, variant: "destructive"})
      }
    }
  };

  return (
    <>
      <Helmet><title>Kelola Kandang - Admin</title></Helmet>
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Kelola Kandang</h1>
                <p className="text-gray-500">Lihat, tambah, atau perbarui data kandang mitra.</p>
              </div>
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => handleOpenModal()} className="bg-red-600 hover:bg-red-700">
                    <Plus className="h-4 w-4 mr-2" /> Tambah Kandang
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingCoop ? 'Edit Kandang' : 'Tambah Kandang Baru'}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="name">Nama Kandang</Label>
                      <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                    </div>
                    <div>
                      <Label htmlFor="address">Alamat</Label>
                      <Input id="address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} required />
                    </div>
                    <div>
                      <Label htmlFor="capacity">Kapasitas (Ekor)</Label>
                      <Input id="capacity" type="number" value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: e.target.value })} required />
                    </div>
                  
                    <div>
                      <Label htmlFor="contactName">Nama Pemilik (Penanggung Jawab)</Label>
                      <Input id="contact" value={formData.contactName} onChange={(e) => setFormData({ ...formData, contactName: e.target.value })} required />
                    </div>
                    <div>
                      <Label htmlFor="contactPhone">Kontak No. Hp</Label>
                      <Input id="contact" value={formData.contactPhone} onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })} required />
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button type="button" variant="outline" onClick={handleCloseModal}>Batal</Button>
                      <Button type="submit">{editingCoop ? 'Simpan Perubahan' : 'Tambah'}</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardHeader><CardTitle>Daftar Kandang Mitra</CardTitle></CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold">Nama Kandang</th>
                        <th className="text-left py-3 px-4 font-semibold">Alamat</th>
                        <th className="text-right py-3 px-4 font-semibold">Kapasitas (Ekor)</th>
                        <th className="text-center py-3 px-4 font-semibold">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {coops.length > 0 ? coops.map(coop => (
                        <tr key={coop._id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <p className="font-medium">{coop.namaKandang}</p>
                            <p className="text-sm text-gray-500">{coop.kontak.nama}: {coop.kontak.nomorTelepon}</p>
                          </td>
                          <td className="py-3 px-4">{coop.alamat}</td>
                          <td className="py-3 px-4 text-right">{Number(coop.kapasitas).toLocaleString('id-ID')}</td>
                          <td className="py-3 px-4">
                            <div className="flex justify-center space-x-2">
                              <Button size="sm" variant="outline" onClick={() => handleOpenModal(coop)}><Edit className="h-4 w-4" /></Button>
                              <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50" onClick={() => handleDelete(coop._id)}><Trash2 className="h-4 w-4" /></Button>
                            </div>
                          </td>
                        </tr>
                      )) : (
                        <tr><td colSpan="4" className="text-center py-10 text-gray-500">Belum ada kandang mitra.</td></tr>
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

export default AdminCoops;