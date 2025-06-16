import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Skills from './pages/Skills';
import Contact from './pages/Contact';
import DataAnalytics from './pages/DataAnalytics'; // Importa la nueva página

// Importamos el ícono desde assets
import favicon from './assets/icon.png';

const App = () => {
    return (
        <HelmetProvider>
            <Router>
                <div className="flex flex-col min-h-screen">
                    <Helmet>
                        <title>Analía Rojas | Data Science Portfolio</title>
                        <link rel="icon" href={favicon} />
                        <meta name="description" content="Portafolio de Ciencia de Datos de Analía Rojas - Estudiante de Talento Digital" />
                        <meta name="keywords" content="ciencia de datos, data science, analía rojas, portfolio, talento digital" />
                        <meta name="author" content="Analía Estefanie Rojas Araya" />
                    </Helmet>
                    <Navbar />
                    <main className="flex-grow pt-16"> {/* Añadido pt-16 para compensar el navbar fijo */}
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/projects" element={<Projects />} />
                            <Route path="/skills" element={<Skills />} />
                            <Route path="/contact" element={<Contact />} />
                            <Route path="/data-analytics" element={<DataAnalytics />} /> {/* Añade la nueva ruta */}
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </Router>
        </HelmetProvider>
    );
};

export default App;