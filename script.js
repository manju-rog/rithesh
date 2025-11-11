// State management
let userName = '';
let currentActivity = '';
let checkInTime = null;
let timerInterval = null;

// Cursor elements
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

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

// Previous time values for flip animation
let prevSeconds = '00';
let prevMinutes = '00';
let prevHours = '00';

// ===========================================
// CUSTOM CURSOR
// ===========================================
let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;
let followerX = 0;
let followerY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Smooth cursor animation using requestAnimationFrame
function animateCursor() {
    // Lerp (linear interpolation) for smooth following
    const speed = 0.2;
    const followerSpeed = 0.1;

    cursorX += (mouseX - cursorX) * speed;
    cursorY += (mouseY - cursorY) * speed;

    followerX += (mouseX - followerX) * followerSpeed;
    followerY += (mouseY - followerY) * followerSpeed;

    cursor.style.transform = `translate(${cursorX - 6}px, ${cursorY - 6}px)`;
    cursorFollower.style.transform = `translate(${followerX - 20}px, ${followerY - 20}px)`;

    requestAnimationFrame(animateCursor);
}
animateCursor();

// Hover effects for cursor
const interactiveElements = [
    ...optionCards,
    checkoutBtn,
    nameInput
];

interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover');
    });
});

// ===========================================
// MAGNETIC EFFECT ON CARDS
// ===========================================
optionCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const deltaX = (x - centerX) / centerX;
        const deltaY = (y - centerY) / centerY;

        const moveX = deltaX * 10;
        const moveY = deltaY * 10;
        const rotateX = deltaY * 5;
        const rotateY = deltaX * 5;

        card.style.transform = `
            translateY(-12px)
            scale(1.05)
            translateX(${moveX}px)
            translateY(${moveY}px)
            rotateX(${-rotateX}deg)
            rotateY(${rotateY}deg)
            translateZ(50px)
        `;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// Magnetic effect on checkout button
checkoutBtn.addEventListener('mousemove', (e) => {
    const rect = checkoutBtn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const deltaX = (x - centerX) / centerX;
    const deltaY = (y - centerY) / centerY;

    const moveX = deltaX * 8;
    const moveY = deltaY * 8;

    checkoutBtn.style.transform = `
        scale(1.08)
        translateY(-4px)
        translateX(${moveX}px)
        translateY(${moveY - 4}px)
    `;
});

checkoutBtn.addEventListener('mouseleave', () => {
    checkoutBtn.style.transform = '';
});

// ===========================================
// RIPPLE EFFECT
// ===========================================
function createRipple(e, element) {
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');

    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    element.appendChild(ripple);

    setTimeout(() => {
        ripple.remove();
    }, 600);
}

optionCards.forEach(card => {
    card.addEventListener('click', (e) => {
        createRipple(e, card);
    });
});

checkoutBtn.addEventListener('click', (e) => {
    createRipple(e, checkoutBtn);
});

// ===========================================
// PARTICLE BACKGROUND
// ===========================================
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.5 + 0.2;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
    }

    draw() {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

const particlesArray = [];
const numberOfParticles = 100;

for (let i = 0; i < numberOfParticles; i++) {
    particlesArray.push(new Particle());
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particlesArray.forEach(particle => {
        particle.update();
        particle.draw();
    });

    // Draw connections between nearby particles
    for (let i = 0; i < particlesArray.length; i++) {
        for (let j = i + 1; j < particlesArray.length; j++) {
            const dx = particlesArray[i].x - particlesArray[j].x;
            const dy = particlesArray[i].y - particlesArray[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) {
                ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - distance / 150)})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                ctx.stroke();
            }
        }
    }

    requestAnimationFrame(animateParticles);
}

animateParticles();

// ===========================================
// MAIN APP INITIALIZATION
// ===========================================
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

    // Handle activity selection with enhanced feedback
    optionCards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove selection from all cards
            optionCards.forEach(c => c.classList.remove('selected'));

            // Add selection to clicked card
            card.classList.add('selected');

            // Small delay to show selection before transition
            setTimeout(() => {
                currentActivity = card.dataset.activity;
                startTimer();
                transitionToTimerScreen();
            }, 300);
        });
    });

    // Handle checkout
    checkoutBtn.addEventListener('click', handleCheckout);
}

// ===========================================
// SCREEN TRANSITIONS
// ===========================================
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

// ===========================================
// TIMER FUNCTIONS WITH FLIP ANIMATION
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

    // Apply flip animation when value changes
    if (secondsStr !== prevSeconds) {
        secondsDisplay.classList.add('flip');
        setTimeout(() => secondsDisplay.classList.remove('flip'), 400);
        prevSeconds = secondsStr;
    }

    if (minutesStr !== prevMinutes) {
        minutesDisplay.classList.add('flip');
        setTimeout(() => minutesDisplay.classList.remove('flip'), 400);
        prevMinutes = minutesStr;
    }

    if (hoursStr !== prevHours) {
        hoursDisplay.classList.add('flip');
        setTimeout(() => hoursDisplay.classList.remove('flip'), 400);
        prevHours = hoursStr;
    }

    hoursDisplay.textContent = hoursStr;
    minutesDisplay.textContent = minutesStr;
    secondsDisplay.textContent = secondsStr;
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
    const originalText = checkoutBtn.innerHTML;
    checkoutBtn.innerHTML = '<span>Checked Out ✓</span>';
    checkoutBtn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    checkoutBtn.style.transform = 'scale(1.1)';

    setTimeout(() => {
        checkoutBtn.style.transform = 'scale(1)';
    }, 200);

    setTimeout(() => {
        checkoutBtn.innerHTML = originalText;
        checkoutBtn.style.background = '';
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
    prevSeconds = '00';
    prevMinutes = '00';
    prevHours = '00';

    // Remove selection from all cards
    optionCards.forEach(card => card.classList.remove('selected'));

    setTimeout(() => nameInput.focus(), 500);
}

// ===========================================
// SMOOTH SCROLL BEHAVIOR
// ===========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===========================================
// INITIALIZE APP
// ===========================================
init();

// Optional: View all records in console
console.log('%c TRIO Time Tracking ', 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-size: 16px; padding: 10px; border-radius: 5px;');
console.log('To view all records, run: JSON.parse(localStorage.getItem("trioRecords"))');

// Performance monitoring (development only)
if (window.performance) {
    window.addEventListener('load', () => {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`Page load time: ${pageLoadTime}ms`);
    });
}
