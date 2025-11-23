// --- 1. MAP LOGIC ---
document.addEventListener('DOMContentLoaded', () => {
    
    // Check if there is a map on the page
    var mapElement = document.getElementById('map');

    if (mapElement) {
        // Initialize the map
        var map = L.map('map').setView([35.6762, 139.6503], 6); // Zoomed out to see whole Japan

        // Add the English/Tourist-friendly Tiles
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap &copy; CARTO',
            maxZoom: 20
        }).addTo(map);

        // --- BLOG PAGE: ADD THE FULL ROUTE ---
        // If we are on the blog page, let's draw a line connecting cities!
        if (window.location.pathname.includes('blog.html')) {
            
            // Coordinates for your trip (Oct 6-24)
            var tripPath = [
                [35.7719, 140.3929], // Narita Airport
                [35.6762, 139.6503], // Tokyo
                [35.1815, 136.9066], // Nagoya (Example stop?)
                [34.9949, 135.7850], // Kyoto
                [34.6937, 135.5023]  // Osaka
            ];

            // Draw a red line connecting them
            var polyline = L.polyline(tripPath, {color: '#c30b4e', weight: 4}).addTo(map);
            
            // Zoom the map to fit the whole trip
            map.fitBounds(polyline.getBounds());
        }

        // --- ALWAYS ADD MARKERS ---
        L.marker([35.6762, 139.6503]).addTo(map).bindPopup('<b>Tokyo</b><br>Oct 6 - Oct 12');
        L.marker([34.9949, 135.7850]).addTo(map).bindPopup('<b>Kyoto</b><br>Oct 13 - Oct 18');
        L.marker([34.6937, 135.5023]).addTo(map).bindPopup('<b>Osaka</b><br>Oct 19 - Oct 24');
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

// --- 5. DARK MODE TOGGLE LOGIC ---
const toggleButton = document.getElementById('theme-toggle');
const body = document.body;

// 1. Check if user has a saved preference
if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-mode');
    toggleButton.innerHTML = '<i class="fas fa-sun"></i>'; // Change icon to sun
}

// 2. Listen for clicks
if (toggleButton) {
    toggleButton.addEventListener('click', () => {
        body.classList.toggle('dark-mode');

        // Save preference and swap icon
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
            toggleButton.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            localStorage.setItem('theme', 'light');
            toggleButton.innerHTML = '<i class="fas fa-moon"></i>';
        }
    });
}