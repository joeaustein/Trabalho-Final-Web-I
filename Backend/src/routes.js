const express = require("express");
const router = express.Router();
const categoryController = require("./controllers/categoryController");
const productController = require("./controllers/productController");
const userController = require("./controllers/userController");
const listController = require("./controllers/listController"); // Adicionando o controlador de listas

// Rota de teste para verificar se a API está funcionando corretamente:
router.get("/", (request, response) => {
  console.log(request.query);
  response.json({ message: "Bem-vindo à API de Lista de Compras (Por Joelinton Dorte)" });
});

// Rotas para Produtos:
// Rota para listar todos os produtos:
router.get("/products", productController.listProducts);
// Rota para criar um novo produto:
router.post("/products", productController.createProduct);
// Rota para atualizar um produto existente:
router.put("/products/:id", productController.updateProduct);
// Rota para excluir um produto:
router.delete("/products/:id", productController.deleteProduct);

// Rotas para Categorias:
// Rota para listar todas as categorias:
router.get("/categories", categoryController.listCategories);
// Rota para criar uma nova categoria:
router.post("/categories", categoryController.createCategory);
// Rota para atualizar uma categoria existente:
router.put("/categories/:id", categoryController.updateCategory);
// Rota para excluir uma categoria:
router.delete("/categories/:id", categoryController.deleteCategory);

// Rotas para Usuários:
// Rota para listar todos os usuários:
router.get("/users", userController.listUsers);
// Rota para criar um novo usuário:
router.post("/users", userController.createUser);
// Rota para atualizar um usuário existente:
router.put("/users/:id", userController.updateUser);
// Rota para excluir um usuário:
router.delete("/users/:id", userController.deleteUser);
// Rota para Login de Usuário:
router.post("/login", userController.loginUser);  // Adicionando a rota de login

// Rotas para Listas (novas rotas adicionadas):
// Rota para listar todas as listas de um usuário:
router.get("/users/:userId/lists", listController.listUserLists);
// Rota para criar uma nova lista:
router.post("/users/:userId/lists", listController.createList);
// Rota para adicionar um produto à lista:
router.post("/lists/:listId/products", listController.addProductToList);
// Rota para remover um produto da lista:
router.delete("/lists/:listId/products", listController.removeProductFromList);
// Rota para excluir uma lista:
router.delete("/lists/:id", listController.deleteList);
// Rota para listar os produtos de uma lista específica:
router.get("/lists/:listId/products", listController.listProductsInList);
// Rota para calcular o valor total de uma lista:
router.get("/lists/:listId/total", listController.calculateTotalValueOfList); // Nova rota para calcular o total
// Rota para obter uma lista pelo ID (novo endpoint):
router.get("/lists/:listId", listController.getListById); // Adicionando a rota para obter lista pelo ID

module.exports = router;
