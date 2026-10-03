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
      filename: './vendas_estoque.db',
      driver: sqlite3.Database
    });

    // Cria a Tabela de Produtos caso não exista
    await db.exec(`
      CREATE TABLE IF NOT EXISTS produtos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        preco DECIMAL(10,2) NOT NULL,
        quantidade INTEGER NOT NULL
      )
    `);

    // Cria a Tabela de Vendas caso não exista
    await db.exec(`
      CREATE TABLE IF NOT EXISTS vendas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        produto_id INTEGER NOT NULL,
        quantidade INTEGER NOT NULL,
        valor_total DECIMAL(10,2) NOT NULL,
        data_venda DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (produto_id) REFERENCES produtos(id)
      )
    `);

    console.log('Banco de dados SQLite ativado com sucesso.');
  } catch (error) {
    console.error('Erro ao inicializar o banco de dados:', error);
  }
})();

// -------------------------------------------------------------
// 2. ROTAS PARA GESTÃO DE ESTOQUE (PRODUTOS)
// -------------------------------------------------------------

// Listar todos os produtos cadastrados
app.get('/api/produtos', async (req, res) => {
  try {
    const produtos = await db.all('SELECT * FROM produtos ORDER BY nome ASC');
    return res.json(produtos);
  } catch (error) {
    return res.status(500).json({ erro: 'Erro ao buscar produtos no estoque.' });
  }
});

// Cadastrar um novo produto no estoque
app.post('/api/produtos', async (req, res) => {
  const { nome, preco, quantidade } = req.body;

  if (!nome || preco === undefined || quantidade === undefined) {
    return res.status(400).json({ erro: 'Todos os campos são obrigatórios.' });
  }

  try {
    await db.run(
      'INSERT INTO produtos (nome, preco, quantidade) VALUES (?, ?, ?)',
      [nome, preco, quantidade]
    );
    return res.status(201).json({ mensagem: 'Produto cadastrado com sucesso!' });
  } catch (error) {
    return res.status(500).json({ erro: 'Erro ao inserir produto.' });
  }
});

// -------------------------------------------------------------
// 3. ROTAS PARA REGISTRO E CONSULTA DE VENDAS
// -------------------------------------------------------------

// Registrar uma nova venda (Com verificação e abatimento de estoque)
app.post('/api/vendas', async (req, res) => {
  const { produto_id, quantidade } = req.body;

  if (!produto_id || !quantidade || quantidade <= 0) {
    return res.status(400).json({ erro: 'Produto e quantidade válida são obrigatórios.' });
  }

  try {
    // 1. Busca o produto no banco
    const produto = await db.get('SELECT * FROM produtos WHERE id = ?', [produto_id]);

    if (!produto) {
      return res.status(404).json({ erro: 'Produto não encontrado.' });
    }

    // 2. Valida se há estoque suficiente
    if (produto.quantidade < quantidade) {
      return res.status(400).json({ erro: `Estoque insuficiente. Restam apenas ${produto.quantidade} unidades.` });
    }

    const valor_total = produto.preco * quantidade;

    // 3. Registra a venda na tabela 'vendas'
    await db.run(
      'INSERT INTO vendas (produto_id, quantidade, valor_total) VALUES (?, ?, ?)',
      [produto_id, quantidade, valor_total]
    );

    // 4. Abate a quantidade do estoque da tabela 'produtos'
    await db.run(
      'UPDATE produtos SET quantidade = quantidade - ? WHERE id = ?',
      [quantidade, produto_id]
    );

    return res.status(201).json({ mensagem: 'Venda realizada com sucesso!' });
  } catch (error) {
    return res.status(500).json({ erro: 'Erro ao registrar venda.' });
  }
});

// Consultar vendas realizadas somente no dia atual
app.get('/api/vendas/hoje', async (req, res) => {
  try {
    const vendasHoje = await db.all(`
      SELECT v.id, p.nome AS produto_nome, v.quantidade, v.valor_total, v.data_venda
      FROM vendas v
      JOIN produtos p ON v.produto_id = p.id
      WHERE DATE(v.data_venda, 'localtime') = DATE('now', 'localtime')
      ORDER BY v.data_venda DESC
    `);
    return res.json(vendasHoje);
  } catch (error) {
    return res.status(500).json({ erro: 'Erro ao consultar vendas do dia.' });
  }
});

// -------------------------------------------------------------
// 4. INICIALIZAÇÃO DO SERVIDOR
// -------------------------------------------------------------
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});