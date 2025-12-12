// --- 1. CURRENCY LOGIC ---
const amountInput = document.getElementById('amount-input');
const resultDisplay = document.getElementById('conversion-result');
const swapBtn = document.getElementById('swap-btn');
const inputLabel = document.getElementById('input-label');
const resultLabel = document.getElementById('result-label');

const rate = 154.50; 
let isUsdToYen = true;

function convert() {
    const amount = parseFloat(amountInput.value);
    if (isNaN(amount) || amountInput.value === '') {
        resultDisplay.textContent = "---";
        return;
    }
    if (isUsdToYen) {
        const yen = (amount * rate).toLocaleString('ja-JP', { maximumFractionDigits: 0 });
        resultDisplay.textContent = `¥${yen}`;
    } else {
        const usd = (amount / rate).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        resultDisplay.textContent = `${usd}`;
    }
}

if (swapBtn) {
    swapBtn.addEventListener('click', () => {
        isUsdToYen = !isUsdToYen;
        if (isUsdToYen) {
            inputLabel.textContent = "USD ($)";
            resultLabel.textContent = "JPY (¥)";
            amountInput.placeholder = "Enter dollars...";
        } else {
            inputLabel.textContent = "JPY (¥)";
            resultLabel.textContent = "USD ($)";
            amountInput.placeholder = "Enter yen...";
        }
        convert(); 
    });
}

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

if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-mode');
    if (toggleButton) {
        toggleButton.innerHTML = '<i class="fas fa-sun"></i>';
    }
}

if (toggleButton) {
    toggleButton.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
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
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const filterValue = button.getAttribute('data-filter');
            timelineItems.forEach(item => {
                const badge = item.querySelector('.badge');
                if (badge) {
                    const badgeText = badge.innerText.toLowerCase();
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

    if (notebookContainer && savedList) {
        let savedPhrases = JSON.parse(localStorage.getItem('mySavedPhrases')) || [];
        updateNotebookUI();

        saveButtons.forEach(btn => {
            const card = btn.closest('.phrase-card'); 
            const phraseText = card.querySelector('strong').innerText;
            if (savedPhrases.includes(phraseText)) {
                btn.classList.add('liked');
                btn.innerHTML = '<i class="fas fa-heart"></i>'; 
            }
            btn.addEventListener('click', () => {
                if (savedPhrases.includes(phraseText)) {
                    savedPhrases = savedPhrases.filter(p => p !== phraseText);
                    btn.classList.remove('liked');
                    btn.innerHTML = '<i class="far fa-heart"></i>'; 
                } else {
                    savedPhrases.push(phraseText);
                    btn.classList.add('liked');
                    btn.innerHTML = '<i class="fas fa-heart"></i>'; 
                }
                localStorage.setItem('mySavedPhrases', JSON.stringify(savedPhrases));
                updateNotebookUI();
            });
        });

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
    }
});

// --- 7. JR PASS CALCULATOR LOGIC ---
function calculateJRPass() {
    const checkboxes = document.querySelectorAll('.calc-row input[type="checkbox"]');
    let totalCost = 0;
    const jrPassPrice = 50000; 

    checkboxes.forEach(box => {
        // Find the parent row 
        const row = box.closest('.calc-row');
        
        // RESET any inline styles from the old version
        row.style.backgroundColor = ""; 
        row.style.borderColor = "";

        if (box.checked) {
            totalCost += parseInt(box.value);
            // Instead of setting colors here, we just add a class name
            row.classList.add('selected');
        } else {
            row.classList.remove('selected');
        }
    });

    // Update Totals
    document.getElementById('trip-total').innerText = "¥" + totalCost.toLocaleString();
    const verdictBox = document.getElementById('jr-pass-verdict');
    
    if (totalCost === 0) {
        verdictBox.className = "verdict-banner verdict-neutral";
        verdictBox.innerText = "Select a trip to see the result!";
    } else if (totalCost > jrPassPrice) {
        const savings = totalCost - jrPassPrice;
        verdictBox.className = "verdict-banner verdict-worth-it";
        verdictBox.innerHTML = `YES! You save <span style="font-size:1.2em">¥${savings.toLocaleString()}</span>!`;
    } else {
        const loss = jrPassPrice - totalCost;
        verdictBox.className = "verdict-banner verdict-waste";
        verdictBox.innerText = `NO. You would lose ¥${loss.toLocaleString()}.`;
    }
}

// --- 8. TRAVEL CHECKLIST LOGIC ---
const checklistContainer = document.querySelector('.checklist-container');
if (checklistContainer) {
    const checklistBoxes = checklistContainer.querySelectorAll('input[type="checkbox"]');
    checklistBoxes.forEach(box => {
        const isChecked = localStorage.getItem(box.id) === 'true';
        box.checked = isChecked;
    });
    checklistBoxes.forEach(box => {
        box.addEventListener('change', () => {
            localStorage.setItem(box.id, box.checked);
        });
    });
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
if (track) {
    const slides = Array.from(track.children);
    const nextButton = document.querySelector('#nextBtn');
    const prevButton = document.querySelector('#prevBtn');
    const dotsNav = document.querySelector('.carousel-nav');
    const dots = Array.from(dotsNav.children);

    let currentIndex = 0;
    const updateSlide = (index) => {
        slides.forEach(slide => slide.classList.remove('current-slide'));
        dots.forEach(dot => dot.classList.remove('current-slide'));
        slides[index].classList.add('current-slide');
        dots[index].classList.add('current-slide');
    };

    nextButton.addEventListener('click', () => {
        currentIndex++;
        if (currentIndex >= slides.length) currentIndex = 0;
        updateSlide(currentIndex);
    });

    prevButton.addEventListener('click', () => {
        currentIndex--;
        if (currentIndex < 0) currentIndex = slides.length - 1; 
        updateSlide(currentIndex);
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateSlide(currentIndex);
        });
    });
}

// --- 10. LIGHTBOX LOGIC (Fixed to prevent crashing on other pages) ---
const lightbox = document.getElementById('lightbox');

// Only run this if the lightbox actually exists on the page
if (lightbox) {
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.close-lightbox');
    const images = document.querySelectorAll('.clickable-img');

    images.forEach(image => {
        image.addEventListener('click', () => {
            lightbox.style.display = "block";
            lightboxImg.src = image.src;
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            lightbox.style.display = "none";
        });
    }

    lightbox.addEventListener('click', (e) => {
        if (e.target !== lightboxImg) {
            lightbox.style.display = "none";
        }
    });
}

// --- 11. ACCORDION LOGIC FOR CHECKLIST ITEMS ---
document.addEventListener("DOMContentLoaded", function() {
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    if (toggleButtons.length > 0) {
        toggleButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation(); // Stop click from toggling checkbox
                const item = button.closest('.accordion');
                item.classList.toggle('active');
            });
        });
    }
});