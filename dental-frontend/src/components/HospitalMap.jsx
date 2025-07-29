import React from 'react';

const HospitalMap = () => {
  return (
    <section className="py-16 bg-white">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold">Find Us Here</h2>
        <p className="text-gray-600 mt-2">Location of Morya Dental Clinic</p>
      </div>
      <div className="w-full max-w-4xl mx-auto px-4">
        <div
          style={{
            width: '100%',
            height: 0,
            paddingBottom: '56.25%', // 16:9 aspect ratio
            position: 'relative',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
            border: '4px solid #333', // dark gray border
            backgroundColor: '#f9fafb',
          }}
        >
          <iframe
            title="Morya Dental Clinic Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3780.961145834447!2d75.91599491535546!3d19.19514175427618!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bdba3daa1069a55%3A0x95331895a5184ec1!2sMorya%20Dental%20clinic!5e0!3m2!1sen!2sin!4v1701165913493!5m2!1sen!2sin"
            style={{
              border: 0,
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              borderRadius: '12px',
            }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
};

export default HospitalMap;
