function validarCPF() {
    const inputCPF = document.getElementById("cpf").value.trim();

    // Valida se contém exatamente 11 dígitos numéricos
    const eApenasNumeros = /^\d{11}$/.test(inputCPF);

    if (!eApenasNumeros) {
        alert("CPF inválido, digite 11 dígitos");
        return;
    }

    // Converte a string em um array de números
    const digitos = inputCPF.split("").map(Number);

    // --- 1º DÍGITO VERIFICADOR ---
    // Multiplica os 9 primeiros dígitos pela sequência 1 a 9
    let soma1 = 0;
    for (let i = 0; i < 9; i++) {
        soma1 += digitos[i] * (i + 1);
    }

    let resto1 = soma1 % 11;
    let dv1Calculado = (resto1 === 10) ? 0 : resto1;

    // --- 2º DÍGITO VERIFICADOR ---
    // Multiplica os 10 primeiros dígitos pela sequência 0 a 9
    let soma2 = 0;
    for (let i = 0; i < 9; i++) {
        soma2 += digitos[i] * i;
    }
    soma2 += dv1Calculado * 9;

    let resto2 = soma2 % 11;
    let dv2Calculado = (resto2 === 10) ? 0 : resto2;

    // --- COMPARAÇÃO ---
    const dv1Digitado = digitos[9];
    const dv2Digitado = digitos[10];

    if (dv1Calculado === dv1Digitado && dv2Calculado === dv2Digitado) {
        alert("Dígito Correto");
    } else {
        alert("Dígito Inválido");
    }
}