import React, { useState } from 'react';
import { FaGithub, FaExternalLinkAlt, FaChartBar, FaFileAlt, FaDatabase, FaPython, FaChartLine, FaBook, FaStore, FaCalculator, FaTable, FaCode } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Projects = () => {
  const [filter, setFilter] = useState('all');
  
  const projectCategories = [
    { id: 'all', name: 'Todos' },
    { id: 'M2', name: 'Módulo 2' },
    { id: 'M3', name: 'Módulo 3' },
    { id: 'analisis', name: 'Análisis de Datos' },
    { id: 'visualizacion', name: 'Visualización' },
    { id: 'curso', name: 'Talento Digital' }
  ];

  const projects = [
    // Módulo 2 - Notebooks
    {
      id: 1,
      title: 'Gestión de Biblioteca',
      description: 'Desarrollo de un sistema de gestión de biblioteca utilizando Python, con funciones para administrar préstamos y devoluciones.',
      tools: ['Python', 'Funciones', 'Diccionarios', 'Listas'],
      github: 'https://github.com/analiarojas2929/ciencia-datos-td/blob/main/M2/biblioteca.ipynb',
      demo: 'https://github.com/analiarojas2929/ciencia-datos-td/blob/main/M2/biblioteca.ipynb',
      category: 'M2',
      icon: <FaBook className="text-blue-500 text-3xl" />
    },
    {
      id: 2,
      title: 'Funciones para Procesamiento de Datos',
      description: 'Implementación de funciones para procesar datos con Python. Incluye manipulación y transformación de datos.',
      tools: ['Python', 'Funciones', 'Procesamiento de datos'],
      github: 'https://github.com/analiarojas2929/ciencia-datos-td/blob/main/M2/funciones_datapro.ipynb',
      demo: 'https://github.com/analiarojas2929/ciencia-datos-td/blob/main/M2/funciones_datapro.ipynb',
      category: 'M2',
      icon: <FaCode className="text-green-500 text-3xl" />
    },
    {
      id: 3,
      title: 'Sistema de Gestión de Tienda',
      description: 'Implementación de un sistema para gestionar inventario, ventas y reportes de una tienda utilizando Python.',
      tools: ['Python', 'Diccionarios', 'Funciones', 'Inventario'],
      github: 'https://github.com/analiarojas2929/ciencia-datos-td/blob/main/M2/gestion_tienda.ipynb',
      demo: 'https://github.com/analiarojas2929/ciencia-datos-td/blob/main/M2/gestion_tienda.ipynb',
      category: 'M2',
      icon: <FaStore className="text-orange-500 text-3xl" />
    },
    {
      id: 4,
      title: 'Manejo de Libros y Bytes',
      description: 'Proyecto sobre manejo de datos binarios y conversión de bytes en Python, con aplicación a almacenamiento de libros.',
      tools: ['Python', 'Bytes', 'Conversión de datos', 'Manipulación binaria'],
      github: 'https://github.com/analiarojas2929/ciencia-datos-td/blob/main/M2/libros_bytes.ipynb',
      demo: 'https://github.com/analiarojas2929/ciencia-datos-td/blob/main/M2/libros_bytes.ipynb',
      category: 'M2',
      icon: <FaFileAlt className="text-purple-500 text-3xl" />
    },
    {
      id: 5,
      title: 'Registro y Cálculo de Notas',
      description: 'Sistema para registrar, calcular promedios y analizar estadísticas básicas de calificaciones de estudiantes.',
      tools: ['Python', 'Listas', 'Cálculos estadísticos', 'Promedio'],
      github: 'https://github.com/analiarojas2929/ciencia-datos-td/blob/main/M2/registro_notas_promedio.ipynb',
      demo: 'https://github.com/analiarojas2929/ciencia-datos-td/blob/main/M2/registro_notas_promedio.ipynb',
      category: 'M2',
      icon: <FaCalculator className="text-red-500 text-3xl" />
    },
    {
      id: 6,
      title: 'Ejercicios con Variables en Python',
      description: 'Conjunto de ejercicios sobre el uso de diferentes tipos de variables en Python y manipulación de datos.',
      tools: ['Python', 'Variables', 'Tipos de datos', 'Operaciones'],
      github: 'https://github.com/analiarojas2929/ciencia-datos-td/blob/main/M2/variables.ipynb',
      demo: 'https://github.com/analiarojas2929/ciencia-datos-td/blob/main/M2/variables.ipynb',
      category: 'M2',
      icon: <FaPython className="text-yellow-500 text-3xl" />
    },
    
    // Módulo 3 - Notebooks
    {
      id: 7,
      title: 'Actividades con NumPy',
      description: 'Ejercicios y soluciones utilizando la biblioteca NumPy para cálculos numéricos y operaciones con matrices.',
      tools: ['Python', 'NumPy', 'Arrays', 'Cálculo numérico'],
      github: 'https://github.com/analiarojas2929/ciencia-datos-td/blob/main/M3/actividad_numpy.ipynb',
      demo: 'https://github.com/analiarojas2929/ciencia-datos-td/blob/main/M3/actividad_numpy.ipynb',
      category: 'M3',
      icon: <FaChartBar className="text-blue-600 text-3xl" />
    },
    {
      id: 8,
      title: 'Análisis de Datos con Pandas',
      description: 'Uso de la biblioteca Pandas para análisis y manipulación de datos estructurados en Python.',
      tools: ['Python', 'Pandas', 'DataFrames', 'Análisis de datos'],
      github: 'https://github.com/analiarojas2929/ciencia-datos-td/blob/main/M3/actividad_pandas.ipynb',
      demo: 'https://github.com/analiarojas2929/ciencia-datos-td/blob/main/M3/actividad_pandas.ipynb',
      category: 'M3',
      icon: <FaTable className="text-green-600 text-3xl" />
    },
    {
      id: 9,
      title: 'Análisis de Ventas',
      description: 'Análisis completo de datos de ventas utilizando Python y Pandas para identificar tendencias y patrones.',
      tools: ['Python', 'Pandas', 'Análisis de datos', 'Visualización'],
      github: 'https://github.com/analiarojas2929/ciencia-datos-td/blob/main/M3/actividad_ventas.ipynb',
      demo: 'https://github.com/analiarojas2929/ciencia-datos-td/blob/main/M3/actividad_ventas.ipynb',
      category: 'M3',
      icon: <FaDatabase className="text-purple-600 text-3xl" />
    },
    
    // Proyectos generales por categoría
    {
      id: 10,
      title: 'Análisis Exploratorio - Fundamentos',
      description: 'Análisis exploratorio usando Pandas para limpieza de datos, manipulación y visualización básica con Matplotlib.',
      tools: ['Python', 'Pandas', 'Matplotlib', 'NumPy'],
      github: 'https://github.com/analiarojas2929/ciencia-datos-td/tree/main/M1-Fundamentos_Data_Science',
      demo: 'https://github.com/analiarojas2929/ciencia-datos-td/tree/main/M1-Fundamentos_Data_Science',
      category: 'curso',
      icon: <FaChartBar className="text-blue-500 text-3xl" />
    },
    {
      id: 11,
      title: 'Visualización Estadística con Seaborn',
      description: 'Ejercicios con Seaborn para crear visualizaciones estadísticas e identificar patrones en los datos.',
      tools: ['Python', 'Seaborn', 'Pandas', 'Matplotlib'],
      github: 'https://github.com/analiarojas2929/ciencia-datos-td/tree/main/M2-Fundamentos_Estadistica',
      demo: 'https://github.com/analiarojas2929/ciencia-datos-td/tree/main/M2-Fundamentos_Estadistica',
      category: 'visualizacion',
      icon: <FaChartLine className="text-green-500 text-3xl" />
    },
    {
      id: 12,
      title: 'Análisis de Datos con NumPy y Pandas',
      description: 'Aplicación de NumPy y Pandas para el análisis de conjuntos de datos estructurados y no estructurados.',
      tools: ['Python', 'NumPy', 'Pandas', 'Análisis de datos'],
      github: 'https://github.com/analiarojas2929/ciencia-datos-td/tree/main/M3',
      demo: 'https://github.com/analiarojas2929/ciencia-datos-td/tree/main/M3',
      category: 'analisis',
      icon: <FaDatabase className="text-purple-500 text-3xl" />
    }
  ];

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(project => project.category === filter);

  // Variantes de animación
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section className="container mx-auto py-24 px-4">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <h1 className="text-4xl font-bold mb-6 text-center">Mis Proyectos</h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-center">
          Una colección de proyectos que he desarrollado durante mi formación en Ciencia de Datos, 
          mostrando mi progreso y aplicación de diferentes técnicas y herramientas.
        </p>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">Formación Actual</h2>
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-xl shadow-sm max-w-3xl mx-auto border border-blue-100">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <FaChartBar className="text-blue-600 text-xl" />
            </div>
            <h3 className="font-bold text-xl text-gray-800">Curso de Ciencia de Datos - Talento Digital</h3>
          </div>
          <p className="mb-4 text-gray-700">
            Actualmente estoy cursando el programa de formación en Ciencia de Datos impartido por Talento Digital. 
            Este portfolio muestra los proyectos que he desarrollado, desde conceptos básicos de Python hasta 
            análisis de datos con bibliotecas especializadas como NumPy y Pandas.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">Python</span>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">NumPy</span>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">Pandas</span>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">Análisis de Datos</span>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">Visualización</span>
          </div>
        </div>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="flex justify-center mb-10"
      >
        <div className="flex flex-wrap gap-3 justify-center">
          {projectCategories.map((category, index) => (
            <motion.button
              key={category.id}
              onClick={() => setFilter(category.id)}
              className={`px-5 py-2 rounded-full transition duration-300 font-medium text-sm ${
                filter === category.id 
                  ? 'bg-black text-white shadow-md' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              {category.name}
            </motion.button>
          ))}
        </div>
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {filteredProjects.map((project) => (
          <motion.div 
            key={project.id} 
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100"
            variants={itemVariants}
            whileHover={{ y: -5 }}
          >
            <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <div className="p-4 bg-white bg-opacity-20 backdrop-filter backdrop-blur-sm rounded-full">
                {project.icon || <FaChartBar className="text-white text-4xl" />}
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2 text-gray-800">{project.title}</h3>
              <p className="text-gray-600 mb-4 text-sm h-16 overflow-hidden">{project.description}</p>
              <div className="mb-4 flex flex-wrap gap-2">
                {project.tools.map((tool, index) => (
                  <span key={index} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                    {tool}
                  </span>
                ))}
              </div>
              <div className="flex justify-between">
                <a 
                  href={project.github} 
                  className="text-[#C03A74] hover:text-[#a82d63] hover:underline flex items-center gap-1 font-medium" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <FaGithub /> Ver Código
                </a>
                <a 
                  href={project.demo} 
                  className="text-[#4285F4] hover:text-blue-700 hover:underline flex items-center gap-1 font-medium" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <FaExternalLinkAlt /> Ver Notebook
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
      
      {filteredProjects.length === 0 && (
        <motion.div 
          className="text-center py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-gray-50 p-8 rounded-lg max-w-lg mx-auto">
            <FaChartBar className="text-gray-400 text-5xl mx-auto mb-4" />
            <p className="text-gray-500 mb-2">No hay proyectos en esta categoría todavía.</p>
            <p className="text-gray-400 text-sm">¡Estoy trabajando en nuevos proyectos que pronto estarán disponibles!</p>
          </div>
        </motion.div>
      )}
    </section>
  );
};

export default Projects;