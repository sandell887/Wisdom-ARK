// rotas.js
(function roteador() {
  // Qual página estamos
  const pagina = window.location.pathname.split("/").pop() || "login.html";

  // Páginas públicas (login, index e agendamento)
  const publicas = ["login.html", "index.html", "agendadeconsultas.html"];

  // Tenta ler usuário logado
  let usuario = null;
  try {
    usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
  } catch {
    localStorage.removeItem("usuarioLogado");
  }

  // Se não autenticado em página privada, redireciona ao login
  if (!usuario && !publicas.includes(pagina)) {
    window.location.href = "login.html";
    return;
  }

  // Se usuário EXISTE e está no login.html, manda conforme papel
  if (usuario && pagina === "login.html") {
    const rotas = {
      paciente: "agendadeconsultas.html",
      medico:   "controledeatendimentos.html",
      gestor:   "estoquedemedicamentos.html"
    };
    const destino = rotas[usuario.tipo];
    if (destino) {
      window.location.href = destino;
    } else {
      localStorage.removeItem("usuarioLogado");
      window.location.href = "login.html";
    }
  }
})();
