import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Users, Target, Eye, ShieldCheck } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const AboutPage = () => {
  const teamMembers = [{
    name: 'Heribertus Heri',
    role: 'CEO & Founder',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200'
  }, {
    name: 'Budi Santoso',
    role: 'Chief Technology Officer',
    image: 'https://images.unsplash.com/photo-1557862921-37829c790f19?w=200'
  }, {
    name: 'Siti Aminah',
    role: 'Head of Operations',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200'
  }, {
    name: 'Agung Pribowo',
    role: 'Marketing Director',
    image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200'
  }];
  return <>
      <Helmet>
        <title>Tentang Kami - PT. Pitek Balap Perkasa</title>
        <meta name="description" content="Pelajari lebih lanjut tentang PT. Pitek Balap Perkasa, visi, misi, dan tim di balik platform trading ayam terpercaya di Indonesia." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />

        <main className="flex-grow">
          <section className="relative py-24 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
            <div className="absolute inset-0 bg-black opacity-20"></div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <motion.h1 initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.8
            }} className="text-4xl md:text-6xl font-bold">
                Tentang PT. Pitek Balap Perkasa
              </motion.h1>
              <motion.p initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.8,
              delay: 0.2
            }} className="mt-4 text-lg md:text-xl max-w-3xl mx-auto">
                Merevolusi industri peternakan ayam melalui teknologi dan inovasi untuk kesejahteraan bersama.
              </motion.p>
            </div>
          </section>

          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <motion.div initial={{
                opacity: 0,
                x: -50
              }} whileInView={{
                opacity: 1,
                x: 0
              }} viewport={{
                once: true
              }} transition={{
                duration: 0.8
              }}>
                  <img className="rounded-lg shadow-2xl w-full h-auto object-cover" alt="Peternakan ayam modern" src="https://images.unsplash.com/photo-1538971663141-21dd09b2c3dd" />
                </motion.div>
                <motion.div initial={{
                opacity: 0,
                x: 50
              }} whileInView={{
                opacity: 1,
                x: 0
              }} viewport={{
                once: true
              }} transition={{
                duration: 0.8
              }}>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Cerita Kami
                  </h2>
                  <p className="text-gray-600 leading-relaxed mb-4">PT. Pitek Balap Perkasa didirikan pada tahun 2020 dengan sebuah ide sederhana: memberdayakan peternak ayam lokal dan menstabilkan rantai pasok nasional melalui platform digital yang transparan dan efisien. 
                </p>
                  <p className="text-gray-600 leading-relaxed">
                    Kami melihat tantangan yang dihadapi peternak dalam mengakses pasar yang adil dan pedagang dalam mendapatkan pasokan berkualitas. Dari situlah, kami membangun sebuah ekosistem yang menghubungkan keduanya secara langsung, memotong perantara yang tidak perlu, dan memastikan harga yang kompetitif serta kualitas yang terjamin.
                  </p>
                </motion.div>
              </div>
            </div>
          </section>

          <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div initial={{
              opacity: 0,
              y: 50
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              duration: 0.8,
              delay: 0
            }} className="text-center p-8 bg-white rounded-lg shadow-md">
                <Target className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Misi Kami</h3>
                <p className="text-gray-600">
                  Menyediakan platform trading ayam yang inovatif, andal, dan mudah diakses untuk meningkatkan profitabilitas peternak dan efisiensi pedagang.
                </p>
              </motion.div>
              <motion.div initial={{
              opacity: 0,
              y: 50
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              duration: 0.8,
              delay: 0.2
            }} className="text-center p-8 bg-white rounded-lg shadow-md">
                <Eye className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Visi Kami</h3>
                <p className="text-gray-600">
                  Menjadi pilar utama dalam transformasi digital industri peternakan ayam di Asia Tenggara, menciptakan ekosistem yang adil dan berkelanjutan.
                </p>
              </motion.div>
              <motion.div initial={{
              opacity: 0,
              y: 50
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              duration: 0.8,
              delay: 0.4
            }} className="text-center p-8 bg-white rounded-lg shadow-md">
                <ShieldCheck className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Nilai Kami</h3>
                <p className="text-gray-600">
                  Integritas, Inovasi, Kemitraan, dan Keberlanjutan adalah empat pilar yang menopang setiap langkah kami.
                </p>
              </motion.div>
            </div>
          </section>

          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Tim Profesional Kami
                </h2>
                <p className="mt-4 text-lg text-gray-600">
                  Orang-orang hebat di balik kesuksesan PT. Pitek Balap Perkasa.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {teamMembers.map((member, index) => <motion.div key={index} initial={{
                opacity: 0,
                scale: 0.8
              }} whileInView={{
                opacity: 1,
                scale: 1
              }} viewport={{
                once: true
              }} transition={{
                duration: 0.5,
                delay: index * 0.1
              }} className="text-center">
                    <img src={member.image} alt={member.name} className="w-32 h-32 rounded-full mx-auto mb-4 object-cover shadow-lg" />
                    <h4 className="text-xl font-bold text-gray-900">{member.name}</h4>
                    <p className="text-blue-600">{member.role}</p>
                  </motion.div>)}
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>;
};
export default AboutPage;