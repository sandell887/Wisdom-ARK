// rotas.js
(function roteador() {
  // 1) Página atual
  const pagina = window.location.pathname.split("/").pop() || "login.html";

  // 2) Páginas públicas (não exigem login)
  const publicas = ["login.html", "index.html"];

  // 3) Recupera usuário do localStorage
  let usuario = null;
  try {
    usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
  } catch {
    localStorage.removeItem("usuarioLogado");
  }

  // 4) Se for página privada e não tiver usuário, manda para login
  if (!usuario && !publicas.includes(pagina)) {
    window.location.href = "login.html";
    return;
  }

  // 5) Se já estiver logado e tentar abrir login.html, redireciona por tipo
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
