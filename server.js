require('dotenv').config();

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');

const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configuración de almacenamiento para multer y cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'sabores-de-quito',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif']
  }
});

const upload = multer({ storage });

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error('Error en conexión a MongoDB:', err));

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Importar modelo y rutas
const Resena = require('./models/Resena');
const router = express.Router();

// Ruta POST para crear reseña con imagen en Cloudinary
router.post('/resenas', upload.single('imagen'), async (req, res) => {
  try {
    const imagenUrl = req.file ? req.file.path : null;

    const nuevaResena = new Resena({
      nombre: req.body.nombre,
      direccion: req.body.direccion,
      comentario: req.body.comentario,
      puntuacion: Number(req.body.puntuacion),
      imagen: imagenUrl
    });

    const guardada = await nuevaResena.save();
    res.status(201).json(guardada);
  } catch (error) {
    console.error('Error guardando reseña:', error);
    res.status(500).json({ mensaje: 'Error al guardar reseña' });
  }
});

// Ruta GET para obtener todas las reseñas ordenadas por fecha descendente
router.get('/resenas', async (req, res) => {
  try {
    const resenas = await Resena.find().sort({ fecha: -1 });
    res.json(resenas);
  } catch (error) {
    console.error('Error obteniendo reseñas:', error);
    res.status(500).json({ mensaje: 'Error al obtener reseñas' });
  }
});

// Ruta DELETE para borrar todas las reseñas
router.delete('/resenas', async (req, res) => {
  try {
    await Resena.deleteMany({});
    res.json({ mensaje: 'Todas las reseñas borradas correctamente' });
  } catch (error) {
    console.error('Error borrando reseñas:', error);
    res.status(500).json({ mensaje: 'Error al borrar reseñas' });
  }
});

app.use('/api', router);

// Ruta principal que sirve el HTML principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'principal.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
