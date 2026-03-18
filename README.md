# Sistema de Reservas UTCH

Aplicación web para la gestión de reservaciones de mesas con un mapa interactivo 3D. Desarrollada para la Universidad Tecnológica de Chihuahua (UTCH).

## 🚀 Tecnologías utilizadas
- **Backend**: Python + Flask
- **Frontend**: HTML5, CSS3, JavaScript
- **Gráficos 3D**: Three.js (Renderizado aéreo interactivo de las mesas)
- **Base de datos y Login**: Firebase (Firestore & Authentication)

## 📋 Requisitos Previos
- Python 3.x instalado en el equipo.
- Credenciales de un proyecto de Google Firebase.

## ⚙️ Instrucciones de Instalación para Revisión

1. **Clonar el repositorio y entrar a la carpeta:**
   ```bash
   git clone https://github.com/EliasGuzmanS/ReservaTable.git
   cd ReservaTable
   ```

2. **Instalar dependencias de Python:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configurar Firebase (Ocultar credenciales):**
   - Ve a la carpeta `static/js/` y busca el archivo `firebase-config.example.js`.
   - Cámbiale el nombre para que se llame exactamente **`firebase-config.js`**.
   - Abre ese archivo y reemplaza los textos falsos (`TU_API_KEY`, etc.) por las llaves reales de tu proyecto de Firebase.

4. **Correr el servidor:**
   ```bash
   python app.py
   ```
   *Abre tu navegador web y entra a `http://127.0.0.1:5001`*.
