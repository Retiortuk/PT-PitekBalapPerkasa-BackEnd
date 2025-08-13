import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import Footer from '@/components/Footer';

const ContactPage = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "Pesan Terkirim!",
      description: "Terima kasih telah menghubungi kami. Tim kami akan segera merespons.",
    });
    e.target.reset();
  };

  return (
    <>
      <Helmet>
        <title>Kontak Kami - PT. Pitek Balap Perkasa</title>
        <meta name="description" content="Hubungi tim PT. Pitek Balap Perkasa untuk pertanyaan, dukungan, atau kemitraan. Kami siap membantu Anda." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <section className="py-24 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-4xl md:text-6xl font-bold"
              >
                Hubungi Kami
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mt-4 text-lg md:text-xl max-w-3xl mx-auto"
              >
                Kami senang mendengar dari Anda. Baik itu pertanyaan, masukan, atau peluang kemitraan.
              </motion.p>
            </div>
          </section>

          <section className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="space-y-8"
                >
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Informasi Kontak</h2>
                    <p className="text-gray-600">
                      Jangan ragu untuk menghubungi kami melalui detail di bawah ini.
                    </p>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Alamat Kantor</h3>
                      <p className="text-gray-600">Jl. Jenderal Sudirman Kav. 52-53, Jakarta Selatan, Indonesia</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Email</h3>
                      <p className="text-gray-600">support@pitekbalap.com</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                      <Phone className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Telepon</h3>
                      <p className="text-gray-600">+62 21 1234 5678</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="bg-white p-8 rounded-lg shadow-lg"
                >
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Kirim Pesan</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="name">Nama Lengkap</Label>
                      <Input id="name" type="text" placeholder="John Doe" required className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="john.doe@example.com" required className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="subject">Subjek</Label>
                      <Input id="subject" type="text" placeholder="Subjek pesan Anda" required className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="message">Pesan</Label>
                      <Textarea id="message" placeholder="Tulis pesan Anda di sini..." required className="mt-1" />
                    </div>
                    <Button type="submit" className="w-full btn-gradient text-lg py-3">
                      Kirim Pesan
                    </Button>
                  </form>
                </motion.div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default ContactPage;