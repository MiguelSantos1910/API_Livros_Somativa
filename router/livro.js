const express = require('express');
const Livro = require('../models/livro.js');
const router = express.Router();

router.get('/livros-cadastrados', async(req, res) =>{
  try{
     const livros = await Livro.find();
     if(!livros || livros.length === 0){
      return res.status(200).json({ message: "Sem livros cadastrados."});
    }
    res.status(200).json(livros);
  }catch(err){
    res.status(500).json({ error: "Erro ao buscar os livros: " + err.message });
  }
});
router.post('/cadastrar-livro', async(req, res) =>{
  try{
    const { titulo, autor, ano_publicacao, isbn } = req.body;
    if(!titulo || !isbn || !autor || !ano_publicacao === undefined){
      return res.status(400).json({ error: "Parametros título, ISBN, autor e ano de publicação são obrigatórios" });
    }
    const novoLivro = new Livro({ titulo, autor, ano_publicacao, isbn });
    await novoLivro.save();
    res.status(201).json(novoLivro);
  }catch(err){
    res.status(400).json({ error: "Erro ao cadastrar o livro: " + err.message });
  }
});
router.get('/:id', async(req, res) =>{
  try{
    const livros = await Livro.findById(req.params.id);
    if(!livros){
      return res.status(404).json({ error: "Livro näo encontrado." });
    }
    res.status(200).json(livros);
  }catch(err){
    res.status(500).json({ error: "Erro ao buscar o livro: " + err.message });
  }
});
router.delete('/:id', async(req, res) =>{
  try{
    const livroDeletado = await Livro.findByIdAndDelete(req.params.id);
    if(!livroDeletado){
      return res.status(404).json({ error: "Livro näo encontrado."});
    }
    res.status(200).json({message: "Livro deletado com sucesso!"})
  }catch(err){
    res.status(500).json({error: "Erro ao deletar livro " + err.message });
  }
});
module.exports = router;