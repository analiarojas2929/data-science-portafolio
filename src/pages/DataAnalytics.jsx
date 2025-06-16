import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaChartBar, FaCode, FaDatabase, FaLaptopCode, FaRobot, FaPython } from 'react-icons/fa';
import DataVisualization from '../components/DataVisualization';

const DataAnalytics = () => {
  const [apiStatus, setApiStatus] = useState('checking');
  const [componentLoading, setComponentLoading] = React.useState(true);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    // Comprobar si la API está disponible
    fetch(`${API_URL}/status/kaggle`)
      .then(response => response.json())
      .then(data => {
        setApiStatus(data.kaggle_api_available ? 'connected' : 'disconnected');
      })
      .catch(() => {
        setApiStatus('disconnected');
      });
  }, []);

  return (
    <section className="container mx-auto px-4 py-24">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6">Análisis Interactivo de Datos</h1>
        <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
          Esta herramienta te permite ejecutar código Python para análisis de datos 
          directamente en el navegador y visualizar los resultados en tiempo real.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12"
      >
        <motion.div 
          className="bg-white p-6 rounded-xl shadow-md border border-gray-100"
          whileHover={{ y: -5 }}
          transition={{ duration: 0.2 }}
        >
          <div className="h-14 w-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center mb-4">
            <FaPython className="text-white text-2xl" />
          </div>
          <h3 className="font-bold text-xl mb-2 text-gray-800">Código Python</h3>
          <p className="text-gray-600">
            Escribe y ejecuta código Python para análisis de datos con acceso a bibliotecas como Pandas, NumPy y Matplotlib.
          </p>
        </motion.div>
        
        <motion.div 
          className="bg-white p-6 rounded-xl shadow-md border border-gray-100"
          whileHover={{ y: -5 }}
          transition={{ duration: 0.2 }}
        >
          <div className="h-14 w-14 bg-gradient-to-br from-pink-400 to-pink-600 rounded-lg flex items-center justify-center mb-4">
            <FaChartBar className="text-white text-2xl" />
          </div>
          <h3 className="font-bold text-xl mb-2 text-gray-800">Visualización Dinámica</h3>
          <p className="text-gray-600">
            Genera gráficos interactivos usando Matplotlib, Seaborn y otras bibliotecas populares para visualizar tus datos.
          </p>
        </motion.div>
        
        <motion.div 
          className="bg-white p-6 rounded-xl shadow-md border border-gray-100"
          whileHover={{ y: -5 }}
          transition={{ duration: 0.2 }}
        >
          <div className="h-14 w-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center mb-4">
            <FaDatabase className="text-white text-2xl" />
          </div>
          <h3 className="font-bold text-xl mb-2 text-gray-800">Datasets Integrados</h3>
          <p className="text-gray-600">
            Accede a datasets populares como Iris, Titanic y Tips para comenzar tu análisis sin configuración adicional.
          </p>
        </motion.div>
      </motion.div>
      
      {apiStatus !== 'checking' && (
        <div className={`mb-4 px-4 py-2 rounded-lg flex items-center text-sm ${
          apiStatus === 'connected' 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
        }`}>
          <div className={`h-2 w-2 rounded-full mr-2 ${
            apiStatus === 'connected' ? 'bg-green-500' : 'bg-yellow-500'
          }`}></div>
          <span>
            {apiStatus === 'connected' 
              ? 'Conexión activa con la API de Kaggle - Datos reales disponibles' 
              : 'API local no detectada - Usando modo demostración con datos de ejemplo'}
          </span>
        </div>
      )}
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="my-8 md:my-12 overflow-hidden rounded-xl shadow-lg"
      >
        <DataVisualization />
      </motion.div>
      
      <motion.div 
        className="bg-gradient-to-r from-gray-50 to-blue-50 p-8 rounded-xl mt-16 border border-gray-200 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="flex items-center mb-4">
          <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
            <FaLaptopCode className="text-blue-600 text-xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Consejos para usar el analizador</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <h3 className="font-semibold text-lg mb-3 text-gray-800">Primeros pasos</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="inline-block h-6 w-6 rounded-full bg-blue-100 text-blue-600 mr-2 flex items-center justify-center text-sm">1</span>
                <span>Selecciona uno de los datasets predefinidos del menú desplegable.</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block h-6 w-6 rounded-full bg-blue-100 text-blue-600 mr-2 flex items-center justify-center text-sm">2</span>
                <span>El editor ya contiene código de ejemplo para comenzar.</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block h-6 w-6 rounded-full bg-blue-100 text-blue-600 mr-2 flex items-center justify-center text-sm">3</span>
                <span>Modifica el código según tus necesidades de análisis.</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-3 text-gray-800">Para obtener resultados</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="inline-block h-6 w-6 rounded-full bg-blue-100 text-blue-600 mr-2 flex items-center justify-center text-sm">4</span>
                <span>Haz clic en "Ejecutar Código" para ver los resultados.</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block h-6 w-6 rounded-full bg-blue-100 text-blue-600 mr-2 flex items-center justify-center text-sm">5</span>
                <span>Los gráficos generados se pueden descargar con el botón "Descargar".</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block h-6 w-6 rounded-full bg-blue-100 text-blue-600 mr-2 flex items-center justify-center text-sm">6</span>
                <span>Si encuentras errores, estos se mostrarán en el panel de resultados.</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-6 bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start">
          <FaRobot className="text-blue-500 mt-1 mr-3 flex-shrink-0" />
          <p className="text-sm text-gray-700">
            <strong className="font-semibold">Consejo pro:</strong> Intenta crear diferentes tipos de gráficos para el mismo conjunto de datos para descubrir distintas perspectivas sobre la información. Puedes probar con gráficos de dispersión, histogramas o gráficos de barras para visualizar diferentes relaciones entre las variables.
          </p>
        </div>
      </motion.div>
    </section>
  );
};

export default DataAnalytics;