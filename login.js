// login.js

function realizarLogin(email, senha) {
  const usuarios = [
    { email: 'paciente@teste.com', senha: '123', tipo: 'paciente' },
    { email: 'medico@teste.com', senha: '123', tipo: 'medico' },
    { email: 'gestor@teste.com', senha: '123', tipo: 'gestor' }
  ];

  const usuario = usuarios.find(u => u.email === email && u.senha === senha);

  if (usuario) {
    localStorage.setItem('usuarioLogado', JSON.stringify(usuario));

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
        alert('Tipo de usuário desconhecido.');
    }
  } else {
    alert('Email ou senha inválidos!');
  }
}
