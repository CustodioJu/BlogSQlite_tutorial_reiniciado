// Criação da biblioteca

const express = require("express"); // importa livraria do EXPRESS
const sqlite3 = require("sqlite3"); // importa livraria do sqlite3

const PORT = 8000; // Porta TCP do servidor HTTP da aplicação

const app = express(); // Instância para o uso do EXPRESS

const db = new sqlite3.Database("user.db"); // Instância para o uso do SQlite3
db.serialize(() => {
  // Este método permite enviar comandos SQL em modo 'SEQUENCIAL'
  db.run(
    "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT)"
  );
});

app.use("/static", express.static(__dirname + "/static"));

// Configurar EJS como o motor de visualização
app.set("view engine", "ejs");

// Cria conexão com o banco de dados

const index =
  "<a href='/home'>Home</a> <br><a href='/sobre'>Sobre</a> <br> <a href='/login'>Login</a> <br> <a href='/cadastro'>Cadastro</a>";
const home = "Você está na página HOME <br> <a href='/'>Voltar</a>";
const sobre = "Você está na página SOBRE  <br> <a href='/'>Voltar</a>";
const login = "Você está na página de LOGIN <br> <a href='/'>Voltar</a>";
const cadastro =
  "Você está na página de CAsDASTRO  <br> <a href='/'>Voltar</a>";

// Método express.get necessita de dois parâmetros. Na ARROW FUNCTION, o
// primeiro são os dados do servidor (REQUISITION - 'req') o segundo, são os
// dados que serão enviados ao cliente (RESULT - 'res')

app.get("/", (req, res) => {
  // Rota raiz do meu servidor, acesse o browser com o endereço http://localhost:3000/
  //res.send(index);
  res.render("index");
});

app.get("/home", (req, res) => {
  // Rota raiz do meu servidor, acesse o browser com o endereço http://localhost:3000/hom
  res.send(home);
});

app.get("/sobre", (req, res) => {
  // Rota raiz do meu servidor, acesse o browser com o endereço http://localhost:3000/sobre
  res.send(sobre);
});

app.get("/login", (req, res) => {
  // Rota raiz do meu servidor, acesse o browser com o endereço http://localhost:3000/login
  res.render("login");
});

app.post("/login", (req, res) => {
  res.send("Login ainda não implementado.");
});

app.get("/cadastro", (req, res) => {
  // Rota raiz do meu servidor, acesse o browser com o endereço http://localhost:3000/cadastro
  res.send(cadastro);
});

// O app.listen() precisa ser SEMPRE ser executado por último. (app.js)
app.listen(PORT, () => {
  console.log(`Servidor sendo executado na porta ${PORT}!`);
});
