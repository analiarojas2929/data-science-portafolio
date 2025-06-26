from api.app import app

if __name__ == '__main__':
    print("🚀 Iniciando API en http://192.168.1.17:5000")
    app.run(host='0.0.0.0', port=5000, debug=True)