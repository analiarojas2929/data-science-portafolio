import React, { useState } from 'react';
import { FaSearch, FaKaggle, FaDownload, FaChartBar, FaInfoCircle } from 'react-icons/fa';

const KaggleSearch = ({ onDatasetSelect }) => {
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

  const handleDatasetSelect = async (datasetRef) => {
    setLoading(true);
    setError(null);
    
    try {
      // Corregir la construcción de la URL
      const baseUrl = import.meta.env.VITE_API_BASE || 'http://localhost:5000';
      const response = await fetch(`${baseUrl}/api/kaggle/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dataset_ref: datasetRef })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        // Manejar diferentes tipos de errores
        if (response.status === 507) {
          setError("No hay suficiente espacio en el servidor. Intenta con un dataset más pequeño.");
        } else if (response.status === 413) {
          setError("El dataset es demasiado grande para analizar. Por favor selecciona uno más pequeño.");
        } else {
          setError(data.error || "Error analizando el dataset");
        }
        setLoading(false);
        return;
      }
      
      onDatasetSelect(data);
    } catch (err) {
      setError("Error de conexión. Intenta de nuevo más tarde.");
      console.error(err);
    } finally {
      setLoading(false);
    }
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
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Cabecera */}
      <div className="flex items-center gap-3 mb-6">
        <FaKaggle className="text-2xl text-blue-600" />
        <h2 className="text-xl font-semibold">Búsqueda de Datasets en Kaggle</h2>
      </div>

      {/* Barra de búsqueda */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Busca datasets (usa términos en inglés para mejores resultados)..."
            className="w-full px-4 py-2 border rounded-lg pl-10 focus:ring-2 focus:ring-blue-500"
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
        <button
          onClick={handleSearch}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                     transition-colors flex items-center gap-2 disabled:opacity-50"
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
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 
                   transition-colors flex items-center gap-2 disabled:opacity-50"
          title="Buscar un dataset aleatorio"
        >
          <FaKaggle className="mr-2" />
          Me siento con suerte
        </button>
      </div>

      {/* Mensajes de estado */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-start gap-3">
          <FaInfoCircle className="mt-1 flex-shrink-0" />
          <div>
            <p className="font-medium">Error en la búsqueda</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Resultados */}
      <div className="space-y-4">
        {searchResults.map((dataset) => (
          <div 
            key={dataset.id}
            className="p-4 border rounded-lg hover:border-blue-500 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-medium text-lg">{dataset.name}</h3>
                <p className="text-gray-600 mt-1">{dataset.description}</p>
                <div className="flex gap-4 mt-2 text-sm text-gray-500">
                  <span>⬇️ {dataset.downloadCount.toLocaleString()} descargas</span>
                  <span>📦 {dataset.size}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleDatasetSelect(dataset)}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 
                           transition-colors flex items-center gap-2"
                >
                  <FaChartBar /> Analizar
                </button>
                <a
                  href={dataset.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 
                           transition-colors flex items-center gap-2"
                >
                  <FaKaggle /> Ver en Kaggle
                </a>
              </div>
            </div>
          </div>
        ))}

        {/* Estado vacío */}
        {searchResults.length === 0 && !loading && !error && (
          <div className="text-center py-12">
            <FaKaggle className="mx-auto text-4xl text-gray-400 mb-4" />
            <p className="text-gray-500">
              Ingresa un término de búsqueda para encontrar datasets
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KaggleSearch;