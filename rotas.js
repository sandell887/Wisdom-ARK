// router.js

// Função para redirecionar o usuário com base no login
function roteador() {
  // Pegue o usuário salvo no localStorage
  const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));

  if (!usuario) {
    // Se não estiver logado, vai para a tela de login
    window.location.href = 'login.html';
  } else {
    // Se estiver logado, vai para a página conforme o tipo
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
        // Caso tipo inválido, redireciona para login para segurança
        window.location.href = 'login.html';
    }
  }
}

// Executa o roteador quando a página carregar
window.onload = roteador;
