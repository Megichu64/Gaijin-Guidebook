// --- 1. MAP LOGIC ---
// We wait for the content to load, though putting the script at the bottom of HTML usually works too.
document.addEventListener('DOMContentLoaded', () => {
    
    // Check if the map element exists to avoid errors on pages without a map
    if (document.getElementById('map')) {
        // Initialize map focused on Japan (Tokyo)
        var map = L.map('map').setView([35.6762, 139.6503], 10);

        // Add Esri World Street Map
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
            .attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
        }).addTo(map);

        // Add Markers for your trip
        L.marker([35.6762, 139.6503]).addTo(map)
            .bindPopup('<b>Tokyo</b><br>Started the journey here.')
            .openPopup();
        
        L.marker([34.9949, 135.7850]).addTo(map)
            .bindPopup('<b>Kiyomizu-dera</b><br>Beautiful temple views.');
    }
});

// --- 2. CURRENCY LOGIC ---
function convertCurrency() {
    const usdInput = document.getElementById('usdInput');
    const resultDisplay = document.getElementById('result');
    
    if (usdInput && resultDisplay) {
        const usd = usdInput.value;
        // Hardcoded rate for MVP (approx 154.50)
        // TODO: Replace with API call later
        const rate = 154.50; 
        const yen = (usd * rate).toFixed(0);
        resultDisplay.innerText = "¥ " + yen;
    }
}

// --- 3. AUDIO LOGIC ---
function playAudio(phrase) {
    // Placeholder for audio logic
    // In the future, you will link this to actual .mp3 files
    console.log("User clicked play for:", phrase);
    alert("Playing audio for: " + phrase + " (Connect actual MP3 files in the code!)");
    
    // Example of how it will look later:
    // var audio = new Audio('assets/' + phrase + '.mp3');
    // audio.play();
}
