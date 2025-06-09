// login.js

function criarConfete(cor) {
  const confete = document.createElement('div');
  confete.classList.add('confetti');
  confete.style.left = Math.random() * 100 + 'vw';
  confete.style.backgroundColor = cor;
  document.body.appendChild(confete);

  setTimeout(() => {
    confete.remove();
  }, 3000);
}

function animarConfetes() {
  const cores = ['#FF7345', '#ABA0F1', '#FEFFC4'];
  for (let i = 0; i < 60; i++) {
    setTimeout(() => {
      criarConfete(cores[Math.floor(Math.random() * cores.length)]);
    }, i * 50);
  }
}

function realizarLogin(email, senha) {
  const usuarios = [
    { email: 'paciente@teste.com', senha: '123', tipo: 'paciente' },
    { email: 'medico@teste.com', senha: '123', tipo: 'medico' },
    { email: 'gestor@teste.com', senha: '123', tipo: 'gestor' }
  ];

  const usuario = usuarios.find(u => u.email === email && u.senha === senha);

  if (usuario) {
    localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
    animarConfetes();

    // Espera 2 segundos para que os confetes apareçam antes de redirecionar
    setTimeout(() => {
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
    }, 2000); // 2 segundos
  } else {
    alert('Email ou senha inválidos!');
  }
}
