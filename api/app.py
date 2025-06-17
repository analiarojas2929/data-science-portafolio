# Cargar variables de entorno desde .env
from dotenv import load_dotenv
load_dotenv()  # Esto cargará las variables del archivo .env

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
import tempfile
import zipfile
from sklearn import datasets

# Importar kaggle API
import kaggle
from kaggle.api.kaggle_api_extended import KaggleApi

# Verificar que las variables están disponibles
print(f"Usando cuenta de Kaggle: {os.environ.get('KAGGLE_USERNAME')}")

app = Flask(__name__)
CORS(app, origins=["*"], 
     supports_credentials=True, 
     allow_headers=["Content-Type", "Authorization"])  # Habilitar CORS para todas las rutas

# Verificar si estamos en PythonAnywhere
if 'PYTHONANYWHERE_DOMAIN' in os.environ:
    # Configuraciones específicas para PythonAnywhere
    UPLOAD_FOLDER = '/home/analiarojasaraya/mysite/static/plots'
    DATASETS_FOLDER = '/home/analiarojasaraya/mysite/datasets'
else:
    # Configuración local
    UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static', 'plots')
    DATASETS_FOLDER = 'datasets'

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# También actualiza la ruta para servir los archivos estáticos
@app.route('/static/plots/<filename>')
def serve_plot(filename):
    return send_file(os.path.join(app.config['UPLOAD_FOLDER'], filename), mimetype='image/png')

# Crear directorios necesarios
os.makedirs(DATASETS_FOLDER, exist_ok=True)

# Configurar credenciales de Kaggle en tiempo de ejecución
def setup_kaggle_credentials():
    # Credenciales de la API de Kaggle
    kaggle_credentials = {
        "username": os.environ.get("KAGGLE_USERNAME", "analiarojas"),
        "key": os.environ.get("KAGGLE_KEY", "0faf5a9174738f31c86ee611c82245e5")
    }
    
    # Directorio donde Kaggle busca las credenciales
    kaggle_dir = os.path.join(os.path.expanduser('~'), '.kaggle')
    os.makedirs(kaggle_dir, exist_ok=True)
    
    # Guardar credenciales en el archivo esperado por la API
    credentials_path = os.path.join(kaggle_dir, 'kaggle.json')
    with open(credentials_path, 'w') as f:
        json.dump(kaggle_credentials, f)
    
    # Establecer permisos adecuados (solo en sistemas Unix)
    if os.name != 'nt':  # No en Windows
        os.chmod(credentials_path, 0o600)
    
    return True

# Inicializar Kaggle API
def init_kaggle_api():
    try:
        # Las variables de entorno ya están cargadas, Kaggle las usará automáticamente
        api = KaggleApi()
        api.authenticate()
        print("✅ API de Kaggle autenticada correctamente")
        return api
    except Exception as e:
        print(f"❌ Error al autenticar la API de Kaggle: {e}")
        print(f"Variables de entorno: KAGGLE_USERNAME={os.environ.get('KAGGLE_USERNAME', 'no definido')}")
        return None

# Inicializar la API de Kaggle
setup_kaggle_credentials()  # Configurar credenciales antes de inicializar
kaggle_api = init_kaggle_api()
kaggle_available = kaggle_api is not None

# Lista de datasets a utilizar
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

# Función para descargar datasets de Kaggle
def download_kaggle_dataset(dataset_id):
    if not kaggle_available:
        return None
        
    dataset_info = KAGGLE_DATASETS.get(dataset_id)
    if not dataset_info:
        return None
    
    dataset_path = os.path.join(DATASETS_FOLDER, dataset_id)
    file_path = os.path.join(dataset_path, dataset_info['file_name'])
    
    # Si el archivo ya existe, devolver la ruta
    if os.path.exists(file_path):
        return file_path
    
    # Si no, descargarlo
    try:
        os.makedirs(dataset_path, exist_ok=True)
        
        # Determinar si es una competición o un dataset regular
        dataset_ref = dataset_info['dataset_ref']
        if dataset_ref.startswith("competitions/"):
            competition = dataset_ref.split("/")[1]
            kaggle_api.competition_download_files(competition, path=dataset_path)
            # Extraer el zip si es necesario
            zip_path = os.path.join(dataset_path, f"{competition}.zip")
            if os.path.exists(zip_path):
                with zipfile.ZipFile(zip_path, 'r') as zip_ref:
                    zip_ref.extractall(dataset_path)
        else:
            kaggle_api.dataset_download_files(dataset_ref, path=dataset_path, unzip=True)
        
        if os.path.exists(file_path):
            return file_path
        else:
            # Buscar el archivo en el directorio (puede que el nombre cambie)
            for file in os.listdir(dataset_path):
                if file.endswith('.csv'):
                    return os.path.join(dataset_path, file)
            
            return None
    except Exception as e:
        print(f"Error al descargar dataset de Kaggle {dataset_id}: {e}")
        return None

