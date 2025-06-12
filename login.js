// login.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

// 1) Configuração correta do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAFbaNGKa_7l1mIYVLjNLVYfyupeUtvDC0",
  authDomain: "wisdom-ark.firebaseapp.com",
  projectId: "wisdom-ark",
  storageBucket: "wisdom-ark.appspot.com",    // <- CORRETO .appspot.com
  messagingSenderId: "140848006140",
  appId: "1:140848006140:web:f99774efc68d5729132879",
  measurementId: "G-C992R6X006"
};

// 2) Inicializa Firebase e Auth (APENAS via CDN)
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// 3) Redireciona conforme o tipo
function redirectByRole(tipo) {
  if (tipo === 'paciente') {
    window.location.href = 'agendadeconsultas.html';
  } else if (tipo === 'medico') {
    window.location.href = 'controledeatendimentos.html';
  } else if (tipo === 'gestor') {
    window.location.href = 'estoquedemedicamentos.html';
  } else {
    auth.signOut().then(() => window.location.href = 'login.html');
  }
}

// 4) Se já estiver logado e estiver em login.html, envia direto
onAuthStateChanged(auth, user => {
  if (user && location.pathname.endsWith('login.html')) {
    const stored = JSON.parse(localStorage.getItem('usuarioLogado') || '{}');
    redirectByRole(stored.tipo);
  }
});

// 5) Login com E-mail/Senha
document.getElementById('email-login').addEventListener('click', () => {
  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value;
  signInWithEmailAndPassword(auth, email, senha)
    .then(({ user }) => {
      const tipo = email.includes('medico')  ? 'medico'
                 : email.includes('gestor')  ? 'gestor'
                 : 'paciente';
      localStorage.setItem('usuarioLogado',
        JSON.stringify({ tipo, uid: user.uid, email })
      );
      redirectByRole(tipo);
    })
    .catch(err => alert('Credenciais inválidas: ' + err.message));
});

// 6) Login com Google
document.getElementById('google-signin').addEventListener('click', () => {
  signInWithPopup(auth, provider)
    .then(({ user }) => {
      // Todo login Google vira paciente (ou busque o tipo no seu Firestore)
      const tipo = 'paciente';
      localStorage.setItem('usuarioLogado',
        JSON.stringify({
          tipo,
          uid:   user.uid,
          nome:  user.displayName,
          email: user.email,
          foto:  user.photoURL
        })
      );
      redirectByRole(tipo);
    })
    .catch(err => {
      console.error(err);
      alert('Não foi possível autenticar com Google: ' + err.message);
    });
});
