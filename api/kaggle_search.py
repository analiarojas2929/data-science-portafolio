from kaggle.api.kaggle_api_extended import KaggleApi
import os
import json
from pathlib import Path
import logging
import pandas as pd

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def setup_kaggle_credentials():
    """Configura las credenciales de Kaggle desde variables de entorno o archivo kaggle.json"""
    try:
        home = str(Path.home())
        kaggle_dir = os.path.join(home, '.kaggle')
        kaggle_file = os.path.join(kaggle_dir, 'kaggle.json')

        if not os.path.exists(kaggle_file):
            os.makedirs(kaggle_dir, exist_ok=True)
            credentials = {
                "username": os.getenv("KAGGLE_USERNAME"),
                "key": os.getenv("KAGGLE_KEY")
            }

            if not credentials["username"] or not credentials["key"]:
                raise ValueError("No se encontraron credenciales de Kaggle")

            with open(kaggle_file, 'w') as f:
                json.dump(credentials, f)

            if os.name != 'nt':
                os.chmod(kaggle_file, 0o600)

        return True

    except Exception as e:
        logger.error(f"Error configurando credenciales: {str(e)}")
        return False

def buscar_datasets_kaggle(keyword, max_resultados=5):
    """Busca datasets en Kaggle usando una palabra clave."""
    try:
        if not setup_kaggle_credentials():
            return []

        api = KaggleApi()
        api.authenticate()

        logger.info(f"🔍 Buscando datasets con keyword: {keyword}")
        datasets = api.dataset_list(search=keyword, sort_by='hottest')

        if not datasets:
            logger.info("❌ No se encontraron datasets")
            return []

        results = []
        for i, d in enumerate(datasets[:max_resultados], 1):
            dataset_info = {
                'numero': i,
                'titulo': d.title,
                'descripcion': d.subtitle or d.description or "Sin descripción",
                'ref': d.ref,  # <- CORREGIDO
                'descargas': getattr(d, 'downloadCount', 0),
                'tamaño': getattr(d, 'totalBytes', 0),
                'url': f"https://www.kaggle.com/datasets/{d.ref}"  # <- CORREGIDO
            }
            results.append(dataset_info)

            print("\n" + "="*80)
            print(f"{i}. {dataset_info['titulo']}")
            print("-"*80)
            print(f"📝 Descripción: {dataset_info['descripcion'][:200]}...")
            print(f"🔗 Ref: {dataset_info['ref']}")
            print(f"⬇️ Descargas: {dataset_info['descargas']:,}")
            print(f"📦 Tamaño: {dataset_info['tamaño'] / 1024 / 1024:.1f} MB")
            print(f"🌐 URL: {dataset_info['url']}")
        return results

    except Exception as e:
        logger.error(f"Error buscando datasets: {str(e)}")
        return []

def descargar_y_mostrar_csv(ref, output_dir="datasets"):
    """Descarga y muestra el primer archivo CSV del dataset de Kaggle."""
    try:
        api = KaggleApi()
        api.authenticate()

        os.makedirs(output_dir, exist_ok=True)
        logger.info(f"⬇️ Descargando dataset: {ref}")
        api.dataset_download_files(ref, path=output_dir, unzip=True)

        # Buscar archivo .csv
        for root, _, files in os.walk(output_dir):
            for file in files:
                if file.endswith(".csv"):
                    csv_path = os.path.join(root, file)
                    logger.info(f"✅ CSV encontrado: {csv_path}")

                    df = pd.read_csv(csv_path)
                    print("\n📊 Primeras filas del CSV:")
                    print(df.head())
                    print("\n📐 Info del dataset:")
                    print(df.info())
                    return
        print("❌ No se encontró ningún archivo CSV en el dataset.")
    except Exception as e:
        logger.error(f"Error al descargar o mostrar CSV: {e}")

def main():
    """Función principal para buscar, descargar y mostrar datasets de Kaggle."""
    print("\n🔍 Buscador de Datasets de Kaggle")
    print("="*40)

    while True:
        keyword = input("\nIngresa palabra clave (o 'salir' para terminar): ")

        if keyword.lower() == 'salir':
            break

        if not keyword.strip():
            print("❌ Por favor ingresa una palabra clave válida")
            continue

        print("\nBuscando datasets...")
        results = buscar_datasets_kaggle(keyword)

        if not results:
            print("\n❌ No se encontraron datasets con esa palabra clave")
            print("Sugerencias:")
            print("- Usa términos en inglés")
            print("- Intenta con palabras más generales")
            print("- Verifica que tengas conexión a internet")
            continue

        print(f"\n✅ Se encontraron {len(results)} datasets")

        ref = results[0]["ref"]
        print(f"\n➡️ Descargando y mostrando el primer dataset automáticamente: {ref}")
        descargar_y_mostrar_csv(ref)

if __name__ == "__main__":
    main()
