// ubs.js
document.querySelectorAll('.ubs-option').forEach(btn => {
  btn.addEventListener('click', () => {
    // Salva a UBS escolhida
    localStorage.setItem('ubsSelecionada', btn.dataset.ubs);
    // Vai para agendamento
    window.location.href = 'agendadeconsultas.html';
  });
});
