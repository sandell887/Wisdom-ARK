// login.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAnalytics }  from "https://www.gstatic.com/firebasejs/9.22.2/firebase-analytics.js";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
}                        from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

// 1) Configuração do Firebase
const firebaseConfig = {
  apiKey:            "AIzaSyAFbaNGKa_7l1mIYVLjNLVYfyupeUtvDC0",
  authDomain:        "wisdom-ark.firebaseapp.com",
  projectId:         "wisdom-ark",
  storageBucket:     "wisdom-ark.appspot.com",
  messagingSenderId: "140848006140",
  appId:             "1:140848006140:web:f99774efc68d5729132879",
  measurementId:     "G-C992R6X006"
};

const app       = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth      = getAuth(app);
const provider  = new GoogleAuthProvider();

// 2) Redirecionamento por tipo
function redirectByRole(tipo) {
  if (tipo === 'medico') {
    window.location.href = 'controledeatendimentos.html';
  } else if (tipo === 'gestor') {
    window.location.href = 'estoquedemedicamentos.html';
  } else {
    window.location.href = 'agendadeconsultas.html';
  }
}

// 3) Se já estiver logado e estiver em login.html, redireciona
onAuthStateChanged(auth, user => {
  if (user && location.pathname.endsWith('login.html')) {
    const stored = JSON.parse(localStorage.getItem('usuarioLogado') || '{}');
    redirectByRole(stored.tipo);
  }
});

// 4) Login com e-mail/senha
document.getElementById('email-login').addEventListener('click', async () => {
  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value;
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, senha);
    // Inferir tipo ou buscar de um coleçãno Firestore
    const tipo = email.toLowerCase().includes('medico') ? 'medico'
               : email.toLowerCase().includes('gestor') ? 'gestor'
               : 'paciente';
    localStorage.setItem('usuarioLogado', JSON.stringify({
      tipo,
      uid:    user.uid,
      email:  user.email
    }));
    redirectByRole(tipo);
  } catch (err) {
    alert('Credenciais inválidas: ' + err.message);
  }
});

// 5) Login com Google
document.getElementById('google-signin').addEventListener('click', async () => {
  try {
    const { user } = await signInWithPopup(auth, provider);
    // Aqui definimos médicos manualmente, ex:
    const emailNorm = user.email.trim().toLowerCase();
    const tipo = (emailNorm === 'wisdombigrobot@gmail.com' || emailNorm === 'medico@teste.com')
               ? 'medico'
               : 'paciente';
    localStorage.setItem('usuarioLogado', JSON.stringify({
      tipo,
      uid:    user.uid,
      email:  user.email
    }));
    redirectByRole(tipo);
  } catch (err) {
    console.error(err);
    alert('Não foi possível autenticar com Google: ' + err.message);
  }
});
