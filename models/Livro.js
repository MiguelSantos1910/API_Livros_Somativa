const mongoose = require('mongoose');
const livroSchema = new mongoose.Schema({
  titulo: {type: String, required: true},
  autor: {type: String, required: true},
  ano_publicacao: {type: Number, required: true},
  isbn: {type: Number, required: true}
});
module.exports = mongoose.model('Livro', livroSchema);