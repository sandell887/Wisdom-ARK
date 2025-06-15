// rotas.js
(function roteador() {
  // 1) Página atual (ex: "login.html", "ubs.html", "agendadeconsultas.html", etc)
  const pagina = window.location.pathname.split("/").pop() || "login.html";

  // 2) Páginas públicas (podem ser acessadas sem login)
  const publicas = ["login.html", "index.html"];

  // 3) Tenta recuperar o usuário do localStorage
  let usuario = null;
  try {
    usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
  } catch {
    localStorage.removeItem("usuarioLogado");
  }

  // 4) Se não estiver logado e tentar abrir página privada, força login
  if (!usuario && !publicas.includes(pagina)) {
    window.location.href = "login.html";
    return;
  }

  // 5) Se já estiver logado e acessar login.html, manda para a primeira etapa do fluxo:
  //    - Paciente → ubs.html
  //    - Médico   → controledeatendimentos.html
  //    - Gestor   → estoquedemedicamentos.html
  if (usuario && pagina === "login.html") {
    const rotas = {
      paciente: "ubs.html",
      medico:   "controledeatendimentos.html",
      gestor:   "estoquedemedicamentos.html"
    };
    const destino = rotas[usuario.tipo];
    if (destino) {
      window.location.href = destino;
    } else {
      // Se tipo inválido, limpa sessão e volta ao login
      localStorage.removeItem("usuarioLogado");
      window.location.href = "login.html";
    }
  }
})();
