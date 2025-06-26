# Cargar variables de entorno desde .env
from dotenv import load_dotenv
load_dotenv()

# Actualizar configuración de logging
import logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler('api.log')
    ]
)
logger = logging.getLogger(__name__)

# Capturar errores no manejados
def handle_exception(exc_type, exc_value, exc_traceback):
    if issubclass(exc_type, KeyboardInterrupt):
        sys.__excepthook__(exc_type, exc_value, exc_traceback)
        return
    logger.error("Excepción no manejada:", exc_info=(exc_type, exc_value, exc_traceback))

import sys
sys.excepthook = handle_exception

# Importaciones estándar
import time
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
from flask import Flask, request, jsonify, send_file, redirect
from flask_cors import CORS
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import io
import base64
import json
from datetime import datetime
import uuid
import os
import zipfile
from sklearn import datasets
import glob

# Importar Kaggle API
import kaggle
from kaggle.api.kaggle_api_extended import KaggleApi

# Intentar importar kaggle_search desde diferentes ubicaciones
try:
    from .kaggle_search import buscar_datasets_kaggle as kaggle_search
except ImportError:
    try:
        from kaggle_search import buscar_datasets_kaggle as kaggle_search
    except ImportError:
        # Definir función fallback que usa directamente la API de Kaggle
        def kaggle_search(keyword, max_resultados=5):
            logger.info(f"🔄 Usando API de Kaggle directamente para buscar: '{keyword}'")
            try:
                if not kaggle_available:
                    logger.error("❌ API de Kaggle no disponible")
                    return []
                
                # Usar la API de Kaggle para buscar datasets
                datasets = kaggle_api.dataset_list(search=keyword, page_size=max_resultados)
                results = []
                
                for dataset in datasets:
                    try:
                        ref = f"{dataset.ref}"
                        if not ref:
                            ref = f"{dataset.owner_username}/{dataset.slug}"
                            
                        results.append({
                            'ref': ref,
                            'titulo': dataset.title,
                            'descripcion': dataset.subtitle or '',
                            'descargas': getattr(dataset, 'downloadCount', 0),
                            'tamaño': getattr(dataset, 'size', 0),
                            'url': f"https://www.kaggle.com/datasets/{ref}"
                        })
                    except Exception as e:
                        logger.error(f"Error procesando dataset: {str(e)}")
                        continue
                
                return results
            except Exception as e:
                logger.error(f"Error en búsqueda con API de Kaggle: {str(e)}")
                return []

# Definir función de sesión Kaggle primero
def create_kaggle_session():
    """Crea una sesión de requests con reintentos"""
    session = requests.Session()
    retries = Retry(
        total=5,
        backoff_factor=0.1,
        status_forcelist=[500, 502, 503, 504]
    )
    session.mount('https://', HTTPAdapter(max_retries=retries))
    return session

# Verificar que las variables de entorno estén presentes
if not os.environ.get('KAGGLE_USERNAME') or not os.environ.get('KAGGLE_KEY'):
    raise EnvironmentError("❌ Las variables de entorno KAGGLE_USERNAME y KAGGLE_KEY no están definidas.")

# Flask setup
app = Flask(__name__)
# Configuración CORS mejorada - versión simplificada
CORS(app, 
     origins=[
         "http://localhost:5173",
         "http://localhost:4173",
         "https://analiarojasaraya.pythonanywhere.com",
         "https://analiarojasaraya.github.io",
         "https://datascience-portafolio.web.app",
         "http://192.168.1.17:5000"
     ],
     supports_credentials=True,
     allow_headers=["Content-Type", "Authorization", "Accept"],
     methods=["GET", "POST", "OPTIONS"]
)

# Rutas de carpetas según entorno
if 'PYTHONANYWHERE_DOMAIN' in os.environ:
    BASE_DIR = '/home/analiarojasaraya/data-science-portafolio'
    STATIC_DIR = os.path.join(BASE_DIR, 'static')
    UPLOAD_FOLDER = os.path.join(STATIC_DIR, 'plots')
    DATASETS_FOLDER = os.path.join(BASE_DIR, 'datasets')
    KAGGLE_CONFIG_DIR = '/home/analiarojasaraya/.kaggle'
    DEBUG = False
