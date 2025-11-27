require("dotenv").config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const { connectDB } = require('./db');
const LivroRouter = require('./router/livro');
const UsuarioRouter = require('./router/usuario');
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => res.json({ status : "OK" }));
app.use('/api/usuarios', UsuarioRouter);
app.use('/api/livros', LivroRouter);

const PORTA = process.env.PORTA || 3000;

connectDB(process.env.MONGO_URI).then(() =>{app.listen(PORTA, () => console.log(`API rodando em http://localhost:${PORTA}`));}).catch((err) =>{ console.error("Erro ao conectar no MongoDB: ", err); process.exit(1);});