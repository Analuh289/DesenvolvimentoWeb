let botao = document.querySelector("button");
botao.onclick = function() {
  let nome = prompt("Qual o seu nome?");
  alert("Olá " + nome.toUpperCase() + " muito prazer em te ver!");
};
