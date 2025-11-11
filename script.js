// State management
let userName = '';
let currentActivity = '';
let checkInTime = null;
let timerInterval = null;
let clockInterval = null;

// Clock elements
const timeDisplay = document.getElementById('timeDisplay');
const dateDisplay = document.getElementById('dateDisplay');

// Screen elements
const welcomeScreen = document.getElementById('welcomeScreen');
const activityScreen = document.getElementById('activityScreen');
const timerScreen = document.getElementById('timerScreen');

// Input elements
const nameInput = document.getElementById('nameInput');
const optionCards = document.querySelectorAll('.option-card');
const activityName = document.querySelector('.activity-name');
const checkoutBtn = document.getElementById('checkoutBtn');

// Timer elements
const hoursDisplay = document.getElementById('hours');
const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');

// ===========================================
// DIGITAL CLOCK
// ===========================================
function updateDigitalClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    if (timeDisplay) {
        timeDisplay.textContent = `${hours}:${minutes}:${seconds}`;
    }

    if (dateDisplay) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateDisplay.textContent = now.toLocaleDateString('en-US', options).toUpperCase();
    }
}

function startDigitalClock() {
    updateDigitalClock();
    clockInterval = setInterval(updateDigitalClock, 1000);
}

function stopDigitalClock() {
    if (clockInterval) {
        clearInterval(clockInterval);
        clockInterval = null;
    }
}

// ===========================================
// MAIN APP INITIALIZATION
// ===========================================
function init() {
    // Focus on name input after animation
    setTimeout(() => {
        nameInput.focus();
    }, 1500);

    // Handle name input
    nameInput.addEventListener('input', () => {
        const enterText = document.querySelector('.enter-name-text');
        if (nameInput.value.length > 0) {
            if (enterText) {
                enterText.style.opacity = '0';
                enterText.style.transform = 'translateY(-10px)';
            }
        } else {
            if (enterText) {
                enterText.style.opacity = '1';
                enterText.style.transform = 'translateY(0)';
            }
        }
    });

    nameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && nameInput.value.trim()) {
            userName = nameInput.value.trim();
            transitionToActivityScreen();
        }
    });

    // Handle activity selection
    optionCards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove selection from all cards
            optionCards.forEach(c => c.classList.remove('selected'));

            // Add selection to clicked card
            card.classList.add('selected');

            // Small delay to show selection before transition
            setTimeout(() => {
                currentActivity = card.dataset.activity;

                // Save session data to localStorage
                const sessionData = {
                    userName: userName,
                    activity: currentActivity,
                    startTime: new Date().toISOString()
                };
                localStorage.setItem('trioSession', JSON.stringify(sessionData));

                // Redirect to session active page
                window.location.href = 'session-active.html';
            }, 300);
        });
    });

    // Handle checkout
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', handleCheckout);
    }
}

// ===========================================
// SCREEN TRANSITIONS
// ===========================================
function transitionToActivityScreen() {
    welcomeScreen.classList.remove('active');
    setTimeout(() => {
        const greetingTitle = document.querySelector('.greeting-title');
        if (greetingTitle) {
            greetingTitle.textContent = `Hey ${userName}`;
        }
        activityScreen.classList.add('active');
        startDigitalClock();
    }, 600);
}

function transitionToTimerScreen() {
    activityScreen.classList.remove('active');
    stopDigitalClock();

    setTimeout(() => {
        activityName.textContent = currentActivity;
        timerScreen.classList.add('active');
    }, 600);
}

function transitionToWelcome() {
    timerScreen.classList.remove('active');
    setTimeout(() => {
        resetApp();
        welcomeScreen.classList.add('active');
    }, 600);
}

// ===========================================
// TIMER FUNCTIONS
// ===========================================
function startTimer() {
    checkInTime = Date.now();
    updateTimerDisplay();
    timerInterval = setInterval(updateTimerDisplay, 1000);
}

function updateTimerDisplay() {
    const elapsed = Date.now() - checkInTime;
    const hours = Math.floor(elapsed / 3600000);
    const minutes = Math.floor((elapsed % 3600000) / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);

    const hoursStr = String(hours).padStart(2, '0');
    const minutesStr = String(minutes).padStart(2, '0');
    const secondsStr = String(seconds).padStart(2, '0');

    if (hoursDisplay) hoursDisplay.textContent = hoursStr;
    if (minutesDisplay) minutesDisplay.textContent = minutesStr;
    if (secondsDisplay) secondsDisplay.textContent = secondsStr;
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

// ===========================================
// CHECKOUT AND STORAGE
// ===========================================
function handleCheckout() {
    const checkOutTime = Date.now();
    const duration = checkOutTime - checkInTime;

    const record = {
        name: userName,
        activity: currentActivity,
        checkIn: new Date(checkInTime).toISOString(),
        checkOut: new Date(checkOutTime).toISOString(),
        duration: duration,
        durationFormatted: formatDuration(duration)
    };

    saveRecord(record);
    stopTimer();

    // Show completion animation
    if (checkoutBtn) {
        const originalText = checkoutBtn.innerHTML;
        checkoutBtn.innerHTML = '<span>Checked Out ✓</span>';

        setTimeout(() => {
            checkoutBtn.innerHTML = originalText;
            transitionToWelcome();
        }, 1500);
    }
}

function formatDuration(ms) {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
}

function saveRecord(record) {
    const records = JSON.parse(localStorage.getItem('trioRecords') || '[]');
    records.push(record);
    localStorage.setItem('trioRecords', JSON.stringify(records));
    console.log('Record saved:', record);
}

function resetApp() {
    userName = '';
    currentActivity = '';
    checkInTime = null;
    nameInput.value = '';

    if (hoursDisplay) hoursDisplay.textContent = '00';
    if (minutesDisplay) minutesDisplay.textContent = '00';
    if (secondsDisplay) secondsDisplay.textContent = '00';

    // Remove selection from all cards
    optionCards.forEach(card => card.classList.remove('selected'));

    setTimeout(() => nameInput.focus(), 500);
}

// ===========================================
// INITIALIZE APP
// ===========================================
init();

console.log('TRIO Time Tracking - To view all records, run: JSON.parse(localStorage.getItem("trioRecords"))');
