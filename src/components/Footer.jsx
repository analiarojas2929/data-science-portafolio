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
import dataIcon from '../assets/icon.png'; // Importamos el ícono directamente

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
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white pt-16 pb-8 relative mt-12">
      {/* Patrón de fondo */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute -bottom-2 right-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl"></div>
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-purple-500 rounded-full filter blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          {/* Información personal */}
          <motion.div 
            className="md:col-span-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUpVariants}
          >
            <div className="flex items-center mb-4">
              <img 
                src={dataIcon} 
                alt="Data Science Logo" 
                className="w-10 h-10 mr-3"
              />
              <h3 className="text-2xl font-bold text-white">Analia Rojas</h3>
            </div>
            <p className="text-gray-300 mb-4 flex items-center">
              <FaGraduationCap className="mr-2" /> Ingeniera en Informática - DUOC UC
            </p>
            <p className="text-gray-400 mb-6">
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
                  className={`text-lg p-2 rounded-full bg-gray-800 hover:text-white transition-all duration-300 ${link.color}`}
                  aria-label={link.label}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </motion.div>
          
          {/* Enlaces rápidos */}
          <motion.div 
            className="md:col-span-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUpVariants}
          >
            <h4 className="text-lg text-white font-semibold mb-4 border-b border-gray-700 pb-2">Enlaces rápidos</h4>
            <nav className="flex flex-col space-y-2">
              <Link to="/" className="text-gray-400 hover:text-blue-300 transition-colors">Inicio</Link>
              <Link to="/projects" className="text-gray-400 hover:text-blue-300 transition-colors">Proyectos</Link>
              <Link to="/skills" className="text-gray-400 hover:text-blue-300 transition-colors">Habilidades</Link>
              <Link to="/contact" className="text-gray-400 hover:text-blue-300 transition-colors">Contacto</Link>
            </nav>
          </motion.div>
          
          {/* Contacto */}
          <motion.div 
            className="md:col-span-5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUpVariants}
          >
            <h4 className="text-lg text-white font-semibold mb-4 border-b border-gray-700 pb-2">Contacto</h4>
            <div className="flex flex-col space-y-3">
              <div className="flex items-center">
                <FaEnvelope className="text-blue-400 mr-3" />
                <span className="text-gray-300">analiarojas2929@gmail.com</span>
              </div>
              <div className="flex items-center">
                <FaMapMarkerAlt className="text-blue-400 mr-3" />
                <span className="text-gray-300">Chile</span>
              </div>
              <div className="flex items-center">
                <FaCode className="text-blue-400 mr-3" />
                <span className="text-gray-300">Desarrolladora & Data Scientist en formación</span>
              </div>
            </div>
          </motion.div>
        </div>
        
        <div className="pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <motion.p 
            className="text-gray-400 text-sm mb-4 md:mb-0"
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
            <p className="text-sm text-gray-500 mr-4">
              Desarrollado con React y Tailwind CSS
            </p>
            <motion.button 
              onClick={scrollToTop}
              className="p-2 bg-blue-600 rounded-full text-white hover:bg-blue-700 transition-all transform hover:-translate-y-1"
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