else:
    # Configuración para desarrollo local
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    STATIC_DIR = os.path.join(BASE_DIR, 'static')
    UPLOAD_FOLDER = os.path.join(STATIC_DIR, 'plots')
    DATASETS_FOLDER = 'datasets'
    KAGGLE_CONFIG_DIR = os.path.expanduser('~/.kaggle')
    DEBUG = True

# Crear directorios necesarios
for directory in [STATIC_DIR, UPLOAD_FOLDER, DATASETS_FOLDER, KAGGLE_CONFIG_DIR]:
    os.makedirs(directory, exist_ok=True)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Servir imágenes de gráficos
@app.route('/static/plots/<filename>')
def serve_plot(filename):
    return send_file(os.path.join(app.config['UPLOAD_FOLDER'], filename), mimetype='image/png')

# Configurar credenciales de Kaggle
def setup_kaggle_credentials():
    credentials = {
        "username": os.environ.get("KAGGLE_USERNAME"),
        "key": os.environ.get("KAGGLE_KEY")
    }
    kaggle_dir = os.path.join(os.path.expanduser('~'), '.kaggle')
    os.makedirs(kaggle_dir, exist_ok=True)
    credentials_path = os.path.join(kaggle_dir, 'kaggle.json')
    with open(credentials_path, 'w') as f:
        json.dump(credentials, f)
    if os.name != 'nt':
        os.chmod(credentials_path, 0o600)

def init_kaggle_api():
    try:
        api = KaggleApi()
        api.authenticate()
        api._session = create_kaggle_session()
        logger.info("✅ API de Kaggle autenticada correctamente")
        return api
    except Exception as e:
        logger.error(f"❌ Error al autenticar la API de Kaggle: {e}")
        return None

def setup_proxy():
    """Configura el proxy si está definido"""
    proxy = os.environ.get('https_proxy')
    if proxy:
        os.environ['KAGGLE_PROXY'] = proxy
        logger.info(f"Proxy configurado: {proxy}")

setup_kaggle_credentials()
setup_proxy()  # Llamar antes de init_kaggle_api()
kaggle_api = init_kaggle_api()
kaggle_available = kaggle_api is not None

KAGGLE_DATASETS = {
    "iris": {
        "dataset_ref": "uciml/iris",
        "file_name": "Iris.csv",
        "description": "Dataset clásico de flores iris"
    },
    "titanic": {
        "dataset_ref": "competitions/titanic",
        "file_name": "train.csv",
        "description": "Supervivencia de pasajeros del Titanic"
    },
    "housing": {
        "dataset_ref": "camnugent/california-housing-prices",
        "file_name": "housing.csv",
        "description": "Precios de viviendas en California"
    },
    "wine": {
        "dataset_ref": "uciml/red-wine-quality-cortez-et-al-2009",
        "file_name": "winequality-red.csv",
        "description": "Clasificación de calidad de vinos"
    },
    "covid": {
        "dataset_ref": "imdevskp/corona-virus-report",
        "file_name": "country_wise_latest.csv",
        "description": "Datos globales de COVID-19"
    }
}

def download_kaggle_dataset(dataset_id):
    if not kaggle_available:
        return None
    info = KAGGLE_DATASETS.get(dataset_id)
    if not info:
        return None
    path = os.path.join(DATASETS_FOLDER, dataset_id)
    file_path = os.path.join(path, info['file_name'])
    if os.path.exists(file_path):
        return file_path
    try:
        os.makedirs(path, exist_ok=True)
        if info['dataset_ref'].startswith("competitions/"):
            comp = info['dataset_ref'].split("/")[1]
            kaggle_api.competition_download_files(comp, path=path)
            zip_path = os.path.join(path, f"{comp}.zip")
            if os.path.exists(zip_path):
                with zipfile.ZipFile(zip_path, 'r') as zip_ref:
                    zip_ref.extractall(path)
        else:
            kaggle_api.dataset_download_files(info['dataset_ref'], path=path, unzip=True)
        if os.path.exists(file_path):
            return file_path
        for f in os.listdir(path):
            if f.endswith('.csv'):
                return os.path.join(path, f)
    except Exception as e:
        print(f"❌ Error al descargar dataset {dataset_id}: {e}")
    return None

