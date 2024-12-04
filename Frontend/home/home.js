document.addEventListener("DOMContentLoaded", async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
        window.location.href = "../login/login.html";
        return;
    }

    // Exibe o nome do usuário na tela
    const userName = localStorage.getItem("userName");
    document.getElementById("userName").textContent = `${userName}`;
    await loadUserLists(userId);

    // Exibe a seção para criar uma nova lista
    document.getElementById("createListButton").addEventListener("click", () => {
        document.getElementById("createListSection").style.display = "block";
    });

    // Envia a nova lista para o backend
    document.getElementById("submitListButton").addEventListener("click", async () => {
        const listName = document.getElementById("listName").value;
        if (listName.trim() === "") {
            alert("Por favor, insira um nome para a lista.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/users/${userId}/lists`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: userId, name: listName }),
            });

            const result = await response.json();

            if (response.status === 201) {
                showModal("statusModal", "Lista criada!");
                setTimeout(() => location.reload(), 2000);
            } else {
                showModal("errorModal", result.error || "Falha ao criar lista");
            }
        } catch (error) {
            console.error("Erro ao criar lista:", error);
            showModal("errorModal", "Erro ao criar lista.");
        }
    });
});

async function loadUserLists(userId) {
    try {
        const response = await fetch(`http://localhost:3000/users/${userId}/lists`);
        const listContainer = document.getElementById("listContainer");

        if (response.status === 404 || response.status !== 200) {
            listContainer.innerHTML = "<p>Nenhuma lista criada!</p>";
            return;
        }

        const lists = await response.json();

        if (lists.length === 0) {
            listContainer.innerHTML = "<p>Nenhuma lista criada</p>";
        } else {
            lists.forEach(list => {
                const listItem = document.createElement("div");
                listItem.classList.add("list-item");
                listItem.setAttribute('data-id', list.id);

                listItem.innerHTML = `
                    <span>${list.name}</span>
                    <button onclick="viewList(${list.id})">Visualizar</button>
                    <button class="delete-btn" onclick="deleteList(${list.id})">Excluir</button>
                `;

                listContainer.appendChild(listItem);
            });
        }
    } catch (error) {
        console.error("Erro ao carregar listas:", error);
        document.getElementById("listContainer").innerHTML = "<p>Erro ao carregar as listas</p>";
    }
}

function viewList(listId) {
    // Salva apenas o ID da lista no localStorage
    localStorage.setItem("currentListId", listId);

    // Redireciona para a página da lista
    window.location.href = `../lista/lista.html?id=${listId}`;
}

async function deleteList(listId) {
    if (confirm("Tem certeza de que deseja excluir esta lista?")) {
        try {
            const response = await fetch(`http://localhost:3000/lists/${listId}`, { method: "DELETE" });

            if (response.status === 200) {
                showModal("statusModal", "Lista excluída!");
                setTimeout(() => location.reload(), 2000);
            } else {
                showModal("errorModal", "Falha ao excluir lista.");
            }
        } catch (error) {
            console.error("Erro ao excluir lista:", error);
            showModal("errorModal", "Erro ao excluir lista.");
        }
    }
}

function showModal(modalId, message) {
    const modal = document.getElementById(modalId);
    document.getElementById(modalId === "statusModal" ? "statusMessage" : "errorMessage").textContent = message;
    modal.style.display = "flex";
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = "none";
}
