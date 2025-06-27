from api.app import app

if __name__ == '__main__':
    print("🚀 Iniciando API en http://localhost:5000")
    app.run(host='127.0.0.1', port=5000, debug=True)