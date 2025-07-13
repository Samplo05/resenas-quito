const express = require('express');
const router = express.Router();
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary').v2;
const Resena = require('../models/Resena');

// Configurar Cloudinary con variables de entorno
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configurar almacenamiento en Cloudinary
const storage = new cloudinaryStorage.CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'sabores-de-quito',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
  },
});

const upload = multer({ storage });


// ✅ POST /api/resenas — Crear nueva reseña con imagen
router.post('/', upload.single('imagen'), async (req, res) => {
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
    console.error('Error al guardar reseña:', error);
    res.status(500).json({ mensaje: 'Error al guardar reseña' });
  }
});

// ✅ GET /api/resenas — Obtener todas las reseñas
router.get('/', async (req, res) => {
  try {
    const resenas = await Resena.find().sort({ fecha: -1 });
    res.json(resenas);
  } catch (error) {
    console.error('Error al obtener reseñas:', error);
    res.status(500).json({ mensaje: 'Error al obtener reseñas' });
  }
});

// ✅ DELETE /api/resenas/:id — Eliminar una reseña por ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ mensaje: 'ID inválido' });
    }

    const borrada = await Resena.findByIdAndDelete(id);
    if (!borrada) {
      return res.status(404).json({ mensaje: 'Reseña no encontrada' });
    }

    res.json({ mensaje: 'Reseña eliminada correctamente' });
  } catch (error) {
    console.error('Error al borrar reseña:', error);
    res.status(500).json({ mensaje: 'Error al borrar reseña' });
  }
});

// ✅ GET /api/resenas/:id — Obtener una reseña específica por ID
router.get('/:id', async (req, res) => {
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

module.exports = router;
