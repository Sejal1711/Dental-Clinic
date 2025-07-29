import React from 'react';
import { motion } from 'framer-motion';

const doctors = [
  {
    name: 'Dr. Snehal Tawar',
    image: '/images/doctor1.jpg',
    specialization: '',
  },
  {
    name: 'Dr. Ankit Sable',
    image: '/images/doctor2.jpg',
    specialization: '',
  },
];

const Home = () => {
  return (
    <div className="w-full">
     
      <div className="w-full h-screen bg-white flex items-center justify-center overflow-hidden ">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
          src="/clinic.mp4"
          autoPlay
          muted
          loop
          playsInline
        />

        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <h1 className="text-white text-4xl md:text-5xl font-bold">
            Welcome to Morya Dental Clinic
          </h1>
        </div>
      </div>

      {/* Doctors Section */}
      <section className="py-20 bg-gray-50">
        <motion.h2
          className="text-3xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ amount: 0.4 }}
        >
          Meet Our Doctors
        </motion.h2>

        <div className="flex flex-col md:flex-row justify-center items-center gap-40 px-4">
          {doctors.map((doctor, index) => (
            <motion.div
              key={doctor.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ amount: 0.3 }}
              className="bg-white rounded-xl shadow-xl p-6 max-w-xs text-center hover:shadow-2xl transition-shadow duration-300"
            >
              <img
                src={doctor.image}
                alt={doctor.name}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold">{doctor.name}</h3>
              <p className="text-sm text-gray-600">{doctor.specialization}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
