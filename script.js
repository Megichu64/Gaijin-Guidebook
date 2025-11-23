// --- 1. MAP LOGIC ---
document.addEventListener('DOMContentLoaded', () => {
    
    // Check if the map element exists
    if (document.getElementById('map')) {
        // Initialize map focused on Japan (Tokyo)
        var map = L.map('map').setView([35.6762, 139.6503], 10);

        // --- NEW MAP STYLE: CartoDB Voyager (English + Tourism Friendly) ---
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 20
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
        const rate = 154.50; 
        const yen = (usd * rate).toFixed(0);
        resultDisplay.innerText = "¥ " + yen;
    }
}

// --- 3. AUDIO LOGIC ---
function playAudio(phrase) {
    console.log("User clicked play for:", phrase);
    alert("Playing audio for: " + phrase + " (Connect actual MP3 files in the code!)");
}

// --- 4. SCROLL TO TOP LOGIC ---
// Get the button
const mybutton = document.getElementById("scrollToTopBtn");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
        mybutton.style.display = "block";
    } else {
        mybutton.style.display = "none";
    }
}

// When the user clicks on the button, scroll to the top of the document
mybutton.addEventListener("click", function() {
    window.scrollTo({top: 0, behavior: 'smooth'}); // 'smooth' makes it glide nicely
});