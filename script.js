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
const mybutton = document.getElementById("scrollToTopBtn");

// SAFETY CHECK: Only run this code if the button actually exists on this page
if (mybutton) {
    window.onscroll = function() {scrollFunction()};

    function scrollFunction() {
        if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
            mybutton.style.display = "block";
        } else {
            mybutton.style.display = "none";
        }
    }

    mybutton.addEventListener("click", function() {
        window.scrollTo({top: 0, behavior: 'smooth'});
    });
}

// --- 5. DARK MODE TOGGLE LOGIC ---
const toggleButton = document.getElementById('theme-toggle');
const body = document.body;

// 1. Check if user has a saved preference (Runs immediately on load)
if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-mode');
    if (toggleButton) {
        toggleButton.innerHTML = '<i class="fas fa-sun"></i>';
    }
}

// 2. Listen for clicks (Only if button exists)
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

// --- 6. BLOG FILTER LOGIC ---
const filterButtons = document.querySelectorAll('.filter-btn');
const timelineItems = document.querySelectorAll('.timeline-container');

if (filterButtons.length > 0) {
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 1. Remove 'active' class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // 2. Add 'active' class to the clicked button
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            timelineItems.forEach(item => {
                // Find the badge text inside this timeline item
                const badge = item.querySelector('.badge');
                if (badge) {
                    const badgeText = badge.innerText.toLowerCase();

                    // If filter is 'all' OR the badge text matches the filter
                    if (filterValue === 'all' || badgeText.includes(filterValue)) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                }
            });
        });
    });
}
// --- 7. SAVED PHRASES (LOCAL STORAGE) ---
document.addEventListener('DOMContentLoaded', () => {
    
    const saveButtons = document.querySelectorAll('.save-btn');
    const notebookContainer = document.getElementById('notebook-container');
    const savedList = document.getElementById('saved-list');

    // 1. Load saved phrases from LocalStorage on page load
    let savedPhrases = JSON.parse(localStorage.getItem('mySavedPhrases')) || [];
    updateNotebookUI();

    // 2. Add Click Listeners to all Heart Buttons
    saveButtons.forEach(btn => {
        // Find the text for this specific card
        // We look at the parent's parent to find the text container
        const card = btn.closest('.phrase-card'); 
        const phraseText = card.querySelector('strong').innerText;

        // Check if this phrase is already saved (to set the heart color correctly on load)
        if (savedPhrases.includes(phraseText)) {
            btn.classList.add('liked');
            btn.innerHTML = '<i class="fas fa-heart"></i>'; // Solid heart
        }

        btn.addEventListener('click', () => {
            // Toggle the 'liked' state
            if (savedPhrases.includes(phraseText)) {
                // REMOVE IT
                savedPhrases = savedPhrases.filter(p => p !== phraseText);
                btn.classList.remove('liked');
                btn.innerHTML = '<i class="far fa-heart"></i>'; // Empty heart
            } else {
                // ADD IT
                savedPhrases.push(phraseText);
                btn.classList.add('liked');
                btn.innerHTML = '<i class="fas fa-heart"></i>'; // Solid heart
            }

            // Save to Browser Memory
            localStorage.setItem('mySavedPhrases', JSON.stringify(savedPhrases));
            
            // Update the UI
            updateNotebookUI();
        });
    });

    // 3. Function to Render the Notebook List
    function updateNotebookUI() {
        // Clear current list
        savedList.innerHTML = '';

        if (savedPhrases.length === 0) {
            notebookContainer.style.display = 'none'; // Hide if empty
        } else {
            notebookContainer.style.display = 'block'; // Show if has items
            
            savedPhrases.forEach(phrase => {
                const li = document.createElement('li');
                li.textContent = phrase;
                li.style.marginBottom = "5px";
                savedList.appendChild(li);
            });
        }
    }
});