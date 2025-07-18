// models/Resena.js
const mongoose = require('mongoose');

const ResenaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  direccion: { type: String, required: true },
  comentario: { type: String, required: true },
  puntuacion: { type: Number, min: 1, max: 5, required: true },
  imagen: { type: String }, // Puede ser URL o base64
  fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Resena', ResenaSchema);
