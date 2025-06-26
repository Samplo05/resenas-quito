# 🍽️ Sabores de Quito

Una aplicación web para compartir y descubrir reseñas de lugares para comer en Quito.  
Desarrollada con **Node.js**, **Express**, **MongoDB**, y frontend en **HTML/CSS/JS**.

---

## 📦 Estructura del proyecto

```
sabores-quito/
│
├── public/               # Archivos frontend (HTML, CSS, JS, imágenes)
│   ├── principal.html
│   ├── styles.css
│   ├── script.js
│   └── imagenes/
│
├── uploads/              # Imágenes subidas por los usuarios
│
├── routes/
│   └── resenas.js        # Rutas de la API
│
├── models/
│   └── Resena.js         # Modelo de MongoDB
│
├── .env                  # Variables de entorno (NO subir a GitHub)
├── .gitignore
├── server.js             # Servidor principal
└── package.json
```

---

## 🚀 Instalación local

### 1. Clona el repositorio:

```bash
git clone https://github.com/tu-usuario/sabores-quito.git
cd sabores-quito
```

### 2. Instala dependencias:

```bash
npm install
```

### 3. Configura tu base de datos MongoDB

Crea un archivo `.env` en la raíz con lo siguiente:

```env
MONGODB_URI=mongodb+srv://<usuario>:<contraseña>@<cluster>.mongodb.net/saboresdb?retryWrites=true&w=majority
PORT=3000
```

> ⚠️ Reemplaza `<usuario>`, `<contraseña>` y `<cluster>` con los datos de tu cuenta de MongoDB Atlas.

### 4. Ejecuta la app:

```bash
npm start
```

Abre tu navegador en:  
👉 http://localhost:3000

---

## 🌐 Despliegue en Render

1. Crea cuenta en [render.com](https://render.com)
2. Conecta tu GitHub y crea un **Web Service**
3. En configuración:
   - **Build command**: `npm install`
   - **Start command**: `npm start`
   - **Environment variables**:
     - `MONGODB_URI`: tu conexión MongoDB
     - `PORT`: (Render lo asigna automáticamente, puedes omitirlo)
4. Haz Deploy
5. Render te dará una URL pública como:  
   `https://sabores-de-quito.onrender.com`

---

## ✍️ Funcionalidades

- [x] Enviar reseñas con imagen
- [x] Filtrar por puntuación
- [x] Eliminar reseñas (admin panel)
- [x] Soporte para modo oscuro
- [ ] Validación con login (próximamente)
- [ ] Almacenamiento externo de imágenes (S3, Cloudinary)

---

## 👨‍💻 Tecnologías usadas

- **Frontend:** HTML5, CSS3, JavaScript (vanilla)
- **Backend:** Node.js, Express.js
- **Base de datos:** MongoDB Atlas
- **Subida de imágenes:** multer
- **Despliegue:** Render.com

---

## 🛡️ Recomendaciones para producción

- No uses `uploads/` en producción sin almacenamiento externo.
- No subas `.env` ni datos sensibles a tu repositorio.
- Considera usar Cloudinary o Amazon S3 para imágenes.

---

## 📫 Contacto

Desarrollado por [Pablo Samuel Beltrán Serrano](mailto:samyserbel@gmail.com)  
¡Gracias por visitar Sabores de Quito!