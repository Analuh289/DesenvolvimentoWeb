let botaoAdicionar = document.getElementById("adicionar");
let botaoLimpar = document.getElementById("limpar");
let botaoRelatorio = document.getElementById("relatorio");
let nomeInput = document.getElementById("nome");
let vendasInput = document.getElementById("vendas");
let listaVendedores = document.getElementById("lista-vendedores");
let divErro = document.getElementById("erro");

let totalComissoes = 0;
let qtdVendedores = 0;

function calcularComissao(vendas) {
    if(vendas <= 1000){
        return vendas * 0.03;
    }else if(vendas <= 5000){
        return vendas * 0.05;
    }else{
        return vendas * 0.08;
    }
}

function formatarMoeda(valor){
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

botaoAdicionar.onclick = function() {
    const nome = nomeInput.value.trim();
    const vendas = parseFloat(vendasInput.value);

    if(nome === ""){
        divErro.innerText = "Por favor, informe o nome do vendedor.";
        divErro.style.display = "block";
        return;
    }

    if(vendas <= 0){
        divErro.innerText = "Informe um valor de vendas válido (maior que zero).";
        divErro.style.display = "block";
        return;
    }

    divErro.style.display = "none";
    
    const comissao = calcularComissao(vendas);

    totalComissoes += comissao;
    qtdVendedores++;

    const item = document.createElement("li");
    item.innerText = `${nome} - Vendas: ${formatarMoeda(vendas)} - Comissão: ${formatarMoeda(comissao)}`;
    listaVendedores.appendChild(item);

    nomeInput.value = "";
    vendasInput.value = "";
    nomeInput.focus();

}

botaoRelatorio.onclick = function() {
    const media = 0;
    media = totalComissoes / qtdVendedores;

    document.getElementById("total-comissoes").innerText = formatarMoeda(totalComissoes);
    document.getElementById("media-comissoes").innerText = formatarMoeda(media);
}

botaoLimpar.onclick = function() {
  totalComissoes = 0;
  qtdVendedores = 0;
  listaVendedores.innerHTML = "";
  document.getElementById("totalComissoes").innerText = "0,00";
  document.getElementById("mediaComissao").innerText = "0,00";
  inputNome.value = "";
  inputVendas.value = "";
  divErro.style.display = "none";
}
