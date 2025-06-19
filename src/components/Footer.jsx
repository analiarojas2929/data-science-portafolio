import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaGithub, 
  FaLinkedin, 
  FaGraduationCap, 
  FaEnvelope,
  FaMapMarkerAlt, 
  FaArrowUp,
  FaCode
} from 'react-icons/fa';
import dataIcon from '../assets/icon.png';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  const socialLinks = [
    { 
      icon: <FaGithub />, 
      url: 'https://github.com/analiarojas2929',
      label: 'GitHub',
      color: 'hover:bg-gray-700'
    },
    { 
      icon: <FaLinkedin />, 
      url: 'https://www.linkedin.com/in/analia-rojas-araya-056349205/',
      label: 'LinkedIn',
      color: 'hover:bg-blue-600'
    },
    { 
      icon: <FaEnvelope />, 
      url: 'mailto:analiarojas2929@gmail.com',
      label: 'Email',
      color: 'hover:bg-red-500'
    }
  ];

  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white pt-10 md:pt-16 pb-6 md:pb-8 relative mt-10 md:mt-12 border-t-2 border-blue-600 md:border-t-0"> {/* Añadido borde superior solo en móvil */}
      {/* Patrón de fondo */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute -bottom-2 right-0 w-72 md:w-96 h-72 md:h-96 bg-blue-500 rounded-full filter blur-3xl"></div>
        <div className="absolute -top-20 -left-20 w-60 md:w-72 h-60 md:h-72 bg-purple-500 rounded-full filter blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Botón flotante para móvil */}
        <motion.button 
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 p-3 bg-blue-600 rounded-full text-white shadow-lg hover:bg-blue-700 transition-all md:hidden z-50"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <FaArrowUp />
        </motion.button>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-y-8 md:gap-8 mb-8 md:mb-12">
          {/* Información personal */}
          <motion.div 
            className="sm:col-span-2 md:col-span-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUpVariants}
          >
            <div className="flex items-center mb-3 md:mb-4">
              <img 
                src={dataIcon} 
                alt="Data Science Logo" 
                className="w-8 h-8 md:w-10 md:h-10 mr-2 md:mr-3"
              />
              <h3 className="text-xl md:text-2xl font-bold text-white">Analia Rojas</h3>
            </div>
            <p className="text-gray-300 mb-3 md:mb-4 flex items-center text-sm md:text-base">
              <FaGraduationCap className="mr-2 flex-shrink-0" /> Ingeniera en Informática - DUOC UC
            </p>
            <p className="text-gray-400 mb-4 md:mb-6 text-sm md:text-base">
              Estudiante de Ciencia de Datos en Talento Digital, enfocada en construir 
              soluciones basadas en datos y aprendizaje automático.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((link, index) => (
                <a 
                  key={index}
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={`text-base md:text-lg p-2 rounded-full bg-gray-800 hover:text-white transition-all duration-300 ${link.color}`}
                  aria-label={link.label}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </motion.div>
          
          {/* Enlaces rápidos */}
          <motion.div 
            className="sm:col-span-1 md:col-span-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUpVariants}
          >
            <h4 className="text-base md:text-lg text-white font-semibold mb-3 md:mb-4 border-b border-gray-700 pb-2">Enlaces rápidos</h4>
            <nav className="grid grid-cols-2 sm:grid-cols-1 gap-y-1 gap-x-2">
              <Link to="/" className="text-gray-400 hover:text-blue-300 transition-colors py-1 text-sm md:text-base">Inicio</Link>
              <Link to="/projects" className="text-gray-400 hover:text-blue-300 transition-colors py-1 text-sm md:text-base">Proyectos</Link>
              <Link to="/skills" className="text-gray-400 hover:text-blue-300 transition-colors py-1 text-sm md:text-base">Habilidades</Link>
              <Link to="/contact" className="text-gray-400 hover:text-blue-300 transition-colors py-1 text-sm md:text-base">Contacto</Link>
            </nav>
          </motion.div>
          
          {/* Contacto */}
          <motion.div 
            className="sm:col-span-1 md:col-span-5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUpVariants}
          >
            <h4 className="text-base md:text-lg text-white font-semibold mb-3 md:mb-4 border-b border-gray-700 pb-2">Contacto</h4>
            <div className="flex flex-col space-y-2 md:space-y-3">
              <div className="flex items-center text-sm md:text-base">
                <FaEnvelope className="text-blue-400 mr-2 md:mr-3 flex-shrink-0" />
                <span className="text-gray-300 break-all">analiarojas2929@gmail.com</span>
              </div>
              <div className="flex items-center text-sm md:text-base">
                <FaMapMarkerAlt className="text-blue-400 mr-2 md:mr-3 flex-shrink-0" />
                <span className="text-gray-300">Chile</span>
              </div>
              <div className="flex items-center text-sm md:text-base">
                <FaCode className="text-blue-400 mr-2 md:mr-3 flex-shrink-0" />
                <span className="text-gray-300">Desarrolladora & Data Scientist en formación</span>
              </div>
            </div>
          </motion.div>
        </div>
        
        <div className="pt-6 md:pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-center md:justify-between items-center text-center md:text-left">
          <motion.p 
            className="text-gray-400 text-xs md:text-sm mb-3 md:mb-0"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            © {new Date().getFullYear()} Analia Estefanie Rojas Araya. Todos los derechos reservados.
          </motion.p>
          
          <motion.div 
            className="flex items-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-xs md:text-sm text-gray-500 mr-3 md:mr-4">
              Desarrollado con React y Tailwind CSS
            </p>
            <motion.button 
              onClick={scrollToTop}
              className="hidden md:block p-2 bg-blue-600 rounded-full text-white hover:bg-blue-700 transition-all transform hover:-translate-y-1"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaArrowUp />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;