const db = require("../models/ConnectDatabase");

// Listar todos os usuários:
const listUsers = async (req, res) => {
  try {
    const users = await db.query("SELECT id, name, email FROM users");
    res.json(users);  // Removido o [0] porque não é necessário
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar usuários." });
  }
};

// Criar um novo usuário:
const createUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }
  try {
    await db.query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, password]);
    res.status(201).json({ message: "Usuário criado com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar usuário." });
  }
};

// Atualizar um usuário existente:
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }
  try {
    const result = await db.query("UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?", [name, email, password, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }
    res.json({ message: "Usuário atualizado com sucesso!" });
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error); // Para debug
    res.status(500).json({ error: "Erro ao atualizar usuário." });
  }
};

// Excluir um usuário:
const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query("DELETE FROM users WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }
    res.json({ message: "Usuário excluído com sucesso!" });
  } catch (error) {
    console.error("Erro ao excluir usuário:", error);  // Para ajudar no debug
    res.status(500).json({ error: "Erro ao excluir usuário." });
  }
};

// Login de usuário:
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    // Verificar se email e senha foram fornecidos
    if (!email || !password) {
      return res.status(400).json({ error: "Email e senha são obrigatórios." });
    }
    try {
      // Buscar o usuário pelo email no banco de dados
      const result = await db.query("SELECT id, name, email, password FROM users WHERE email = ?", [email]);
      // Verificar se o usuário existe
      if (result.length === 0) {
        return res.status(401).json({ error: "Usuário não encontrado." });
      }
      const user = result[0];
      // Comparar a senha fornecida diretamente com a senha armazenada
      if (password !== user.password) {
        return res.status(401).json({ error: "Senha incorreta." });
      }
      // Se a senha estiver correta, enviar as informações do usuário
      res.json({
        message: "Login realizado com sucesso!",
        user: { id: user.id, name: user.name, email: user.email }
      });
    } catch (error) {
      console.error("Erro ao realizar login:", error);
      res.status(500).json({ error: "Erro ao realizar login." });
    }
  };

// Exportações:
module.exports = {
  listUsers,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
};
