import React from 'react';
import { FiPhone, FiMail, FiMapPin } from 'react-icons/fi';
import Logo from '../assets/LogoBlack.png'; // adjust path if needed

const Footer = () => {
  return (
    <footer className="bg-white text-green-800 px-6 py-10">
      <div className="max-w-7xl mx-auto grid md:grid-cols-5 gap-8 text-sm">

        {/* Logo & Reach Us */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <img src={Logo} alt="VibeX Logo" className="h-10 w-auto" />
            
          </div>
          <h3 className="text-lg font-semibold mb-4 text-green-700">Reach us</h3>
          <p className="flex items-center gap-2 mb-2 text-green-600">
            <FiPhone /> +102 3456 789
          </p>
          <p className="flex items-center gap-2 mb-2 text-green-600">
            <FiMail /> nestifyforu@gmail.com
          </p>
          <p className="flex items-center gap-2 text-green-600">
            <FiMapPin /> 123 Dartmouth Street, Boston, MA, USA
          </p>
        </div>

        {/* Company */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-green-700">Company</h3>
          <ul className="space-y-2 text-green-600">
            <li>About</li>
            <li>Contact</li>
            <li>Blogs</li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-green-700">Legal</h3>
          <ul className="space-y-2 text-green-600">
            <li>Privacy Policy</li>
            <li>Terms & Services</li>
            <li>Terms of Use</li>
            <li>Refund Policy</li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-green-700">Quick Links</h3>
          <ul className="space-y-2 text-green-600">
            <li>Techstack / Employee</li>
            <li>Downloads</li>
            <li>Forum</li>
          </ul>
        </div>

        {/* Empty Space or Future Use */}
        <div className="hidden md:block" />
      </div>

      <hr className="my-8 border-green-200" />

      <div className="text-center text-green-500 text-xs">
        © {new Date().getFullYear()} VibeX. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
