let jogoAtivo = true;
let rodada = 1;

function ehValida(jogada) {
  if (jogada === "pedra" || jogada === "papel" || jogada === "tesoura") {
    return true;
  } else {
    return false;
  }
}

function jogarRodada() {
  if (jogoAtivo === false) {
    alert("O jogo foi encerrado por causa de uma jogada inválida! Atualize a página.");
    return;
  }

  let inputJ1 = document.getElementById("j1");
  let inputJ2 = document.getElementById("j2");
  let elemVencedor = document.getElementById("vencedor");
  let elemMensagem = document.getElementById("mensagem");

  let j1 = inputJ1.value.trim().toLowerCase();
  let j2 = inputJ2.value.trim().toLowerCase();

  // Validação do Jogador 1
  if (ehValida(j1) === false) {
    let erro = `Jogada inválida ("${j1}") do Jogador 1. Fim de jogo!`;
    console.log(erro);
    elemVencedor.innerText = "FIM DE JOGO!";
    elemVencedor.style.color = "red";
    elemMensagem.innerText = erro;
    jogoAtivo = false;
    return;
  }

  // Validação do Jogador 2
  if (ehValida(j2) === false) {
    let erro = `Jogada inválida ("${j2}") do Jogador 2. Fim de jogo!`;
    console.log(erro);
    elemVencedor.innerText = "FIM DE JOGO!";
    elemVencedor.style.color = "red";
    elemMensagem.innerText = erro;
    jogoAtivo = false;
    return;
  }

  // Identifica o Vencedor
  let resultado = "";

  if (j1 === j2) {
    resultado = "Empate!";
  } else if (
    (j1 === "pedra" && j2 === "tesoura") ||
    (j1 === "papel" && j2 === "pedra") ||
    (j1 === "tesoura" && j2 === "papel")
  ) {
    resultado = "Jogador 1 Venceu! 🏆";
  } else {
    resultado = "Jogador 2 Venceu! 🏆";
  }

  // Exibe na tela em destaque e também no console
  console.log(`Rodada ${rodada}: J1 (${j1}) vs J2 (${j2}) => Vencedor: ${resultado}`);
  
  elemVencedor.innerText = resultado;
  elemVencedor.style.color = "#28a745";
  elemMensagem.innerText = `Rodada ${rodada}: J1 colocou ${j1} e J2 colocou ${j2}.`;

  // Prepara para a próxima rodada
  rodada++;
  inputJ1.value = "";
  inputJ2.value = "";
  inputJ1.focus();
}