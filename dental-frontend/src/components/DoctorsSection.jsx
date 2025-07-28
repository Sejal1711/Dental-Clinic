import React from 'react';
import { motion } from 'framer-motion';

const doctors = [
  {
    name: 'Dr. Snehal Tawar',
    specialization: '',
    image: '',
  },
  {
    name: 'Dr. ankit Sable',
    specialization: '',
    image: '',
  },
];

const DoctorsSection = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, amount: 0.2 }}
      className="py-20 px-6 md:px-12 bg-white"
    >
      <h2 className="text-4xl font-bold text-center mb-14 text-primary">Meet Our Doctors</h2>
      <div className="flex flex-col md:flex-row justify-center items-center gap-60">
        {doctors.map((doctor, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg p-6 w-full sm:w-[280px] md:w-[340px] hover:shadow-2xl transition-shadow"
          >
            <img
              src={doctor.image}
              alt={doctor.name}
              className="w-full h-64 object-cover rounded-lg mb-5"
            />
            <h3 className="text-2xl font-semibold text-center text-gray-800">{doctor.name}</h3>
            <p className="text-center text-gray-600">{doctor.specialization}</p>
          </div>
        ))}
      </div>
    </motion.section>
  );
};

export default DoctorsSection;
