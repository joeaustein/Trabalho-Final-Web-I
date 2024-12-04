const db = require("../models/ConnectDatabase");

// Listar todos os produtos
const listProducts = async (req, res) => {
  try {
    const products = await db.query(`
      SELECT products.*, categories.name AS category_name 
      FROM products 
      LEFT JOIN categories ON products.category_id = categories.id
    `);
    res.json(products);  // Removido o [0] porque não é necessário
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar produtos." });
  }
};

// Criar um novo produto
const createProduct = async (req, res) => {
  const { name, price, category_id } = req.body;
  if (!name || !price || !category_id) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }
  try {
    await db.query("INSERT INTO products (name, price, category_id) VALUES (?, ?, ?)", [name, price, category_id]);
    res.status(201).json({ message: "Produto criado com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar produto." });
  }
};

// Atualizar um produto existente
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, category_id } = req.body;
  if (!name || !price || !category_id) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }
  try {
    const result = await db.query("UPDATE products SET name = ?, price = ?, category_id = ? WHERE id = ?", [name, price, category_id, id]);
    // Acessando diretamente o ResultSetHeader
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Produto não encontrado." });
    }
    res.json({ message: "Produto atualizado com sucesso!" });
  } catch (error) {
    console.error("Erro ao atualizar produto:", error); // Para debug
    res.status(500).json({ error: "Erro ao atualizar produto." });
  }
};

// Excluir um produto
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query("DELETE FROM products WHERE id = ?", [id]);
    // Verificando diretamente o resultado
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Produto não encontrado." });
    }
    res.json({ message: "Produto excluído com sucesso!" });
  } catch (error) {
    console.error("Erro ao excluir produto:", error);  // Para ajudar no debug
    res.status(500).json({ error: "Erro ao excluir produto." });
  }
};

module.exports = {
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
