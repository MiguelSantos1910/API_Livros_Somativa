const express = require('express');
const Usuario = require('../models/Usuario.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth.js');
const { z } = require('zod');
const router = express.Router();

const registroSchema = z.object({
  nome: z.string().min(2),
  email: z.string(),
  password: z.string().min(6)
});

const loginSchema = z.object({
  email: z.string(),
  password: z.string().min(6)
});

function signToken(usuarios){
  return jtw.sign(
      { sub: usuarios._id.toString(), email: usuarios.email, nome: usuarios.nome },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );
}

router.post('/registro', async(req, res) =>{
  try{
    const { nome, email, password } = registroSchema.parse(req.body);
    const exists = await Usuario.findOne({ email });
    if(exists){
      return res.status(409).json({ error: "Email já cadastrado!" });
    }
    const passwordHash = await bcrypt.hash(password, 12);
    const usuarios = await Usuario.create({ nome, email, passwordHash });
    const token = signToken(usuarios);
    return res.status(201).json({
      message: "Usuário registrado com sucesso!",
      usuario: { id: usuarios._id, nome: usuarios.nome, email: usuarios.email },
      token
    });
  }catch(err){
    if(err?.issues){
      return res.status(400).json({ error: "Dados inválidos", details: err.issues });
    }
    return res.status(500).json({ error: "Erro ao registrar usuário: " + err.message });
  }
});

router.post('/login', async(req, res) => {
  try{
    const { email, password } = loginSchema.parse(req.body);
    const usuarios = await Usuario.findOne({ email });
    if(!usuarios){
      return res.status(401).json({ error: "Credenciais inválidas: " + err.message });
    }
    const ok = await bcrypt.compare(password, usuarios.passwordHash);
    if(!ok){
      return res.status(401).json({error: "Credenciais inválidas: " + err.message });
    }
    const token = signToken(usuarios);
    return res.json({
      message: "Login efetuado com sucesso!",
      usuarios: { id: usuarios._id, nome: usuarios.nome, email: usuarios.email },
      token
    });
  }catch(err){
    if(err?.issues){
      return res.status(401).json({ error: "Dados inválidas: ", details: err.issues });
    }
    return res.status(500).json({ error: "Erro ao logar: " + err.message });
  }
});

router.get('/me', async(req, res) => {
  return res.json({ usuarios: req.usuarios });
});

router.get('/usuarios-cadastrados', async(req, res) =>{
  try{
    const usuarios = await Usuario.find();
    if(!usuarios || usuarios.length === 0){
      return res.status(200).json({ message: "Sem usuarios cadastrados." });
    }
    res.status(200).json(usuarios);
  }catch(err){
    res.status(500).json({ error: "Erro ao buscar usuarios cadastrados " + err.message });
  }
});

router.post('/cadastrar-usuario', async(req, res) =>{
  try{
    const { nome, email, password } = req.body;
    if(!nome || !email || !password){
      return res.status(400).json({ error: "Compos obrigatórios ausentes: " + err.message });
    }
    const passwordHash = await bcrypt.hash(password, 12);
    const novoUsuario = await Usuario.create({ nome, email, passwordHash });
    res.status(201).json(novoUsuario);
  }catch(err){
    res.status(400).json({ error: "Erro ao cadastrar usuário: " + err.message });
  }
});
router.get('/procurar-usuario/:id', async(req, res) =>{
  try{
    const usuarios = await Usuario.findById(req.params.id);
    if(!usuarios){
      return res.status(404).json({ error: "Usuário não encontrado: " + err.message });
    }
    res.status(200).json(usuarios);
  }catch(err){
    res.status(500).json({error: "Erro ao procurar o usuário: " + err.message});
  }
});
router.delete('/deletar-usuario/:id', async(req, res) =>{
  try{
    const usuarioDeletado = await Usuario.findByIdAndDelete(req.params.id);
    if(!usuarioDeletado){
      return res.status(404).json({ message: "Usuário não encontrado: " + err.message });
    }
    res.status(200).json({ message: "Usuário deletado com sucesso!" });
  }catch(err){
    res.status(500).json({ error: "Erro ao deletar o usuário: " + err.message });
  }
});
module.exports = router;