// --- 1. CURRENCY LOGIC ---
// Grab elements
const amountInput = document.getElementById('amount-input');
const resultDisplay = document.getElementById('conversion-result');
const swapBtn = document.getElementById('swap-btn');
const inputLabel = document.getElementById('input-label');
const resultLabel = document.getElementById('result-label');

// Current Rate (approximate)
const rate = 154.50; 
let isUsdToYen = true; // State: Are we doing USD -> JPY?

function convert() {
    const amount = parseFloat(amountInput.value);

    // Handle empty or invalid input
    if (isNaN(amount) || amountInput.value === '') {
        resultDisplay.textContent = "---";
        return;
    }

    if (isUsdToYen) {
        // USD -> JPY (Multiplication)
        // format: 1,000
        const yen = (amount * rate).toLocaleString('ja-JP', { maximumFractionDigits: 0 });
        resultDisplay.textContent = `¥${yen}`;
    } else {
        // JPY -> USD (Division)
        // format: 10.50
        const usd = (amount / rate).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        resultDisplay.textContent = `${usd}`;
    }
}

// Event: Click Swap Button
if (swapBtn) {
    swapBtn.addEventListener('click', () => {
        // 1. Toggle state
        isUsdToYen = !isUsdToYen;
        
        // 2. Rotate text labels
        if (isUsdToYen) {
            inputLabel.textContent = "USD ($)";
            resultLabel.textContent = "JPY (¥)";
            amountInput.placeholder = "Enter dollars...";
        } else {
            inputLabel.textContent = "JPY (¥)";
            resultLabel.textContent = "USD ($)";
            amountInput.placeholder = "Enter yen...";
        }

        // 3. Clear result to avoid confusion or re-calculate immediately
        convert(); 
    });
}

// Event: Type in the box
if (amountInput) {
    amountInput.addEventListener('input', convert);
}

// --- 2. AUDIO LOGIC ---
function playAudio(phrase) {
    console.log("User clicked play for:", phrase);
    alert("Playing audio for: " + phrase + " (Connect actual MP3 files in the code!)");
}

// --- 3. SCROLL TO TOP LOGIC ---
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

// --- 4. DARK MODE TOGGLE LOGIC ---
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

// --- 5. BLOG FILTER LOGIC ---
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

// --- 6. SAVED PHRASES (LOCAL STORAGE) ---
document.addEventListener('DOMContentLoaded', () => {
    
    const notebookContainer = document.getElementById('notebook-container');
    const savedList = document.getElementById('saved-list');
    const saveButtons = document.querySelectorAll('.save-btn');

    // SAFEGUARD: Only run this code if the notebook actually exists on this page
    if (notebookContainer && savedList) {

        // 1. Load saved phrases from LocalStorage on page load
        let savedPhrases = JSON.parse(localStorage.getItem('mySavedPhrases')) || [];
        updateNotebookUI();

        // 2. Add Click Listeners to all Heart Buttons
        saveButtons.forEach(btn => {
            const card = btn.closest('.phrase-card'); 
            const phraseText = card.querySelector('strong').innerText;

            // Check if this phrase is already saved
            if (savedPhrases.includes(phraseText)) {
                btn.classList.add('liked');
                btn.innerHTML = '<i class="fas fa-heart"></i>'; 
            }

            btn.addEventListener('click', () => {
                if (savedPhrases.includes(phraseText)) {
                    // REMOVE IT
                    savedPhrases = savedPhrases.filter(p => p !== phraseText);
                    btn.classList.remove('liked');
                    btn.innerHTML = '<i class="far fa-heart"></i>'; 
                } else {
                    // ADD IT
                    savedPhrases.push(phraseText);
                    btn.classList.add('liked');
                    btn.innerHTML = '<i class="fas fa-heart"></i>'; 
                }

                localStorage.setItem('mySavedPhrases', JSON.stringify(savedPhrases));
                updateNotebookUI();
            });
        });

        // 3. Function to Render the Notebook List
        function updateNotebookUI() {
            savedList.innerHTML = '';

            if (savedPhrases.length === 0) {
                notebookContainer.style.display = 'none'; 
            } else {
                notebookContainer.style.display = 'block'; 
                
                savedPhrases.forEach(phrase => {
                    const li = document.createElement('li');
                    li.textContent = phrase;
                    li.style.marginBottom = "5px";
                    savedList.appendChild(li);
                });
            }
        }
    } // End of Safe Check
});

// --- 7. JR PASS CALCULATOR LOGIC ---
const JR_PASS_COST = 50000; // Hardcoded 7-day pass cost in JPY (for MVP)

