const db = require("../models/ConnectDatabase");

// Listar listas de um usuário:
const listUserLists = async (req, res) => {
  const { userId } = req.params;
  try {
    const lists = await db.query("SELECT * FROM lists WHERE user_id = ?", [userId]);
    res.json(lists);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar listas." });
  }
};

// Obter uma lista pelo ID:
const getListById = async (req, res) => {
  const { listId } = req.params;
  try {
    // Consultar o banco de dados para obter a lista pelo ID
    const list = await db.query("SELECT * FROM lists WHERE id = ?", [listId]);

    // Verificar se a lista existe
    if (list.length === 0) {
      return res.status(404).json({ error: "Lista não encontrada." });
    }

    // Retornar a lista encontrada
    res.json(list[0]);  // Retorna apenas a primeira (e única) lista
  } catch (error) {
    console.error("Erro ao obter lista:", error);
    res.status(500).json({ error: "Erro ao obter lista." });
  }
};

// Criar uma nova lista:
const createList = async (req, res) => {
    const { user_id, name } = req.body;  // Alterei para user_id para corresponder ao corpo da requisição
    // Verifique se os parâmetros estão presentes
    if (!user_id || !name) {
      return res.status(400).json({ error: "'user_id' e 'name' são obrigatórios." });
    }
    try {
      // Log para verificar os parâmetros
      console.log(`Criando lista: ${name}, para o usuário: ${user_id}`);
      // Execute a query para inserir a nova lista
      await db.query("INSERT INTO lists (name, user_id) VALUES (?, ?)", [name, user_id]);
      res.status(201).json({ message: "Lista criada com sucesso!" });
    } catch (error) {
      console.error("Erro ao criar lista:", error);
      res.status(500).json({ error: "Erro ao criar lista." });
    }
  };
  

// Adicionar produto à lista:
const addProductToList = async (req, res) => {
  const { listId, productId } = req.body;
  try {
    await db.query("INSERT INTO list_items (list_id, product_id) VALUES (?, ?)", [listId, productId]);
    res.status(201).json({ message: "Produto adicionado à lista!" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao adicionar produto à lista." });
  }
};

// Remover produto da lista:
const removeProductFromList = async (req, res) => {
    const { listId, productId } = req.body;
    try {
      // Deletar apenas um item do produto da lista, mesmo que haja múltiplos
      const result = await db.query(
        "DELETE FROM list_items WHERE list_id = ? AND product_id = ? LIMIT 1",
        [listId, productId]
      );
      // Verificar se nenhum produto foi removido
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Produto não encontrado." });
      }
      res.status(200).json({ message: "Produto removido da lista!" });
    } catch (error) {
      console.error("Erro ao remover produto da lista:", error);
      res.status(500).json({ error: "Erro ao remover produto da lista." });
    }
  };

// Excluir uma lista:
const deleteList = async (req, res) => {
    const { id } = req.params;
    try {
      // Executa a query de exclusão
      const result = await db.query("DELETE FROM lists WHERE id = ?", [id]);
      // Verifica se nenhuma linha foi afetada (nenhuma lista com esse ID foi encontrada)
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Lista não encontrada." });  // Retorna erro 404
      }
      res.json({ message: "Lista excluída com sucesso!" });
    } catch (error) {
      console.error("Erro ao excluir lista:", error);
      res.status(500).json({ error: "Erro ao excluir lista." });
    }
  };

// Listar os produtos de uma lista específica:
const listProductsInList = async (req, res) => {
  const { listId } = req.params;
  try {
    // Consulta SQL para listar os produtos com ID, nome, quantidade, valor unitário e valor total
    const products = await db.query(`
      SELECT p.id AS product_id, 
             p.name AS product_name, 
             COUNT(li.product_id) AS quantity, 
             p.price AS unit_value,
             (p.price * COUNT(li.product_id)) AS total_value
      FROM list_items li
      JOIN products p ON li.product_id = p.id
      WHERE li.list_id = ?
      GROUP BY p.id, p.name, p.price`, [listId]); // Incluindo p.id no GROUP BY
    // Verifica se a lista contém produtos
    if (products.length === 0) {
      return res.status(404).json({ error: "Nenhum produto encontrado para esta lista." });
    }
    // Retorna os produtos encontrados com ID, nome, quantidade, valor unitário e valor total
    res.json(products);
  } catch (error) {
    console.error("Erro ao listar produtos da lista:", error);
    res.status(500).json({ error: "Erro ao listar produtos da lista." });
  }
};

// Calcular o valor total de uma lista:
const calculateTotalValueOfList = async (req, res) => {
    const { listId } = req.params;
    try {
      // Consulta SQL corrigida para calcular o valor total da lista
      const result = await db.query(`
        SELECT SUM(p.price * quantity_per_product) AS total_value
        FROM (
          SELECT li.product_id, COUNT(li.product_id) AS quantity_per_product
          FROM list_items li
          WHERE li.list_id = ?
          GROUP BY li.product_id
        ) AS product_quantities
        JOIN products p ON product_quantities.product_id = p.id`, [listId]);
      // Verifica se o valor foi calculado
      if (result.length === 0 || result[0].total_value === null) {
        return res.status(404).json({ error: "Lista não encontrada ou sem produtos." });
      }
      // Retorna o valor total da lista
      res.json({ total_value: result[0].total_value });
    } catch (error) {
      console.error("Erro ao calcular o valor total da lista:", error);
      res.status(500).json({ error: "Erro ao calcular o valor total da lista." });
    }
};

module.exports = {
  listUserLists,
  createList,
  addProductToList,
  removeProductFromList,
  deleteList,
  listProductsInList, 
  calculateTotalValueOfList,
  getListById,
};

