import React from 'react';
import { FaPython, FaDatabase, FaChartBar, FaLaptopCode, FaBrain } from 'react-icons/fa';
import { SiTensorflow, SiPandas, SiNumpy, SiScikitlearn, SiJupyter, SiPlotly } from 'react-icons/si';

const Skills = () => {
  const skillCategories = [
    {
      category: "Completado",
      icon: <FaLaptopCode className="text-4xl mb-2 text-green-500" />,
      description: "Tecnologías y herramientas que ya he dominado en el curso de Talento Digital",
      skills: [
        { name: "Python Básico", level: 90 },
        { name: "Pandas", level: 85 },
        { name: "Jupyter Notebooks", level: 90 },
        { name: "Matplotlib", level: 80 },
      ]
    },
    {
      category: "En progreso",
      icon: <FaChartBar className="text-4xl mb-2 text-blue-500" />,
      description: "Herramientas y conceptos que estoy aprendiendo actualmente",
      skills: [
        { name: "Scikit-learn", level: 60 },
        { name: "Estadística aplicada", level: 65 },
        { name: "Seaborn", level: 70 },
        { name: "SQL", level: 50 },
      ]
    },
    {
      category: "Próximamente",
      icon: <FaBrain className="text-4xl mb-2 text-purple-500" />,
      description: "Tecnologías que aprenderé en los próximos módulos del curso",
      skills: [
        { name: "TensorFlow", level: 20 },
        { name: "Deep Learning", level: 15 },
        { name: "Big Data", level: 10 },
        { name: "Hadoop / Spark", level: 5 },
      ]
    }
  ];

  return (
    <section className="container mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Mis Habilidades</h1>
      <p className="text-center max-w-3xl mx-auto mb-12 text-gray-600">
        Estoy en proceso de formación como científico de datos a través del programa de Talento Digital. 
        Estas habilidades reflejan mi progreso y aprendizaje a lo largo del curso.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {skillCategories.map((category, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-center mb-6">
              {category.icon}
              <h3 className="text-xl font-bold">{category.category}</h3>
              <p className="text-sm text-gray-600 mt-2">{category.description}</p>
            </div>
            
            <div className="space-y-4">
              {category.skills.map((skill, skillIndex) => (
                <div key={skillIndex}>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">{skill.name}</span>
                    <span className="text-sm text-gray-600">{skill.level}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        category.category === "Completado" 
                          ? "bg-green-500" 
                          : category.category === "En progreso" 
                          ? "bg-blue-500" 
                          : "bg-purple-500"
                      }`}
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-8 text-center">Herramientas y lenguajes</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 max-w-4xl mx-auto">
          <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm">
            <FaPython className="text-4xl text-blue-500 mb-2" />
            <span>Python</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm">
            <SiPandas className="text-4xl text-red-500 mb-2" />
            <span>Pandas</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm">
            <SiNumpy className="text-4xl text-blue-400 mb-2" />
            <span>NumPy</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm">
            <FaChartBar className="text-4xl text-green-500 mb-2" />
            <span>Matplotlib</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm">
            <SiScikitlearn className="text-4xl text-orange-500 mb-2" />
            <span>Scikit-learn</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm">
            <SiJupyter className="text-4xl text-orange-400 mb-2" />
            <span>Jupyter</span>
          </div>
        </div>
      </div>
      
      <div className="mt-16 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">Plan de aprendizaje</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="relative pb-12">
            <div className="absolute h-full w-0.5 bg-blue-200 left-1.5"></div>
            
            <div className="relative flex items-start mb-8">
              <div className="bg-blue-600 rounded-full h-4 w-4 flex-shrink-0 mt-1"></div>
              <div className="ml-4">
                <h3 className="font-bold">Fundamentos Python y análisis de datos</h3>
                <p className="text-sm text-gray-600">Completado</p>
                <p className="mt-2">Dominando las bases de Python, Pandas y herramientas de análisis exploratorio de datos.</p>
              </div>
            </div>
            
            <div className="relative flex items-start mb-8">
              <div className="bg-blue-400 rounded-full h-4 w-4 flex-shrink-0 mt-1"></div>
              <div className="ml-4">
                <h3 className="font-bold">Visualización de datos y estadística</h3>
                <p className="text-sm text-gray-600">En progreso</p>
                <p className="mt-2">Creación de visualizaciones avanzadas y aplicación de técnicas estadísticas.</p>
              </div>
            </div>
            
            <div className="relative flex items-start">
              <div className="bg-gray-300 rounded-full h-4 w-4 flex-shrink-0 mt-1"></div>
              <div className="ml-4">
                <h3 className="font-bold">Machine Learning y modelos avanzados</h3>
                <p className="text-sm text-gray-600">Próximamente</p>
                <p className="mt-2">Implementación de algoritmos de ML, deep learning y técnicas de big data.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </section>
  );
};

export default Skills;