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
import zipfile
from sklearn import datasets

# Importar Kaggle API
import kaggle
from kaggle.api.kaggle_api_extended import KaggleApi

# Verificar que las variables de entorno estén presentes
if not os.environ.get('KAGGLE_USERNAME') or not os.environ.get('KAGGLE_KEY'):
    raise EnvironmentError("❌ Las variables de entorno KAGGLE_USERNAME y KAGGLE_KEY no están definidas.")

# Flask setup
app = Flask(__name__)
CORS(app, origins=["*"], supports_credentials=True, allow_headers=["Content-Type", "Authorization"])

# Rutas de carpetas según entorno
if 'PYTHONANYWHERE_DOMAIN' in os.environ:
    UPLOAD_FOLDER = '/home/analiarojasaraya/data-science-portafolio/static/plots'
    DATASETS_FOLDER = '/home/analiarojasaraya/data-science-portafolio/datasets'
else:
    UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static', 'plots')
    DATASETS_FOLDER = 'datasets'

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(DATASETS_FOLDER, exist_ok=True)
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
        print("✅ API de Kaggle autenticada correctamente")
        return api
    except Exception as e:
        print(f"❌ Error al autenticar la API de Kaggle: {e}")
        return None

setup_kaggle_credentials()
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
        "endpoints": ["/api/hello", "/api/datasets", "/api/code/run", "/api/code/sample", "/api/status/kaggle"]
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

if __name__ == '__main__':
    if 'PYTHONANYWHERE_DOMAIN' in os.environ:
        print("⛅ Ejecutando en PythonAnywhere")
    else:
        app.run(debug=True, host='0.0.0.0', port=5000)
