import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Check, X, Eye, Landmark, Hash, UserSquare2 } from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const AdminVerification = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = () => {
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    setUsers(allUsers.filter(user => user.role !== 'admin').sort((a,b) => {
        if(a.verificationStatus === 'pending') return -1;
        if(b.verificationStatus === 'pending') return 1;
        return 0;
    }));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleVerification = (userId, isApproved) => {
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = allUsers.map(user =>
      user.id === userId ? { ...user, verificationStatus: isApproved ? 'approved' : 'rejected', isVerified: isApproved } : user
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    fetchUsers();
    toast({
      title: `Verifikasi ${isApproved ? 'Disetujui' : 'Ditolak'}`,
      description: `Status verifikasi untuk pengguna telah diperbarui.`,
    });
  };
  
  const getStatusBadge = (status) => {
    const statusMap = {
      approved: { text: "Disetujui", color: "bg-green-100 text-green-800" },
      pending: { text: "Tertunda", color: "bg-yellow-100 text-yellow-800" },
      rejected: { text: "Ditolak", color: "bg-red-100 text-red-800" },
      not_submitted: { text: "Belum Diajukan", color: "bg-gray-100 text-gray-800" },
    };
    return statusMap[status] || statusMap.not_submitted;
  };

  return (
    <>
      <Helmet><title>Verifikasi Pengguna - Admin</title></Helmet>
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Verifikasi Pengguna</h1>
            <p className="text-gray-500 mb-8">Tinjau dan verifikasi dokumen identitas pengguna.</p>
            <Card>
              <CardHeader><CardTitle>Daftar Pengguna & Status Verifikasi</CardTitle></CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b"><th className="text-left py-3 px-4 font-semibold">Pengguna</th><th className="text-left py-3 px-4 font-semibold">Status</th><th className="text-center py-3 px-4 font-semibold">Aksi</th></tr>
                    </thead>
                    <tbody>
                      {users.length > 0 ? users.map(user => {
                        const status = getStatusBadge(user.verificationStatus);
                        return (
                        <tr key={user.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4"><p className="font-medium">{user.name}</p><p className="text-sm text-gray-500">{user.email}</p></td>
                          <td className="py-3 px-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${status.color}`}>{status.text}</span></td>
                          <td className="py-3 px-4">
                            <div className="flex justify-center space-x-2">
                              <Dialog>
                                <DialogTrigger asChild><Button size="sm" variant="outline"><Eye className="h-4 w-4 mr-2" />Detail</Button></DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                  <DialogHeader><DialogTitle>Detail Verifikasi: {user.name}</DialogTitle></DialogHeader>
                                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <CardDescription>Informasi Bank</CardDescription>
                                        <div className="mt-2 space-y-3">
                                            <div className="flex items-center space-x-3"><Landmark className="h-5 w-5 text-gray-400" /><div><p className="text-xs text-gray-500">Bank</p><p className="font-medium">{user.bankInfo?.bankName || '-'}</p></div></div>
                                            <div className="flex items-center space-x-3"><Hash className="h-5 w-5 text-gray-400" /><div><p className="text-xs text-gray-500">No. Rekening</p><p className="font-medium">{user.bankInfo?.accountNumber || '-'}</p></div></div>
                                            <div className="flex items-center space-x-3"><UserSquare2 className="h-5 w-5 text-gray-400" /><div><p className="text-xs text-gray-500">Pemilik</p><p className="font-medium">{user.bankInfo?.accountName || '-'}</p></div></div>
                                        </div>
                                    </div>
                                    <div>
                                        <CardDescription>Dokumen KTP</CardDescription>
                                        {user.verificationDoc ? <img className="w-full mt-2 rounded border" alt={`Dokumen verifikasi`} src={user.verificationDoc} /> : <p className="text-sm mt-2 text-gray-500">Dokumen belum diunggah.</p>}
                                    </div>
                                  </div>
                                  {user.verificationStatus === 'pending' && (
                                    <div className="flex justify-end space-x-2 mt-6">
                                      <Button variant="destructive" onClick={() => handleVerification(user.id, false)}><X className="h-4 w-4 mr-2" /> Tolak</Button>
                                      <Button className="bg-green-600 hover:bg-green-700" onClick={() => handleVerification(user.id, true)}><Check className="h-4 w-4 mr-2" /> Setujui</Button>
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>
                              {user.verificationStatus === 'pending' && <>
                                <Button size="sm" variant="outline" className="text-green-600 hover:bg-green-50" onClick={() => handleVerification(user.id, true)}><Check className="h-4 w-4" /> Setujui</Button>
                                <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50" onClick={() => handleVerification(user.id, false)}><X className="h-4 w-4" /> Tolak</Button>
                              </>}
                            </div>
                          </td>
                        </tr>
                      )}) : (
                        <tr><td colSpan="3" className="text-center py-10 text-gray-500">Tidak ada pengguna untuk diverifikasi.</td></tr>
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

export default AdminVerification;