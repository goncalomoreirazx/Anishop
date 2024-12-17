const express = require('express');
const db = require('./db/connection');
const bodyParser = require('body-parser'); // Pode ser removido, pois express.json() já faz isso
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
require('dotenv').config();

const jwt = require('jsonwebtoken'); // Não está sendo usado diretamente aqui

const authRoutes = require('./routes/authRoutes');
const productRoute = require('./routes/productRoute');
const userRoutes = require('./routes/userRoute');
const CheckoutRoute = require('./routes/checkoutRoute');
const orderDetailsRoute = require('./routes/orderDetailsRoute');

const app = express();
const PORT = process.env.PORT || 5000;

// Configuração CORS
app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Permite requisições OPTIONS (pré-voo)
app.options('*', cors());

// Middlewares
app.use(express.json()); // Parsing de JSON
app.use(bodyParser.json()); // Redundante, pode ser removido

// Servir pasta de assets estaticamente
app.use('/assets', express.static(path.resolve(__dirname, '../src/assets')));

// Configuração de upload de imagens
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../src/assets/images'));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// Rotas
console.log('Registering order routes...');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoute);
app.use('/api/users', userRoutes);
app.use('/api', CheckoutRoute);
app.use('/api/checkout', CheckoutRoute);
app.use('/api/orders', orderDetailsRoute);



// Log all registered routes
app._router.stack.forEach(function(r){
  if (r.route && r.route.path){
      console.log('Route:', r.route.path)
  }
});



// Rota de upload de imagem
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Nenhuma imagem foi enviada.' });
  }

  res.status(200).json({ 
    message: 'Upload realizado com sucesso!', 
    filePath: `/assets/images/${req.file.originalname}` 
  });
});

// Rota para listar uploads
app.get('/api/uploads', (req, res) => {
  const uploadFolder = path.join(__dirname, '../src/assets/images');
  
  fs.readdir(uploadFolder, (err, files) => {
    if (err) {
      console.error('Erro ao ler os arquivos:', err);
      return res.status(500).json({ message: 'Erro ao buscar arquivos.' });
    }

    res.json(files);
  });
});

// Tratamento de erros global (opcional, mas recomendado)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Ocorreu um erro interno no servidor',
    error: process.env.NODE_ENV === 'production' ? {} : err.stack 
  });
});

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});