# Función para cargar un dataset (desde Kaggle o fallback a los datasets locales)
def load_dataset(dataset_id):
    if dataset_id in KAGGLE_DATASETS:
        try:
            # Intentar cargar desde Kaggle
            file_path = download_kaggle_dataset(dataset_id)
            if file_path and os.path.exists(file_path):
                df = pd.read_csv(file_path)
                
                # Limpiar y ajustar según el dataset
                if dataset_id == 'iris':
                    # Renombrar columnas si es necesario
                    if 'Id' in df.columns:
                        df = df.drop('Id', axis=1)
                    if 'Species' in df.columns:
                        # Renombrar a minúsculas
                        df.columns = [col.lower() for col in df.columns]
                        df = df.rename(columns={'species': 'species'})
                elif dataset_id == 'titanic':
                    # Limpiar y ajustar datos del Titanic
                    df['survived'] = df['Survived']
                    df['class'] = df['Pclass'].map({1: '1st', 2: '2nd', 3: '3rd'})
                    df['sex'] = df['Sex']
                    df['age'] = df['Age']
                    df = df[['survived', 'class', 'sex', 'age', 'SibSp', 'Parch']]
                    df.columns = df.columns.str.lower()
                elif dataset_id == 'housing':
                    # Renombrar la columna target a MEDV para ser consistente
                    if 'median_house_value' in df.columns:
                        df = df.rename(columns={'median_house_value': 'MEDV'})
                elif dataset_id == 'wine':
                    # Renombrar columnas para facilitar el uso
                    df = df.rename(columns={'fixed acidity': 'fixed_acidity', 
                                          'volatile acidity': 'volatile_acidity',
                                          'citric acid': 'citric_acid'})
                elif dataset_id == 'covid':
                    # Simplificar el dataset de COVID para que tenga el formato esperado
                    if 'Country/Region' in df.columns:
                        df = df.rename(columns={
                            'Country/Region': 'country', 
                            'Confirmed': 'confirmed',
                            'Deaths': 'deaths', 
                            'Recovered': 'recovered',
                            'Active': 'active'
                        })
                        df['date'] = pd.to_datetime(df['WHO Region'].fillna('2021-01-01'))
                        
                return df
        except Exception as e:
            print(f"Error al cargar dataset desde Kaggle: {e}")
    
    # Si llegamos aquí, usamos los datasets fallback
    if dataset_id == "iris":
        return sns.load_dataset('iris')
    elif dataset_id == "titanic":
        return sns.load_dataset('titanic')
    elif dataset_id == "tips":
        return sns.load_dataset('tips')
    elif dataset_id == "housing":
        boston = datasets.fetch_california_housing()
        data = np.c_[boston.data, boston.target]
        columns = list(boston.feature_names) + ['MEDV']
        return pd.DataFrame(data, columns=columns)
    elif dataset_id == "wine":
        wine = datasets.load_wine()
        df = pd.DataFrame(wine.data, columns=wine.feature_names)
        df['quality'] = wine.target
        return df
    elif dataset_id == "covid":
        # Simulamos un dataset de COVID
        dates = pd.date_range(start='2020-01-01', end='2021-12-31', freq='M')
        countries = ['USA', 'India', 'Brazil', 'UK', 'Russia', 'France', 'Germany', 'Italy', 'Spain', 'Mexico']
        data = []
        for date in dates:
            for country in countries:
                month_num = (date.year - 2020) * 12 + date.month
                confirmed = int(np.random.normal(10000 * month_num, 5000))
                deaths = int(np.random.normal(confirmed * 0.02, confirmed * 0.005))
                recovered = int(np.random.normal(confirmed * 0.7, confirmed * 0.1))
                
                data.append({
                    'date': date,
                    'country': country,
                    'confirmed': max(0, confirmed),
                    'deaths': max(0, deaths),
                    'recovered': max(0, recovered)
                })
        return pd.DataFrame(data)
    
    # Default: devolver dataset vacío
    return pd.DataFrame()

