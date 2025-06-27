import React, { useState } from 'react';
import { FaSearch, FaKaggle, FaDownload, FaChartBar, FaInfoCircle, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';

const KaggleSearch = ({ onDatasetSelect, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDataset, setSelectedDataset] = useState(null);

  const randomSearchTerms = [
    'covid-19', 'football', 'sales data', 'machine learning', 
    'stock market', 'netflix', 'spotify', 'twitter', 
    'cryptocurrency', 'housing', 'weather', 'food', 
    'education', 'gaming', 'movies'
  ];

  const handleSearch = async () => {
    if (!searchTerm?.trim()) {
        setError('Por favor ingresa un término de búsqueda');
        return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
        // Corregir la construcción de la URL
        const baseUrl = import.meta.env.VITE_API_BASE || 'http://localhost:5000';
        const url = `${baseUrl}/api/kaggle/search?keyword=${encodeURIComponent(searchTerm.trim())}`;
        
        console.log('🔍 Iniciando búsqueda:', url);
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        console.log('📦 Datos recibidos:', data);
        
        if (response.ok) {
            if (data.results?.length > 0) {
                // Los datos ya vienen en el formato correcto del backend
                setSearchResults(data.results);
                setError(null);
            } else {
                setSearchResults([]);
                // Mostrar sugerencias del backend
                setError(
                    <div>
                        <p>{data.message}</p>
                        {data.suggestions && (
                            <ul className="mt-2 list-disc list-inside">
                                {data.suggestions.map((suggestion, index) => (
                                    <li key={index} className="text-sm">{suggestion}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                );
            }
        } else {
            throw new Error(data.error || 'Error en la búsqueda');
        }
    } catch (err) {
        console.error('❌ Error:', err);
        setError(err.message);
        setSearchResults([]);
    } finally {
        setLoading(false);
    }
  };

  // Simplifica la función para que solo pase la referencia del dataset
  const handleDatasetSelect = (datasetRef) => {
    // Llamar directamente a la función proporcionada por el componente padre
    onDatasetSelect(datasetRef);
  };

  // Mejorar la función de búsqueda aleatoria
  const handleRandomSearch = () => {
    const randomIndex = Math.floor(Math.random() * randomSearchTerms.length);
    const randomTerm = randomSearchTerms[randomIndex];
    setSearchTerm(randomTerm);
    // Usar setTimeout para asegurar que el estado se actualice
    setTimeout(() => handleSearch(), 0);
  };

  return (
    <motion.div 
      className="bg-white rounded-lg shadow-2xl p-4 md:p-6 max-w-4xl w-full mx-auto relative overflow-hidden border border-blue-100"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Fondo decorativo */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-50 rounded-full opacity-50 z-0"></div>
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-green-50 rounded-full opacity-50 z-0"></div>
      
      {/* Botón de cerrar */}
      <button 
        onClick={onClose}
        className="absolute top-3 right-3 md:top-6 md:right-6 bg-gray-100 hover:bg-gray-200 text-gray-600 
                   rounded-full p-2 transition-all hover:rotate-90 z-20"
        aria-label="Cerrar"
      >
        <FaTimes className="text-lg" />
      </button>

      {/* Cabecera */}
      <div className="flex items-center gap-3 mb-4 md:mb-6 relative z-10">
        <div className="bg-blue-600 text-white p-2 rounded-lg">
          <FaKaggle className="text-xl md:text-2xl" />
        </div>
        <h2 className="text-lg md:text-xl font-bold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
          Búsqueda de Datasets en Kaggle
        </h2>
      </div>

      {/* Barra de búsqueda */}
      <div className="flex flex-col md:flex-row gap-2 md:gap-3 mb-4 md:mb-6 relative z-10">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Busca datasets (usa términos en inglés para mejores resultados)..."
            className="w-full px-4 py-2 border rounded-lg pl-10 focus:ring-2 focus:ring-blue-500 bg-white"
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
        <div className="flex gap-2 md:flex-nowrap">
          <button
            onClick={handleSearch}
            disabled={loading}
            className="flex-1 md:flex-none px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                     transition-colors flex items-center justify-center gap-2 disabled:opacity-50
                     hover:shadow-md"
          >
            {loading ? (
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <>
                <FaSearch /> Buscar
              </>
            )}
          </button>
          <button
            onClick={handleRandomSearch}
            disabled={loading}
            className="flex-1 md:flex-none px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 
                     transition-colors flex items-center justify-center gap-2 disabled:opacity-50
                     hover:shadow-md"
            title="Buscar un dataset aleatorio"
          >
            <FaKaggle className="mr-2" />
            <span className="hidden sm:inline">Me siento con suerte</span>
            <span className="sm:hidden">Suerte</span>
          </button>
        </div>
      </div>

      {/* Mensajes de estado */}
      {error && (
        <motion.div 
          className="mb-4 md:mb-6 p-3 md:p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-start gap-3 relative z-10"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <FaInfoCircle className="mt-1 flex-shrink-0" />
          <div>
            <p className="font-medium">Error en la búsqueda</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </motion.div>
      )}

      {/* Resultados */}
      <div className="space-y-3 max-h-[50vh] overflow-y-auto p-1 relative z-10">
        {searchResults.map((dataset) => (
          <motion.div 
            key={dataset.id}
            className="p-3 md:p-4 border rounded-lg hover:border-blue-500 transition-all hover:shadow-md bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-medium text-base md:text-lg">{dataset.name}</h3>
                <p className="text-gray-600 mt-1 text-sm md:text-base">{dataset.description}</p>
                <div className="flex gap-4 mt-2 text-xs md:text-sm text-gray-500">
                  <span>⬇️ {dataset.downloadCount.toLocaleString()} descargas</span>
                  <span>📦 {dataset.size}</span>
                </div>
              </div>
              <div className="flex flex-row md:flex-col gap-2 mt-2 md:mt-0">
                <button
                  onClick={() => handleDatasetSelect(dataset.id)}
                  className="flex-1 px-3 py-1.5 md:px-4 md:py-2 bg-green-600 text-white rounded hover:bg-green-700 
                           transition-colors flex items-center justify-center gap-1 md:gap-2 text-sm hover:shadow-md"
                >
                  <FaChartBar /> <span>Analizar</span>
                </button>
                <a
                  href={dataset.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-3 py-1.5 md:px-4 md:py-2 bg-gray-600 text-white rounded hover:bg-gray-700 
                           transition-colors flex items-center justify-center gap-1 md:gap-2 text-sm hover:shadow-md"
                >
                  <FaKaggle /> <span>Ver en Kaggle</span>
                </a>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Estado vacío */}
        {searchResults.length === 0 && !loading && !error && (
          <div className="text-center py-8 md:py-12">
            <div className="bg-blue-50 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4">
              <FaKaggle className="text-blue-400 text-3xl" />
            </div>
            <p className="text-gray-500">
              Ingresa un término de búsqueda para encontrar datasets
            </p>
          </div>
        )}
        
        {/* Indicador de carga */}
        {loading && (
          <div className="text-center py-10">
            <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-gray-600">Buscando datasets...</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default KaggleSearch;