def load_dataset(dataset_id):
    try:
        file_path = download_kaggle_dataset(dataset_id)
        if file_path:
            df = pd.read_csv(file_path)
            if dataset_id == 'iris' and 'Id' in df.columns:
                df.drop('Id', axis=1, inplace=True)
            elif dataset_id == 'titanic':
                df['survived'] = df['Survived']
                df['class'] = df['Pclass'].map({1: '1st', 2: '2nd', 3: '3rd'})
                df['sex'] = df['Sex']
                df['age'] = df['Age']
                df = df[['survived', 'class', 'sex', 'age', 'SibSp', 'Parch']]
                df.columns = df.columns.str.lower()
            elif dataset_id == 'housing' and 'median_house_value' in df.columns:
                df.rename(columns={'median_house_value': 'MEDV'}, inplace=True)
            elif dataset_id == 'wine':
                df.rename(columns={
                    'fixed acidity': 'fixed_acidity',
                    'volatile acidity': 'volatile_acidity',
                    'citric acid': 'citric_acid'
                }, inplace=True)
            elif dataset_id == 'covid':
                if 'Country/Region' in df.columns:
                    df.rename(columns={
                        'Country/Region': 'country',
                        'Confirmed': 'confirmed',
                        'Deaths': 'deaths',
                        'Recovered': 'recovered',
                        'Active': 'active'
                    }, inplace=True)
                    df['date'] = pd.to_datetime('2021-01-01')
            return df
    except Exception as e:
        print(f"Error cargando dataset {dataset_id}: {e}")

    # Fallbacks
    if dataset_id == "iris":
        return sns.load_dataset("iris")
    elif dataset_id == "titanic":
        return sns.load_dataset("titanic")
    elif dataset_id == "tips":
        return sns.load_dataset("tips")
    elif dataset_id == "housing":
        boston = datasets.fetch_california_housing()
        return pd.DataFrame(np.c_[boston.data, boston.target], columns=list(boston.feature_names) + ['MEDV'])
    elif dataset_id == "wine":
        wine = datasets.load_wine()
        df = pd.DataFrame(wine.data, columns=wine.feature_names)
        df['quality'] = wine.target
        return df
    elif dataset_id == "covid":
        return pd.DataFrame()

    return pd.DataFrame()

def execute_code(code, dataset_name=None):
    local_vars = {'pd': pd, 'np': np, 'plt': plt, 'sns': sns}
    if dataset_name:
        local_vars['df'] = load_dataset(dataset_name)
    plt.switch_backend('Agg')
    buf = io.BytesIO()
    try:
        exec(code, globals(), local_vars)
        if plt.get_fignums():
            plt.savefig(buf, format='png')
            plt.close('all')
            buf.seek(0)
            filename = f"{uuid.uuid4()}.png"
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            with open(filepath, 'wb') as f:
                f.write(buf.getbuffer())
            return {"success": True, "image_url": f"/static/plots/{filename}"}
        for key, val in local_vars.items():
            if isinstance(val, pd.DataFrame):
                return {
                    "success": True,
                    "data": json.loads(val.head().to_json(orient='records')),
                    "columns": val.columns.tolist()
                }
        return {"success": True, "message": "Código ejecutado sin resultados visibles"}
    except Exception as e:
        plt.close('all')
        return {"success": False, "error": str(e)}

@app.route('/api/code/run', methods=['POST'])
def run_code():
    data = request.json
    return jsonify(execute_code(data.get('code', ''), data.get('dataset')))

@app.route('/api/datasets', methods=['GET'])
def get_datasets():
    return jsonify([
        {"id": k, "name": k.title(), "description": v["description"], "source": "kaggle"}
        for k, v in KAGGLE_DATASETS.items()
    ])

