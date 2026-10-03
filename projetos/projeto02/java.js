const API_URL = 'http://localhost:3000/api';

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  carregarEstoque();
  carregarVendasDia();

  document.getElementById('form-produto').addEventListener('submit', cadastrarProduto);
  document.getElementById('form-venda').addEventListener('submit', registrarVenda);
});

// Busca os produtos no backend e atualiza a tabela e o menu select
async function carregarEstoque() {
  const res = await fetch(`${API_URL}/produtos`);
  const produtos = await res.json();

  const tabela = document.getElementById('tabela-estoque');
  const select = document.getElementById('venda-produto');

  tabela.innerHTML = '';
  select.innerHTML = '<option value="">Selecione um produto...</option>';

  produtos.forEach(p => {
    tabela.innerHTML += `
      <tr>
        <td>${p.id}</td>
        <td>${p.nome}</td>
        <td>R$ ${Number(p.preco).toFixed(2)}</td>
        <td><strong>${p.quantidade}</strong></td>
      </tr>
    `;

    if (p.quantidade > 0) {
      select.innerHTML += `<option value="${p.id}">${p.nome} (R$ ${Number(p.preco).toFixed(2)}) - Estq: ${p.quantidade}</option>`;
    }
  });
}

// Cadastra um novo produto no banco
async function cadastrarProduto(e) {
  e.preventDefault();

  const nome = document.getElementById('prod-nome').value;
  const preco = parseFloat(document.getElementById('prod-preco').value);
  const quantidade = parseInt(document.getElementById('prod-qtd').value);

  const res = await fetch(`${API_URL}/produtos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, preco, quantidade })
  });

  if (res.ok) {
    document.getElementById('form-produto').reset();
    carregarEstoque();
  } else {
    alert('Erro ao cadastrar produto.');
  }
}

// Registra a venda de um produto
async function registrarVenda(e) {
  e.preventDefault();

  const produto_id = parseInt(document.getElementById('venda-produto').value);
  const quantidade = parseInt(document.getElementById('venda-qtd').value);

  const res = await fetch(`${API_URL}/vendas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ produto_id, quantidade })
  });

  const dados = await res.json();

  if (res.ok) {
    document.getElementById('form-venda').reset();
    carregarEstoque();
    carregarVendasDia();
  } else {
    alert(dados.erro || 'Erro ao realizar venda.');
  }
}

// Carrega as vendas do dia atual e calcula os totais
async function carregarVendasDia() {
  const res = await fetch(`${API_URL}/vendas/hoje`);
  const vendas = await res.json();

  const tabela = document.getElementById('tabela-vendas');
  tabela.innerHTML = '';

  let faturamentoTotal = 0;
  let quantidadeTotal = 0;

  vendas.forEach(v => {
    faturamentoTotal += Number(v.valor_total);
    quantidadeTotal += v.quantidade;

    const hora = new Date(v.data_venda).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    tabela.innerHTML += `
      <tr>
        <td>${v.produto_nome}</td>
        <td>${v.quantidade}</td>
        <td>R$ ${Number(v.valor_total).toFixed(2)}</td>
        <td>${hora}</td>
      </tr>
    `;
  });

  document.getElementById('total-vendas-qtd').textContent = quantidadeTotal;
  document.getElementById('total-faturamento').textContent = `R$ ${faturamentoTotal.toFixed(2)}`;
}