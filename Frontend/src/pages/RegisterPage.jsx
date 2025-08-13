import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, User, Building, Landmark, Hash, UserSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '', role: '', phone: '', address: '',
    bankName: '', accountNumber: '', accountName: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // HANDLE SUBMIT KE DATABASE
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast({ title: "Error", description: "Password dan konfirmasi password tidak cocok", variant: "destructive" });
      setLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      toast({ title: "Error", description: "Password minimal 6 karakter", variant: "destructive" });
      setLoading(false);
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.email === formData.email)) {
      toast({ title: "Error", description: "Email sudah terdaftar", variant: "destructive" });
      setLoading(false);
      return;
    }

    try {
      
      // API DATABASE USER
      const res = await fetch('http://localhost:5000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          jenisAkun: formData.role,
          namaLengkap: formData.name,
          email: formData.email,
          password: formData.password,
          nomorTelepon: formData.phone,
          alamat: formData.address,
          namaBank: formData.bankName,
          nomorRekening: formData.accountNumber,
          namaPemilikRekening: formData.accountName
        })
      });
      
      if(!res.ok) throw new Error('Gagal Registrasi');

      const data = await res.json();

      toast({ title: "Registrasi Berhasil!", description: `Selamat datang, ${data.namaLengkap}!` });
      navigate(formData.role === 'admin' ? '/admin' : '/dashboard');
    } catch (error) {
      toast({ title: "Error", description: "Terjadi kesalahan saat registrasi", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Daftar - PT. Pitek Balap Perkasa</title>
        <meta name="description" content="Daftar akun baru untuk mengakses platform trading ayam terpercaya." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">

        <div className="w-full max-w-lg">
          <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"><ArrowLeft className="h-4 w-4 mr-2" />Kembali</Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="shadow-2xl border-0">
              <CardHeader className="text-center pb-6">
                <img src="https://horizons-cdn.hostinger.com/e17b5b5d-3b23-492e-8a50-f08715bdc0dd/534c3c26a2b5b5906b17544c64ebfeac.png" alt="Logo" className="h-16 mx-auto mb-4" />
                <CardTitle className="text-2xl font-bold text-gray-900">Buat Akun Baru</CardTitle>
                <CardDescription>Bergabunglah dengan platform trading ayam terpercaya</CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                    {/* Jenis Akun */}
                    <Label>Jenis Akun</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {/* Pembeli */}
                      <button type="button" onClick={() => setFormData({ ...formData, role: 'Pembeli' })} className={`p-4 rounded-lg border-2 flex flex-col items-center justify-center transition-all ${formData.role === 'Pembeli' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'}`}>
                        <User className="h-6 w-6 mb-1" /> <span className="text-sm font-medium">Pembeli</span>
                      </button>
                      {/* Peternak */}
                      <button type="button" onClick={() => setFormData({ ...formData, role: 'Peternak' })} className={`p-4 rounded-lg border-2 flex flex-col items-center justify-center transition-all ${formData.role === 'Peternak' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-200 hover:border-gray-300'}`}>
                        <Building className="h-6 w-6 mb-1" /> <span className="text-sm font-medium">Peternak</span>
                      </button>
                    </div>
                  </div>

                  {/* Data-Data User */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2"><Label htmlFor="name">Nama Lengkap</Label><Input id="name" name="name" value={formData.name} onChange={handleChange} required /></div>
                    <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required /></div>
                    <div className="space-y-2"><Label htmlFor="phone">Nomor Telepon</Label><Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required /></div>
                    <div className="space-y-2"><Label htmlFor="address">Alamat</Label><Input id="address" name="address" value={formData.address} onChange={handleChange} required /></div>
                  </div>

                  {/* INFO BANK */}
                  <fieldset className="border p-4 rounded-lg">
                    <legend className="text-sm font-medium px-1">Informasi Bank (Untuk Verifikasi)</legend>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <div className="space-y-2"><Label htmlFor="bankName">Nama Bank</Label><Input id="bankName" name="bankName" value={formData.bankName} onChange={handleChange} placeholder="cth: BCA" required /></div>
                        <div className="space-y-2"><Label htmlFor="accountNumber">Nomor Rekening</Label><Input id="accountNumber" name="accountNumber" value={formData.accountNumber} onChange={handleChange} required /></div>
                        <div className="space-y-2 md:col-span-2"><Label htmlFor="accountName">Nama Pemilik Rekening</Label><Input id="accountName" name="accountName" value={formData.accountName} onChange={handleChange} required /></div>
                    </div>
                  </fieldset>

                  {/*Password  */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2"><Label htmlFor="password">Password</Label><div className="relative"><Input id="password" name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} required /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">{showPassword ? <EyeOff /> : <Eye />}</button></div></div>
                    <div className="space-y-2"><Label htmlFor="confirmPassword">Konfirmasi Password</Label><div className="relative"><Input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={handleChange} required /><button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">{showConfirmPassword ? <EyeOff /> : <Eye />}</button></div></div>
                  </div>
                  
                  <Button type="submit" className="w-full h-12 btn-gradient text-lg font-semibold" disabled={loading}>{loading ? 'Memproses...' : 'Daftar Sekarang'}</Button>
                </form>

                <div className="mt-6 text-center"><p className="text-gray-600">Sudah punya akun? <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold">Masuk</Link></p></div>
              
              </CardContent>
            
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;