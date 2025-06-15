// 1) Configurações das UBS (coordenadas de exemplo)
const ubsCoords = {
  "UBS Centro": [-23.550521, -46.633308],
  "UBS Norte":  [-23.530000, -46.630000],
  "UBS Sul":    [-23.570000, -46.640000],
  "UBS Leste":  [-23.550000, -46.610000],
  "UBS Oeste":  [-23.550000, -46.660000],
};

// 2) Inicializa o mapa Leaflet
const map = L.map('map', {
  scrollWheelZoom: false,
  dragging:         false,
  zoomControl:      false
}).setView(ubsCoords["UBS Centro"], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap'
}).addTo(map);

const marker = L.marker(ubsCoords["UBS Centro"]).addTo(map);

// 3) Lógica do carrossel de UBS
const carousel = document.getElementById('carousel');
const cards    = carousel.querySelectorAll('.card');

function selectAndProceed(cardEl) {
  // Marca visualmente
  cards.forEach(c => c.classList.remove('selected'));
  cardEl.classList.add('selected');

  const chosen = cardEl.dataset.ubs;

  // Salva a UBS escolhida
  localStorage.setItem('ubsEscolhida', chosen);

  // Atualiza o mapa
  const latlng = ubsCoords[chosen];
  if (latlng) {
    map.setView(latlng, 14, { animate: true });
    marker.setLatLng(latlng);
  }

  // Redireciona ao agendamento
  window.location.href = 'agendadeconsultas.html';
}

// Ao clicar em qualquer cartão, já segue
cards.forEach(card =>
  card.addEventListener('click', () => selectAndProceed(card))
);

// Ajusta scroll automático para o cartão central
let scrollTimeout;
carousel.addEventListener('scroll', () => {
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    const rect = carousel.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    let closest, minD = Infinity;
    cards.forEach(c => {
      const r  = c.getBoundingClientRect();
      const cc = r.left + r.width / 2;
      const d  = Math.abs(cc - cx);
      if (d < minD) {
        minD = d; closest = c;
      }
    });
    if (closest) {
      cards.forEach(c => c.classList.remove('selected'));
      closest.classList.add('selected');
      const latlng = ubsCoords[closest.dataset.ubs];
      map.setView(latlng, 14, { animate: true });
      marker.setLatLng(latlng);
    }
  }, 100);
});

// Navegação por botões
document.querySelector('.nav-prev')
  .addEventListener('click', () =>
    carousel.scrollBy({ left: -200, behavior: 'smooth' })
  );
document.querySelector('.nav-next')
  .addEventListener('click', () =>
    carousel.scrollBy({ left:  200, behavior: 'smooth' })
  );

// Pré-seleciona a primeira UBS ao carregar
window.addEventListener('load', () => {
  const first = cards[0];
  first.classList.add('selected');
  map.setView(ubsCoords[first.dataset.ubs], 14);
  marker.setLatLng(ubsCoords[first.dataset.ubs]);
});
