from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import os
import zipfile
from kaggle.api.kaggle_api_extended import KaggleApi

app = Flask(__name__)
CORS(app)

# Crear directorio para datasets
DATASETS_FOLDER = 'datasets'
os.makedirs(DATASETS_FOLDER, exist_ok=True)

# Inicializar API de Kaggle
api = KaggleApi()
try:
    api.authenticate()
    print("✅ API de Kaggle autenticada correctamente")
except Exception as e:
    print(f"❌ Error al autenticar la API de Kaggle: {e}")
    print("Asegúrate de que el archivo kaggle.json está en ~/.kaggle/")

# Datasets de Kaggle a usar
DATASETS = {
    "iris": "uciml/iris",
    "titanic": "competitions/titanic",
    "housing": "camnugent/california-housing-prices",
    "wine": "uciml/red-wine-quality-cortez-et-al-2009",
    "covid": "imdevskp/corona-virus-report"
}

@app.route('/api/search-kaggle', methods=['GET'])
def search_kaggle():
    query = request.args.get('query', '')
    try:
        datasets = api.dataset_list(search=query)
        results = []
        for dataset in datasets[:10]:  # Limitar a 10 resultados
            results.append({
                "id": dataset.ref,
                "name": dataset.title,
                "description": dataset.subtitle,
                "url": f"https://www.kaggle.com/{dataset.ref}"
            })
        return jsonify({"success": True, "results": results})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})

@app.route('/api/download-dataset', methods=['POST'])
def download_dataset():
    data = request.json
    dataset_ref = data.get('dataset_ref')
    
    if not dataset_ref:
        return jsonify({"success": False, "error": "No se proporcionó una referencia de dataset"})
    
    try:
        # Crear directorio para el dataset
        dataset_dir = os.path.join(DATASETS_FOLDER, dataset_ref.replace("/", "_"))
        os.makedirs(dataset_dir, exist_ok=True)
        
        # Descargar dataset
        print(f"Descargando {dataset_ref} en {dataset_dir}...")
        
        if dataset_ref.startswith("competitions/"):
            competition = dataset_ref.split("/")[1]
            api.competition_download_files(competition, path=dataset_dir)
            
            # Descomprimir si es necesario
            zip_file = os.path.join(dataset_dir, f"{competition}.zip")
            if os.path.exists(zip_file):
                with zipfile.ZipFile(zip_file, 'r') as zip_ref:
                    zip_ref.extractall(dataset_dir)
        else:
            api.dataset_download_files(dataset_ref, path=dataset_dir, unzip=True)
        
        # Obtener lista de archivos
        files = []
        for file in os.listdir(dataset_dir):
            if file.endswith('.csv'):
                file_path = os.path.join(dataset_dir, file)
                # Leer las primeras filas del CSV
                try:
                    sample_data = pd.read_csv(file_path, nrows=5)
                    files.append({
                        "name": file,
                        "path": file_path,
                        "size": os.path.getsize(file_path),
                        "columns": sample_data.columns.tolist(),
                        "sample": sample_data.to_dict(orient='records')
                    })
                except:
                    files.append({
                        "name": file,
                        "path": file_path,
                        "size": os.path.getsize(file_path),
                        "error": "No se pudo leer este archivo como CSV"
                    })
        
        return jsonify({
            "success": True, 
            "message": f"Dataset {dataset_ref} descargado correctamente",
            "files": files
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})

@app.route('/api/get-dataset', methods=['GET'])
def get_dataset():
    dataset_id = request.args.get('id', '')
    
    # Si es un dataset conocido, usar la referencia predefinida
    dataset_ref = DATASETS.get(dataset_id)
    if not dataset_ref:
        return jsonify({"success": False, "error": "Dataset no encontrado"})
    
    # Intentar descargar o cargar el dataset
    dataset_dir = os.path.join(DATASETS_FOLDER, dataset_ref.replace("/", "_"))
    
    # Si no existe, descargarlo
    if not os.path.exists(dataset_dir):
        try:
            os.makedirs(dataset_dir, exist_ok=True)
            
            print(f"Descargando {dataset_ref}...")
            if dataset_ref.startswith("competitions/"):
                competition = dataset_ref.split("/")[1]
                api.competition_download_files(competition, path=dataset_dir)
                
                # Descomprimir
                zip_file = os.path.join(dataset_dir, f"{competition}.zip")
                if os.path.exists(zip_file):
                    with zipfile.ZipFile(zip_file, 'r') as zip_ref:
                        zip_ref.extractall(dataset_dir)
            else:
                api.dataset_download_files(dataset_ref, path=dataset_dir, unzip=True)
        except Exception as e:
            return jsonify({"success": False, "error": f"Error al descargar: {str(e)}"})
    
    # Buscar archivos CSV en el directorio
    csv_files = []
    for file in os.listdir(dataset_dir):
        if file.endswith('.csv'):
            file_path = os.path.join(dataset_dir, file)
            try:
                sample_data = pd.read_csv(file_path, nrows=10)
                csv_files.append({
                    "name": file,
                    "columns": sample_data.columns.tolist(),
                    "rows": len(pd.read_csv(file_path)),
                    "preview": sample_data.to_dict(orient='records')
                })
            except:
                csv_files.append({
                    "name": file,
                    "error": "No se pudo leer este archivo"
                })
    
    return jsonify({
        "success": True,
        "dataset_id": dataset_id,
        "dataset_ref": dataset_ref,
        "files": csv_files
    })

@app.route('/')
def index():
    return jsonify({
        "status": "API funcionando",
        "endpoints": [
            {"path": "/api/search-kaggle", "method": "GET", "params": "query", "description": "Buscar datasets en Kaggle"},
            {"path": "/api/download-dataset", "method": "POST", "body": {"dataset_ref": "usuario/dataset"}, "description": "Descargar un dataset de Kaggle"},
            {"path": "/api/get-dataset", "method": "GET", "params": "id", "description": "Obtener un dataset predefinido"}
        ]
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)