let botao = document.querySelector("button");
botao.addEventListener("click", atualizarNome);
function atualizarNome() {
  let nome = prompt("Digite um novo nome");
  if (nome != null){
    alert("O NOME SERA ALTERADO !");
    botao.textContent = "Jogador 1: " + nome;
  }
}
