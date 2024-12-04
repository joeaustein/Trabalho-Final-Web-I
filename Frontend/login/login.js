document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault();
  
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
  
    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      
      const result = await response.json();
  
      if (response.status === 200) {
        // Supondo que a resposta contenha o objeto 'user' com 'id' e 'name'
        const { user } = result; // Ajuste conforme a estrutura de dados da sua API
  
        // Salve os dados do usuário no localStorage
        localStorage.setItem("userId", user.id); // Armazenando o ID do usuário
        localStorage.setItem("userName", user.name); // Armazenando o nome do usuário
  
        // Verificação para garantir que os dados estão armazenados corretamente
        console.log("userId:", localStorage.getItem("userId"));
        console.log("userName:", localStorage.getItem("userName"));
  
        // Redirecionar para a tela inicial do usuário
        alert("Login realizado com sucesso!");
        window.location.href = "../home/home.html"; // Redireciona para a página inicial
      } else {
        // Exibir o modal de erro
        showModal("errorModal", result.error || "Erro desconhecido");
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      showModal("errorModal", "Erro ao fazer login");
    }
  });
  
  // Função para exibir o modal
  function showModal(modalId, message) {
    const modal = document.getElementById(modalId);
    document.getElementById("errorMessage").textContent = message;
    modal.style.display = "block";
  }
  
  // Função para fechar o modal
  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = "none";
  }
  