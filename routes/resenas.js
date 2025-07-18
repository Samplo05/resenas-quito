const express = require('express');
const router = express.Router();
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const Resena = require('../models/Resena');

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configurar almacenamiento
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'sabores-de-quito',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
  },
});

const upload = multer({ storage });

// POST - Crear reseña
router.post('/', upload.single('imagen'), async (req, res) => {
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
});

// GET - Obtener todas
router.get('/', async (req, res) => {
  try {
    const resenas = await Resena.find().sort({ fecha: -1 });
    res.json(resenas);
  } catch (error) {
    console.error('Error al obtener reseñas:', error);
    res.status(500).json({ mensaje: 'Error al obtener reseñas' });
  }
});

// DELETE - Eliminar una por ID
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

// PUT - Editar reseña (incluye imagen opcional)
router.put('/:id', upload.single('imagen'), async (req, res) => {
  const { id } = req.params;
  const { nombre, comentario, direccion, puntuacion } = req.body;

  try {
    const resena = await Resena.findById(id);
    if (!resena) return res.status(404).json({ error: 'No encontrada' });

    resena.nombre = nombre;
    resena.comentario = comentario;
    resena.direccion = direccion;
    resena.puntuacion = puntuacion;

    if (req.file) {
      // subir imagen a Cloudinary y reemplazar la anterior
      const subida = await cloudinary.uploader.upload(req.file.path);
      resena.imagen = subida.secure_url;
    }

    await resena.save();
    res.json(resena);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error actualizando reseña' });
  }
});





module.exports = router;
