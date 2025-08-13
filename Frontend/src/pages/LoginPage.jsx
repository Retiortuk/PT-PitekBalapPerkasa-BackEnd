import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Default admin account
      const defaultAdmin = {
        id: 'admin',
        name: 'Administrator',
        email: 'admin@pitekbalap.com',
        password: 'admin123',
        role: 'admin'
      };

    try {
      // Connect to Database
      
      const res = await fetch('http://localhost:5000/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      // Jika login Gagal
      if(!res.ok) {
        toast({
          title: "Error",
          description: data.message || "Terjadi kesalahan saat login",
          variant: "destructive"
        });
        // Kalo Sukses 
      } else {
        login(data.user);
        toast ({
          title: "Login Berhasil!",
          description: `Selamat datang, ${data.user.namaLengkap}!`
        });

        if(data.user.jenisAkun === 'Admin') {
          navigate('/admin')
        } else {
          navigate('/dashboard')
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: data.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login - PT. Pitek Balap Perkasa</title>
        <meta name="description" content="Masuk ke akun Anda untuk mengakses platform trading ayam terpercaya." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Beranda
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Card className="shadow-2xl border-0">
              <CardHeader className="text-center pb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-2xl">P</span>
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Masuk ke Akun Anda
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  Selamat datang kembali di platform trading ayam terpercaya
                </p>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Masukkan email Anda"
                      required
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Masukkan password Anda"
                        required
                        className="h-12 pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 btn-gradient text-lg font-semibold"
                    disabled={loading}
                  >
                    {loading ? 'Memproses...' : 'Masuk'}
                  </Button>
                </form>

                <div className="mt-8 text-center">
                  <p className="text-gray-600">
                    Belum punya akun?{' '}
                    <Link to="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
                      Daftar sekarang
                    </Link>
                  </p>
                </div>

                {/* Demo Accounts */}
                {/* <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Akun Demo:</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Admin:</strong> admin@pitekbalap.com / admin123</p>
                    <p><strong>User:</strong> Daftar akun baru sebagai user</p>
                  </div>
                </div> */}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;