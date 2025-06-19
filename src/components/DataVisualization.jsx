import React, { useState, useEffect, useRef } from 'react';
import { FaPlayCircle, FaDownload, FaCode, FaDatabase, FaExclamationTriangle, FaKaggle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import CodeEditor from '@monaco-editor/react';
import { loader } from '@monaco-editor/react';

// Reemplaza todas las URL hardcodeadas con la variable de entorno
const API_URL = import.meta.env?.VITE_API_URL;

// Datasets populares de Kaggle
const mockDatasets = [
  { id: "iris", name: "Iris Dataset", description: "Dataset clásico de flores iris", source: "kaggle" },
  { id: "titanic", name: "Titanic Dataset", description: "Supervivencia de pasajeros del Titanic", source: "kaggle" },
  { id: "housing", name: "Housing Dataset", description: "Precios de viviendas en Boston", source: "kaggle" },
  { id: "wine", name: "Wine Quality", description: "Clasificación de calidad de vinos", source: "kaggle" },
  { id: "covid", name: "COVID-19 Global", description: "Datos globales de COVID-19", source: "kaggle" }
];

const mockSampleCode = {
  "iris": `# Analizar el dataset Iris
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# El dataset ya está cargado en 'df'

# Verificar los nombres de columnas
print("Nombres de columnas:", df.columns.tolist())

# Visualizar las primeras filas para entender la estructura
print(df.head())

# Ahora crear el gráfico usando los nombres correctos de columnas
plt.figure(figsize=(10, 6))
# Usaremos los nombres de columna tal como aparecen en el DataFrame
# df.columns[0] para la primera columna, df.columns[1] para la segunda, etc.
sns.scatterplot(data=df, x=df.columns[0], y=df.columns[1], hue=df.columns[-1])
plt.title('Relación entre Longitud y Ancho del Sépalo por Especie')
plt.grid(True, alpha=0.3)
plt.tight_layout()`,

  "titanic": `# Análisis de supervivencia en el Titanic (Kaggle)
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# El dataset ya está cargado en 'df'

# Visualizar tasa de supervivencia por clase
plt.figure(figsize=(10, 6))
sns.countplot(x='class', hue='survived', data=df)
plt.title('Supervivencia por Clase Social en el Titanic')
plt.xlabel('Clase')
plt.ylabel('Número de Pasajeros')
plt.legend(['No Sobrevivió', 'Sobrevivió'])
plt.grid(True, alpha=0.3)
plt.tight_layout()`,

  "housing": `# Análisis del Boston Housing Dataset de Kaggle
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np

# El dataset ya está cargado en 'df'

# Mostrar información general
print(df.info())
print(df.head())

# Crear un histograma de precios de viviendas
plt.figure(figsize=(10, 6))
plt.hist(df['MEDV'], bins=30, alpha=0.7, color='blue')
plt.title('Distribución de Precios de Viviendas en Boston')
plt.xlabel('Precio Medio ($1000s)')
plt.ylabel('Frecuencia')
plt.grid(True, alpha=0.3)
plt.tight_layout()`,

  "wine": `# Análisis de calidad de vinos de Kaggle
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# El dataset ya está cargado en 'df'

# Visualizar distribución de calidad
plt.figure(figsize=(10, 6))
sns.countplot(x='quality', data=df, palette='viridis')
plt.title('Distribución de Calidad en Vinos')
plt.xlabel('Puntuación de Calidad')
plt.ylabel('Número de Vinos')
plt.grid(True, alpha=0.3)
plt.tight_layout()

# Correlación entre variables
plt.figure(figsize=(12, 8))
corr = df.corr()
mask = np.triu(np.ones_like(corr, dtype=bool))
sns.heatmap(corr, mask=mask, annot=True, fmt='.2f', cmap='coolwarm', square=True)
plt.title('Matriz de Correlación entre Variables')
plt.tight_layout()`,

  "covid": `# Análisis de datos COVID-19 de Kaggle
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
from datetime import datetime

# El dataset ya está cargado en 'df'
# Asumimos columnas: date, country, confirmed, deaths, recovered

# Preparamos datos
df['date'] = pd.to_datetime(df['date'])
top_countries = df.groupby('country')['confirmed'].max().nlargest(10).index.tolist()
df_top = df[df['country'].isin(top_countries)]

# Visualizamos casos por país
plt.figure(figsize=(12, 8))
for country in top_countries:
    country_data = df_top[df_top['country'] == country]
    plt.plot(country_data['date'], country_data['confirmed'], label=country)

plt.title('Casos Confirmados de COVID-19 en los 10 Países más Afectados')
plt.xlabel('Fecha')
plt.ylabel('Casos Confirmados')
plt.legend()
plt.grid(True, alpha=0.3)
plt.xticks(rotation=45)
plt.tight_layout()`
};

// Imágenes de ejemplo para simular las visualizaciones
const mockImages = {
  "iris": "https://miro.medium.com/v2/resize:fit:720/format:webp/1*_vZMn5HGr7K88LRZCZTHpA.png",
  "titanic": "https://miro.medium.com/v2/resize:fit:1400/1*t_nGu9Jl9QIO-z7RYHMZJA.png",
  "housing": "https://miro.medium.com/v2/resize:fit:1400/1*Vc31J_YJwPxKdQRit2HU3w.png",
  "wine": "https://miro.medium.com/v2/resize:fit:2000/1*kWWT5gOolL-In6KUiuIEEQ.png",
  "covid": "https://www.kaggleusercontent.com/kf/86502430/eyJhbGciOiJkaXIiLCJlbmMiOiJBMTI4Q0JDLUhTMjU2In0..O5PDo1W0NbkgJ9Ovc2QR5A.7omT3XvgCOU_-5p0-wz6qg380iv1BmU0c4vJJAKJ68GDdxG8cT6-5W8-2uj4X_spUeMLmAwnbNNRj1EuaL8g7KvWq_43tGQTvXR7z3qGMdH3WDZzPgqmlv-GvpdL09d5SCHJh2WZTWPp-3hgBsZrtY5m9n--gL_MxVtVzMhEZzzFQALh2MBlxDPi0maxFLHPpO8AmEoYNVGqGmkTdJ6kJKZs2hHWLG2KXUEfKTXi3Cl0a_oBGOlTo3gU_SAMkLT-qErfkJ54Z2ikOBZO2cknqA.0ETJjLCvSBxEuYbQ7DOuvQ/__results___files/__results___16_0.png"
};

// Detalles de los datasets para mostrar metadatos
const datasetDetails = {
  "iris": {
    title: "Iris Species Dataset",
    description: "El dataset de Iris contiene medidas de 150 flores de iris de tres especies diferentes: setosa, versicolor y virginica. Las medidas incluyen el largo y ancho del sépalo y pétalo en centímetros.",
    source: "Kaggle",
    url: "https://www.kaggle.com/datasets/uciml/iris",
    variables: [
      { name: "sepal_length", type: "float", description: "Longitud del sépalo en cm" },
      { name: "sepal_width", type: "float", description: "Ancho del sépalo en cm" },
      { name: "petal_length", type: "float", description: "Longitud del pétalo en cm" },
      { name: "petal_width", type: "float", description: "Ancho del pétalo en cm" },
      { name: "species", type: "categorical", description: "Especie (setosa, versicolor, virginica)" }
    ]
  },
  "titanic": {
    title: "Titanic Survival Dataset",
    description: "Este dataset contiene información sobre los pasajeros del Titanic, incluyendo variables como edad, sexo, clase de viaje y si sobrevivieron al desastre.",
    source: "Kaggle",
    url: "https://www.kaggle.com/c/titanic",
    variables: [
      { name: "survived", type: "binary", description: "Supervivencia (0 = No, 1 = Sí)" },
      { name: "class", type: "categorical", description: "Clase (1st, 2nd, 3rd)" },
      { name: "sex", type: "categorical", description: "Sexo (male, female)" },
      { name: "age", type: "float", description: "Edad en años" },
      { name: "sibsp", type: "integer", description: "# de hermanos/cónyuges a bordo" },
      { name: "parch", type: "integer", description: "# de padres/hijos a bordo" }
    ]
  },
  "housing": {
    title: "Boston Housing Dataset",
    description: "Contiene información sobre los precios de las viviendas en Boston y diversos factores que pueden influir en ellos.",
    source: "Kaggle",
    url: "https://www.kaggle.com/datasets/fedesoriano/the-boston-houseprice-data",
    variables: [
      { name: "CRIM", type: "float", description: "Tasa de criminalidad per cápita por ciudad" },
      { name: "ZN", type: "float", description: "Proporción de terrenos residenciales" },
      { name: "INDUS", type: "float", description: "Proporción de acres comerciales no minoristas" },
      { name: "MEDV", type: "float", description: "Valor medio de viviendas ocupadas en $1000s" }
    ]
  },
  "wine": {
    title: "Wine Quality Dataset",
    description: "Este conjunto de datos contiene información sobre diferentes vinos y puntuaciones de calidad asignadas por expertos.",
    source: "Kaggle",
    url: "https://www.kaggle.com/datasets/uciml/red-wine-quality-cortez-et-al-2009",
    variables: [
      { name: "fixed_acidity", type: "float", description: "Acidez fija" },
      { name: "volatile_acidity", type: "float", description: "Acidez volátil" },
      { name: "citric_acid", type: "float", description: "Ácido cítrico" },
      { name: "quality", type: "integer", description: "Calidad (puntuación entre 0 y 10)" }
    ]
  },
  "covid": {
    title: "COVID-19 Global Dataset",
    description: "Datos globales de casos de COVID-19, incluyendo casos confirmados, muertes y recuperaciones por país y fecha.",
    source: "Kaggle",
    url: "https://www.kaggle.com/datasets/josephassaker/covid19-global-dataset",
    variables: [
      { name: "date", type: "date", description: "Fecha del reporte" },
      { name: "country", type: "string", description: "País" },
      { name: "confirmed", type: "integer", description: "Casos confirmados acumulados" },
      { name: "deaths", type: "integer", description: "Muertes acumuladas" },
      { name: "recovered", type: "integer", description: "Casos recuperados acumulados" }
    ]
  }
};

// Datos tabulares de ejemplo para mostrar cuando no hay gráfico
const mockDataFrames = {
  "iris": [
    { sepal_length: 5.1, sepal_width: 3.5, petal_length: 1.4, petal_width: 0.2, species: "setosa" },
    { sepal_length: 4.9, sepal_width: 3.0, petal_length: 1.4, petal_width: 0.2, species: "setosa" },
    { sepal_length: 7.0, sepal_width: 3.2, petal_length: 4.7, petal_width: 1.4, species: "versicolor" },
    { sepal_length: 6.3, sepal_width: 3.3, petal_length: 6.0, petal_width: 2.5, species: "virginica" },
    { sepal_length: 5.8, sepal_width: 2.7, petal_length: 5.1, petal_width: 1.9, species: "virginica" }
  ],
  "titanic": [
    { survived: 0, class: "3rd", sex: "male", age: 22.0, sibsp: 1, parch: 0 },
    { survived: 1, class: "1st", sex: "female", age: 38.0, sibsp: 1, parch: 0 },
    { survived: 1, class: "3rd", sex: "female", age: 26.0, sibsp: 0, parch: 0 },
    { survived: 0, class: "1st", sex: "male", age: 35.0, sibsp: 0, parch: 0 },
    { survived: 0, class: "3rd", sex: "male", age: 45.0, sibsp: 0, parch: 0 }
  ],
  "housing": [
    { CRIM: 0.00632, ZN: 18.0, INDUS: 2.31, MEDV: 21.9 },
    { CRIM: 0.02731, ZN: 0.0, INDUS: 7.07, MEDV: 19.4 },
    { CRIM: 0.02729, ZN: 0.0, INDUS: 7.07, MEDV: 25.0 },
    { CRIM: 0.03237, ZN: 0.0, INDUS: 2.18, MEDV: 23.6 },
    { CRIM: 0.06905, ZN: 0.0, INDUS: 2.18, MEDV: 17.8 }
  ],
  "wine": [
    { fixed_acidity: 7.4, volatile_acidity: 0.7, citric_acid: 0.0, quality: 5 },
    { fixed_acidity: 7.8, volatile_acidity: 0.88, citric_acid: 0.0, quality: 6 },
    { fixed_acidity: 7.8, volatile_acidity: 0.76, citric_acid: 0.04, quality: 7 },
    { fixed_acidity: 11.2, volatile_acidity: 0.28, citric_acid: 0.56, quality: 8 },
    { fixed_acidity: 6.3, volatile_acidity: 0.3, citric_acid: 0.34, quality: 5 }
  ],
  "covid": [
    { date: "2021-01-01", country: "USA", confirmed: 20128693, deaths: 358682, recovered: 12436958 },
    { date: "2021-01-01", country: "India", confirmed: 10266674, deaths: 148994, recovered: 9860280 },
    { date: "2021-01-01", country: "Brazil", confirmed: 7700578, deaths: 195411, recovered: 6756284 },
    { date: "2021-01-01", country: "Russia", confirmed: 3186336, deaths: 57555, recovered: 2580138 },
    { date: "2021-01-01", country: "France", confirmed: 2697014, deaths: 64892, recovered: 202074 }
  ]
};

const DataVisualization = () => {
  // Añade este estado para controlar qué filas están expandidas
  const [expandedRows, setExpandedRows] = useState([]);
  // Añade este estado para controlar las pestañas en móvil
  const [mobileTab, setMobileTab] = useState('editor'); // 'editor' o 'result'
  const editorRef = useRef(null);
  
  // Resto de tus estados existentes
  const [code, setCode] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState('iris');
  const [datasets, setDatasets] = useState([]);
  const [error, setError] = useState(null);
  const [backendAvailable, setBackendAvailable] = useState(false);
  const [viewMode, setViewMode] = useState('code'); // 'code', 'data', 'about'
  const [editorReady, setEditorReady] = useState(false);

  // Comprobar si el backend está disponible e inicializar
  useEffect(() => {
    // Intentamos conectar con el backend
    fetch(`${API_URL}/datasets`)
      .then(response => {
        if (response.ok) {
          setBackendAvailable(true);
          return response.json();
        } else {
          throw new Error('Backend no disponible');
        }
      })
      .then(data => setDatasets(data))
      .catch(err => {
        console.warn("Backend no disponible, usando datos de ejemplo:", err);
        // Si no hay backend, usamos datos mock
        setDatasets(mockDatasets);
        setCode(mockSampleCode.iris);
      });

  }, []);

  // Cargar código de ejemplo
  const loadSampleCode = (datasetId) => {
    setSelectedDataset(datasetId);

    if (backendAvailable) {
      fetch(`${API_URL}/sample-code?dataset=${datasetId}`)
        .then(response => response.json())
        .then(data => setCode(data.code))
        .catch(err => {
          console.error("Error al cargar código de ejemplo:", err);
          // Si hay un error, usar el código de ejemplo de backup
          setCode(mockSampleCode[datasetId] || mockSampleCode.iris);
        });
    } else {
      // Si no hay backend, usar los datos de ejemplo
      setCode(mockSampleCode[datasetId] || mockSampleCode.iris);
    }
  };

  // Ejecutar código Python (o simular si no hay backend)
  const runCode = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    if (backendAvailable) {
      try {
        const response = await fetch(`${API_URL}/code/run`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code,
            dataset: selectedDataset
          }),
        });

        const data = await response.json();

        if (data.success) {
          setResult(data);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError("Error al comunicarse con el servidor. Asegúrate de que la API esté en funcionamiento.");
      }
    } else {
      // Simulamos la ejecución si no hay backend
      setTimeout(() => {
        // Si el código contiene ciertos patrones, devolvemos un error simulado
        if (code.includes("error") || code.includes("raise Exception")) {
          setError("Error simulado: El código contiene errores intencionales.");
        } else if (code.includes("print") && code.includes("head()")) {
          // Simulamos un resultado de DataFrame
          setResult({
            success: true,
            message: "DataFrame procesado correctamente (simulación)",
            data: mockDataFrames[selectedDataset],
            columns: Object.keys(mockDataFrames[selectedDataset][0])
          });
        } else {
          // Simulamos un resultado exitoso with gráfico
          setResult({
            success: true,
            message: "Visualización generada correctamente (simulación)",
            image_url: mockImages[selectedDataset]
          });
        }
      }, 1500); // Simulamos un tiempo de carga de 1.5 segundos
    }

    setTimeout(() => setLoading(false), 1500);
  };

  // Simular descarga de la imagen
  const downloadImage = () => {
    if (result && result.image_url) {
      const link = document.createElement('a');

      // Si es una URL local o una URL completa
      const imageUrl = result.image_url.startsWith('http')
        ? result.image_url
        : `http://localhost:5000${result.image_url}`;

      link.href = imageUrl;
      link.download = `visualization-${Date.now()}.png`;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Función para alternar la expansión de una fila
  const toggleRowExpansion = (rowIndex) => {
    setExpandedRows(prev => 
      prev.includes(rowIndex) 
        ? prev.filter(i => i !== rowIndex) 
        : [...prev, rowIndex]
    );
  };

  // Modificación completa del renderContent con scroll en todas las secciones
  const renderContent = () => {
    if (viewMode === 'about' && selectedDataset) {
      const details = datasetDetails[selectedDataset];
      return (
        <div className="h-full max-h-[400px] overflow-y-auto scrollbar pb-6"> {/* Añadida max-h-[400px] para limitar la altura */}
          <div className="p-4 md:p-6"> {/* Mantiene el padding interno */}
            <div className="flex items-center mb-4">
              <FaKaggle className="text-[#20BEFF] text-lg md:text-xl mr-2 md:mr-3" />
              <h3 className="text-lg md:text-xl font-bold text-gray-800">{details.title}</h3>
            </div>

            <div className="mb-4 md:mb-6">
              <p className="text-sm md:text-base text-gray-700 mb-3">{details.description}</p>
              <div className="flex items-center text-sm text-blue-600 hover:text-blue-800">
                <a href={details.url} target="_blank" rel="noopener noreferrer" className="flex items-center bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full transition-colors">
                  Ver en Kaggle
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-md font-semibold text-gray-800 mb-2">Variables del Dataset:</h4>
              
              {/* Tabla para desktop - mejorada la altura máxima y barra de desplazamiento */}
              <div className="hidden md:block bg-white rounded-lg border border-gray-200 overflow-auto max-h-[350px] scrollbar">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {details.variables.map((variable, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{variable.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{variable.type}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{variable.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Acordeón para mobile */}
              <div className="md:hidden space-y-2">
                {details.variables.map((variable, index) => (
                  <div key={index} className="border rounded-lg overflow-hidden bg-white">
                    <button 
                      className="w-full text-left p-3 flex justify-between items-center bg-gray-50 border-b border-gray-200"
                      onClick={() => toggleRowExpansion(index + 200)}
                    >
                      <span className="font-medium text-gray-700">
                        {variable.name}
                      </span>
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className={`h-5 w-5 transition-transform ${expandedRows.includes(index + 200) ? 'rotate-180' : ''}`} 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                    
                    {expandedRows.includes(index + 200) && (
                      <div className="p-3 space-y-2">
                        <div className="py-1">
                          <div className="text-xs font-medium text-gray-500 uppercase mb-1">Tipo</div>
                          <div className="text-sm text-gray-900">{variable.type}</div>
                        </div>
                        <div className="py-1">
                          <div className="text-xs font-medium text-gray-500 uppercase mb-1">Descripción</div>
                          <div className="text-sm text-gray-900">{variable.description}</div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="text-sm font-semibold mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Sugerencia para Análisis
              </h4>
              <p className="text-sm text-gray-600">
                Prueba a realizar análisis de correlación entre las variables para descubrir patrones interesantes.
                Para el dataset {details.title}, es especialmente útil explorar la relación entre
                {selectedDataset === 'iris' && " las medidas de pétalos y sépalos para diferenciar especies."}
                {selectedDataset === 'titanic' && " la clase de pasajero, el género y las tasas de supervivencia."}
                {selectedDataset === 'housing' && " la tasa de criminalidad y el valor de las viviendas."}
                {selectedDataset === 'wine' && " la acidez y la calidad del vino."}
                {selectedDataset === 'covid' && " la propagación del virus en diferentes países a lo largo del tiempo."}
              </p>
            </div>
          </div>
        </div>
      );
    } else if (viewMode === 'data' && selectedDataset) {
      const data = mockDataFrames[selectedDataset];
      const columns = data ? Object.keys(data[0]) : [];

      return (
        <div className="h-full overflow-y-auto scrollbar pb-6"> {/* Añadido h-full, scrollbar y pb-6 */}
          <div className="p-4"> {/* Contenedor interno con padding */}
            <h3 className="text-lg font-semibold mb-4">Muestra de Datos: {selectedDataset}</h3>
            
            {/* Tabla responsiva para desktop */}
            <div className="hidden md:block bg-white rounded-lg border border-gray-200 overflow-auto max-h-[500px] scrollbar"> {/* Ajustada altura máxima */}
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0 z-10"> {/* Añadido sticky */}
                  <tr>
                    {columns.map((col, i) => (
                      <th key={i} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      {columns.map((col, j) => (
                        <td key={j} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {row[col] !== null ? row[col].toString() : 'null'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Acordeón para mobile */}
            <div className="md:hidden space-y-3">
              {data.map((row, i) => (
                <div key={i} className="border rounded-lg overflow-hidden bg-white">
                  <button 
                    className="w-full text-left p-3 flex justify-between items-center bg-gray-50 border-b border-gray-200"
                    onClick={() => toggleRowExpansion(i)}
                  >
                    <span className="font-medium text-gray-700">
                      Registro #{i+1}: {columns[0]} = {row[columns[0]]}
                    </span>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-5 w-5 transition-transform ${expandedRows.includes(i) ? 'rotate-180' : ''}`} 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {expandedRows.includes(i) && (
                    <div className="p-3 divide-y divide-gray-200">
                      {columns.map((col, j) => (
                        <div key={j} className="py-2">
                          <div className="text-xs font-medium text-gray-500 uppercase mb-1">{col}</div>
                          <div className="text-sm text-gray-900">{row[col] !== null ? row[col].toString() : 'null'}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Información adicional */}
            <div className="mt-4 text-sm text-gray-500">
              <p className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Mostrando las primeras 5 filas del dataset. El conjunto de datos completo contiene más registros.
              </p>
            </div>
          </div>
        </div>
      );
    } else {
      // Vista de resultados con scroll adecuado
      return (
        <div className="h-full overflow-y-auto scrollbar pb-6"> {/* Mejoramos el scroll */}
          <div className="p-4 bg-gray-50 h-full overflow-y-auto"> {/* Añadido h-full y overflow-y-auto */}
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <svg className="animate-spin h-10 w-10 text-black mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="text-gray-600">Procesando código Python...</p>
                </div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 overflow-y-auto max-h-full"> {/* Añadido overflow-y-auto y max-h-full */}
                <h3 className="text-red-800 font-medium mb-2">Error:</h3>
                <pre className="text-red-700 bg-red-50 p-3 rounded overflow-auto scrollbar text-sm whitespace-pre-wrap">
                  {error}
                </pre>
              </div>
            ) : result ? (
              <div className="flex flex-col overflow-y-auto max-h-full scrollbar"> {/* Añadido overflow-y-auto y max-h-full */}
                {result.image_url ? (
                  <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center justify-center">
                    <img
                      src={
                        result.image_url.startsWith('http')
                          ? result.image_url
                          : `${import.meta.env.VITE_API_BASE}${result.image_url}`
                      }
                      alt="Visualización de datos"
                      className="max-w-full max-h-[500px] object-contain rounded border border-gray-200"
                    />
                    <p className="text-gray-500 mt-2 text-sm">{result.message}</p>
                  </div>
                ) : result.data ? (
                  <div className="overflow-y-auto max-h-full"> {/* Ajustado para scroll propio */}
                    <h3 className="text-lg font-medium mb-2">Resultados del DataFrame:</h3>
                    
                    {/* Tabla responsiva para desktop */}
                    <div className="hidden md:block overflow-auto max-h-[500px] scrollbar"> {/* Ya tiene buen scroll */}
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100 sticky top-0 z-10"> {/* Añadido sticky */}
                          <tr>
                            {result.columns.map((col, i) => (
                              <th key={i} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {col}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {result.data.map((row, i) => (
                            <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                              {result.columns.map((col, j) => (
                                <td key={j} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {row[col] !== null ? row[col].toString() : 'null'}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    {/* Acordeón para mobile */}
                    <div className="md:hidden space-y-3">
                      {result.data.map((row, i) => (
                        <div key={i} className="border rounded-lg overflow-hidden bg-white">
                          <button 
                            className="w-full text-left p-3 flex justify-between items-center bg-gray-50 border-b border-gray-200"
                            onClick={() => toggleRowExpansion(i + 100)} // Offset para no colisionar con otras tablas
                          >
                            <span className="font-medium text-gray-700">
                              Fila #{i+1}
                            </span>
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              className={`h-5 w-5 transition-transform ${expandedRows.includes(i + 100) ? 'rotate-180' : ''}`} 
                              viewBox="0 0 20 20" 
                              fill="currentColor"
                            >
                              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                          
                          {expandedRows.includes(i + 100) && (
                            <div className="p-3 divide-y divide-gray-200">
                              {result.columns.map((col, j) => (
                                <div key={j} className="py-2">
                                  <div className="text-xs font-medium text-gray-500 uppercase mb-1">{col}</div>
                                  <div className="text-sm text-gray-900">{row[col] !== null ? row[col].toString() : 'null'}</div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-8">
                    <p className="text-gray-500">{result.message}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-500">
                <FaPlayCircle className="text-4xl mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-1">Ejecuta el código para ver resultados</h3>
                <p className="max-w-md">
                  Escribe o modifica el código Python en el editor y presiona 'Ejecutar Código' para visualizar los resultados.
                </p>
              </div>
            )}
          </div>
        </div>
      );
    }
  };

  // Manejar cuando el editor está listo
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    setEditorReady(true);

    // Configuración adicional del editor cuando está montado
    editor.updateOptions({
      tabSize: 4,
      insertSpaces: true,
      fontSize: 16, // Tamaño de fuente más grande para mejor legibilidad
      lineHeight: 24, // Mayor espacio entre líneas para selección en móvil
      wordWrap: "on" // Ajuste de línea para evitar scroll horizontal
    });

    // Opcional: puedes establecer el foco en el editor
    editor.focus();
  };

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg overflow-hidden my-6 md:my-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Alerta de modo demostración */}
      {!backendAvailable && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 md:p-4 text-yellow-700 text-xs md:text-sm">
          <div className="flex">
            <div className="flex-shrink-0">
              <FaExclamationTriangle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="font-medium">Modo demostración</p>
              <p className="mt-1">
                El backend no está disponible. Se está mostrando una simulación con datos de ejemplo de Kaggle.
                Para la funcionalidad completa, el servidor Flask debe estar ejecutándose en http://localhost:5000.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Cabecera principal */}
      <div className="bg-gray-900 py-3 md:py-4 px-4 md:px-6 flex justify-between items-center">
        <h2 className="text-white text-lg md:text-xl font-bold flex items-center">
          <FaCode className="mr-2" /> Analizador de Datos Interactivo
        </h2>
        <div className="flex items-center space-x-2 md:space-x-4">
          <div className="flex items-center">
            <span className="text-gray-300 text-xs md:text-sm mr-1 md:mr-2">Dataset:</span>
            <select
              className="bg-gray-800 text-white rounded-md px-2 md:px-3 py-1 text-xs md:text-sm border border-gray-700"
              value={selectedDataset}
              onChange={(e) => loadSampleCode(e.target.value)}
            >
              {datasets.map(dataset => (
                <option key={dataset.id} value={dataset.id}>
                  {dataset.name}
                </option>
              ))}
            </select>
          </div>
          <button
            className="bg-black hover:bg-gray-800 text-white px-3 md:px-4 py-1 md:py-2 rounded-md text-xs md:text-sm font-medium flex items-center transition-all"
            onClick={runCode}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-1 h-3 w-3 md:h-4 md:w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Ejecutando...
              </span>
            ) : (
              <>
                <FaPlayCircle className="mr-1 md:mr-2" /> Ejecutar Código
              </>
            )}
          </button>
        </div>
      </div>

      {/* Pestañas para móvil - esto es lo principal */}
      <div className="lg:hidden flex border-b border-gray-200">
        <button 
          className={`flex-1 py-2 px-4 text-sm font-medium ${mobileTab === 'editor' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-700'}`}
          onClick={() => setMobileTab('editor')}
        >
          <span className="flex items-center justify-center">
            <FaCode className="mr-2" /> Editor de Código Python
          </span>
        </button>
        <button 
          className={`flex-1 py-2 px-4 text-sm font-medium ${mobileTab === 'result' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-700'}`}
          onClick={() => setMobileTab('result')}
        >
          <span className="flex items-center justify-center">
            <FaDatabase className="mr-2" /> Resultados
          </span>
        </button>
      </div>

      {/* Grid principal con contenido condicional para móvil */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        {/* Editor de código - visible según pestaña en móvil */}
        <div className={`h-[calc(100vh-200px)] border-r border-gray-200 flex flex-col ${mobileTab === 'editor' ? 'block' : 'hidden'} lg:block`}>
          {/* Encabezado del editor con puntos de colores - ALTURA AUMENTADA */}
          <div className="bg-gray-900 py-3 md:py-5 px-4 md:px-6 font-medium text-sm md:text-base flex items-center justify-between border-b border-gray-700 flex-shrink-0">
            <div className="flex items-center">
              <FaCode className="mr-2 text-blue-400" />
              <span className="text-white font-semibold">Editor de Código Python</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-green-500"></div>
            </div>
          </div>
          
          {/* Editor de código */}
          <div className="flex-grow overflow-hidden h-[calc(100vh-270px)]">
            <CodeEditor
              height="100%"
              width="100%"
              language="python"
              value={code}
              onChange={setCode}
              theme="vs-dark"
              loading={<div className="h-full w-full flex items-center justify-center bg-gray-800 text-white">Cargando editor...</div>}
              onMount={handleEditorDidMount}
              options={{
                fontSize: 16,
                fontFamily: "'Cascadia Code', Consolas, 'Source Code Pro', 'Courier New', monospace",
                fontLigatures: true,
                lineHeight: 24,
                letterSpacing: 0.5,
                theme: "vs-dark",
                semanticHighlighting: true,
                renderLineHighlight: "all",
                mouseWheelZoom: true,
                smoothScrolling: true,
                cursorBlinking: "smooth",
                cursorSmoothCaretAnimation: true,
                minimap: {
                  enabled: false, // Desactivamos en móvil
                  scale: 1,
                  showSlider: "always",
                  size: "fill"
                },
                wordWrap: "on",
                wordWrapColumn: 80,
                wrappingIndent: "same",
                autoClosingBrackets: "always",
                formatOnPaste: true,
                padding: { top: 16, bottom: 16 }, // Añadimos padding interno
                suggest: {
                  showKeywords: true,
                  showSnippets: true,
                }
              }}
            />
          </div>
        </div>
        
        {/* Panel de resultados - visible según pestaña en móvil */}
        <div className={`h-[calc(100vh-200px)] flex flex-col ${mobileTab === 'result' ? 'block' : 'hidden'} lg:block`}>
          {/* Encabezado de resultados - ALTURA AUMENTADA para consistencia */}
          <div className="bg-gray-900 py-3 md:py-5 px-4 md:px-6 font-medium text-sm md:text-base flex items-center justify-between border-b border-gray-700">
            <div className="flex items-center">
              <FaDatabase className="mr-2 text-green-400" />
              <span className="text-white font-semibold">Resultados</span>
            </div>
            {result && result.image_url && (
              <button
                onClick={downloadImage}
                className="text-blue-300 hover:text-blue-100 flex items-center text-xs md:text-sm bg-gray-700 px-2 md:px-3 py-1 md:py-2 rounded-md transition-colors"
              >
                <FaDownload className="mr-1" /> Descargar
              </button>
            )}
          </div>

          {/* Submenu de pestañas de resultados */}
          <div className="bg-gray-50 flex border-b border-gray-200 text-xs md:text-sm">
            <button
              className={`py-2 px-3 md:px-4 font-medium ${viewMode === 'code' ? 'bg-white border-b-2 border-blue-500' : 'text-gray-600 hover:bg-gray-200'}`}
              onClick={() => setViewMode('code')}
            >
              Resultados
            </button>
            <button
              className={`py-2 px-3 md:px-4 font-medium ${viewMode === 'data' ? 'bg-white border-b-2 border-blue-500' : 'text-gray-600 hover:bg-gray-200'}`}
              onClick={() => setViewMode('data')}
            >
              Datos
            </button>
            <button
              className={`py-2 px-3 md:px-4 font-medium ${viewMode === 'about' ? 'bg-white border-b-2 border-blue-500' : 'text-gray-600 hover:bg-gray-200'}`}
              onClick={() => setViewMode('about')}
            >
              Info
            </button>
          </div>

          {/* Contenido de resultados */}
          <div className="flex-1 overflow-hidden"> {/* Contenedor padre con overflow-hidden */}
            {renderContent()}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DataVisualization;