const express = require('express');
const router = express.Router();
const multer = require('multer');
const Resena = require('../models/Resena');

// Configuración multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const extension = file.originalname.split('.').pop();
    cb(null, `${file.fieldname}-${uniqueSuffix}.${extension}`);
  }
});
const upload = multer({ storage });

// POST - Crear reseña con imagen opcional
router.post('/', upload.single('imagen'), async (req, res) => {
  try {
    const nuevaResena = new Resena({
      nombre: req.body.nombre,
      direccion: req.body.direccion,
      comentario: req.body.comentario,
      puntuacion: Number(req.body.puntuacion), // convertir a número
      imagen: req.file ? `/uploads/${req.file.filename}` : null
    });

    const guardada = await nuevaResena.save();
    res.status(201).json(guardada);
  } catch (error) {
    console.error('Error al guardar reseña:', error);
    res.status(500).json({ mensaje: 'Error al guardar reseña' });
  }
});

// GET - Obtener todas las reseñas ordenadas por fecha
router.get('/', async (req, res) => {
  try {
    const resenas = await Resena.find().sort({ fecha: -1 }); // usa fecha
    res.json(resenas);
  } catch (error) {
    console.error('Error al obtener reseñas:', error);
    res.status(500).json({ mensaje: 'Error al obtener reseñas' });
  }
});

// DELETE - Borrar reseña por ID con validación simple
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

module.exports = router;
