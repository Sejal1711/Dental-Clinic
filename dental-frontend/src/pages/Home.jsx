import React from 'react';
import { motion } from 'framer-motion';
import HospitalMap from '../components/HospitalMap';
import DoctorSchedule from '../components/DoctorSchedule'; // ✅ Import schedule

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
  const isAdmin = localStorage.getItem('role') === 'admin'; // ✅ Check role

  return (
    <div className="w-full">
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

        <div className="flex flex-col md:flex-row justify-center items-center gap-10 px-4">
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

      {/* 🗺 Hospital Map Section */}
      <HospitalMap />

      {/* 🩺 Admin-only Schedule Section */}
      {isAdmin && (
        <section className="mt-12 px-4">
          <DoctorSchedule />
        </section>
      )}
    </div>
  );
};

export default Home; 