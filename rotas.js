(function roteador() {
  const paginaAtual = window.location.pathname.split("/").pop();
  const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));

  // Se o usuário NÃO estiver logado e não for login.html, redireciona
  if (!usuario && paginaAtual !== 'login.html') {
    window.location.href = 'login.html';
    return;
  }

  // Se estiver logado e tentar voltar para login.html, redireciona conforme tipo
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
})();
