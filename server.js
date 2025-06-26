require('dotenv').config(); // ⚠️ Debe ir al principio

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// Conexión a MongoDB usando la variable de entorno
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Conectado a MongoDB');
})
.catch(err => {
  console.error('Error de conexión a MongoDB:', err);
});

// Middleware para entender JSON en requests
app.use(express.json());

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Importar y usar rutas de reseñas
const resenasRoutes = require('./routes/resenas');
app.use('/api/resenas', resenasRoutes);

// Ruta principal que sirve tu HTML principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'principal.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
