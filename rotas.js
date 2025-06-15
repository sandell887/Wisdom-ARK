// rotas.js
(function roteador() {
  // 1) Página atual
  const pagina = window.location.pathname.split("/").pop() || "login.html";

  // 2) Páginas públicas (podem ser acessadas sem usuário)
  const publicas = ["login.html", "index.html"];

  // 3) Tenta recuperar o usuário do localStorage
  let usuario = null;
  try {
    usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
  } catch {
    localStorage.removeItem("usuarioLogado");
  }

  // 4) Se não estiver logado e abrir página privada, força ir ao login
  if (!usuario && !publicas.includes(pagina)) {
    window.location.href = "login.html";
    return;
  }

  // 5) Se já estiver logado e tentar abrir o login.html, redireciona no fluxo:
  //    paciente → ubs.html
  //    médico   → controledeatendimentos.html
  //    gestor   → estoquedemedicamentos.html
  if (usuario && pagina === "login.html") {
    const rotas = {
      paciente: "ubs.html",
      medico:   "controledeatendimentos.html",
      gestor:   "estoquedemedicamentos.html"
    };
    const destino = rotas[usuario.tipo] || "login.html";
    window.location.href = destino;
  }
})();
