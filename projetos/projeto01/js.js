const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

let db;

// -------------------------------------------------------------
// 1. INICIALIZAÇÃO DO BANCO DE DADOS (SQLite)
// -------------------------------------------------------------
(async () => {
  try {
    db = await open({
      filename: './database.db',
      driver: sqlite3.Database
    });

    // Cria a tabela de usuários caso não exista
    await db.exec(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL
      )
    `);

    console.log('Banco de dados SQLite conectado e pronto.');
  } catch (error) {
    console.error('Erro ao conectar no banco de dados:', error);
  }
})();

// -------------------------------------------------------------
// 2. ROTAS DA API (Backend)
// -------------------------------------------------------------

// Rota POST: Salva um novo e-mail no banco de dados
app.post('/usuarios', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ erro: 'O campo e-mail é obrigatório.' });
  }

  try {
    await db.run('INSERT INTO usuarios (email) VALUES (?)', [email]);
    return res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!' });
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT') {
      return res.status(400).json({ erro: 'Este e-mail já está cadastrado.' });
    }
    return res.status(500).json({ erro: 'Erro interno no banco de dados.' });
  }
});

// Rota GET: Retorna todos os e-mails cadastrados
app.get('/usuarios', async (req, res) => {
  try {
    const usuarios = await db.all('SELECT * FROM usuarios');
    return res.json(usuarios);
  } catch (error) {
    return res.status(500).json({ erro: 'Erro ao buscar usuários.' });
  }
});