# Función para ejecutar código Python y generar un gráfico
def execute_code(code, dataset_name=None):
    # Crear un espacio local para ejecutar el código
    local_vars = {}
    
    # Cargar datasets
    if dataset_name:
        local_vars['df'] = load_dataset(dataset_name)
    
    # Variables comunes que podrían ser útiles
    local_vars['pd'] = pd
    local_vars['np'] = np
    local_vars['plt'] = plt
    local_vars['sns'] = sns
    
    # Configurar matplotlib para que use un backend no interactivo
    plt.switch_backend('Agg')
    
    # Buffer para guardar la imagen
    buf = io.BytesIO()
    
    try:
        # Ejecutar el código
        exec(code, globals(), local_vars)
        
        # Si hay una figura abierta, guardarla
        if plt.get_fignums():
            plt.savefig(buf, format='png', dpi=100)
            plt.close('all')  # Cerrar todas las figuras
            buf.seek(0)
            
            try:
                # Generar nombre único para el archivo
                filename = f"{uuid.uuid4()}.png"
                filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                
                # Verificar que el directorio existe
                os.makedirs(os.path.dirname(filepath), exist_ok=True)
                
                # Guardar el archivo
                with open(filepath, 'wb') as f:
                    f.write(buf.getbuffer())
                    
                return {
                    "success": True,
                    "image_url": f"/static/plots/{filename}",
                    "message": "Gráfico generado con éxito"
                }
            except Exception as e:
                print(f"Error al guardar el gráfico: {e}")
                # Fallback para no interrumpir la ejecución
                return {
                    "success": True,
                    "message": f"Código ejecutado correctamente, pero hubo un problema al guardar el gráfico: {e}"
                }
        
        # Si no hay gráfico pero hay un DataFrame en las variables locales
        for key, value in local_vars.items():
            if isinstance(value, pd.DataFrame):
                # Devolver las primeras filas del DataFrame como JSON
                return {
                    "success": True,
                    "data": json.loads(value.head().to_json(orient='records')),
                    "columns": value.columns.tolist(),
                    "message": f"DataFrame '{key}' procesado con éxito"
                }
        
        return {
            "success": True,
            "message": "Código ejecutado correctamente, pero no se generó ningún gráfico o DataFrame"
        }
        
    except Exception as e:
        plt.close('all')  # Cerrar todas las figuras en caso de error
        return {
            "success": False,
            "error": str(e)
        }

# Endpoints sin Swagger
@app.route('/api/datasets', methods=['GET'])
def get_datasets():
    """Obtener lista de datasets disponibles"""
    datasets = [
        {"id": "iris", "name": "Iris Dataset", "description": "Dataset clásico de flores iris", "source": "kaggle"},
        {"id": "titanic", "name": "Titanic Dataset", "description": "Supervivencia de pasajeros del Titanic", "source": "kaggle"},
        {"id": "housing", "name": "Housing Dataset", "description": "Precios de viviendas en California", "source": "kaggle"},
        {"id": "wine", "name": "Wine Quality", "description": "Clasificación de calidad de vinos", "source": "kaggle"},
        {"id": "covid", "name": "COVID-19 Global", "description": "Datos globales de COVID-19", "source": "kaggle"}
    ]
    return jsonify(datasets)

@app.route('/api/code/run', methods=['POST'])
def run_code():
    """Ejecutar código Python y devolver resultados"""
    data = request.json
    code = data.get('code', '')
    dataset = data.get('dataset', None)
    result = execute_code(code, dataset)
    return jsonify(result)

