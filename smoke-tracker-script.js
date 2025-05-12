// smoke-tracker-script.js

document.addEventListener('DOMContentLoaded', () => {
    // =================================================================================
    // SECTION: CONSTANTS & STATE VARIABLES
    // =================================================================================
    const localStorageKeySuffix = '_v27_theme_shop';

    // --- Element Selectors ---
    // General UI & Header
    const particleCanvas = document.getElementById('particleCanvas');
    const userPointsDisplay = document.getElementById('userPoints');
    const smokeFreeStreakDisplay = document.getElementById('smokeFreeStreak');
    const streakDisplay = document.getElementById('streakDisplay'); // In progress section
    const healthMilestonesDisplay = document.getElementById('healthMilestones');
    const shopUserPointsDisplay = document.getElementById('shopUserPoints'); // In toolbar link
    const toastNotification = document.getElementById('toastNotification');

    // Cigarette Logging Elements
    const logCigaretteButton = document.getElementById('logCigaretteButton');
    const todayCigaretteCountDisplay = document.getElementById('todayCigaretteCount');
    const cigaretteLimitDisplay = document.getElementById('cigaretteLimitDisplay');
    const setLimitInput = document.getElementById('setLimitInput');
    const saveLimitButton = document.getElementById('saveLimitButton');

    // Vape Timer Elements
    const startVapeTimerButton = document.getElementById('startVapeTimerButton');
    const stopVapeTimerButton = document.getElementById('stopVapeTimerButton');
    const vapeTimerDisplay = document.getElementById('vapeTimerDisplay');
    const setVapeSessionLimitInput = document.getElementById('setVapeSessionLimitInput');
    const saveVapeSessionLimitButton = document.getElementById('saveVapeSessionLimitButton');

    // Daily Vape Time Limit Elements
    const todayTotalVapeTimeDisplay = document.getElementById('todayTotalVapeTimeDisplay');
    const dailyVapeTimeLimitDisplay = document.getElementById('dailyVapeTimeLimitDisplay');
    const setDailyVapeTimeLimitInput = document.getElementById('setDailyVapeTimeLimitInput');
    const saveDailyVapeTimeLimitButton = document.getElementById('saveDailyVapeTimeLimitButton');

    // Log List Elements
    const smokeLogList = document.getElementById('smokeLogList');
    const noLogsPlaceholder = document.getElementById('noLogsPlaceholder');

    // Reason Modal Elements
    const reasonModalOverlay = document.getElementById('reasonModalOverlay');
    const reasonInput = document.getElementById('reasonInput');
    const reasonLogTimestampInput = document.getElementById('reasonLogTimestamp');
    const saveReasonButton = document.getElementById('saveReasonButton');
    const cancelReasonButton = document.getElementById('cancelReasonButton');

    // --- State Variables ---
    // General App State
    let userPoints = 0;
    let smokeFreeStreak = 0;
    let healthMilestones = 0;

    // Smoking & Vaping State
    let dailyCigaretteLimit = 5;
    let vapeSessionDurationLimit = 30; // Seconds, 0 means count up only
    let dailyTotalVapeTimeLimit = 300; // Seconds
    let smokeLog = []; // Array of { type, timestamp, duration?, reason? }
    let lastLogDate = ''; // YYYY-MM-DD format
    let todayCigaretteCount = 0;
    let todayTotalVapeTime = 0; // In seconds
    let lastDayStreakIncremented = ''; // YYYY-MM-DD

    // Timer Runtime State (Not saved to localStorage)
    let isVapeTimerRunning = false;
    let vapeTimerStartTime = null;
    let vapeTimerIntervalId = null; // For the 00:00 display update
    let vapeTimerTargetEndTime = null; // For countdown mode
    let vapeTimerMode = 'up'; // 'up' or 'down'

    // Particle System State
    let particleCtx = null;
    let particles = [];
    let isAnimatingParticles = false;
    let vapeParticleIntervalId = null; // For emitting vape particles periodically

    // Theme State (Loaded to apply, but managed by shop.html)
    let ownedThemes = ['default'];
    let currentTheme = 'default';


    // =================================================================================
    // SECTION: THEME DATA OBJECT
    // (Must match themes object in other JS files like script.js or shop-script.js)
    // =================================================================================
    const themes = {
        default: { name: "Default Retro", cost: 0, owned: true, description: "The classic look and feel.", cssVariables: { '--theme-primary-dark': '#264653', '--theme-primary-accent': '#2A9D8F', '--theme-secondary-accent': '#E9C46A', '--theme-tertiary-accent': '#F4A261', '--theme-highlight-accent': '#E76F51', '--theme-light-bg': '#EAEAEA', '--theme-card-bg': '#FFFFFF', '--theme-text-on-dark': '#EAEAEA', '--theme-page-bg': 'rgb(174, 217, 211)' } },
        oceanDepths: { name: "Ocean Depths", cost: 1, description: "Dive into cool blue tranquility.", cssVariables: { '--theme-primary-dark': '#03045E', '--theme-primary-accent': '#0077B6', '--theme-secondary-accent': '#00B4D8', '--theme-tertiary-accent': '#90E0EF', '--theme-highlight-accent': '#CAF0F8', '--theme-light-bg': '#E0FBFC', '--theme-card-bg': '#FFFFFF', '--theme-text-on-dark': '#CAF0F8', '--theme-page-bg': '#ADE8F4' } },
        volcanoRush: { name: "Volcano Rush", cost: 1, description: "Fiery reds and oranges.", cssVariables: { '--theme-primary-dark': '#2B0000', '--theme-primary-accent': '#6A0000', '--theme-secondary-accent': '#FF4500', '--theme-tertiary-accent': '#FF8C00', '--theme-highlight-accent': '#AE2012', '--theme-light-bg': '#FFF2E6', '--theme-card-bg': '#FFFFFF', '--theme-text-on-dark': '#FFDAB9', '--theme-page-bg': '#FFCDB2' } },
        techOrangeBlue: { name: "Tech Orange & Blue", cost: 1, description: "A modern tech-inspired palette.", cssVariables: { '--theme-primary-dark': '#004C97', '--theme-primary-accent': '#4A7DB5', '--theme-secondary-accent': '#FF6600', '--theme-tertiary-accent': '#C0C0C0', '--theme-highlight-accent': '#FF7700', '--theme-light-bg': '#F0F0F0', '--theme-card-bg': '#FFFFFF', '--theme-text-on-dark': '#F0F0F0', '--theme-page-bg': '#E8E8E8' } },
        forestGreens: { name: "Forest Greens", cost: 1, description: "Earthy and calming greens.", cssVariables: { '--theme-primary-dark': '#1A2B12', '--theme-primary-accent': '#335128', '--theme-secondary-accent': '#526F35', '--theme-tertiary-accent': '#8A9A5B', '--theme-highlight-accent': '#E0E7A3', '--theme-light-bg': '#F0F5E0', '--theme-card-bg': '#FFFFFF', '--theme-text-on-dark': '#E0E7A3', '--theme-page-bg': '#D8E0C0' } }
    };


    // =================================================================================
    // SECTION: HELPER FUNCTIONS
    // (Formatting, UI feedback, etc.)
    // =================================================================================
    function formatTime(totalSeconds) {
        if (isNaN(totalSeconds) || totalSeconds < 0) { return "0m 0s"; }
        const m = Math.floor(totalSeconds / 60);
        const s = Math.floor(totalSeconds % 60);
        return `${m}m ${s}s`;
    }
    function formatTimerDisplay(totalSeconds) {
        if (isNaN(totalSeconds) || totalSeconds < 0) { return "00:00"; }
        const m = Math.floor(totalSeconds / 60);
        const s = Math.floor(totalSeconds % 60);
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }
    function parseMMSS(timeString) {
        if (!timeString || typeof timeString !== 'string') { return null; }
        const p = timeString.split(':');
        if (p.length !== 2) { return null; }
        const m = parseInt(p[0], 10);
        const s = parseInt(p[1], 10);
        if (isNaN(m) || isNaN(s) || m < 0 || s < 0 || s >= 60) { return null; }
        return (m * 60) + s;
    }
    function showToast(message, duration = 2500) {
        if (toastNotification) {
            toastNotification.textContent = message;
            toastNotification.classList.add('show');
            setTimeout(() => {
                toastNotification.classList.remove('show');
            }, duration);
        } else {
            console.log("Toast:", message);
        }
    }
    function triggerPointsFlash() {
        const d = document.querySelector('.header-stats-bar .points-display:first-child');
        if (d) { d.classList.add('points-earned-flash'); }
        setTimeout(() => {
            if (d) { d.classList.remove('points-earned-flash'); }
        }, 500);
    }
    function addPoints(amount, reason = "") {
        if (amount > 0) {
            userPoints += amount;
            showToast(`+${amount} PTS! ${reason}`.trim(), amount > 5 ? 3000 : 2500);
            triggerPointsFlash();
            updateHeaderDisplays();
            saveState();
        }
    }
    function getCurrentDateString() {
        const t = new Date();
        const y = t.getFullYear();
        const m = String(t.getMonth() + 1).padStart(2, '0');
        const d = String(t.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }

  // =================================================================================
    // SECTION: PARTICLE SYSTEM
    // =================================================================================
    function initializeParticleCanvas() {
        if (particleCanvas) {
            particleCtx = particleCanvas.getContext('2d');
            particleCanvas.width = window.innerWidth;
            particleCanvas.height = window.innerHeight;
            window.addEventListener('resize', () => {
                if (particleCanvas && particleCtx) {
                    particleCanvas.width = window.innerWidth;
                    particleCanvas.height = window.innerHeight;
                }
            });
        } else {
            console.warn("Particle canvas not found for smoke/vape effects.");
        }
    }

    function createGenericParticle(x, y, options) {
        if (!particleCtx) { return; }
        const defaults = {
            color: '#FFFFFF',
            size: Math.random() * 5 + 2,
            count: 1,
            spread: 3,
            speedX: (Math.random() - 0.5) * options.spread,
            speedY: (Math.random() * -1.5 - 0.5) * (options.speedMultiplier || 1),
            life: 60 + Math.random() * 40,
            gravity: 0.01,
            alphaDecay: 0.98,
            shadowColor: null, // NEW: For vape particles
            shadowBlur: 0     // NEW: For vape particles
        };
        const pOptions = { ...defaults, ...options };

        for (let i = 0; i < pOptions.count; i++) {
            particles.push({
                x: x + (Math.random() - 0.5) * (pOptions.initialSpread || 0),
                y: y + (Math.random() - 0.5) * (pOptions.initialSpread || 0),
                size: pOptions.size,
                color: pOptions.color,
                vx: pOptions.speedX,
                vy: pOptions.speedY,
                life: pOptions.life,
                alpha: 1,
                gravity: pOptions.gravity,
                alphaDecay: pOptions.alphaDecay,
                shadowColor: pOptions.shadowColor, // Store shadow properties
                shadowBlur: pOptions.shadowBlur
            });
        }
        if (particles.length > 0 && !isAnimatingParticles) {
            isAnimatingParticles = true;
            requestAnimationFrame(updateAndDrawParticles);
        }
    }

    function updateAndDrawParticles() {
        if (!particleCtx || !particleCanvas) { isAnimatingParticles = false; return; }
        particleCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
        let stillAnimating = false;
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.x += p.vx; p.y += p.vy; p.vy += p.gravity; p.alpha *= p.alphaDecay; p.life--;
            if (p.life <= 0 || p.alpha <= 0.01) { particles.splice(i, 1); continue; }

            // Apply shadow if specified
            if (p.shadowColor) {
                particleCtx.shadowColor = p.shadowColor;
                particleCtx.shadowBlur = p.shadowBlur;
            }

            particleCtx.fillStyle = p.color;
            particleCtx.globalAlpha = p.alpha;
            particleCtx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);

            // Reset shadow for next particle
            if (p.shadowColor) {
                particleCtx.shadowColor = 'transparent'; // Or null
                particleCtx.shadowBlur = 0;
            }

            stillAnimating = true;
        }
        particleCtx.globalAlpha = 1;
        if (stillAnimating) { requestAnimationFrame(updateAndDrawParticles); } else { isAnimatingParticles = false; }
    }

    function triggerCigarettePuff() {
        // Target the PARENT card of the logCigaretteButton
        const targetCard = logCigaretteButton ? logCigaretteButton.closest('.log-actions-section') : null;
        if (!targetCard || !particleCtx) { return; }

        const cardRect = targetCard.getBoundingClientRect();
        const buttonRect = logCigaretteButton.getBoundingClientRect();

        // Emit from the top edge of the card, centered horizontally with the button
        const emitX = buttonRect.left + buttonRect.width / 2; // Horizontal center of button
        const emitY = cardRect.top; // Top edge of the card

        const greyColors = ['#AAAAAA', '#BBBBBB', '#CCCCCC', '#DDDDDD'];
        const numParticles = 35; // Slightly more for a denser initial puff

        for (let i = 0; i < numParticles; i++) {
            // Emit upwards and slightly outwards from the emit point
            const angleOffset = (Math.random() - 0.5) * (Math.PI / 2); // Spread within a 90-degree upward cone
            const initialAngle = -Math.PI / 2 + angleOffset; // Centered upwards

            const speedMagnitude = 0.8 + Math.random() * 0.7;
            const vx = Math.cos(initialAngle) * speedMagnitude;
            const vy = Math.sin(initialAngle) * speedMagnitude;

            createGenericParticle(emitX, emitY, {
                color: greyColors[Math.floor(Math.random() * greyColors.length)],
                size: Math.random() * 6 + 4, // 4-10px
                speedX: vx,
                speedY: vy,
                gravity: -0.01, // Gentle upward float, then slight fall
                life: 50 + Math.random() * 40, // 50-90 frames
                alphaDecay: 0.95,
                initialSpread: buttonRect.width * 0.6 // Spread along the button's width initially
            });
        }
    }

    function startVapeParticleStream() {
        // Target the PARENT card of the vape timer section
        const targetCard = vapeTimerDisplay ? vapeTimerDisplay.closest('.vape-timer-section') : null;
        if (!targetCard || vapeParticleIntervalId || !particleCtx) { return; }

        const cardRect = targetCard.getBoundingClientRect();
        // Emit from the top edge of the card, spread across its width
        const emitY = cardRect.top;

        vapeParticleIntervalId = setInterval(() => {
            if (!isVapeTimerRunning) { stopVapeParticleStream(); return; }

            // Emit from a random horizontal position along the top edge of the card
            const emitX = cardRect.left + Math.random() * cardRect.width;

            const angleOffset = (Math.random() - 0.5) * (Math.PI / 1.5); // Wider upward cone
            const initialAngle = -Math.PI / 2 + angleOffset;

            const speedMagnitude = 0.3 + Math.random() * 0.4;
            const vx = Math.cos(initialAngle) * speedMagnitude;
            const vy = Math.sin(initialAngle) * speedMagnitude * 1.2; // Slightly more upward emphasis

            createGenericParticle(emitX, emitY, {
                color: '#F0F0F0', // Whiteish vape
                size: Math.random() * 4 + 2, // 2-6px
                count: 1,
                speedX: vx,
                speedY: vy,
                gravity: -0.03, // Stronger upward float
                life: 90 + Math.random() * 60, // Longer life
                alphaDecay: 0.988,
                shadowColor: 'rgba(0, 0, 0, 0.3)', // <<< NEW: Subtle black shadow
                shadowBlur: 3                       // <<< NEW: Blur radius for the shadow
            });
        }, 180); // Emit slightly less frequently
    }

    // stopVapeParticleStream remains the same:
    function stopVapeParticleStream() {
        if (vapeParticleIntervalId) {
            clearInterval(vapeParticleIntervalId);
            vapeParticleIntervalId = null;
        }
    }

    // =================================================================================
    // SECTION: THEME APPLICATION
    // (Applies loaded theme, changes are managed in shop.html)
    // =================================================================================
    function applyThemeOnPage(themeId) {
        const themeToApply = themes[themeId] || themes.default;
        currentTheme = themeId;
        if (themeToApply && themeToApply.cssVariables) {
            const themeVars = themeToApply.cssVariables;
            for (const [key, value] of Object.entries(themeVars)) {
                document.documentElement.style.setProperty(key, value);
            }
            document.documentElement.style.setProperty('--theme-text-main', themeVars['--theme-primary-dark']);
            document.documentElement.style.setProperty('--theme-border-main', themeVars['--theme-primary-dark']);
        } else {
            console.warn(`Theme ID "${themeId}" not found. Applying default.`);
            applyThemeOnPage('default');
            return;
        }
        // saveState(); // Not saving state here, shop page manages theme purchases/changes.
                      // This function just applies what's loaded or selected.
    }


    // =================================================================================
    // SECTION: CORE SMOKE TRACKER LOGIC
    // (Date checks, logging, timer management, limits)
    // =================================================================================
    function checkDateAndResetCounts() {
        const currentDate = getCurrentDateString();
        if (currentDate !== lastLogDate && lastLogDate !== '') {
            console.log(`Date changed from ${lastLogDate} to ${currentDate}. Checking yesterday's limits and resetting counts.`);
            const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayCigsUnder = todayCigaretteCount <= dailyCigaretteLimit;
            const yesterdayVapeUnder = todayTotalVapeTime <= dailyTotalVapeTimeLimit;
            const yesterdayWasUnderLimit = yesterdayCigsUnder && yesterdayVapeUnder;
            if (yesterdayWasUnderLimit) {
                smokeFreeStreak++; lastDayStreakIncremented = currentDate;
                showToast(`Streak Extended! ${smokeFreeStreak} Days!`); addPoints(5, `Streak: ${smokeFreeStreak} Days`);
                if ([1, 3, 7, 14, 30, 60, 90].includes(smokeFreeStreak)) {
                    healthMilestones++; addPoints(Math.max(10, smokeFreeStreak * 2), `Milestone: ${smokeFreeStreak}-Day Streak!`);
                    showToast(`MILESTONE! ${smokeFreeStreak}-Day Streak Achieved!`);
                }
            } else { smokeFreeStreak = 0; lastDayStreakIncremented = ''; showToast("Streak Reset. Keep trying!", 3000); }
            todayCigaretteCount = 0; todayTotalVapeTime = 0; lastLogDate = currentDate; saveState();
        } else if (lastLogDate === '') { lastLogDate = currentDate; saveState(); }
    }

    function logCigaretteEvent() {
        checkDateAndResetCounts();
        todayCigaretteCount++;
        const logEntry = { type: 'cigarette', timestamp: Date.now(), reason: '' };
        smokeLog.unshift(logEntry);
        if (smokeLog.length > 100) { smokeLog.pop(); }
        triggerCigarettePuff(); // Call particle effect
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
        startVapeTimerButton.disabled = true;
        stopVapeTimerButton.disabled = false;
        stopVapeTimerButton.style.display = 'inline-block';
        vapeTimerDisplay.classList.remove('warning', 'counting-down');

        if (vapeSessionDurationLimit > 0) {
            vapeTimerMode = 'down';
            vapeTimerTargetEndTime = vapeTimerStartTime + vapeSessionDurationLimit * 1000;
            vapeTimerDisplay.textContent = formatTimerDisplay(vapeSessionDurationLimit);
            vapeTimerDisplay.classList.add('counting-down');
            showToast(`Vape timer started (Counting down from ${formatTimerDisplay(vapeSessionDurationLimit)})!`);
        } else {
            vapeTimerMode = 'up';
            vapeTimerTargetEndTime = null;
            vapeTimerDisplay.textContent = formatTimerDisplay(0);
            showToast("Vape timer started (Counting up)!");
        }
        startVapeParticleStream(); // Start vape particles

        vapeTimerIntervalId = setInterval(() => {
            if (vapeTimerMode === 'down') {
                const remainingMillis = vapeTimerTargetEndTime - Date.now();
                if (remainingMillis <= 0) {
                    vapeTimerDisplay.textContent = "00:00";
                    showToast("Vape session limit reached!", 3000);
                    vapeTimerDisplay.classList.add('warning');
                    stopVapeTimer(true); // Auto-stop
                } else {
                    const remainingSeconds = Math.ceil(remainingMillis / 1000);
                    vapeTimerDisplay.textContent = formatTimerDisplay(remainingSeconds);
                }
            } else { // Count 'up' mode
                const elapsedMillis = Date.now() - vapeTimerStartTime;
                const elapsedSeconds = Math.floor(elapsedMillis / 1000);
                vapeTimerDisplay.textContent = formatTimerDisplay(elapsedSeconds);
            }
        }, 1000);
    }

    function stopVapeTimer(autoStopped = false) {
        if (!isVapeTimerRunning) { return; }
        clearInterval(vapeTimerIntervalId); // Clears the 00:00 display timer
        isVapeTimerRunning = false;
        const endTime = Date.now();
        let durationSeconds;
        if (vapeTimerMode === 'down') {
            if (autoStopped) { durationSeconds = vapeSessionDurationLimit; }
             else {
                durationSeconds = Math.max(1, Math.round((endTime - vapeTimerStartTime) / 1000));
                durationSeconds = Math.min(durationSeconds, vapeSessionDurationLimit);
            }
        } else { durationSeconds = Math.max(1, Math.round((endTime - vapeTimerStartTime) / 1000)); }
        todayTotalVapeTime += durationSeconds;
        const logEntry = { type: 'vape', timestamp: endTime, duration: durationSeconds, reason: '' };
        smokeLog.unshift(logEntry);
        if (smokeLog.length > 100) { smokeLog.pop(); }
        vapeTimerStartTime = null; vapeTimerTargetEndTime = null; vapeTimerMode = 'up';
        startVapeTimerButton.disabled = false;
        stopVapeTimerButton.disabled = true; stopVapeTimerButton.style.display = 'none';
        vapeTimerDisplay.textContent = formatTimerDisplay(0);
        vapeTimerDisplay.classList.remove('warning', 'counting-down');
        stopVapeParticleStream(); // Stop vape particles
        if (!autoStopped) { showToast(`Vape session logged: ${formatTime(durationSeconds)}`); }
        checkAndWarnLimits();
        updateStatusDisplay();
        renderSmokeLog();
        saveState();
    }

    function checkAndWarnLimits() {
        const cigOver = todayCigaretteCount > dailyCigaretteLimit;
        const vapeOver = todayTotalVapeTime > dailyTotalVapeTimeLimit;
        if (cigOver) { showToast(`Warning: Cigarette limit (${dailyCigaretteLimit}) exceeded!`, 3000); }
        if (vapeOver) { showToast(`Warning: Daily vape time limit (${formatTime(dailyTotalVapeTimeLimit)}) exceeded!`, 3000); }
    }


    // =================================================================================
    // SECTION: UI UPDATE FUNCTIONS
    // (Updating displays, rendering lists)
    // =================================================================================
    function updateHeaderDisplays() {
        if (userPointsDisplay) { userPointsDisplay.textContent = userPoints; }
        if (smokeFreeStreakDisplay) { smokeFreeStreakDisplay.textContent = smokeFreeStreak; }
        if (streakDisplay) { streakDisplay.textContent = `${smokeFreeStreak} Days`; }
        if (healthMilestonesDisplay) { healthMilestonesDisplay.textContent = healthMilestones; }
        if (shopUserPointsDisplay) { shopUserPointsDisplay.textContent = userPoints; }
    }

    function updateStatusDisplay() {
        if (todayCigaretteCountDisplay) { todayCigaretteCountDisplay.textContent = todayCigaretteCount; }
        if (cigaretteLimitDisplay) { cigaretteLimitDisplay.textContent = dailyCigaretteLimit; }
        if (todayCigaretteCountDisplay && todayCigaretteCountDisplay.parentElement) { todayCigaretteCountDisplay.parentElement.classList.toggle('over-limit', todayCigaretteCount > dailyCigaretteLimit); }
        if (todayTotalVapeTimeDisplay) { todayTotalVapeTimeDisplay.textContent = formatTime(todayTotalVapeTime); }
        if (dailyVapeTimeLimitDisplay) { dailyVapeTimeLimitDisplay.textContent = formatTime(dailyTotalVapeTimeLimit); }
        if (todayTotalVapeTimeDisplay && todayTotalVapeTimeDisplay.parentElement) { todayTotalVapeTimeDisplay.parentElement.classList.toggle('over-limit', todayTotalVapeTime > dailyTotalVapeTimeLimit); }
        if (startVapeTimerButton) { startVapeTimerButton.disabled = isVapeTimerRunning; }
        if (stopVapeTimerButton) { stopVapeTimerButton.disabled = !isVapeTimerRunning; stopVapeTimerButton.style.display = isVapeTimerRunning ? 'inline-block' : 'none'; }
        if (vapeTimerDisplay && !isVapeTimerRunning) { vapeTimerDisplay.textContent = formatTimerDisplay(0); vapeTimerDisplay.classList.remove('warning', 'counting-down'); }
    }

    function renderSmokeLog() {
        if (!smokeLogList) { return; }
        smokeLogList.innerHTML = '';
        const logsToRender = smokeLog.slice(0, 30);
        if (logsToRender.length === 0) {
            if (noLogsPlaceholder) { noLogsPlaceholder.style.display = 'block'; } return;
        } else {
            if (noLogsPlaceholder) { noLogsPlaceholder.style.display = 'none'; }
        }
        logsToRender.forEach(log => {
            const listItem = document.createElement('li'); listItem.className = 'moment-card'; listItem.style.cssText = 'opacity:1; animation:none; padding:8px; margin-bottom:8px;';
            const logTime = new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const logDate = new Date(log.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric'});
            let iconClass = '', iconColor = '', text = '', details = '';
            let reasonIconBaseClass = 'add-reason-icon'; let reasonIconExtraClass = log.reason ? 'fas fa-comment-dots has-reason' : 'far fa-comment-dots';
            if (log.type === 'cigarette') { iconClass = 'fas fa-smoking'; iconColor = 'var(--theme-highlight-accent)'; text = 'Cigarette'; }
            else if (log.type === 'vape') { iconClass = 'fas fa-vial'; iconColor = 'var(--theme-primary-accent)'; text = 'Vape Session'; details = log.duration ? `(${formatTime(log.duration)})` : ''; }
            listItem.innerHTML = `<div class="log-item-content"><div class="log-item-details"><i class="${iconClass}" style="color: ${iconColor}; margin-right: 8px; font-size: 18px;"></i><span>${text} ${details}</span></div><div class="log-item-reason-icon-container"><span class="log-item-time">${logDate} @ ${logTime}</span><i class="${reasonIconBaseClass} ${reasonIconExtraClass}"></i></div></div>`;
            const reasonIconElement = listItem.querySelector('.add-reason-icon');
            if (reasonIconElement) { const reasonTitle = log.reason ? 'Edit Reason' : 'Add Reason'; reasonIconElement.setAttribute('title', reasonTitle); reasonIconElement.setAttribute('data-timestamp', log.timestamp); }
            smokeLogList.appendChild(listItem);
        });
    }


    // =================================================================================
    // SECTION: REASON MODAL LOGIC
    // =================================================================================
    function handleOpenReasonModal(timestamp) {
        const logEntry = smokeLog.find(log => log.timestamp === timestamp);
        if (!logEntry || !reasonModalOverlay) { return; }
        reasonInput.value = logEntry.reason || '';
        reasonLogTimestampInput.value = timestamp;
        reasonModalOverlay.classList.add('show');
        reasonInput.focus();
    }
    function handleCloseReasonModal() {
        if (reasonModalOverlay) { reasonModalOverlay.classList.remove('show'); }
        reasonInput.value = '';
        reasonLogTimestampInput.value = '';
    }
    function handleSaveReason() {
        const timestamp = parseInt(reasonLogTimestampInput.value);
        const newReason = reasonInput.value.trim();
        if (isNaN(timestamp)) { return; }
        const logEntry = smokeLog.find(log => log.timestamp === timestamp);
        if (logEntry) {
            logEntry.reason = newReason;
            saveState();
            renderSmokeLog();
            showToast(newReason ? "Reason Saved!" : "Reason Cleared.");
        }
        handleCloseReasonModal();
    }


    // =================================================================================
    // SECTION: EVENT LISTENERS
    // (Attaching functionality to UI elements)
    // =================================================================================
    // Log Buttons
    if (logCigaretteButton) { logCigaretteButton.addEventListener('click', logCigaretteEvent); }
    if (startVapeTimerButton) { startVapeTimerButton.addEventListener('click', startVapeTimer); }
    if (stopVapeTimerButton) { stopVapeTimerButton.addEventListener('click', () => { stopVapeTimer(false); }); }

    // Limit Buttons
    if (saveLimitButton && setLimitInput) {
        saveLimitButton.addEventListener('click', () => {
            const newLimit = parseInt(setLimitInput.value);
            if (!isNaN(newLimit) && newLimit >= 0) {
                dailyCigaretteLimit = newLimit; updateStatusDisplay(); checkAndWarnLimits(); saveState(); showToast(`Cigarette limit set to ${dailyCigaretteLimit}.`);
            } else { showToast("Invalid limit value."); setLimitInput.value = dailyCigaretteLimit; }
        });
    }
    if (saveVapeSessionLimitButton && setVapeSessionLimitInput) {
        saveVapeSessionLimitButton.addEventListener('click', () => {
            const parsedSeconds = parseMMSS(setVapeSessionLimitInput.value);
            if (parsedSeconds !== null && parsedSeconds >= 0) {
                vapeSessionDurationLimit = parsedSeconds; saveState(); showToast(`Vape session limit set to ${formatTimerDisplay(vapeSessionDurationLimit)} ${parsedSeconds === 0 ? '(Count Up)' : ''}.`); setVapeSessionLimitInput.value = formatTimerDisplay(vapeSessionDurationLimit);
            } else { showToast("Invalid session limit format (MM:SS)."); setVapeSessionLimitInput.value = formatTimerDisplay(vapeSessionDurationLimit); }
        });
    }
    if (saveDailyVapeTimeLimitButton && setDailyVapeTimeLimitInput) {
        saveDailyVapeTimeLimitButton.addEventListener('click', () => {
            const newLimitMinutes = parseInt(setDailyVapeTimeLimitInput.value);
            if (!isNaN(newLimitMinutes) && newLimitMinutes >= 0) {
                dailyTotalVapeTimeLimit = newLimitMinutes * 60; updateStatusDisplay(); checkAndWarnLimits(); saveState(); showToast(`Daily vape time limit set to ${newLimitMinutes} minutes.`);
            } else { showToast("Invalid limit value (minutes)."); setDailyVapeTimeLimitInput.value = Math.floor(dailyTotalVapeTimeLimit / 60); }
        });
    }

    // Reason Modal Listeners
    if (smokeLogList) {
        smokeLogList.addEventListener('click', (event) => {
            if (event.target.classList.contains('add-reason-icon')) {
                const timestamp = parseInt(event.target.dataset.timestamp);
                if (!isNaN(timestamp)) {
                    handleOpenReasonModal(timestamp);
                }
            }
        });
    }
    if (saveReasonButton) { saveReasonButton.addEventListener('click', handleSaveReason); }
    if (cancelReasonButton) { cancelReasonButton.addEventListener('click', handleCloseReasonModal); }
    if (reasonModalOverlay) {
        reasonModalOverlay.addEventListener('click', (event) => {
            if (event.target === reasonModalOverlay) { handleCloseReasonModal(); }
        });
    }

    // No toolbar interaction listeners in this script, as the toolbar is just a link.


    // =================================================================================
    // SECTION: INITIAL SETUP
    // (Run on page load)
    // =================================================================================
    loadState();
    initializeParticleCanvas();
    applyThemeOnPage(currentTheme); // Apply the loaded theme
    checkDateAndResetCounts();      // Check date after loading state
    updateHeaderDisplays();         // Update UI with loaded/calculated values
    updateStatusDisplay();          // Update UI with loaded/calculated values
    renderSmokeLog();               // Render log with loaded data

    console.log("Smoke Tracker Initialized (v7 - Border Particle Emission).");
    console.log("Initial Theme:", currentTheme);

}); // End DOMContentLoaded
