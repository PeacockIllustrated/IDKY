// smoke-tracker-script.js

document.addEventListener('DOMContentLoaded', () => {
    // --- Constants and State Variables ---
    const localStorageKeySuffix = '_v27_theme_shop';

    // --- Element Selectors ---
    const particleCanvas = document.getElementById('particleCanvas'); // For smoke/vape effects
    // ... (all other selectors remain the same)
    const userPointsDisplay = document.getElementById('userPoints');
    const smokeFreeStreakDisplay = document.getElementById('smokeFreeStreak');
    const streakDisplay = document.getElementById('streakDisplay');
    const healthMilestonesDisplay = document.getElementById('healthMilestones');
    const shopUserPointsDisplay = document.getElementById('shopUserPoints');
    const toastNotification = document.getElementById('toastNotification');
    const logCigaretteButton = document.getElementById('logCigaretteButton');
    const todayCigaretteCountDisplay = document.getElementById('todayCigaretteCount');
    const cigaretteLimitDisplay = document.getElementById('cigaretteLimitDisplay');
    const setLimitInput = document.getElementById('setLimitInput');
    const saveLimitButton = document.getElementById('saveLimitButton');
    const startVapeTimerButton = document.getElementById('startVapeTimerButton');
    const stopVapeTimerButton = document.getElementById('stopVapeTimerButton');
    const vapeTimerDisplay = document.getElementById('vapeTimerDisplay');
    const setVapeSessionLimitInput = document.getElementById('setVapeSessionLimitInput');
    const saveVapeSessionLimitButton = document.getElementById('saveVapeSessionLimitButton');
    const todayTotalVapeTimeDisplay = document.getElementById('todayTotalVapeTimeDisplay');
    const dailyVapeTimeLimitDisplay = document.getElementById('dailyVapeTimeLimitDisplay');
    const setDailyVapeTimeLimitInput = document.getElementById('setDailyVapeTimeLimitInput');
    const saveDailyVapeTimeLimitButton = document.getElementById('saveDailyVapeTimeLimitButton');
    const smokeLogList = document.getElementById('smokeLogList');
    const noLogsPlaceholder = document.getElementById('noLogsPlaceholder');
    const reasonModalOverlay = document.getElementById('reasonModalOverlay');
    const reasonInput = document.getElementById('reasonInput');
    const reasonLogTimestampInput = document.getElementById('reasonLogTimestamp');
    const saveReasonButton = document.getElementById('saveReasonButton');
    const cancelReasonButton = document.getElementById('cancelReasonButton');
    // Shop toolbar elements are not interactive on this page anymore

    // --- State Variables ---
    // ... (all other state variables remain the same) ...
    let userPoints = 0;
    let smokeFreeStreak = 0;
    let healthMilestones = 0;
    let dailyCigaretteLimit = 5;
    let vapeSessionDurationLimit = 30;
    let dailyTotalVapeTimeLimit = 300;
    let smokeLog = [];
    let lastLogDate = '';
    let todayCigaretteCount = 0;
    let todayTotalVapeTime = 0;
    let lastDayStreakIncremented = '';
    let isVapeTimerRunning = false;
    let vapeTimerStartTime = null;
    let vapeTimerIntervalId = null;
    let vapeTimerTargetEndTime = null;
    let vapeTimerMode = 'up';
    let ownedThemes = ['default'];
    let currentTheme = 'default';

    // --- NEW: Particle System State ---
    let particleCtx = null;
    let particles = [];
    let isAnimatingParticles = false;
    let vapeParticleIntervalId = null;


    // --- Theme Data Object (Keep this definition) ---
    const themes = { /* ... Full themes object definition ... */
        default: { name: "Default Retro", cost: 0, owned: true, description: "The classic look and feel.", cssVariables: { '--theme-primary-dark': '#264653', '--theme-primary-accent': '#2A9D8F', '--theme-secondary-accent': '#E9C46A', '--theme-tertiary-accent': '#F4A261', '--theme-highlight-accent': '#E76F51', '--theme-light-bg': '#EAEAEA', '--theme-card-bg': '#FFFFFF', '--theme-text-on-dark': '#EAEAEA', '--theme-page-bg': 'rgb(174, 217, 211)' } },
        oceanDepths: { name: "Ocean Depths", cost: 1, description: "Dive into cool blue tranquility.", cssVariables: { '--theme-primary-dark': '#03045E', '--theme-primary-accent': '#0077B6', '--theme-secondary-accent': '#00B4D8', '--theme-tertiary-accent': '#90E0EF', '--theme-highlight-accent': '#CAF0F8', '--theme-light-bg': '#E0FBFC', '--theme-card-bg': '#FFFFFF', '--theme-text-on-dark': '#CAF0F8', '--theme-page-bg': '#ADE8F4' } },
        volcanoRush: { name: "Volcano Rush", cost: 1, description: "Fiery reds and oranges.", cssVariables: { '--theme-primary-dark': '#2B0000', '--theme-primary-accent': '#6A0000', '--theme-secondary-accent': '#FF4500', '--theme-tertiary-accent': '#FF8C00', '--theme-highlight-accent': '#AE2012', '--theme-light-bg': '#FFF2E6', '--theme-card-bg': '#FFFFFF', '--theme-text-on-dark': '#FFDAB9', '--theme-page-bg': '#FFCDB2' } },
        techOrangeBlue: { name: "Tech Orange & Blue", cost: 1, description: "A modern tech-inspired palette.", cssVariables: { '--theme-primary-dark': '#004C97', '--theme-primary-accent': '#4A7DB5', '--theme-secondary-accent': '#FF6600', '--theme-tertiary-accent': '#C0C0C0', '--theme-highlight-accent': '#FF7700', '--theme-light-bg': '#F0F0F0', '--theme-card-bg': '#FFFFFF', '--theme-text-on-dark': '#F0F0F0', '--theme-page-bg': '#E8E8E8' } },
        forestGreens: { name: "Forest Greens", cost: 1, description: "Earthy and calming greens.", cssVariables: { '--theme-primary-dark': '#1A2B12', '--theme-primary-accent': '#335128', '--theme-secondary-accent': '#526F35', '--theme-tertiary-accent': '#8A9A5B', '--theme-highlight-accent': '#E0E7A3', '--theme-light-bg': '#F0F5E0', '--theme-card-bg': '#FFFFFF', '--theme-text-on-dark': '#E0E7A3', '--theme-page-bg': '#D8E0C0' } }
    };

    // --- Helper Functions (Keep all: formatTime, formatTimerDisplay, parseMMSS, showToast, triggerPointsFlash, addPoints, getCurrentDateString) ---
    function formatTime(totalSeconds) { /* ... */ }
    function formatTimerDisplay(totalSeconds) { /* ... */ }
    function parseMMSS(timeString) { /* ... */ }
    function showToast(message, duration = 2500) { /* ... */ }
    function triggerPointsFlash() { /* ... */ }
    function addPoints(amount, reason = "") { /* ... */ }
    function getCurrentDateString() { /* ... */ }

    // --- NEW: Particle System Functions ---
    function initializeParticleCanvas() {
        if (particleCanvas) {
            particleCtx = particleCanvas.getContext('2d');
            particleCanvas.width = window.innerWidth;
            particleCanvas.height = window.innerHeight;
            window.addEventListener('resize', () => {
                if (particleCanvas && particleCtx) { // Add check for particleCtx
                    particleCanvas.width = window.innerWidth;
                    particleCanvas.height = window.innerHeight;
                }
            });
        } else {
            console.warn("Particle canvas not found for smoke/vape effects.");
        }
    }

    function createGenericParticle(x, y, options) {
        if (!particleCtx) return;
        const defaults = {
            color: '#FFFFFF',
            size: Math.random() * 5 + 2, // Default: 2-7px
            count: 1,
            spread: 3,
            speedX: (Math.random() - 0.5) * options.spread,
            speedY: (Math.random() * -1.5 - 0.5) * (options.speedMultiplier || 1), // Default up
            life: 60 + Math.random() * 40, // Default: 60-100 frames
            gravity: 0.01, // Slight downward pull, can be negative for upward float
            alphaDecay: 0.98 // How quickly it fades
        };
        const pOptions = { ...defaults, ...options };

        for (let i = 0; i < pOptions.count; i++) {
            particles.push({
                x: x + (Math.random() - 0.5) * (pOptions.initialSpread || 0), // Initial spread from point
                y: y + (Math.random() - 0.5) * (pOptions.initialSpread || 0),
                size: pOptions.size,
                color: pOptions.color,
                vx: pOptions.speedX,
                vy: pOptions.speedY,
                life: pOptions.life,
                alpha: 1,
                gravity: pOptions.gravity,
                alphaDecay: pOptions.alphaDecay
            });
        }

        if (particles.length > 0 && !isAnimatingParticles) {
            isAnimatingParticles = true;
            requestAnimationFrame(updateAndDrawParticles);
        }
    }

    function updateAndDrawParticles() {
        if (!particleCtx || !particleCanvas) {
            isAnimatingParticles = false;
            return;
        }
        particleCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
        let stillAnimating = false;

        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity;
            p.alpha *= p.alphaDecay;
            p.life--;

            if (p.life <= 0 || p.alpha <= 0.01) {
                particles.splice(i, 1);
                continue;
            }

            particleCtx.fillStyle = p.color;
            particleCtx.globalAlpha = p.alpha;
            // Using simple squares for retro feel
            particleCtx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
            stillAnimating = true;
        }
        particleCtx.globalAlpha = 1; // Reset global alpha

        if (stillAnimating) {
            requestAnimationFrame(updateAndDrawParticles);
        } else {
            isAnimatingParticles = false;
        }
    }

    function triggerCigarettePuff() {
        if (!logCigaretteButton) return; // Ensure button exists
        const rect = logCigaretteButton.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2 - 30; // Puff starts slightly above button center

        const greyColors = ['#AAAAAA', '#BBBBBB', '#CCCCCC', '#DDDDDD'];
        for (let i = 0; i < 30; i++) { // Create a burst of ~30 particles
            createGenericParticle(x, y, {
                color: greyColors[Math.floor(Math.random() * greyColors.length)],
                size: Math.random() * 6 + 4, // 4-10px
                spread: 4,
                speedMultiplier: 0.8, // Slower, puff-like
                gravity: -0.02, // Make it float up more initially
                life: 50 + Math.random() * 30, // Shorter life for a puff
                alphaDecay: 0.96,
                initialSpread: 10 // Spread particles a bit at the source
            });
        }
    }

    function startVapeParticleStream() {
        if (!vapeTimerDisplay || vapeParticleIntervalId) return; // Prevent multiple intervals

        const rect = vapeTimerDisplay.getBoundingClientRect(); // Emit from near the timer display
        const x = rect.left + rect.width / 2;
        const y = rect.top - 10; // Emit from just above the timer

        vapeParticleIntervalId = setInterval(() => {
            if (!isVapeTimerRunning) { // Stop if timer stops externally
                stopVapeParticleStream();
                return;
            }
            createGenericParticle(x, y, {
                color: '#F0F0F0', // Whiteish vape
                size: Math.random() * 4 + 2, // 2-6px, smaller than smoke
                count: 1, // Emit 1 particle per interval for a gentle stream
                spread: 1.5,
                speedMultiplier: 0.5, // Slower, more ethereal
                gravity: -0.03, // More upward float
                life: 80 + Math.random() * 50, // Longer life for lingering vape
                alphaDecay: 0.985,
                initialSpread: 5
            });
        }, 150); // Add a particle every 150ms
    }

    function stopVapeParticleStream() {
        if (vapeParticleIntervalId) {
            clearInterval(vapeParticleIntervalId);
            vapeParticleIntervalId = null;
        }
    }


    // --- Load & Save State (Unchanged) ---
    function loadState() { /* ... */ }
    function saveState() { /* ... */ }

    // --- Theme Application Logic (Unchanged) ---
    function applyThemeOnPage(themeId) { /* ... */ }


    // --- Core Logic Functions ---
    function checkDateAndResetCounts() { /* ... (Keep existing logic) ... */ }

    function logCigaretteEvent() {
        checkDateAndResetCounts();
        todayCigaretteCount++;
        const logEntry = { type: 'cigarette', timestamp: Date.now(), reason: '' };
        smokeLog.unshift(logEntry);
        if (smokeLog.length > 100) { smokeLog.pop(); }

        triggerCigarettePuff(); // <<<<<< NEW: Trigger smoke puff

        showToast("Cigarette logged.");
        checkAndWarnLimits();
        updateStatusDisplay();
        renderSmokeLog();
        saveState();
    }

    function startVapeTimer() {
        if (isVapeTimerRunning) { return; }
        checkDateAndResetCounts();
        isVapeTimerRunning = true;
        vapeTimerStartTime = Date.now();
        // ... (rest of startVapeTimer logic remains the same)
        startVapeTimerButton.disabled = true;
        stopVapeTimerButton.disabled = false;
        stopVapeTimerButton.style.display = 'inline-block';
        vapeTimerDisplay.classList.remove('warning', 'counting-down');
        if (vapeSessionDurationLimit > 0) { /* ... */ } else { /* ... */ }
        vapeTimerIntervalId = setInterval(() => { /* ... */ }, 1000);

        startVapeParticleStream(); // <<<<<< NEW: Start vape particle stream
    }

    function stopVapeTimer(autoStopped = false) {
        if (!isVapeTimerRunning) { return; }
        // ... (rest of stopVapeTimer logic remains the same) ...
        clearInterval(vapeTimerIntervalId); // This is for the timer display interval
        isVapeTimerRunning = false;
        const endTime = Date.now();
        let durationSeconds;
        if (vapeTimerMode === 'down') { /* ... */ } else { /* ... */ }
        todayTotalVapeTime += durationSeconds;
        const logEntry = { type: 'vape', timestamp: endTime, duration: durationSeconds, reason: '' };
        smokeLog.unshift(logEntry);
        if (smokeLog.length > 100) { smokeLog.pop(); }
        vapeTimerStartTime = null; vapeTimerTargetEndTime = null; /* vapeTimerIntervalId = null; */ vapeTimerMode = 'up'; // Don't nullify vapeTimerIntervalId here, the timer logic needs it.
        startVapeTimerButton.disabled = false;
        stopVapeTimerButton.disabled = true; stopVapeTimerButton.style.display = 'none';
        vapeTimerDisplay.textContent = formatTimerDisplay(0);
        vapeTimerDisplay.classList.remove('warning', 'counting-down');
        if (!autoStopped) { showToast(`Vape session logged: ${formatTime(durationSeconds)}`); }
        checkAndWarnLimits(); updateStatusDisplay(); renderSmokeLog(); saveState();

        stopVapeParticleStream(); // <<<<<< NEW: Stop vape particle stream
    }

    function checkAndWarnLimits() { /* ... (Keep existing logic) ... */ }


    // --- UI Update Functions (Keep existing updateHeaderDisplays, updateStatusDisplay) ---
    function updateHeaderDisplays() { /* ... */ }
    function updateStatusDisplay() { /* ... */ }

    // --- renderSmokeLog (Keep corrected version) ---
    function renderSmokeLog() { /* ... */ }

    // --- Reason Modal Logic (Keep existing) ---
    function handleOpenReasonModal(timestamp) { /* ... */ }
    function handleCloseReasonModal() { /* ... */ }
    function handleSaveReason() { /* ... */ }

    // --- Event Listeners (Keep existing) ---
    if (logCigaretteButton) { /* ... */ }
    // ... (all other event listeners remain the same)

    // --- Initial Setup ---
    loadState();
    initializeParticleCanvas(); // <<<<<< NEW: Initialize canvas
    applyThemeOnPage(currentTheme);
    checkDateAndResetCounts();
    updateHeaderDisplays();
    updateStatusDisplay();
    renderSmokeLog();

    console.log("Smoke Tracker Initialized (v6 - Particle Effects).");
    // ... (other console logs remain)

}); // End DOMContentLoaded