@app.route('/api/code/sample', methods=['GET'])
def get_sample_code():
    """Obtener código de ejemplo para un dataset específico"""
    dataset = request.args.get('dataset', 'iris')
    samples = {
        "iris": """# Análisis del dataset Iris de Kaggle
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# El dataset ya está cargado en 'df'

# Visualizar las primeras filas
print(df.head())

# Estadísticas descriptivas
print(df.describe())

# Crear un gráfico de dispersión por especies
plt.figure(figsize=(10, 6))
sns.scatterplot(data=df, x='sepal_length', y='sepal_width', hue='species')
plt.title('Relación entre Longitud y Ancho del Sépalo por Especie')
plt.grid(True, alpha=0.3)
plt.tight_layout()""",

        "titanic": """# Análisis de supervivencia en el Titanic (Kaggle)
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
plt.tight_layout()""",

        "housing": """# Análisis del Housing Dataset de Kaggle
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
plt.title('Distribución de Precios de Viviendas en California')
plt.xlabel('Precio Medio ($1000s)')
plt.ylabel('Frecuencia')
plt.grid(True, alpha=0.3)
plt.tight_layout()""",

        "wine": """# Análisis de calidad de vinos de Kaggle
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np

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
plt.tight_layout()""",

        "covid": """# Análisis de datos COVID-19 de Kaggle
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
from datetime import datetime

# El dataset ya está cargado en 'df'
# Columnas: date, country, confirmed, deaths, recovered

# Preparamos datos
top_countries = df.groupby('country')['confirmed'].max().nlargest(5).index.tolist()
df_top = df[df['country'].isin(top_countries)]

# Visualizamos casos por país
plt.figure(figsize=(12, 8))
for country in top_countries:
    country_data = df_top[df_top['country'] == country]
    plt.plot(country_data['date'], country_data['confirmed'], label=country)

plt.title('Casos Confirmados de COVID-19 en los 5 Países más Afectados')
plt.xlabel('Fecha')
plt.ylabel('Casos Confirmados')
plt.legend()
plt.grid(True, alpha=0.3)
plt.xticks(rotation=45)
plt.tight_layout()"""
    }
    
    return jsonify({"code": samples.get(dataset, samples["iris"])})

@app.route('/api/status/kaggle', methods=['GET'])
def get_kaggle_status():
    """Obtener el estado de la conexión con Kaggle"""
    return jsonify({
        "kaggle_api_available": kaggle_available,
        "datasets_available": list(KAGGLE_DATASETS.keys())
    })

# Ruta para probar que el servidor está funcionando
@app.route('/api/hello')
def hello_world():
    """Test API status"""
    return jsonify({
        "status": "API funcionando correctamente",
        "version": "1.0.0"
    })

# Documentación básica de la API
@app.route('/api')
def api_docs():
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
                "body": {"code": "string", "dataset": "string (opcional)"}
            },
            {
                "path": "/api/code/sample",
                "method": "GET",
                "description": "Obtiene código de ejemplo para un dataset",
                "query": {"dataset": "string (opcional, default: iris)"}
            },
            {
                "path": "/api/status/kaggle",
                "method": "GET",
                "description": "Verifica el estado de la conexión con Kaggle"
            }
        ]
    })

# Limpieza periódica de archivos antiguos
@app.before_request
def cleanup_old_plots():
    # Limpiar archivos antiguos una vez por hora aproximadamente (1/3600 probabilidad por request)
    if np.random.random() < 1/3600:
        try:
            now = datetime.now()
            plot_dir = app.config['UPLOAD_FOLDER']
            for filename in os.listdir(plot_dir):
                file_path = os.path.join(plot_dir, filename)
                file_modified = datetime.fromtimestamp(os.path.getmtime(file_path))
                if (now - file_modified).days > 1:  # Eliminar archivos de más de un día
                    os.remove(file_path)
        except Exception as e:
            print(f"Error durante limpieza: {e}")

@app.before_request
def enforce_https():
    if request.headers.get('X-Forwarded-Proto') == 'http':
        url = request.url.replace('http://', 'https://', 1)
        return redirect(url, code=301)

if __name__ == '__main__':
    # Verificar si estamos en PythonAnywhere
    if 'PYTHONANYWHERE_DOMAIN' in os.environ:
        print("Ejecutando en PythonAnywhere - el servidor WSGI gestionará la ejecución")
    else:
        # Modo desarrollo local
        app.run(debug=True, host='0.0.0.0', port=5000)
else:
    # Para producción
    # No ejecutes el servidor aquí, Gunicorn/uWSGI se encargará de eso
    pass