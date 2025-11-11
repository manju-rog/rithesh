// State management
let userName = '';
let currentActivity = '';
let checkInTime = null;
let timerInterval = null;

// Screen elements
const welcomeScreen = document.getElementById('welcomeScreen');
const activityScreen = document.getElementById('activityScreen');
const timerScreen = document.getElementById('timerScreen');

// Input elements
const nameInput = document.getElementById('nameInput');
const enterNameText = document.querySelector('.enter-name-text');
const greeting = document.querySelector('.greeting');
const optionCards = document.querySelectorAll('.option-card');
const activityName = document.querySelector('.activity-name');
const checkoutBtn = document.getElementById('checkoutBtn');

// Timer elements
const hoursDisplay = document.getElementById('hours');
const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');

// Initialize
function init() {
    // Focus on name input after welcome animation
    setTimeout(() => {
        nameInput.focus();
    }, 2000);

    // Handle name input - hide text when typing
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
            currentActivity = card.dataset.activity;
            startTimer();
            transitionToTimerScreen();
        });
    });

    // Handle checkout
    checkoutBtn.addEventListener('click', handleCheckout);
}

// Screen transitions
function transitionToActivityScreen() {
    welcomeScreen.classList.remove('active');
    setTimeout(() => {
        greeting.textContent = `Hey ${userName}`;
        activityScreen.classList.add('active');
    }, 400);
}

function transitionToTimerScreen() {
    activityScreen.classList.remove('active');
    setTimeout(() => {
        activityName.textContent = currentActivity;
        timerScreen.classList.add('active');
    }, 400);
}

function transitionToWelcome() {
    timerScreen.classList.remove('active');
    setTimeout(() => {
        resetApp();
        welcomeScreen.classList.add('active');
    }, 400);
}

// Timer functions
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

    hoursDisplay.textContent = String(hours).padStart(2, '0');
    minutesDisplay.textContent = String(minutes).padStart(2, '0');
    secondsDisplay.textContent = String(seconds).padStart(2, '0');
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

// Checkout and storage
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
    checkoutBtn.textContent = 'Checked Out ✓';
    setTimeout(() => {
        transitionToWelcome();
    }, 1500);
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
    hoursDisplay.textContent = '00';
    minutesDisplay.textContent = '00';
    secondsDisplay.textContent = '00';
    checkoutBtn.textContent = 'Check Out';
    setTimeout(() => nameInput.focus(), 500);
}

// Initialize app
init();

// Optional: View all records in console
console.log('To view all records, run: JSON.parse(localStorage.getItem("trioRecords"))');
