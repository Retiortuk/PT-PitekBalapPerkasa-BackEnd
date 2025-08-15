import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '../../hooks/useAuth.jsx';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); // secara default loading => true
  const { token } = useAuth();

  useEffect(() => {
    const fethUsers = async () => {
      if(!token) {
        setLoading(false);
        toast({title: "Error", description: "Gagal Token Tidak Ditemukan." , variant: "desctructive"});
        return;
      }
      try {
        const response = await fetch('http://localhost:5000/users', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if(!response.ok) {
          throw new Error('Gagal Mengambil Data Pengguna');
        }

        const data = await response.json();
        setUsers(data);
      } catch (error) {
        toast({title: "Error", description: error.message, variant: "destructive"});
      } finally {
        setLoading(false);
      }
    };
    fethUsers();
  }, [token]);

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus pengguna ini?")) {
      try {
        const response = await fetch(`http://localhost:5000/users/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if(!response.ok) {
          throw new Error('Gagal Menghapus Pengguna');
        }
        setUsers(users.filter(user => user._id !== userId));

        toast({
          title: "Pengguna Dihapus",
          description: "Pengguna Telah Berhasil Dihapus Dari Sistem",
          variant: "success"
        });
      } catch (error) {
        toast({title: "Error", description: error.message, variant: "destructive"})
      }
    }
  };

  const getRoleColor = (role) => {
    switch(role) {
      case 'Admin':
        return 'bg-red-200 text-orange-900';
      case 'Peternak':
        return 'bg-orange-100 text-orange-800';
      case 'Pembeli':
        default:
          return 'bg-blue-100 text-blue-800';
    }
  }

  return (
    <>
      <Helmet><title>Kelola Pengguna - Admin</title></Helmet>
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Kelola Pengguna</h1>
            <p className="text-gray-500 mb-8">Lihat, tambah, atau perbarui data penjual dan pembeli.</p>

            <Card>
              <CardHeader><CardTitle>Daftar Pengguna</CardTitle></CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold">Pengguna</th>
                        <th className="text-left py-3 px-4 font-semibold">Peran</th>
                        <th className="text-left py-3 px-4 font-semibold">Tanggal Bergabung</th>
                        <th className="text-center py-3 px-4 font-semibold">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.length > 0 ? users.map(user => (
                        <tr key={user._id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600">
                                {user.namaLengkap.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-medium">{user.namaLengkap}</p>
                                <p className="text-sm text-gray-500">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.jenisAkun)}`}>
                              {user.jenisAkun}
                            </span>
                          </td>
                          <td className="py-3 px-4">{new Date(user.createdAt).toLocaleDateString('id-ID')}</td>
                          <td className="py-3 px-4 text-center">
                            <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50" onClick={() => handleDeleteUser(user._id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      )) : (
                        <tr><td colSpan="4" className="text-center py-10 text-gray-500">Belum ada pengguna terdaftar.</td></tr>
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

export default AdminUsers;