function calculateJRPass() {
    const tripOptions = document.getElementById('trip-options');
    const checkboxes = tripOptions.querySelectorAll('input[type="checkbox"]');
    const tripTotalDisplay = document.getElementById('trip-total');
    const verdictDisplay = document.getElementById('jr-pass-verdict');
    let totalCost = 0;

    // 1. Calculate Total Ticket Cost
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            // Use dataset to get the value from data-cost=""
            totalCost += parseInt(checkbox.dataset.cost);
        }
    });

    // 2. Display the Trip Total
    tripTotalDisplay.innerText = '¥ ' + totalCost.toLocaleString('en-US');

    // 3. Determine and Display the Verdict
    if (totalCost === 0) {
        verdictDisplay.innerText = "Select a trip to see the result!";
        verdictDisplay.style.backgroundColor = '#e6e6e6';
        verdictDisplay.style.color = 'var(--text-dark)';
    } else if (totalCost >= JR_PASS_COST) {
        verdictDisplay.innerText = `YES! You save ¥ ${(totalCost - JR_PASS_COST).toLocaleString('en-US')} by buying the JR Pass.`;
        verdictDisplay.style.backgroundColor = '#d4edda'; // Light green
        verdictDisplay.style.color = '#155724'; // Dark green text
    } else {
        verdictDisplay.innerText = `NO. You spend ¥ ${(JR_PASS_COST - totalCost).toLocaleString('en-US')} more than you need to. Just buy individual tickets.`;
        verdictDisplay.style.backgroundColor = '#f8d7da'; // Light red
        verdictDisplay.style.color = '#721c24'; // Dark red text
    }
}

// --- 8. TRAVEL CHECKLIST LOGIC ---
const checklistContainer = document.querySelector('.checklist-container');

// Only run this if we are actually on the checklist page
if (checklistContainer) {
    // FIX 1: We define the variable here
    const checklistBoxes = checklistContainer.querySelectorAll('input[type="checkbox"]');

    // 1. Load saved checks from LocalStorage
    // FIX 1: We must use 'checklistBoxes' (the name we just made), not 'checkboxes'
    checklistBoxes.forEach(box => {
        const isChecked = localStorage.getItem(box.id) === 'true';
        box.checked = isChecked;
    });

    // 2. Listen for clicks to save progress
    checklistBoxes.forEach(box => {
        box.addEventListener('change', () => {
            localStorage.setItem(box.id, box.checked);
        });
    });

    // 3. Reset Button Logic
    // FIX 2: Select by the ID we added in HTML ('reset-checklist-btn')
    const resetBtn = document.getElementById('reset-checklist-btn');
    
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if(confirm("Are you sure you want to uncheck everything?")) {
                checklistBoxes.forEach(box => {
                    box.checked = false;
                    localStorage.removeItem(box.id);
                });
            }
        });
    }
}
// --- 9. HOMEPAGE CAROUSEL LOGIC ---
const track = document.querySelector('.carousel-track');

// Only run if the carousel exists (so it doesn't break other pages)
if (track) {
    const slides = Array.from(track.children);
    const nextButton = document.querySelector('#nextBtn');
    const prevButton = document.querySelector('#prevBtn');
    const dotsNav = document.querySelector('.carousel-nav');
    const dots = Array.from(dotsNav.children);

    let currentIndex = 0;

    // Function to update the slide display
    const updateSlide = (index) => {
        // 1. Remove 'current-slide' from ALL slides & dots
        slides.forEach(slide => slide.classList.remove('current-slide'));
        dots.forEach(dot => dot.classList.remove('current-slide'));

        // 2. Add 'current-slide' to the NEW target
        slides[index].classList.add('current-slide');
        dots[index].classList.add('current-slide');
    };

    // Click Right (Next)
    nextButton.addEventListener('click', () => {
        currentIndex++;
        if (currentIndex >= slides.length) {
            currentIndex = 0; // Loop back to start
        }
        updateSlide(currentIndex);
    });

    // Click Left (Previous)
    prevButton.addEventListener('click', () => {
        currentIndex--;
        if (currentIndex < 0) {
            currentIndex = slides.length - 1; // Loop to end
        }
        updateSlide(currentIndex);
    });

    // Click on Dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateSlide(currentIndex);
        });
    });
}
// --- 10. LIGHTBOX LOGIC FOR BLOG IMAGES ---
// LIGHTBOX FUNCTIONALITY
// Get the lightbox elements
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeBtn = document.querySelector('.close-lightbox');

// Select all images you want to be clickable
// (Ensure you added the 'clickable-img' class to your HTML images!)
const images = document.querySelectorAll('.clickable-img');

images.forEach(image => {
    image.addEventListener('click', () => {
        lightbox.style.display = "block";
        lightboxImg.src = image.src;
    });
});

// Close the lightbox when clicking the (x)
closeBtn.addEventListener('click', () => {
    lightbox.style.display = "none";
});

// Close the lightbox when clicking outside the image
lightbox.addEventListener('click', (e) => {
    if (e.target !== lightboxImg) {
        lightbox.style.display = "none";
    }
});
// --- 11. ACCORDION LOGIC FOR CHECKLIST ITEMS ---
document.addEventListener("DOMContentLoaded", function() {
    // Select all the arrow buttons
    const toggleButtons = document.querySelectorAll('.toggle-btn');

    // Only run this code if we actually found buttons (i.e., we are on the Checklist page)
    if (toggleButtons.length > 0) {
        toggleButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                // Prevents the click from triggering anything else
                e.stopPropagation();
                
                // Find the parent item and toggle the "active" class
                const item = button.closest('.accordion');
                item.classList.toggle('active');
            });
        });
    }
});