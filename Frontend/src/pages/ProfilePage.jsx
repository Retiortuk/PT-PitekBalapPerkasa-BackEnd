import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Edit, Shield, CheckCircle, AlertTriangle, Clock, Upload, Landmark, Hash, UserSquare2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [verificationFile, setVerificationFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  if (!user) return <div>Loading...</div>;

  const handleFileChange = (e) => setVerificationFile(e.target.files[0]);

  const handleUploadVerification = () => {
    if (!verificationFile) {
      toast({ title: "File belum dipilih", description: "Silakan pilih foto KTP untuk diunggah.", variant: "destructive" });
      return;
    }
    setIsUploading(true);
    setTimeout(() => {
      const reader = new FileReader();
      reader.readAsDataURL(verificationFile);
      reader.onload = () => {
        const updatedUser = { ...user, verificationDoc: reader.result, verificationStatus: 'pending' };
        updateUser(updatedUser);
        setIsUploading(false);
        toast({ title: "Dokumen Terkirim", description: "Dokumen verifikasi Anda sedang ditinjau oleh admin." });
        setVerificationFile(null);
      };
      reader.onerror = () => {
        setIsUploading(false);
        toast({ title: "Gagal Membaca File", variant: "destructive" });
      };
    }, 1500);
  };

  const VerificationStatus = () => {
    const statusMap = {
      approved: { icon: <CheckCircle className="h-5 w-5" />, text: "Akun Terverifikasi", color: "text-green-600 bg-green-100" },
      pending: { icon: <Clock className="h-5 w-5" />, text: "Verifikasi Ditinjau", color: "text-yellow-600 bg-yellow-100" },
      rejected: { icon: <AlertTriangle className="h-5 w-5" />, text: "Verifikasi Ditolak", color: "text-red-600 bg-red-100" },
      not_submitted: { icon: <AlertTriangle className="h-5 w-5" />, text: "Akun Belum Terverifikasi", color: "text-gray-600 bg-gray-100" }
    };
    const currentStatus = statusMap[user.verificationStatus] || statusMap.not_submitted;
    return (
      <div className={`flex items-center space-x-2 p-3 rounded-lg ${currentStatus.color}`}>
        {currentStatus.icon}
        <p className="font-semibold">{currentStatus.text}</p>
      </div>
    );
  };

  return (
    <>
      <Helmet><title>Profil Saya - {user.name}</title></Helmet>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="shadow-xl mb-8">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center space-x-4">
                   <div className="w-20 h-20 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <CardTitle className="text-3xl font-bold flex items-center">
                          {user.name}
                          {user.isVerified && <CheckCircle className="h-6 w-6 text-green-500 ml-2" title="Akun Terverifikasi" />}
                        </CardTitle>
                        <p className="text-gray-500">{user.email}</p>
                    </div>
                </div>
                <Link to="/profile/edit"><Button variant="outline"><Edit className="mr-2 h-4 w-4" /> Edit Profil</Button></Link>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                <div className="flex items-center space-x-3"><User className="h-5 w-5 text-gray-400" /><div><p className="text-sm text-gray-500">Nama</p><p className="font-medium">{user.name}</p></div></div>
                <div className="flex items-center space-x-3"><Mail className="h-5 w-5 text-gray-400" /><div><p className="text-sm text-gray-500">Email</p><p className="font-medium">{user.email}</p></div></div>
                <div className="flex items-center space-x-3"><Phone className="h-5 w-5 text-gray-400" /><div><p className="text-sm text-gray-500">Telepon</p><p className="font-medium">{user.phone || '-'}</p></div></div>
                <div className="flex items-center space-x-3"><Shield className="h-5 w-5 text-gray-400" /><div><p className="text-sm text-gray-500">Peran</p><p className="font-medium">{user.role === 'admin' ? 'Peternak' : 'Pembeli'}</p></div></div>
                <div className="flex items-start space-x-3 md:col-span-2"><MapPin className="h-5 w-5 text-gray-400 mt-1" /><div><p className="text-sm text-gray-500">Alamat</p><p className="font-medium">{user.address || '-'}</p></div></div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="shadow-xl">
                <CardHeader><CardTitle>Informasi Bank</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3"><Landmark className="h-5 w-5 text-gray-400" /><div><p className="text-sm text-gray-500">Nama Bank</p><p className="font-medium">{user.bankInfo?.bankName || '-'}</p></div></div>
                  <div className="flex items-center space-x-3"><Hash className="h-5 w-5 text-gray-400" /><div><p className="text-sm text-gray-500">Nomor Rekening</p><p className="font-medium">{user.bankInfo?.accountNumber || '-'}</p></div></div>
                  <div className="flex items-center space-x-3"><UserSquare2 className="h-5 w-5 text-gray-400" /><div><p className="text-sm text-gray-500">Nama Pemilik</p><p className="font-medium">{user.bankInfo?.accountName || '-'}</p></div></div>
                </CardContent>
              </Card>

              <Card className="shadow-xl">
                <CardHeader><CardTitle>Verifikasi Akun</CardTitle><CardDescription>Verifikasi akun untuk membuka semua fitur.</CardDescription></CardHeader>
                <CardContent>
                  <div className="flex flex-col items-start justify-between gap-4">
                    <VerificationStatus />
                    {(user.verificationStatus === 'not_submitted' || user.verificationStatus === 'rejected') && (
                      <Dialog>
                        <DialogTrigger asChild><Button className="mt-2"><Upload className="mr-2 h-4 w-4" />{user.verificationStatus === 'rejected' ? 'Unggah Ulang Dokumen' : 'Mulai Verifikasi'}</Button></DialogTrigger>
                        <DialogContent>
                          <DialogHeader><DialogTitle>Unggah Dokumen Verifikasi</DialogTitle></DialogHeader>
                          <div className="space-y-4 mt-4">
                            <p className="text-sm text-gray-600">Unggah foto KTP Anda yang jelas dan valid.</p>
                            <Input type="file" onChange={handleFileChange} accept="image/*" />
                            {verificationFile && <p className="text-sm text-gray-500">File: {verificationFile.name}</p>}
                            <Button onClick={handleUploadVerification} disabled={isUploading || !verificationFile} className="w-full">{isUploading ? 'Mengunggah...' : 'Kirim Dokumen'}</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </main>
      </div>
    </>
  );
};

export default ProfilePage;