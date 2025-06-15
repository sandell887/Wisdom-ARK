// agenda.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// ─── 1) Configuração Firebase ─────────────────────────────────────────────────
const firebaseConfig = {
  apiKey:            "AIzaSyAFbaNGKa_7l1mIYVLjNLVYfyupeUtvDC0",
  authDomain:        "wisdom-ark.firebaseapp.com",
  projectId:         "wisdom-ark",
  storageBucket:     "wisdom-ark.appspot.com",
  messagingSenderId: "140848006140",
  appId:             "1:140848006140:web:f99774efc68d5729132879",
  measurementId:     "G-C992R6X006"
};
const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);
const col  = collection(db, "consultas");

// ─── 2) Protege a página: se não estiver logado, volta ao login ──────────────
onAuthStateChanged(auth, user => {
  if (!user) {
    // usuário saiu ou não está autenticado
    window.location.href = "login.html";
  }
});

// ─── 3) DOM pronto: carrega histórico e configura o form ──────────────────────
window.addEventListener("DOMContentLoaded", () => {
  carregarHistorico();
  document.getElementById("consulta-form")
          .addEventListener("submit", handleSubmit);
});

// ─── 4) Gera código alfanumérico curto e único ────────────────────────────────
function gerarCodigo() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length: 6 },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join("");
}

// ─── 5) Confete e checkmark ────────────────────────────────────────────────────
function criarConfete(cor) {
  const c = document.createElement("div");
  c.className = "confetti";
  c.style.left = `${Math.random() * 100}vw`;
  c.style.backgroundColor = cor;
  document.body.appendChild(c);
  setTimeout(() => c.remove(), 3000);
}
function animarConfetes() {
  ["#FF7345","#ABA0F1","#FEFFC4"].forEach((cor, i) =>
    setTimeout(() => criarConfete(cor), i * 50)
  );
}
function mostrarCheck() {
  const chk = document.getElementById("checkmark");
  chk.classList.add("show");
  setTimeout(() => chk.classList.remove("show"), 2000);
}

// ─── 6) Tratamento do submit ──────────────────────────────────────────────────
async function handleSubmit(e) {
  e.preventDefault();

  // Garantia extra: só grava se ainda houver sessão
  if (!auth.currentUser) {
    window.location.href = "login.html";
    return;
  }

  const patient     = document.getElementById("patient").value.trim();
  const dateVal     = document.getElementById("date").value;
  const timeVal     = document.getElementById("time").value;
  const severity    = document.getElementById("severity").value;
  const consultorio = document.getElementById("consultorio").value;
  const datetimeISO = new Date(`${dateVal}T${timeVal}`).toISOString();
  const codigo      = gerarCodigo();

  // grava no Firestore
  const docRef = await addDoc(col, {
    codigo,
    patient,
    start:    datetimeISO,
    date:     dateVal,
    time:     timeVal,
    severity,
    consultorio,
    uid:      auth.currentUser.uid,
    email:    auth.currentUser.email
  });
  console.log("Documento gravado com ID:", docRef.id);

  // atualiza UI
  animarConfetes();
  mostrarCheck();
  document.getElementById("mensagem-sucesso").innerHTML = `
    <div class="alert alert-success">
      <strong>✔ Consulta Agendada!</strong><br>
      Código: <code>${codigo}</code><br>
      ${patient} — ${dateVal} ${timeVal}<br>
      ${consultorio} — <span class="fw-bold ${
        severity === "Leve" ? "text-success"
      : severity === "Moderado" ? "text-warning"
      : "text-danger"
      }">${severity}</span>
    </div>
  `;
  e.target.reset();
  carregarHistorico();
}

// ─── 7) Carrega histórico do Firestore ────────────────────────────────────────
async function carregarHistorico() {
  const tbody = document.getElementById("historico-consultas");
  tbody.innerHTML = "";
  const snapshot = await getDocs(col);
  snapshot.forEach(docSnap => {
    const ev   = docSnap.data();
    const dt   = new Date(ev.start);
    const data = dt.toLocaleDateString("pt-BR");
    const hora = ev.time || dt.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"});
    const cor  = ev.severity === "Leve"     ? "text-success"
               : ev.severity === "Moderado"  ? "text-warning"
               :                                 "text-danger";
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><code>${ev.codigo}</code></td>
      <td>${ev.patient}</td>
      <td>${data}</td>
      <td>${hora}</td>
      <td>${ev.consultorio}</td>
      <td class="fw-bold ${cor}">${ev.severity}</td>
    `;
    tbody.appendChild(tr);
  });
}
