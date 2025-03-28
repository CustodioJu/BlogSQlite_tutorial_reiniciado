// Para usar o prompt em nodejs é preciso instalar essa lib (prompt-sync)

let prompt = require("prompt-sync");
prompt = prompt();

// Cálculo de Desconto -
//let preco = parseFloat(prompt("Qual o valor do produto? :")); // Solicita ao usuário o preço do produto e converte para número
//let desconto = parseFloat(prompt("Qual o valor do desconto? :")); // Solicita o valor do desconto em porcentagem e converte para número

// Função para calcular o valor com desconto
//function calcularDesconto(preco, desconto) {
// Calcula o preço com o desconto aplicado
// const resultado = preco - (preco * desconto) / 100;

// Exibe o resultado com 2 casas decimais
//console.log(`O valor com desconto é : R$${resultado.toFixed(2)}`);
//}

// Chama a função passando os valores informados pelo usuário
//calcularDesconto(preco, desconto);

// Classificação de Idade -
let idade = parseFloat(prompt("Digite a sua idade:")); // Solicita a idade do usuário

//Função para classificar a idade em diferentes faixas
function classificarIdade(idade) {
  if (idade < 12) {
    console.log("Você é uma Criança!");
  } else if (idade < 18) {
    console.log("Você é Adolescente!");
  } else {
    console.log("Você é Adulto");
  }
}
//
// Chama a função para classificar a idade
classificarIdade(idade);
