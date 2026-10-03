
let botaoGerar = document.querySelector("button");
let loginGerado = document.getElementById("loginGerado");
let senhaGerada = document.getElementById("senhaGerada");

botaoGerar.onclick = function() {
    let nomeUsuario = document.getElementById("nomeUsuario").value;
    console.log (nomeUsuario, typeof(nomeUsuario));

    // validacao
    loginGerado.textContent = "Login Gerado => "
    senhaGerada.textContent = "Senha Gerada => "
    let msgErro = document.getElementById("msgErro");
    let valido = false;
    if (nomeUsuario.length < 15){
        msgErro.innerHTML = "<h3> Nome de usuário inválido! Digite pelo menos 15 letras </h3>)";
    } else if (nomeUsuario[0] == " " || nomeUsuario[nomeUsuario.length - 1] == " ") {
        msgErro.innerHTML = "<h3> Nome de usuário inválido! Não pode existir expaço antes ou depois do nome </h3> ";
    } else if (nomeUsuario.indexOf(" ") == -1){
        msgErro.innerHTML = "<h3> Nome de usuário inválido! Nomes devem possuir pelo menos 1 sobrenome </h3> ";
    } else if (nomeUsuario.indexOf("  ") >= 0){
        msgErro.innerHTML = "<h3> Nome de usuário inválido! Nomes devem possuir somente 1 espaço entre sobrenomes </h3> ";
    } else {
        valido = true;
    }

    if (valido){
        msgErro.innerHTML = "";
        let login = "";
        let senha = "";

        // gerar login
        login = nomeUsuario[0];
        for (let x = 1; x < nomeUsuario.length; x++){
            if (nomeUsuario[x] == " "){
                login = login + nomeUsuario[x+1];
            }
        }
        login = login.toUpperCase();
        //console.log (login);
        loginGerado.textContent = "Login Gerado => " + login;

        // gerar senha
        for (let x = 0; x < login.length; x++){
            senha = senha + login.charCodeAt(x).toString().slice(0,1);
        }
        //console.log(senha);
        senhaGerada.textContent = "Senha Gerada => " + senha;

    }
}
