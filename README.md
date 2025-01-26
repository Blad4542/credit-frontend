# Frontend: Registro y Consulta de Aplicaciones

Este proyecto es una aplicación frontend que permite a los usuarios registrar solicitudes de crédito mediante un flujo de pasos y consultar las aplicaciones registradas a través de una tabla con paginación. Se integra con un backend para gestionar los datos.

## 🚀 Funcionalidades principales

- **Flujo de registro paso a paso:**

  - Ingreso de datos personales y financieros.
  - Subida de documentos en formato Base64.
  - Captura de selfie con validación facial usando `face-api.js`.

- **Tabla de consultas:**

  - Visualización de aplicaciones registradas.
  - Paginación dinámica basada en datos provenientes del backend.
  - Modal para mostrar detalles específicos de cada registro.

- **Manejo de errores:**
  - Validación en tiempo real de datos ingresados.
  - Mensajes de error y éxito en un modal.

## 🛠️ Tecnologías utilizadas

- **Framework:** [React.js](https://reactjs.org/)
- **Librerías:**
  - [React Router](https://reactrouter.com/): Navegación entre vistas.
  - [face-api.js](https://github.com/justadudewho/face-api.js): Detección facial para la validación de selfies.
  - [Axios](https://axios-http.com/): Para realizar solicitudes HTTP al backend.
- **Diseño:**
  - CSS y Tailwind CSS para un diseño limpio y responsivo.

## 🗂️ Estructura del proyecto

```plaintext
src/
├── assets/                 # Imágenes y recursos estáticos
├── components/             # Componentes reutilizables
├── pages/                  # Páginas principales
│   ├── Step1.tsx           # Paso 1 del flujo de registro
│   ├── Step2.tsx           # Paso 2 del flujo de registro
│   ├── Step3.tsx           # Paso 3: Captura de selfie y envío
│   ├── ApplicationsTable.tsx # Tabla de consultas
├── utils/                  # Utilidades y funciones auxiliares
├── App.tsx                 # Componente principal de la aplicación
└── index.tsx               # Punto de entrada de React
```

## ⚙️ Instalación y configuración

1. Clonar el repositorio
   git clone <URL-del-repositorio>
   cd frontend-app

2. Instalar dependencias
   Asegúrate de tener instalado Node.js y usa npm o yarn para instalar las dependencias:

npm install

# o

yarn install

3. Configurar variables de entorno
   Crea un archivo .env en la raíz del proyecto y define las siguientes variables según sea necesario:

env

REACT_APP_API_BASE_URL=http://<tu-backend-url>

4. Iniciar el proyecto
   Ejecuta el servidor de desarrollo:

npm start

# o

yarn start

La aplicación estará disponible en http://localhost:3000.

## 📂 Endpoints consumidos

- POST /createApplication: Registra una nueva aplicación.
- GET /getApplications?page={page}&limit={limit}: Obtiene aplicaciones paginadas.

## 💡 Cómo usar la aplicación

- **Registrar una aplicación:**
  - Completa los formularios paso a paso.
  - Carga documentos e imágenes en formato Base64.
  - Captura una selfie y verifica el rostro.
  - Envía la solicitud.
  - Consultar aplicaciones:

Navega a la tabla de aplicaciones.

Explora los registros paginados.

Haz clic en "Ver detalle" para inspeccionar cada registro.
