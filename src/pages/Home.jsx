import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaChartLine, FaLaptopCode, FaBrain, FaChartBar, FaCode, FaDatabase, FaGraduationCap, FaArrowRight } from 'react-icons/fa';

const Home = () => {
  return (
    <div>
      {/* Sección Hero con gradiente y patrón de fondo */}
      <section className="py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <rect width="10" height="10" fill="none" />
                <circle cx="5" cy="5" r="1" fill="white" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="mb-6 inline-block p-2 bg-blue-700 bg-opacity-30 rounded-full">
              <div className="bg-white bg-opacity-20 p-3 rounded-full">
                <FaCode className="text-3xl" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Hola, soy <span className="text-blue-300">Analía Rojas</span>
            </h1>
            <h2 className="namee text-xl md:text-3xl mb-6 font-light">
              Ingeniera en Informática & <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300 font-semibold">Estudiante de Ciencia de Datos</span>
            </h2>
            <p className="text-lg mb-10 text-blue-100 max-w-2xl mx-auto">
              Formándome como científica de datos en el programa de Talento Digital. 
              Este portafolio documenta mi viaje de aprendizaje y muestra los proyectos 
              que desarrollo mientras combino mi experiencia en informática con el análisis de datos.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/projects" className="bg-blue-500 text-white px-8 py-3 rounded-md hover:bg-blue-400 transition-all transform hover:-translate-y-1 font-medium flex items-center">
                Ver proyectos <FaArrowRight className="ml-2" />
              </Link>
              <Link to="/contact" className="border-2 border-blue-300 text-blue-300 px-8 py-3 rounded-md hover:bg-blue-800 hover:border-transparent transition-all transform hover:-translate-y-1 font-medium">
                Contactar
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Forma decorativa en el fondo */}
        <div className="hidden md:block absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/4 w-96 h-96 bg-blue-400 rounded-full opacity-20"></div>
        <div className="hidden md:block absolute top-0 left-0 transform -translate-x-1/3 -translate-y-1/3 w-96 h-96 bg-purple-500 rounded-full opacity-10"></div>
      </section>

      {/* Sección de Mi Formación Actual con diseño de tarjeta mejorado */}
      <section className="bg-gray-50 py-20 relative">
        <div className="absolute right-0 top-0 h-full w-1/2 bg-blue-50 z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-start gap-12">
            <div className="md:w-5/12">
              <h2 className="text-3xl font-bold mb-4 text-gray-800 inline-block pb-2 border-b-4 border-blue-500">
                Mi Formación Actual
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Mi viaje en la ciencia de datos apenas comienza. Con una sólida base en ingeniería informática, 
                estoy enfocada en adquirir las habilidades técnicas y analíticas necesarias para convertirme en 
                una profesional de datos capacitada.
              </p>
              <div className="flex items-center p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg shadow-lg">
                <FaGraduationCap className="text-3xl mr-4" />
                <div>
                  <div className="font-bold">DUOC UC</div>
                  <div className="text-sm text-blue-100">Ingeniería en Informática</div>
                </div>
              </div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="md:w-7/12 bg-white p-8 rounded-xl shadow-lg border-t-4 border-blue-600"
            >
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <FaChartLine className="text-blue-600 text-xl" />
                </div>
                <h3 className="text-xl font-bold">Curso de Ciencia de Datos - Talento Digital</h3>
              </div>
              
              <p className="mb-8 text-gray-700">
                Actualmente me encuentro participando en el programa de formación en Ciencia de Datos 
                impartido por Talento Digital. Este programa me está permitiendo combinar mis conocimientos
                de ingeniería con nuevas técnicas de análisis avanzado de datos.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="flex items-start bg-gray-50 p-4 rounded-lg hover:bg-blue-50 transition-colors">
                  <FaLaptopCode className="text-blue-600 text-2xl mt-1 mr-3" />
                  <div>
                    <h4 className="font-semibold text-gray-800">Programación en Python</h4>
                    <p className="text-sm text-gray-600">Pandas, NumPy, estructuras de datos</p>
                  </div>
                </div>
                <div className="flex items-start bg-gray-50 p-4 rounded-lg hover:bg-blue-50 transition-colors">
                  <FaChartBar className="text-blue-600 text-2xl mt-1 mr-3" />
                  <div>
                    <h4 className="font-semibold text-gray-800">Visualización de datos</h4>
                    <p className="text-sm text-gray-600">Matplotlib, Seaborn, Plotly</p>
                  </div>
                </div>
                <div className="flex items-start bg-gray-50 p-4 rounded-lg hover:bg-blue-50 transition-colors">
                  <FaBrain className="text-blue-600 text-2xl mt-1 mr-3" />
                  <div>
                    <h4 className="font-semibold text-gray-800">Machine Learning</h4>
                    <p className="text-sm text-gray-600">Scikit-learn, modelos predictivos</p>
                  </div>
                </div>
                <div className="flex items-start bg-gray-50 p-4 rounded-lg hover:bg-blue-50 transition-colors">
                  <FaDatabase className="text-blue-600 text-2xl mt-1 mr-3" />
                  <div>
                    <h4 className="font-semibold text-gray-800">Bases de datos</h4>
                    <p className="text-sm text-gray-600">SQL, almacenamiento y consultas</p>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-100 pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <p className="text-gray-600 text-sm italic">
                    En este portafolio iré documentando mi progreso y proyectos.
                  </p>
                  <Link to="/skills" className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium">
                    Ver todas mis habilidades <FaArrowRight className="ml-1" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Sección de Últimos Proyectos con diseño de tarjeta mejorado */}
      <section className="container mx-auto py-20 px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 inline-block relative">
            Últimos Proyectos
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-blue-500"></span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Aquí puedes ver algunos de los proyectos en los que estoy trabajando como parte de mi formación en ciencia de datos.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div className="h-40 bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center">
              <FaChartBar className="text-white text-5xl" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-3 text-gray-800">Análisis Exploratorio - Módulo 1</h3>
              <p className="text-gray-600 mb-4">
                Primer ejercicio de análisis de datos del curso utilizando Python y Pandas para explorar y limpiar datos.
              </p>
              <Link to="/projects" className="text-blue-600 font-medium hover:underline flex items-center">
                Ver proyecto <FaArrowRight className="ml-1" />
              </Link>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div className="h-40 bg-gradient-to-r from-green-500 to-teal-600 flex items-center justify-center">
              <FaChartLine className="text-white text-5xl" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-3 text-gray-800">Visualización de datos COVID-19</h3>
              <p className="text-gray-600 mb-4">
                Visualización interactiva de datos usando técnicas aprendidas en el curso para representar tendencias y patrones.
              </p>
              <Link to="/projects" className="text-blue-600 font-medium hover:underline flex items-center">
                Ver proyecto <FaArrowRight className="ml-1" />
              </Link>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div className="h-40 bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center">
              <FaBrain className="text-white text-5xl" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-3 text-gray-800">Modelo Predictivo - Módulo 2</h3>
              <p className="text-gray-600 mb-4">
                Aplicación de algoritmos de machine learning para predicciones basadas en datos históricos.
              </p>
              <Link to="/projects" className="text-blue-600 font-medium hover:underline flex items-center">
                Ver proyecto <FaArrowRight className="ml-1" />
              </Link>
            </div>
          </motion.div>
        </div>
        
        <div className="text-center">
          <Link 
            to="/projects" 
            className="inline-block bg-gradient-to-r from-blue-600 to-blue-800 text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 font-medium text-lg"
          >
            Ver todos los proyectos
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;