@app.route('/api/code/sample', methods=['GET'])
def get_sample_code():
    samples = {
        "iris": "plt.figure(); sns.scatterplot(data=df, x='sepal_length', y='sepal_width', hue='species')",
        "titanic": "plt.figure(); sns.countplot(data=df, x='class', hue='survived')",
        "housing": "plt.hist(df['MEDV'], bins=30); plt.title('Precios de casas')",
        "wine": "sns.countplot(x='quality', data=df)",
        "covid": "# Código para análisis de COVID"
    }
    dataset = request.args.get("dataset", "iris")
    return jsonify({"code": samples.get(dataset, samples["iris"])})

@app.route('/api/status/kaggle', methods=['GET'])
def kaggle_status():
    return jsonify({
        "kaggle_api_available": kaggle_available,
        "datasets_available": list(KAGGLE_DATASETS.keys())
    })

@app.route('/api/hello')
def hello():
    return jsonify({"status": "API funcionando correctamente", "version": "1.0.0"})

@app.route('/api')
def docs():
    return jsonify({
        "title": "API de Análisis de Datos",
        "version": "1.0",
        "endpoints": [
            {
                "path": "/api/hello",
                "method": "GET",
                "description": "Verifica si la API está funcionando"
            },
            {
                "path": "/api/datasets",
                "method": "GET",
                "description": "Obtiene la lista de datasets disponibles"
            },
            {
                "path": "/api/code/run",
                "method": "POST",
                "description": "Ejecuta código Python y devuelve resultados",
                "body": {
                    "code": "string",
                    "dataset": "string (opcional)"
                }
            },
            {
                "path": "/api/code/sample",
                "method": "GET",
                "description": "Obtiene código de ejemplo para un dataset",
                "query": {
                    "dataset": "string (opcional, default: iris)"
                }
            },
            {
                "path": "/api/status/kaggle",
                "method": "GET",
                "description": "Verifica el estado de la conexión con Kaggle"
            },
            {
                "path": "/api/kaggle/search",
                "method": "GET",
                "description": "Busca datasets en Kaggle",
                "query": {
                    "keyword": "string (requerido)"
                }
            },
            {
                "path": "/api/kaggle/download",
                "method": "POST",
                "description": "Descarga y preprocesa un dataset de Kaggle",
                "body": {
                    "dataset_ref": "string (requerido, formato: username/dataset-slug)"
                },
                "response": {
                    "success": "boolean",
                    "dataset_ref": "string",
                    "files": "array de archivos CSV con información y vista previa"
                }
            },
            {
                "path": "/api/kaggle/analyze",
                "method": "POST",
                "description": "Analiza un dataset específico de Kaggle",
                "body": {
                    "dataset_ref": "string (requerido)"
                }
            }
        ]
    })

@app.before_request
def cleanup_old_plots():
    if np.random.random() < 1/3600:
        try:
            now = datetime.now()
            for f in os.listdir(app.config['UPLOAD_FOLDER']):
                path = os.path.join(app.config['UPLOAD_FOLDER'], f)
                if (now - datetime.fromtimestamp(os.path.getmtime(path))).days > 1:
                    os.remove(path)
        except Exception as e:
            print(f"Error al limpiar plots: {e}")

@app.before_request
def enforce_https():
    if request.headers.get('X-Forwarded-Proto') == 'http':
        return redirect(request.url.replace('http://', 'https://', 1), code=301)

def buscar_datasets_kaggle(keyword, max_resultados=5):
    """Adapta los resultados de kaggle_search al formato de la API"""
    try:
        # Usar la función que sabemos que funciona
        results = kaggle_search(keyword, max_resultados)
        
        # Adaptar el formato de los resultados
        formatted_results = [{
            'id': r['ref'],
            'name': r['titulo'],
            'description': r['descripcion'],
            'downloadCount': r['descargas'],
            'size': f"{r['tamaño'] / 1024 / 1024:.1f} MB",
            'url': r['url']
        } for r in results]
        
        return formatted_results

    except Exception as e:
        logger.error(f"Error buscando datasets: {str(e)}")
        return []

