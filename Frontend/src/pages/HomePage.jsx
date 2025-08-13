import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const HomePage = () => {
  const bgImage = 'https://horizons-cdn.hostinger.com/e17b5b5d-3b23-492e-8a50-f08715bdc0dd/47836679ceeedbcb3729f999593767d0.png';

  return (
    <>
      <Helmet>
        <title>PT. Pitek Balap Perkasa - Revolusi Trading Ayam</title>
        <meta name="description" content="Platform modern untuk jual beli ayam berkualitas. Cepat, aman, dan menguntungkan bagi peternak dan pedagang di seluruh Indonesia." />
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <section
            className="relative bg-cover bg-center text-white h-[calc(100vh-4rem)] flex items-center justify-center"
            style={{ backgroundImage: `url(${bgImage})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-purple-900/80"></div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative z-10 text-center px-4"
            >
              <img src="https://horizons-cdn.hostinger.com/e17b5b5d-3b23-492e-8a50-f08715bdc0dd/534c3c26a2b5b5906b17544c64ebfeac.png" alt="Pitek Balap Logo" className="h-24 mx-auto mb-6" />
              <h1 className="text-4xl md:text-7xl font-bold tracking-tight">
                Revolusi Trading Ayam
              </h1>
              <p className="mt-6 text-lg md:text-xl max-w-3xl mx-auto text-blue-100">
                Platform modern untuk jual beli ayam berkualitas. Cepat, aman, dan menguntungkan bagi peternak dan pedagang di seluruh Indonesia.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/trading">
                  <Button size="lg" className="btn-gradient w-full sm:w-auto">
                    Lihat Stok Sekarang <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/about">
                   <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-700 w-full sm:w-auto">
                    Pelajari Lebih Lanjut
                  </Button>
                </Link>
              </div>
            </motion.div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default HomePage;