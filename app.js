// Criação da biblioteca

const express = require("express"); // importa livraria do EXPRESS
const sqlite3 = require("sqlite3"); // importa livraria do sqlite3
const bodyParser = require("body-parser"); // importa biblioteca express
const PORT = 8000; // Porta TCP do servidor HTTP da aplicação
const session = require("express-session"); //Importa o express-session

let config = { titulo: "", rodape: "" };

const app = express(); // Instância para o uso do EXPRESS

const db = new sqlite3.Database("user.db"); // Instância para o uso do SQlite3
db.serialize(() => {
  // Este método permite enviar comandos SQL em modo 'SEQUENCIAL'
  db.run(
    `CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT,
    email TEXT, celular TEXT, cpf TEXT, rg TEXT)`
  );
});

//Configuração para uso de sessão (cookies) com Express
app.use(
  session({
    secret: "qualquersenha",
    resave: true,
    saveUninitialized: true,
  })
);

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
  // res.redirect("/cadastro", { titulo: "TutorialBlog" }); // Redirecionamento de rota

  res.render("pages/index", { ...config, req: req });
});

app.get("/usuarios", (req, res) => {
  const query = "SELECT * FROM users";
  db.all(query, (err, row) => {
    console.log(`GET /usuarios ${JSON.stringify(row)}`);
    res.send("Lista de usuários!");
  });
});

app.get("/cadastro", (req, res) => {
  console.log("GET/cadastro");
  // Rota raiz do meu servidor, acesse o browser com o endereço http://localhost:3000/cadastro
  res.render("pages/cadastro", { ...config, req: req });
});

app.get("/home", (req, res) => {
  console.log("GET/home");
  // Rota raiz do meu servidor, acesse o browser com o endereço http://localhost:3000/hom
  res.send(home);
});

app.get("/sobre", (req, res) => {
  console.log("GET/sobre");
  // Rota raiz do meu servidor, acesse o browser com o endereço http://localhost:3000/sobre
  res.render("pages/sobre", { ...config, req: req });
});

app.get("/login", (req, res) => {
  console.log("GET/login");
  // Rota raiz do meu servidor, acesse o browser com o endereço http://localhost:3000/login
  res.render("pages/login", { ...config, req: req });
});

app.get("/loginInvalido", (req, res) => {
  console.log("GET/usuarioinvalido");
  // Rota raiz do meu servidor, acesse o browser com o endereço http://localhost:3000/login
  res.render("pages/errorUser", { ...config, req: req, error: "Login Inválido" });
});

app.get("/cadastroInvalido", (req, res) => {
  console.log("GET/usuarioinvalido");
  // Rota raiz do meu servidor, acesse o browser com o endereço http://localhost:3000/login
  res.render("pages/errorUser", { ...config, req: req, error: "Usuário Já Cadastrado ou Cadastro Inválido" });
});

app.get("/error404", (req, res) => {
  console.log("GET/usuarioinvalido");
  // Rota raiz do meu servidor, acesse o browser com o endereço http://localhost:3000/login
  res.render("pages/errorUser", { ...config, req: req, error: "ERROR 404 -  ROTA NÃO ENCONTRADA" });
});


app.post("/login", (req, res) => {
  console.log("POST/login");
  const { username, password } = req.body; // Pegar parêmtros

  //Consultar o usuário no banco de dados
  const query = "SELECT * FROM users WHERE username =? AND password =?";

  console.log(`req.body: ${JSON.stringify(req.body)}`);
  db.get(query, [username, password], (err, row) => {
    if (err) throw err;
    // Se usuário válido -> registra a sessão e redireciona para o dashboard
    if (row) {
      req.session.loggedin = true;
      req.session.username = username;
      res.redirect("/dashboard");
    } // Se não, envie a mensagem de erro (Usuário inválido)
    else {
      res.redirect("/loginInvalido");
    }
  });
});

app.get("/dashboard", (req, res) => {
  console.log("GET/dashboard");
  // Rota raiz do meu servidor, acesse o browser com o endereço http://localhost:3000/sobre
  console.log(JSON.stringify(config));

  if (req.session.loggedin) {
    db.all("SELECT * FROM users", [], (err, row) => {
      if (err) throw err;
      res.render("pages/dashboard", {
        titulo: "DASHBOARD",
        dados: row,
        req: req,
      });
    });
  } else {
    console.log("Tentativa de acesso a área restrita");
    res.redirect("/");
  }
});

app.get("/logout", (req, res) => {
  // Exemplo de uma rota (END POINT) controlado pela sessão do usuário logado.
  req.session.destroy(() => {
    res.redirect("/");
  });
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
      res.redirect("/cadastroInvalido")
    } else {
      // 3. Se o usuário não existe no banco, faça o cadastro
      const insertQuery =
        "INSERT INTO users (username, password, email, celular, cpf, rg) VALUES (?,?,?,?,?,?)";
      db.run(insertQuery,[username, password, email, celular, cpf, rg],
        (err) => {
          console.log("ESTOU AQUI!",)
          //INserir a lógica do INSERT
          if(err) throw err;
          res.redirect("/login")
        }
      );
    }
  });
  // res.send(
  //   `Bem-vindo usuário: ${req.body.username}, seu email é ${req.body.email})`
  // );
});

app.use("*", (req, res) => {
  res.redirect("/error404");
});

// O app.listen() precisa ser SEMPRE ser executado por último. (app.js)
app.listen(PORT, () => {
  console.log(`Servidor sendo executado na porta ${PORT}!`);
});
