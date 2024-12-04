document.getElementById("registerForm").addEventListener("submit", async function (event) {
    event.preventDefault();
  
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
  
    try {
      const response = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });
      
      const result = await response.json();
  
      if (response.status === 201) {
        // Exibir o modal de sucesso e redirecionar para a tela de login
        showModal("statusModal", "Usuário cadastrado com sucesso!");
        setTimeout(() => window.location.href = "../login/login.html", 2000); // Redirecionar após 2 segundos
      } else {
        // Exibir o modal de erro
        showModal("statusModal", result.error || "Falha ao cadastrar");
      }
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      showModal("statusModal", "Erro ao cadastrar usuário");
    }
  });
  
  function showModal(modalId, message) {
    const modal = document.getElementById(modalId);
    document.getElementById("statusMessage").textContent = message;
    modal.style.display = "block";
  }
  
  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = "none";
  }
  