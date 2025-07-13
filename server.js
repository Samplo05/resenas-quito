require('dotenv').config();

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer + Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'sabores-de-quito',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
  },
});
const upload = multer({ storage });

// MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Conectado a MongoDB'))
.catch((err) => console.error('❌ Error de conexión:', err));

// Model
const Resena = require('./models/Resena');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// API
app.post('/api/resenas', upload.single('imagen'), async (req, res) => {
  try {
    const nuevaResena = new Resena({
      nombre: req.body.nombre,
      direccion: req.body.direccion,
      comentario: req.body.comentario,
      puntuacion: Number(req.body.puntuacion),
      imagen: req.file ? req.file.path : null,
    });
    const guardada = await nuevaResena.save();
    res.status(201).json(guardada);
  } catch (error) {
    console.error('Error al guardar reseña:', error);
    res.status(500).json({ mensaje: 'Error al guardar reseña' });
  }
});

app.get('/api/resenas', async (req, res) => {
  try {
    const resenas = await Resena.find().sort({ fecha: -1 });
    res.json(resenas);
  } catch (error) {
    console.error('Error al obtener reseñas:', error);
    res.status(500).json({ mensaje: 'Error al obtener reseñas' });
  }
});

app.delete('/api/resenas', async (req, res) => {
  try {
    await Resena.deleteMany({});
    res.json({ mensaje: 'Todas las reseñas fueron borradas' });
  } catch (error) {
    console.error('Error al borrar reseñas:', error);
    res.status(500).json({ mensaje: 'Error al borrar reseñas' });
  }
});

// Página principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'principal.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});

// Obtener una reseña específica por ID
router.get('/resenas/:id', async (req, res) => {
  try {
    const resena = await Resena.findById(req.params.id);
    if (!resena) {
      return res.status(404).json({ mensaje: 'Reseña no encontrada' });
    }
    res.json(resena);
  } catch (error) {
    console.error('Error al obtener reseña:', error);
    res.status(500).json({ mensaje: 'Error al obtener la reseña' });
  }
});

