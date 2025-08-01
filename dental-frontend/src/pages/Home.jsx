import React from 'react';
import { motion } from 'framer-motion';
import HospitalMap from '../components/HospitalMap';
import DoctorSchedule from '../pages/DoctorSchedule';

const doctors = [
  {
    name: 'Dr. Snehal Tawar',
    image: 'dr1.jpg',
    specialization: 'Dentist',
  },
  {
    name: 'Dr. Ankit Sable',
    image: 'dr2.jpg',
    specialization: 'Dentist',
  },
];

const Home = () => {
  const isAdmin = localStorage.getItem('role') === 'admin';

  return (
    <div className="w-full bg-gray-50 text-gray-800">
      {/* Hero Section with Video */}
      <div className="relative w-full h-screen overflow-hidden">
        <video
          className="w-full h-full object-cover"
          src="clinic1.mp4"
          autoPlay
          muted
          loop
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <h1 className="text-white text-4xl md:text-5xl font-bold text-center px-4">
            Welcome to Morya Dental Clinic
          </h1>
        </div>
      </div>

      {/* Doctors Section */}
      <section className="py-20 bg-gray-200 border-t border-gray-300">
        <motion.h2
          className="text-4xl font-bold text-center text-gray-800 mb-14"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ amount: 0.4 }}
        >
          Meet Our Doctors
        </motion.h2>

        <div className="relative max-w-4xl mx-auto h-[700px]">
          {/* Doctor 1 card positioned top-left */}
          <motion.div
            className="absolute top-0 left-0 bg-white border border-gray-300 rounded-xl shadow-md w-80"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ amount: 0.3 }}
          >
            <img
              src={doctors[0].image}
              alt={doctors[0].name}
              className="w-full h-64 object-cover rounded-t-xl"
            />
            <div className="p-4 text-center">
              <h3 className="text-xl font-semibold text-gray-900">{doctors[0].name}</h3>
              <p className="text-gray-600 mt-1">{doctors[0].specialization}</p>
            </div>
          </motion.div>

          {/* Doctor 2 card positioned bottom-right */}
          <motion.div
            className="absolute bottom-0 right-0 bg-white border border-gray-300 rounded-xl shadow-md w-80"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ amount: 0.3 }}
          >
            <img
              src={doctors[1].image}
              alt={doctors[1].name}
              className="w-full h-64 object-cover rounded-t-xl"
            />
            <div className="p-4 text-center">
              <h3 className="text-xl font-semibold text-gray-900">{doctors[1].name}</h3>
              <p className="text-gray-600 mt-1">{doctors[1].specialization}</p>
            </div>
          </motion.div>
        </div>
        <br></br>
        <br></br>
    

        {/* Hospital Map */}
        <HospitalMap />
      </section>

      {/* Admin-only Schedule Section */}
      {isAdmin && (
        <section className="py-16 bg-gray-200 border-t border-gray-300">
          <h2 className="text-3xl text-center font-semibold text-gray-800 mb-8">
            Doctor Schedule
          </h2>
          <div className="px-4 max-w-6xl mx-auto">
            <DoctorSchedule />
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;