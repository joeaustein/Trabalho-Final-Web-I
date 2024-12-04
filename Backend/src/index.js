const express = require("express");
const db = require("./models/ConnectDatabase");
const routes = require("./routes");
const cors = require("cors"); // Importar o CORS
const app = express();
const port = 3000;

// Testar a conexão com o banco de dados
db.testConnection().catch((err) => {
  console.error("Não foi possível conectar ao banco de dados. Encerrando o aplicativo.");
  process.exit(1);
});

// Configuração do CORS para permitir requisições de qualquer origem
app.use(cors()); // Permite todas as origens. Pode ser configurado para uma origem específica, se necessário.

// Middleware para analisar o corpo das requisições com JSON
app.use(express.json());

// Utilizando as rotas configuradas em routes.js
app.use(routes);

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em: http://localhost:${port}`);
});
