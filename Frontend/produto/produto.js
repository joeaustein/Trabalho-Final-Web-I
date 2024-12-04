document.addEventListener("DOMContentLoaded", () => {
    const newProductButton = document.getElementById("newProductButton");
    const editProductButton = document.getElementById("editProductButton");
    const productForm = document.getElementById("productForm");
    const productName = document.getElementById("productName");
    const productPrice = document.getElementById("productPrice");
    const categorySelect = document.getElementById("categorySelect");
    const addCategoryButton = document.getElementById("addCategoryButton");
    const categoryForm = document.getElementById("categoryForm");
    const categoryName = document.getElementById("categoryName");
    const submitButton = document.getElementById("submitButton");
    const productSelectContainer = document.getElementById("productSelectContainer");
    const productSelect = document.getElementById("productSelect");

    let isEditing = false;

    newProductButton.addEventListener("click", () => {
        isEditing = false;
        resetForm();
        loadCategories();
        productForm.style.display = "block";
        submitButton.textContent = "Cadastrar";
        submitButton.disabled = false;

        // Liberar campos para edição ao clicar em "Novo Produto"
        productName.disabled = false;
        productPrice.disabled = false;
        categorySelect.disabled = false;
    });

    editProductButton.addEventListener("click", () => {
        isEditing = true;
        resetForm();
        loadCategories();
        loadProducts();
        productForm.style.display = "block";
        submitButton.textContent = "Atualizar";
        submitButton.disabled = false;

        // Liberar campos para edição ao clicar em "Editar Produto"
        productName.disabled = false;
        productPrice.disabled = false;
        categorySelect.disabled = false;
    });

    submitButton.addEventListener("click", async () => {
        const name = productName.value;
        const price = parseFloat(productPrice.value);
        const categoryId = categorySelect.value;

        const productData = { name, price, category_id: categoryId };

        try {
            const url = isEditing ? `http://localhost:3000/products/${productSelect.value}` : 'http://localhost:3000/products';
            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(productData)
            });

            if (response.ok) {
                alert(isEditing ? "Produto atualizado!" : "Produto cadastrado!");
                resetForm();
            } else {
                alert("Falha ao salvar produto.");
            }
        } catch (error) {
            console.error("Erro ao salvar produto:", error);
            alert("Erro ao salvar produto.");
        }
    });

    addCategoryButton.addEventListener("click", () => {
        categoryForm.style.display = "block";
    });

    document.getElementById("addCategory").addEventListener("click", async () => {
        const category = categoryName.value;
        try {
            const response = await fetch("http://localhost:3000/categories", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name: category })
            });

            if (response.ok) {
                alert("Categoria cadastrada!");
                loadCategories();
                categoryName.value = '';
                categoryForm.style.display = "none";
            } else {
                alert("Falha ao cadastrar categoria.");
            }
        } catch (error) {
            console.error("Erro ao cadastrar categoria:", error);
            alert("Erro ao cadastrar categoria.");
        }
    });

    async function loadCategories() {
        try {
            const response = await fetch("http://localhost:3000/categories");
            const categories = await response.json();

            categorySelect.innerHTML = '';
            categories.forEach(category => {
                const option = document.createElement("option");
                option.value = category.id;
                option.textContent = category.name;
                categorySelect.appendChild(option);
            });
        } catch (error) {
            console.error("Erro ao carregar categorias:", error);
            alert("Erro ao carregar categorias.");
        }
    }

    async function loadProducts() {
        try {
            const response = await fetch("http://localhost:3000/products");
            const products = await response.json();

            productSelect.innerHTML = '';
            products.forEach(product => {
                const option = document.createElement("option");
                option.value = product.id;
                option.textContent = product.name;
                productSelect.appendChild(option);
            });

            productSelectContainer.style.display = "block";
            productSelect.disabled = false;
            productSelect.addEventListener("change", () => {
                const selectedProduct = products.find(product => product.id == productSelect.value);
                productName.value = selectedProduct.name;
                productPrice.value = selectedProduct.price;
                categorySelect.value = selectedProduct.category_id;
            });
        } catch (error) {
            console.error("Erro ao carregar produtos:", error);
            alert("Erro ao carregar produtos.");
        }
    }

    function resetForm() {
        productName.value = '';
        productPrice.value = '';
        categorySelect.value = '';
        categoryForm.style.display = "none";
        submitButton.disabled = true;

        // Desabilitar campos ao resetar o formulário
        productName.disabled = true;
        productPrice.disabled = true;
        categorySelect.disabled = true;
    }
});
