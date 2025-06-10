// login.js
/*
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
*/
// login.js

// 1) Importações do Firebase
import { initializeApp }           from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } 
                                   from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

// 2) Sua configuração (já no seu código)
const firebaseConfig = {
  apiKey: "AIzaSyAFbaNGKa_7l1mIYVLjNLVYfyupeUtvDC0",
  authDomain: "wisdom-ark.firebaseapp.com",
  projectId: "wisdom-ark",
  storageBucket: "wisdom-ark.appspot.com",
  messagingSenderId: "140848006140",
  appId: "1:140848006140:web:f99774efc68d5729132879",
  measurementId: "G-C992R6X006"
};

// 3) Inicializa Firebase e Auth
const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// 4) Botão “Entrar com Google”
document.getElementById('google-signin')
  .addEventListener('click', () => {
    signInWithPopup(auth, provider)
      .then(result => {
        const user = result.user;
        // Exemplo: salva no localStorage
        localStorage.setItem('usuarioLogado', JSON.stringify({
          tipo:    'paciente',           // ajuste conforme seu fluxo
          uid:     user.uid,
          nome:    user.displayName,
          email:   user.email,
          foto:    user.photoURL
        }));
        // redireciona
        window.location.href = 'agendadeconsultas.html';
      })
      .catch(err => {
        console.error("Erro no login Google:", err);
        alert("Não foi possível autenticar com Google.");
      });
  });

