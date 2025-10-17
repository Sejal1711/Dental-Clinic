import React from 'react';
import { Phone, Mail, MapPin, Clock, Facebook, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Clinic Info */}
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-3">
                <span className="text-gray-900 text-xl font-bold">🦷</span>
              </div>
              <h3 className="text-xl font-bold">Morya Dental Clinic</h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Providing exceptional dental care with modern technology and compassionate service. 
              Your smile is our priority.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition duration-200">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition duration-200">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition duration-200">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-300 hover:text-white transition duration-200">Home</a></li>
              <li><a href="/book" className="text-gray-300 hover:text-white transition duration-200">Book Appointment</a></li>
              <li><a href="/#services" className="text-gray-300 hover:text-white transition duration-200">Services</a></li>
              <li><a href="/#doctors" className="text-gray-300 hover:text-white transition duration-200">Our Doctors</a></li>
              <li><a href="/#contact" className="text-gray-300 hover:text-white transition duration-200">Contact</a></li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Our Services</h4>
            <ul className="space-y-2">
              <li className="text-gray-300">General Dentistry</li>
              <li className="text-gray-300">Cosmetic Dentistry</li>
              <li className="text-gray-300">Orthodontics</li>
              <li className="text-gray-300">Oral Surgery</li>
              <li className="text-gray-300">Emergency Care</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-blue-400 mr-3" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-blue-400 mr-3" />
                <span className="text-gray-300">info@moryadental.com</span>
              </div>
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-blue-400 mr-3 mt-1" />
                <span className="text-gray-300">123 Dental Street<br />Health City, HC 12345</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-blue-400 mr-3" />
                <span className="text-gray-300">Mon-Fri: 9AM-6PM<br />Sat: 9AM-2PM</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 Morya Dental Clinic. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition duration-200">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition duration-200">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition duration-200">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;