@app.route('/api/kaggle/search', methods=['GET'])
def search_kaggle_datasets():
    try:
        keyword = request.args.get('keyword', '').strip()
        logger.info(f"🔍 Nueva búsqueda recibida: '{keyword}'")
        
        if not keyword:
            return jsonify({
                'success': False,
                'error': 'Por favor ingresa un término de búsqueda',
                'suggestions': [
                    'soccer', 'football', 'sports',  # Términos en inglés
                    'world cup', 'premier league'
                ]
            }), 400

        # Traducir términos comunes al inglés
        term_translations = {
            'futbol': 'soccer',
            'fútbol': 'soccer',
            'deportes': 'sports'
        }
        
        # Traducir si es necesario
        search_term = term_translations.get(keyword.lower(), keyword)
        logger.info(f"🔄 Término de búsqueda traducido: '{search_term}'")
        
        # Usar la función importada de kaggle_search.py
        results = kaggle_search(search_term)
        
        if results:
            # Los resultados ya vienen en el formato correcto
            formatted_results = [{
                'id': r['ref'],
                'name': r['titulo'],
                'description': r['descripcion'],
                'downloadCount': r['descargas'],
                'size': f"{r['tamaño'] / 1024 / 1024:.1f} MB",
                'url': r['url']
            } for r in results]

            logger.info(f"✅ Se encontraron {len(formatted_results)} datasets")
            return jsonify({
                'success': True,
                'query': search_term,
                'count': len(formatted_results),
                'results': formatted_results
            })
        else:
            logger.warning(f"❌ No se encontraron resultados para: {search_term}")
            return jsonify({
                'success': True,
                'query': search_term,
                'count': 0,
                'message': f"No se encontraron datasets para '{keyword}'",
                'suggestions': [
                    'Intenta con estos términos en inglés:',
                    '- soccer (para fútbol)',
                    '- sports (para deportes)',
                    '- football statistics',
                    '- world cup data'
                ]
            })

    except Exception as e:
        logger.error(f"❌ Error en búsqueda: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# Nuevo endpoint para descargar y analizar un dataset específico
@app.route('/api/kaggle/analyze', methods=['POST'])
def analyze_kaggle_dataset():
    data = request.json
    dataset_ref = data.get('dataset_ref')
    
    if not dataset_ref:
        return jsonify({'error': 'Se requiere una referencia al dataset'}), 400
    
    try:
        # Descargar el dataset
        path = os.path.join(DATASETS_FOLDER, dataset_ref.replace('/', '_'))
        os.makedirs(path, exist_ok=True)
        
        # Descargar y extraer
        logger.info(f"📦 Descargando dataset: {dataset_ref}")
        kaggle_api.dataset_download_files(dataset_ref, path=path, unzip=True)
        
        # Buscar el primer CSV
        csv_files = glob.glob(os.path.join(path, "**/*.csv"), recursive=True)
        if not csv_files:
            return jsonify({'error': 'No se encontraron archivos CSV'}), 404
            
        # Cargar y analizar el CSV
        logger.info(f"📊 Analizando CSV: {csv_files[0]}")
        df = pd.read_csv(csv_files[0])
        
        # Generar visualizaciones básicas
        results = []
        plt.switch_backend('Agg')
        
        # 1. Correlación si hay columnas numéricas
        numeric_cols = df.select_dtypes(include=['number']).columns
        if len(numeric_cols) > 1:
            plt.figure(figsize=(10, 8))
            # Usar una matriz de correlación más pequeña si hay muchas columnas
            if len(numeric_cols) > 10:
                # Seleccionar las 10 columnas numéricas con más variabilidad
                numeric_df = df[numeric_cols].copy()
                top_cols = numeric_df.var().nlargest(10).index.tolist()
                corr_df = df[top_cols].corr()
            else:
                corr_df = df[numeric_cols].corr()
                
            sns.heatmap(corr_df, annot=True, fmt='.2f', cmap='coolwarm')
            plt.title('Matriz de Correlación')
            filename = f"corr_{uuid.uuid4()}.png"
            plt.savefig(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            plt.close()
            results.append({
                'type': 'correlation',
                'image_url': f"/static/plots/{filename}"
            })
        
        # 2. Distribuciones numéricas (máximo 5 columnas)
        for col in numeric_cols[:5]:
            plt.figure(figsize=(8, 6))
            sns.histplot(df[col].dropna(), kde=True)
            plt.title(f'Distribución de {col}')
            plt.grid(True, alpha=0.3)
            filename = f"dist_{col}_{uuid.uuid4()}.png"
            plt.savefig(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            plt.close()
            results.append({
                'type': 'distribution',
                'column': col,
                'image_url': f"/static/plots/{filename}"
            })
        
        # 3. Gráficos de barras para columnas categóricas
        categorical_cols = df.select_dtypes(include=['object']).columns
        for col in categorical_cols[:3]:  # Limitamos a 3 columnas categóricas
            if df[col].nunique() <= 20:  # Solo si hay 20 o menos categorías
                plt.figure(figsize=(10, 6))
                value_counts = df[col].value_counts().nlargest(15)
                sns.barplot(x=value_counts.index, y=value_counts.values)
                plt.title(f'Frecuencia de {col}')
                plt.xticks(rotation=45, ha='right')
                plt.tight_layout()
                filename = f"cat_{col}_{uuid.uuid4()}.png"
                plt.savefig(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                plt.close()
                results.append({
                    'type': 'categorical',
                    'column': col,
                    'image_url': f"/static/plots/{filename}"
                })
        
        return jsonify({
            'success': True,
            'dataset_info': {
                'rows': len(df),
                'columns': len(df.columns),
                'columns_info': {
                    'numeric': numeric_cols.tolist(),
                    'categorical': categorical_cols.tolist()
                },
                'null_counts': df.isnull().sum().to_dict(),
                'file_name': os.path.basename(csv_files[0])
            },
            'visualizations': results
        })
        
    except Exception as e:
        logger.error(f"❌ Error analizando dataset: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/kaggle/download', methods=['POST'])
def download_kaggle_dataset():
    try:
        data = request.json
        dataset_ref = data.get('dataset_ref')
        
        if not dataset_ref:
            return jsonify({
                'success': False,
                'error': 'Se requiere una referencia al dataset'
            }), 400
            
        # Crear directorio para el dataset
        dataset_dir = os.path.join(DATASETS_FOLDER, dataset_ref.replace('/', '_'))
        os.makedirs(dataset_dir, exist_ok=True)
        
        # Descargar dataset
        kaggle_api.dataset_download_files(dataset_ref, path=dataset_dir, unzip=True)
        
        # Listar archivos descargados
        files = []
        for file in os.listdir(dataset_dir):
            file_path = os.path.join(dataset_dir, file)
            if file.endswith('.csv'):
                try:
                    df = pd.read_csv(file_path)
                    files.append({
                        'name': file,
                        'size': os.path.getsize(file_path),
                        'rows': len(df),
                        'columns': len(df.columns),
                        'preview': df.head().to_dict('records')
                    })
                except:
                    files.append({
                        'name': file,
                        'size': os.path.getsize(file_path),
                        'error': 'No se pudo leer el archivo'
                    })
                    
        return jsonify({
            'success': True,
            'dataset_ref': dataset_ref,
            'files': files
        })
        
    except Exception as e:
        logger.error(f"Error descargando dataset: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/kaggle/search', methods=['OPTIONS'])
@app.route('/api/<path:path>', methods=['OPTIONS'])
def handle_options(path=None):
    response = jsonify({'status': 'ok'})
    return response

if __name__ == '__main__':
    try:
        logger.info("🚀 Iniciando servidor API...")
        # Verificar estado de Kaggle
        if kaggle_available:
            logger.info("✅ API de Kaggle disponible y configurada")
        else:
            logger.warning("⚠️ API de Kaggle no disponible")
            
        # Verificar directorios
        logger.info(f"📁 Directorio de uploads: {UPLOAD_FOLDER}")
        logger.info(f"📁 Directorio de datasets: {DATASETS_FOLDER}")
        
        # Iniciar servidor
        app.run(debug=True, host='0.0.0.0', port=5000)
    except Exception as e:
        logger.error(f"❌ Error fatal iniciando la aplicación: {str(e)}")
        raise
