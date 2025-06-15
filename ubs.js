// ubs.js

// 1) Configurações das UBS (coordenadas de exemplo)
const ubsCoords = {
  "UBS Sede":      [-2.5471611, -44.0990541],
  "UBS Vilas":     [-2.5463453, -44.1051945],
  "UBS Limítrofes":[-2.511107,  -44.183616],
  "UBS Parques":   [-2.5197547, -44.2095218],
  "UBS Zona Rural":[-2.5598032, -44.1760007]
};

// 2) Inicializa o mapa Leaflet
const map = L.map('map', {
  scrollWheelZoom: false,
  dragging:         false,
  zoomControl:      false
}).setView(ubsCoords["UBS Sede"], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap'
}).addTo(map);

const marker = L.marker(ubsCoords["UBS Sede"]).addTo(map);

// 3) Pop-in do painel de tempos (cria logo abaixo do botão Continuar)
const continueBtn = document.getElementById('continueBtn');
const travelPanel = document.createElement('div');
travelPanel.id = 'travel-times';
continueBtn.insertAdjacentElement('afterend', travelPanel);

// Haversine para distância em km
function haversine([lat1,lon1],[lat2,lon2]) {
  const toRad = x=> x*Math.PI/180;
  const R = 6371; // km
  const dLat = toRad(lat2-lat1), dLon = toRad(lon2-lon1);
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLon/2)**2;
  return 2*R*Math.asin(Math.sqrt(a));
}

// Atualiza os tempos no painel
function updateTravelTimes(ubsName) {
  if (!navigator.geolocation) {
    travelPanel.innerHTML = `<p>Geolocalização não suportada.</p>`;
    return;
  }
  navigator.geolocation.getCurrentPosition(({coords}) => {
    const userPos = [coords.latitude, coords.longitude];
    const target  = ubsCoords[ubsName];
    const dist    = haversine(userPos, target);
    // velocidades típicas km/h
    const times = {
      '🚶‍♂️': Math.ceil(dist/5   * 60),  // 5 km/h
      '🚴‍♀️': Math.ceil(dist/15  * 60),  // 15 km/h
      '🚗':   Math.ceil(dist/50  * 60)    // 50 km/h
    };
    // monta HTML
    travelPanel.innerHTML = `
      <div class="route-options">
        ${Object.entries(times).map(([icon, min])=>
          `<button class="route-btn"><span class="me-2">${icon}</span>${min} min</button>`
        ).join('')}
      </div>
    `;
  }, err => {
    travelPanel.innerHTML = `<p>Não foi possível obter localização.</p>`;
  });
}

// 4) Lógica do carrossel de UBS
const carousel = document.getElementById('carousel');
const cards    = carousel.querySelectorAll('.card');

function selectCard(cardEl, goImmediately=false) {
  cards.forEach(c => c.classList.remove('selected'));
  cardEl.classList.add('selected');
  const chosen = cardEl.dataset.ubs;
  // atualiza mapa
  const latlng = ubsCoords[chosen];
  map.setView(latlng, 14, { animate:true });
  marker.setLatLng(latlng);
  // atualiza tempos
  updateTravelTimes(chosen);
  // se clicou e quer ir direto
  if (goImmediately) {
    localStorage.setItem('ubsEscolhida', chosen);
    window.location.href = 'agendadeconsultas.html';
  }
}

// clique em cada cartão
cards.forEach(card =>
  card.addEventListener('click', () => selectCard(card, true))
);

// scroll: escolhe automaticamente o mais centralizado
let scrollTimeout;
carousel.addEventListener('scroll', () => {
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    const rect = carousel.getBoundingClientRect();
    const cx   = rect.left + rect.width/2;
    let closest, minD=Infinity;
    cards.forEach(c => {
      const r  = c.getBoundingClientRect();
      const cc = r.left + r.width/2;
      const d  = Math.abs(cc - cx);
      if (d<minD) { minD=d; closest=c; }
    });
    if (closest) selectCard(closest, false);
  }, 100);
});

// setas de navegação
document.querySelector('.nav-prev')
  .addEventListener('click', ()=> carousel.scrollBy({left:-200,behavior:'smooth'}));
document.querySelector('.nav-next')
  .addEventListener('click', ()=> carousel.scrollBy({left: 200,behavior:'smooth'}));

// pré-seleciona a primeira UBS ao carregar
window.addEventListener('load', () => selectCard(cards[0], false));
