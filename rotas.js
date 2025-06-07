// rotas.js

(function roteador() {
  const paginaAtual = window.location.pathname.split("/").pop(); // ex: 'index.html', 'login.html'
  const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));

  // Se o usuário NÃO estiver logado e não estiver na tela de login, redireciona para login
  if (!usuario && paginaAtual !== 'login.html') {
    window.location.href = 'login.html';
    return;
  }

  // Se o usuário estiver logado e estiver na login.html, redireciona conforme tipo
  if (usuario && paginaAtual === 'login.html') {
    switch (usuario.tipo) {
      case 'paciente':
        window.location.href = 'agendadeconsultas.html';
        break;
      case 'medico':
        window.location.href = 'controledeatendimentos.html';
        break;
      case 'gestor':
        window.location.href = 'estoquedemedicamentos.html';
        break;
      default:
        localStorage.removeItem("usuarioLogado");
        window.location.href = 'login.html';
    }
  }

  // Se já estiver logado e em página válida, deixa continuar normalmente
})();
