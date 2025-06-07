// rotas.js

(function roteador() {
  const paginaAtual = window.location.pathname.split("/").pop(); // Ex: 'index.html', 'login.html'
  const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));

  // Lista de páginas públicas (que não exigem login)
  const paginasPublicas = ['login.html'];

  // Se o usuário NÃO estiver logado E estiver tentando acessar uma página protegida
  if (!usuario && !paginasPublicas.includes(paginaAtual)) {
    window.location.href = 'login.html';
    return;
  }

  // Se o usuário estiver logado e acessando a página de login, redireciona conforme o tipo
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
        // Tipo inválido, força logout
        localStorage.removeItem("usuarioLogado");
        window.location.href = 'login.html';
    }
  }

  // Se estiver logado e não estiver na tela de login, continua normalmente
})();
