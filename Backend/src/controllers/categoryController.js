const db = require("../models/ConnectDatabase");

// Listar todas as categorias
const listCategories = async (req, res) => {
  try {
    const categories = await db.query("SELECT * FROM categories");
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar categorias." });
  }
};

// Criar uma nova categoria
const createCategory = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: "O campo 'name' é obrigatório." });
  }
  try {
    await db.query("INSERT INTO categories (name) VALUES (?)", [name]);
    res.status(201).json({ message: "Categoria criada com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar categoria." });
  }
};

// Atualizar uma categoria existente
const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: "O campo 'name' é obrigatório." });
  }
  try {
    const result = await db.query("UPDATE categories SET name = ? WHERE id = ?", [name, id]);
    // Aqui estamos acessando diretamente o ResultSetHeader
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Categoria não encontrada." });
    }
    res.json({ message: "Categoria atualizada com sucesso!" });
  } catch (error) {
    console.error("Erro ao atualizar categoria:", error);
    res.status(500).json({ error: "Erro ao atualizar categoria." });
  }
};

// Excluir uma categoria
const deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query("DELETE FROM categories WHERE id = ?", [id]);
    // Verificando diretamente o resultado
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Categoria não encontrada." });
    }
    res.json({ message: "Categoria excluída com sucesso!" });
  } catch (error) {
    console.error("Erro ao excluir categoria:", error);  // Para ajudar no debug
    res.status(500).json({ error: "Erro ao excluir categoria." });
  }
};

module.exports = {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
