document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const listId = urlParams.get("id");

    if (!listId) {
      alert("ID da lista não fornecido!");
      return;
    }

    // Carregar informações da lista (título e valor total)
    await loadListInfo(listId);

    // Carregar produtos na lista
    await loadProducts(listId);

    // Carregar dropdown com todos os produtos
    await loadProductDropdown();

    // Adicionar produto à lista
    document.getElementById("addProductButton").addEventListener("click", async () => {
      const productId = document.getElementById("productDropdown").value;
      await modifyProductInList("POST", listId, productId);
    });

    // Botão para cadastrar/editar produto
    document.getElementById("editProductButton").addEventListener("click", () => {
      window.location.href = "../produto/produto.html";
    });
});

async function loadListInfo(listId) {
    const listTitleElement = document.getElementById("listTitle");
    const totalValueElement = document.getElementById("totalValue");

    try {
        // Obter nome da lista
        const listResponse = await fetch(`http://localhost:3000/lists/${listId}`);
        const listData = await listResponse.json();
        listTitleElement.textContent = listData.name || `Lista #${listId}`;

        // Obter valor total da lista
        const totalResponse = await fetch(`http://localhost:3000/lists/${listId}/total`);
        const totalData = await totalResponse.json();

        // Verificando se o valor total é retornado corretamente
        const totalValue = totalData.total_value || 0; // Supondo que o valor total seja retornado como 'total'
        totalValueElement.textContent = `R$${parseFloat(totalValue).toFixed(2)}`;
    } catch (error) {
        console.error("Erro ao carregar informações da lista:", error);
        listTitleElement.textContent = "Erro ao carregar título da lista.";
        totalValueElement.textContent = "Erro ao carregar valor total.";
    }
}

async function loadProducts(listId) {
    const productContainer = document.getElementById("productContainer");
    productContainer.innerHTML = "";

    try {
        const response = await fetch(`http://localhost:3000/lists/${listId}/products`);
        const products = await response.json();

        if (!Array.isArray(products) || products.length === 0) {
            productContainer.innerHTML = "<p>Nenhum produto na lista.</p>";
            return;
        }

        products.forEach(product => {
            const productItem = document.createElement("div");
            productItem.classList.add("product-item");
            productItem.innerHTML = `
                <span>${product.product_name}</span>
                <span>Quantidade: ${product.quantity}</span>
                <span>Valor Unitário: R$${parseFloat(product.unit_value).toFixed(2)}</span>
                <span>Valor Total: R$${parseFloat(product.total_value).toFixed(2)}</span>
                <button onclick="modifyProductInList('POST', ${listId}, ${product.product_id})">+</button>
                <button onclick="modifyProductInList('DELETE', ${listId}, ${product.product_id})">-</button>
            `;
            productContainer.appendChild(productItem);
        });
    } catch (error) {
        console.error("Erro ao carregar produtos:", error);
        productContainer.innerHTML = "<p>Erro ao carregar produtos.</p>";
    }
}

async function modifyProductInList(method, listId, productId) {
    const body = { listId, productId };
    try {
        const response = await fetch(`http://localhost:3000/lists/${listId}/products`, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (response.ok) {
            alert(`Produto ${method === "POST" ? "adicionado" : "removido"} com sucesso!`);
            location.reload(); // Recarregar a página para refletir as mudanças
        } else {
            alert("Erro ao atualizar a lista.");
        }
    } catch (error) {
        console.error("Erro ao modificar produto:", error);
        alert("Erro ao atualizar a lista.");
    }
}

async function loadProductDropdown() {
    const dropdown = document.getElementById("productDropdown");
    dropdown.innerHTML = "";

    try {
        const response = await fetch("http://localhost:3000/products");
        const products = await response.json();

        if (!Array.isArray(products) || products.length === 0) {
            dropdown.innerHTML = "<option>Nenhum produto disponível</option>";
            return;
        }

        products.forEach(product => {
            const option = document.createElement("option");
            option.value = product.id;
            option.textContent = product.name;
            dropdown.appendChild(option);
        });
    } catch (error) {
        console.error("Erro ao carregar produtos:", error);
        dropdown.innerHTML = "<option>Erro ao carregar produtos</option>";
    }
}
