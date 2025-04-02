// Criação da biblioteca

const express = require("express"); // importa livraria do EXPRESS
const sqlite3 = require("sqlite3"); // importa livraria do sqlite3
const bodyParser = require("body-parser"); // importa biblioteca express
const PORT = 8000; // Porta TCP do servidor HTTP da aplicação

const app = express(); // Instância para o uso do EXPRESS

const db = new sqlite3.Database("user.db"); // Instância para o uso do SQlite3
db.serialize(() => {
  // Este método permite enviar comandos SQL em modo 'SEQUENCIAL'
  db.run(
    `CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT,
    email TEXT, celular TEXT, cpf TEXT, rg TEXT)`
  );
});

// __dirname é a variável interna do nodejs que guarda o caminho absoluto do projeto, no SO
// console.log(__dirname + "/static");

// Aqui será acrescentado uma rota "/static", para a pasta __dirname + "/static"
// O app.use é usado para acrescentar rotas novas para o Express gerenciar e pode
// usar Middleware para isto, que neste caso é o express.static, que gerencia rotas estáticas
app.use("/static", express.static(__dirname + "/static"));

//Middleware para processar as requisições do Body Parameters do cliente
app.use(bodyParser.urlencoded({ extended: true }));

// Configurar EJS como o motor de visualização
app.set("view engine", "ejs");

// Cria conexão com o banco de dados

const index =
  "<a href='/home'>Home</a> <br><a href='/sobre'>Sobre</a> <br> <a href='/login'>Login</a> <br> <a href='/cadastro'>Cadastro</a>";
const home = "Você está na página HOME <br> <a href='/'>Voltar</a>";
//const sobre = "Você está na página SOBRE  <br> <a href='/'>Voltar</a>";
const login = "Você está na página de LOGIN <br> <a href='/'>Voltar</a>";
const cadastro = "Você está na página de CADASTRO  <br> <a href='/'>Voltar</a>";

// Método express.get necessita de dois parâmetros. Na ARROW FUNCTION, o
// primeiro são os dados do servidor (REQUISITION - 'req') o segundo, são os
// dados que serão enviados ao cliente (RESULT - 'res')

app.get("/", (req, res) => {
  console.log("GET/index");
  // Rota raiz do meu servidor, acesse o browser com o endereço http://localhost:3000/
  //res.send(index);
  res.redirect("/cadastro"); // Redirecionamento de rota
});

app.get("/cadastro", (req, res) => {
  console.log("GET/cadastro");
  // Rota raiz do meu servidor, acesse o browser com o endereço http://localhost:3000/cadastro
  res.render("cadastro");
});

app.get("/home", (req, res) => {
  console.log("GET/home");
  // Rota raiz do meu servidor, acesse o browser com o endereço http://localhost:3000/hom
  res.send(home);
});

app.get("/sobre", (req, res) => {
  console.log("GET/sobre");
  // Rota raiz do meu servidor, acesse o browser com o endereço http://localhost:3000/sobre
  res.render("sobre");
});

app.get("/login", (req, res) => {
  console.log("GET/login");
  // Rota raiz do meu servidor, acesse o browser com o endereço http://localhost:3000/login
  res.render("login");
});

app.post("/login", (req, res) => {
  console.log("POST/login");
  res.send("Login ainda não implementado.");
});

app.post("/cadastro", (req, res) => {
  console.log("POST/cadastro");
  req.body
    ? console.log(JSON.stringify(req.body))
    : console.log(`Body vazio: ${req.body}`);

  const { username, password, email, celular, cpf, rg } = req.body;
  //Colocar aqui as validalçoes e inclusão no banco de dados do cadastro do usuário
  // 1. Validar dados do usuário

  // 2. Saber se ja existe no banco de dados
  query =
    "SELECT * FROM users WHERE email = ? OR cpf = ? OR  rg = ? OR username = ?";
  db.get(query, [email, cpf, rg, username], (err, row) => {
    if (err) throw err;

    if (row) {
      // A variável 'row' irá retornar os dados do banco,
      //  de dados executado através do SQL, variável query
      res.send("Usuário ja cadastrado, refaça o cadastro");
    } else {
      // 3. Se o usuário não existe no banco, faça o cadastro
      const insertQuery =
        "INSERT INTO users (username, password, email, celular, cpf, rg) VALUES (?,?,?,?,?,?)";
      db.run(
        insertQuery,
        [username, password, email, celular, cpf, rg],
        (err) => {
          //INserir a lógica do INSERT
          if (err) throw err;
          res.send("Usuário cadastrado, com sucesso");
        }
      );
    }
  });
  // res.send(
  //   `Bem-vindo usuário: ${req.body.username}, seu email é ${req.body.email})`
  // );
});

// O app.listen() precisa ser SEMPRE ser executado por último. (app.js)
app.listen(PORT, () => {
  console.log(`Servidor sendo executado na porta ${PORT}!`);
});
