let totalComissoes = 0;
let quantidadeVendedores = 0;


/*
    Função responsável por calcular
    a comissão de acordo com o total de vendas.
*/
function calcularComissao(vendas) {

    let percentual;

    if (vendas <= 1000) {

        percentual = 0.05;

    } else if (vendas <= 5000) {

        percentual = 0.075;

    } else {

        percentual = 0.10;

    }

    return vendas * percentual;
}


/*
    Função responsável por adicionar
    um vendedor ao relatório.
*/
function adicionarVendedor() {

    const nome = document.getElementById("nome").value.trim();
    const vendas = parseFloat(document.getElementById("vendas").value);

    // Validação do nome
    if (nome === "") {

        alert("Digite o nome do vendedor.");
        return;

    }

    // Validação das vendas
    if (isNaN(vendas) || vendas <= 0) {

        alert("O valor das vendas deve ser maior que zero.");
        return;

    }

    // Calcula a comissão
    const comissao = calcularComissao(vendas);

    // Adiciona a comissão ao total
    totalComissoes += comissao;

    // Incrementa a quantidade de vendedores
    quantidadeVendedores++;

    // Cria um novo item da lista
    const item = document.createElement("li");

    item.textContent =
        `${nome} - Comissão: R$ ${comissao.toFixed(2).replace(".", ",")}`;

    // Adiciona o vendedor na lista
    document.getElementById("listaVendedores").appendChild(item);

    // Calcula a média das comissões
    const mediaComissoes = totalComissoes / quantidadeVendedores;

    // Exibe o total
    document.getElementById("totalComissoes").textContent =
        totalComissoes.toFixed(2).replace(".", ",");

    // Exibe a média
    document.getElementById("mediaComissoes").textContent =
        mediaComissoes.toFixed(2).replace(".", ",");

    // Limpa os campos
    document.getElementById("nome").value = "";
    document.getElementById("vendas").value = "";

    // Volta o cursor para o nome
    document.getElementById("nome").focus();
}