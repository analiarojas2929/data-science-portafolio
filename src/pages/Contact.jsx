import React, { useState } from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaGithub, FaLinkedin, FaGraduationCap } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Aquí puedes agregar la lógica para enviar el formulario
    alert('¡Gracias por tu mensaje! Te responderé pronto.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section className="container mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-12 text-center">Contacto</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div>
          <h2 className="text-xl font-semibold mb-4">Envíame un mensaje</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block mb-1 font-medium">Nombre</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block mb-1 font-medium">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block mb-1 font-medium">Mensaje</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="5"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Enviar mensaje
            </button>
          </form>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Información de contacto</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <FaEnvelope className="text-blue-600 text-xl mt-1 mr-4" />
              <div>
                <h3 className="font-medium">Email</h3>
                <p>analiarojas2929@gmail.com</p>
              </div>
            </div>
            <div className="flex items-start">
              <FaGraduationCap className="text-blue-600 text-xl mt-1 mr-4" />
              <div>
                <h3 className="font-medium">Formación</h3>
                <p>Ingeniera en Informática - DUOC UC</p>
              </div>
            </div>
            <div className="flex items-start">
              <FaMapMarkerAlt className="text-blue-600 text-xl mt-1 mr-4" />
              <div>
                <h3 className="font-medium">Ubicación</h3>
                <p>Chile</p>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <h3 className="font-medium mb-2">Redes sociales</h3>
              <div className="flex space-x-4">
                <a 
                  href="https://github.com/analiarojas2929" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md text-gray-800 transition-colors duration-300"
                >
                  <FaGithub className="text-xl" />
                  <span>GitHub</span>
                </a>
                <a 
                  href="https://www.linkedin.com/in/analia-rojas-araya-056349205/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-md text-blue-800 transition-colors duration-300"
                >
                  <FaLinkedin className="text-xl" />
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>
            
            <div className="mt-6 bg-blue-50 p-4 rounded-md">
              <h3 className="font-medium mb-2 text-blue-800">Sobre mí</h3>
              <p className="text-sm text-gray-700">
                Soy Analía Estefanie Rojas Araya, Ingeniera en Informática graduada de DUOC UC. 
                Actualmente me estoy especializando en Ciencia de Datos para combinar mis conocimientos 
                de ingeniería con análisis avanzado de datos y machine learning.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;