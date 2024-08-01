// Crear el mapa centrado en Puno
const map = L.map('map').setView([-15.8402, -70.0219], 13); // Coordenadas de Puno

// Agregar capa de mapa
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
}).addTo(map);

// Lista de puntos de interés
let pointsOfInterest = [
    { name: "Ovalo Ramon Castilla", lat: -15.8402, lon: -70.0219 },
    { name: "IE Sagrado Corazon de Jesus", lat: -15.8406, lon: -70.0210 },
    { name: "Lago Titicaca", lat: -15.8351, lon: -69.9900 },
    { name: "Hospital Manuel Nuñez Butron", lat: -15.8428, lon: -70.0222 },
];

// Marcar los puntos de interés en el mapa
pointsOfInterest.forEach(poi => {
    L.marker([poi.lat, poi.lon]).addTo(map).bindPopup(poi.name);
});

// Icono para la posición del usuario (más pequeño y representando a una persona)
const userIcon = L.icon({
    iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-green.png', // URL de un icono disponible
    iconSize: [25, 41], // Tamaño más pequeño del icono
    iconAnchor: [12, 41], // Punto de anclaje del icono
    popupAnchor: [1, -34] // Punto de anclaje del popup
});

let userMarker = null;

// Función para encontrar el vecino más cercano
function findNearest(lat, lon) {
    let nearest = null;
    let nearestDist = Infinity;

    pointsOfInterest.forEach(poi => {
        const dist = map.distance([lat, lon], [poi.lat, poi.lon]);
        if (dist < nearestDist) {
            nearestDist = dist;
            nearest = { ...poi, distance: dist };
        }
    });

    return nearest;
}

// Función para actualizar el vecino más cercano en la UI
function updateNearestList(nearest) {
    const nearestList = document.getElementById("nearest-list");
    nearestList.innerHTML = nearest
        ? `<li class="list-group-item">
                El vecino más cercano es: <strong>${nearest.name}</strong> a ${Math.round(nearest.distance)} metros.
            </li>`
        : `<li class="list-group-item">No se encontró ningún vecino cercano.</li>`;
}

// Evento de clic en el mapa para representar la ubicación del usuario
map.on('click', function(e) {
    const { lat, lng } = e.latlng;

    // Remover marcador de usuario anterior si existe
    if (userMarker) {
        map.removeLayer(userMarker);
    }

    // Agregar marcador de usuario
    userMarker = L.marker([lat, lng], { icon: userIcon }).addTo(map).bindPopup("Tu posición").openPopup();
    
    // Encontrar y mostrar el vecino más cercano
    const nearest = findNearest(lat, lng);
    updateNearestList(nearest);
});

// Generar coordenadas aleatorias alrededor de Puno
function getRandomCoords() {
    const lat = -15.8402 + (Math.random() - 0.5) * 0.05; // +/- 0.025 grados
    const lon = -70.0219 + (Math.random() - 0.5) * 0.05; // +/- 0.025 grados
    return { lat, lon };
}

// Evento del botón para agregar un punto aleatorio
document.getElementById('random-point-btn').addEventListener('click', () => {
    const { lat, lon } = getRandomCoords();
    const newPoint = { name: `Punto Aleatorio ${pointsOfInterest.length + 1}`, lat, lon };
    pointsOfInterest.push(newPoint);
    L.marker([lat, lon]).addTo(map).bindPopup(newPoint.name);
});
