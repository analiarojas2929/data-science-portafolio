import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa';
import dataIcon from '../assets/icon.png';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Inicio' },
    { path: '/projects', label: 'Proyectos' },
    { path: '/skills', label: 'Habilidades' },
    { path: '/data-analytics', label: 'Análisis de Datos' }, // Nueva página
    { path: '/contact', label: 'Contacto' }
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed w-full z-50 transition-all duration-300 bg-gray-900 py-2 shadow-md"
    >
      <div className="navbar container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <div className="bg-[#C03A74] p-1 rounded-full">
            <img 
              src={dataIcon} 
              alt="Data Science Logo" 
              className="w-10 h-10 rounded-full"
            />
          </div>
          <span className="text-xl font-bold">
            <span className="hidden namee sm:inline">Analia Rojas</span>
            <span className="sm:hidden namee">AR</span>
          </span>
        </Link>

        {/* Enlaces de navegación para escritorio */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Botón de menú móvil */}
        <button 
          className="md:hidden text-white p-2 focus:outline-none bg-[#C03A74] rounded-md"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Menú móvil */}
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-gray-900 border-t border-gray-800"
        >
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`p-2 ${
                  location.pathname === link.path 
                    ? 'bg-[#C03A74] text-white rounded-md' 
                    : 'text-white hover:bg-gray-800 hover:text-[#4285F4] rounded-md'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;