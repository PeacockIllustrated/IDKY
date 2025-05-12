// smoke-tracker-script.js

document.addEventListener('DOMContentLoaded', () => {
    // =================================================================================
    // SECTION: CONSTANTS & STATE VARIABLES
    // =================================================================================
    const localStorageKeySuffix = '_v27_theme_shop';

    // --- Element Selectors ---
    const particleCanvas = document.getElementById('particleCanvas');
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

    // --- State Variables ---
    let userPoints = 0, smokeFreeStreak = 0, healthMilestones = 0;
    let dailyCigaretteLimit = 5, vapeSessionDurationLimit = 30, dailyTotalVapeTimeLimit = 300;
    let smokeLog = [], lastLogDate = '', todayCigaretteCount = 0, todayTotalVapeTime = 0, lastDayStreakIncremented = '';
    let isVapeTimerRunning = false, vapeTimerStartTime = null, vapeTimerIntervalId = null;
    let vapeTimerTargetEndTime = null, vapeTimerMode = 'up';
    let ownedThemes = ['default'], currentTheme = 'default';
    let particleCtx = null, particles = [], isAnimatingParticles = false, vapeParticleIntervalId = null;

    // --- NEW: Cigarette Button Confirmation State ---
    let cigaretteLogConfirmationStep = 0; // 0: Initial, 1: "Are you sure?", 2: "SURE sure?"

    // =================================================================================
    // SECTION: THEME DATA OBJECT
    // =================================================================================
    const themes = { /* ... Full themes object definition from previous ... */
        default: { name: "Default Retro", cost: 0, owned: true, cssVariables: { '--theme-primary-dark': '#264653', '--theme-primary-accent': '#2A9D8F', '--theme-secondary-accent': '#E9C46A', '--theme-tertiary-accent': '#F4A261', '--theme-highlight-accent': '#E76F51', '--theme-light-bg': '#EAEAEA', '--theme-card-bg': '#FFFFFF', '--theme-text-on-dark': '#EAEAEA', '--theme-page-bg': 'rgb(174, 217, 211)' } },
        oceanDepths: { name: "Ocean Depths", cost: 1, cssVariables: { '--theme-primary-dark': '#03045E', '--theme-primary-accent': '#0077B6', '--theme-secondary-accent': '#00B4D8', '--theme-tertiary-accent': '#90E0EF', '--theme-highlight-accent': '#CAF0F8', '--theme-light-bg': '#E0FBFC', '--theme-card-bg': '#FFFFFF', '--theme-text-on-dark': '#CAF0F8', '--theme-page-bg': '#ADE8F4' } },
        volcanoRush: { name: "Volcano Rush", cost: 1, cssVariables: { '--theme-primary-dark': '#2B0000', '--theme-primary-accent': '#6A0000', '--theme-secondary-accent': '#FF4500', '--theme-tertiary-accent': '#FF8C00', '--theme-highlight-accent': '#AE2012', '--theme-light-bg': '#FFF2E6', '--theme-card-bg': '#FFFFFF', '--theme-text-on-dark': '#FFDAB9', '--theme-page-bg': '#FFCDB2' } },
        techOrangeBlue: { name: "Tech Orange & Blue", cost: 1, cssVariables: { '--theme-primary-dark': '#004C97', '--theme-primary-accent': '#4A7DB5', '--theme-secondary-accent': '#FF6600', '--theme-tertiary-accent': '#C0C0C0', '--theme-highlight-accent': '#FF7700', '--theme-light-bg': '#F0F0F0', '--theme-card-bg': '#FFFFFF', '--theme-text-on-dark': '#F0F0F0', '--theme-page-bg': '#E8E8E8' } },
        forestGreens: { name: "Forest Greens", cost: 1, cssVariables: { '--theme-primary-dark': '#1A2B12', '--theme-primary-accent': '#335128', '--theme-secondary-accent': '#526F35', '--theme-tertiary-accent': '#8A9A5B', '--theme-highlight-accent': '#E0E7A3', '--theme-light-bg': '#F0F5E0', '--theme-card-bg': '#FFFFFF', '--theme-text-on-dark': '#E0E7A3', '--theme-page-bg': '#D8E0C0' } }
    };

    // =================================================================================
    // SECTION: HELPER FUNCTIONS
    // =================================================================================
    function formatTime(totalSeconds) { /* ... */ }
    function formatTimerDisplay(totalSeconds) { /* ... */ }
    function parseMMSS(timeString) { /* ... */ }
    function showToast(message, duration = 2500) { /* ... */ }
    function triggerPointsFlash() { /* ... */ }
    function addPoints(amount, reason = "") { /* ... */ }
    function getCurrentDateString() { /* ... */ }

    // =================================================================================
    // SECTION: PARTICLE SYSTEM
    // =================================================================================
    function initializeParticleCanvas() { /* ... */ }
    function createGenericParticle(x, y, options) { /* ... */ }
    function updateAndDrawParticles() { /* ... */ }
    function triggerCigarettePuff() { /* ... */ }
    function startVapeParticleStream() { /* ... */ }
    function stopVapeParticleStream() { /* ... */ }

    // =================================================================================
    // SECTION: LOCAL STORAGE & STATE MANAGEMENT
    // =================================================================================
    function loadState() { /* ... (Ensure all state is loaded as before) ... */ }
    function saveState() { /* ... (Ensure all state is saved as before) ... */ }

    // =================================================================================
    // SECTION: THEME APPLICATION
    // =================================================================================
    function applyThemeOnPage(themeId) { /* ... (Same as before, applies loaded theme) ... */ }

    // =================================================================================
    // SECTION: CORE SMOKE TRACKER LOGIC
    // =================================================================================
    function checkDateAndResetCounts() { /* ... (Same as before) ... */ }

    // --- MODIFIED: Cigarette Logging Logic ---
    function handleLogCigaretteClick() {
        if (!logCigaretteButton) return;

        checkDateAndResetCounts(); // Ensure date is current

        if (cigaretteLogConfirmationStep === 0) {
            // First click: Ask "Are you sure?"
            logCigaretteButton.innerHTML = '<i class="fas fa-question-circle"></i> ARE YOU SURE?';
            cigaretteLogConfirmationStep = 1;
        } else if (cigaretteLogConfirmationStep === 1) {
            // Second click: Check if going over limit
            const willGoOverLimit = (todayCigaretteCount + 1) > dailyCigaretteLimit;

            if (willGoOverLimit && dailyCigaretteLimit > 0) { // Only ask "SURE sure?" if a limit is set and will be exceeded
                logCigaretteButton.innerHTML = '<i class="fas fa-exclamation-triangle"></i> SURE SURE? (Over Limit!)';
                logCigaretteButton.style.backgroundColor = 'var(--theme-highlight-accent)'; // Warning color
                cigaretteLogConfirmationStep = 2;
            } else {
                // Log directly if not going over limit or no limit set
                actuallyLogCigarette();
            }
        } else if (cigaretteLogConfirmationStep === 2) {
            // Third click (after "SURE sure?"): Log it
            actuallyLogCigarette();
        }
    }

    function actuallyLogCigarette() {
        if (!logCigaretteButton) return;

        todayCigaretteCount++;
        const logEntry = { type: 'cigarette', timestamp: Date.now(), reason: '' };
        smokeLog.unshift(logEntry);
        if (smokeLog.length > 100) { smokeLog.pop(); }

        triggerCigarettePuff();
        showToast("Cigarette logged.");
        checkAndWarnLimits(); // This will show the "over limit" warning toast if applicable
        updateStatusDisplay();
        renderSmokeLog();
        saveState();
        resetCigaretteButton(); // Reset button state
    }

    function resetCigaretteButton() {
        if (!logCigaretteButton) return;
        cigaretteLogConfirmationStep = 0;
        logCigaretteButton.innerHTML = '<i class="fas fa-smoking"></i> LOG CIGARETTE';
        logCigaretteButton.style.backgroundColor = ''; // Reset to default CSS color
    }


    // --- Vape Timer Logic (Unchanged from previous full script) ---
    function startVapeTimer() { /* ... */ }
    function stopVapeTimer(autoStopped = false) { /* ... */ }
    function checkAndWarnLimits() { /* ... */ }

    // =================================================================================
    // SECTION: UI UPDATE FUNCTIONS
    // =================================================================================
    function updateHeaderDisplays() { /* ... (Same as before) ... */ }
    function updateStatusDisplay() { /* ... (Same as before) ... */
        // Add a line to ensure cigarette button resets if counts change externally (e.g. date reset)
        if (cigaretteLogConfirmationStep !== 0 && logCigaretteButton) {
            // If counts changed and we were in a confirmation step, reset the button
            // This is a soft reset; a more robust way might be needed if other actions affect todayCigaretteCount
            // without going through the button click sequence. For now, this handles date changes.
            const currentDate = getCurrentDateString();
            if(lastLogDate !== currentDate) { // If date changed, reset button
                 resetCigaretteButton();
            }
        }
    }
    function renderSmokeLog() { /* ... (Same as before, with setAttribute for safety) ... */ }

    // =================================================================================
    // SECTION: REASON MODAL LOGIC
    // =================================================================================
    function handleOpenReasonModal(timestamp) { /* ... (Same as before) ... */ }
    function handleCloseReasonModal() { /* ... (Same as before) ... */ }
    function handleSaveReason() { /* ... (Same as before) ... */ }

    // =================================================================================
    // SECTION: EVENT LISTENERS
    // =================================================================================
    if (logCigaretteButton) {
        logCigaretteButton.addEventListener('click', handleLogCigaretteClick); // MODIFIED
    }
    // ... (Rest of the event listeners for vape, limits, modal are the same as previous full script)
    if (startVapeTimerButton) { startVapeTimerButton.addEventListener('click', startVapeTimer); }
    if (stopVapeTimerButton) { stopVapeTimerButton.addEventListener('click', () => { stopVapeTimer(false); }); }
    if (saveLimitButton && setLimitInput) { /* ... */ }
    if (saveVapeSessionLimitButton && setVapeSessionLimitInput) { /* ... */ }
    if (saveDailyVapeTimeLimitButton && setDailyVapeTimeLimitInput) { /* ... */ }
    if (smokeLogList) { /* ... */ }
    if (saveReasonButton) { /* ... */ }
    if (cancelReasonButton) { /* ... */ }
    if (reasonModalOverlay) { /* ... */ }

    // --- Add a global click listener to reset cigarette button if user clicks elsewhere ---
    document.addEventListener('click', (event) => {
        if (logCigaretteButton && !logCigaretteButton.contains(event.target) && cigaretteLogConfirmationStep !== 0) {
            // If the click was outside the logCigaretteButton and we're in a confirmation step
            resetCigaretteButton();
        }
    });


    // =================================================================================
    // SECTION: INITIAL SETUP
    // =================================================================================
    loadState();
    initializeParticleCanvas();
    applyThemeOnPage(currentTheme);
    checkDateAndResetCounts(); // This will also call updateStatusDisplay, which might reset button
    updateHeaderDisplays();
    updateStatusDisplay(); // Call again to ensure button is in correct initial state if not reset by date change
    renderSmokeLog();
    resetCigaretteButton(); // Ensure button is in its initial state on page load

    console.log("Smoke Tracker Initialized (v8 - Multi-Stage Cigarette Log).");
    console.log("Initial Theme:", currentTheme);

}); // End DOMContentLoaded


// --- PASTE PREVIOUSLY WORKING FULL FUNCTIONS BELOW THIS LINE ---
// Make sure to copy the full, expanded versions of these functions
// from the "v7.1 - Full Commented Particle Version" or similar.

// Helper Functions (Copied for completeness - ensure these are correct from previous)
function formatTime(totalSeconds) { if (isNaN(totalSeconds) || totalSeconds < 0) return "0m 0s"; const m = Math.floor(totalSeconds / 60); const s = Math.floor(totalSeconds % 60); return `${m}m ${s}s`; }
function formatTimerDisplay(totalSeconds) { if (isNaN(totalSeconds) || totalSeconds < 0) return "00:00"; const m = Math.floor(totalSeconds / 60); const s = Math.floor(totalSeconds % 60); return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`; }
function parseMMSS(timeString) { if (!timeString || typeof timeString !== 'string') return null; const p = timeString.split(':'); if (p.length !== 2) return null; const m = parseInt(p[0], 10); const s = parseInt(p[1], 10); if (isNaN(m) || isNaN(s) || m < 0 || s < 0 || s >= 60) return null; return (m * 60) + s; }
function showToast(message, duration = 2500) { if (document.getElementById('toastNotification')) { const t=document.getElementById('toastNotification');t.textContent = message; t.classList.add('show'); setTimeout(() => { t.classList.remove('show'); }, duration); } else { console.log("Toast:", message); } }
function triggerPointsFlash() { const d = document.querySelector('.header-stats-bar .points-display:first-child'); if(d) d.classList.add('points-earned-flash'); setTimeout(() => { if(d) d.classList.remove('points-earned-flash'); }, 500); }
function addPoints(amount, reason = "") { const s = document.getElementById('userPoints'); if (amount > 0 && s) { userPoints += amount; showToast(`+${amount} PTS! ${reason}`.trim(), amount > 5 ? 3000 : 2500); triggerPointsFlash(); updateHeaderDisplays(); saveState(); } } // Modified addPoints to get userPoints from global scope
function getCurrentDateString() { const t = new Date(); const y = t.getFullYear(); const m = String(t.getMonth() + 1).padStart(2, '0'); const d = String(t.getDate()).padStart(2, '0'); return `${y}-${m}-${d}`; }

// Particle System
function initializeParticleCanvas() { const pc = document.getElementById('particleCanvas'); if (pc) { particleCtx = pc.getContext('2d'); pc.width = window.innerWidth; pc.height = window.innerHeight; window.addEventListener('resize', () => { if (pc && particleCtx) { pc.width = window.innerWidth; pc.height = window.innerHeight; } }); } else { console.warn("Particle canvas not found."); } }
function createGenericParticle(x, y, options) { if (!particleCtx) { return; } const defaults = { color: '#FFFFFF', size: Math.random() * 5 + 2, count: 1, spread: 3, speedX: (Math.random() - 0.5) * options.spread, speedY: (Math.random() * -1.5 - 0.5) * (options.speedMultiplier || 1), life: 60 + Math.random() * 40, gravity: 0.01, alphaDecay: 0.98 }; const pOptions = { ...defaults, ...options }; for (let i = 0; i < pOptions.count; i++) { particles.push({ x: x + (Math.random() - 0.5) * (pOptions.initialSpread || 0), y: y + (Math.random() - 0.5) * (pOptions.initialSpread || 0), size: pOptions.size, color: pOptions.color, vx: pOptions.speedX, vy: pOptions.speedY, life: pOptions.life, alpha: 1, gravity: pOptions.gravity, alphaDecay: pOptions.alphaDecay }); } if (particles.length > 0 && !isAnimatingParticles) { isAnimatingParticles = true; requestAnimationFrame(updateAndDrawParticles); } }
function updateAndDrawParticles() { const pc = document.getElementById('particleCanvas'); if (!particleCtx || !pc) { isAnimatingParticles = false; return; } particleCtx.clearRect(0, 0, pc.width, pc.height); let stillAnimating = false; for (let i = particles.length - 1; i >= 0; i--) { const p = particles[i]; p.x += p.vx; p.y += p.vy; p.vy += p.gravity; p.alpha *= p.alphaDecay; p.life--; if (p.life <= 0 || p.alpha <= 0.01) { particles.splice(i, 1); continue; } particleCtx.fillStyle = p.color; particleCtx.globalAlpha = p.alpha; particleCtx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size); stillAnimating = true; } particleCtx.globalAlpha = 1; if (stillAnimating) { requestAnimationFrame(updateAndDrawParticles); } else { isAnimatingParticles = false; } }
function triggerCigarettePuff() { const btn = document.getElementById('logCigaretteButton'); if (!btn || !particleCtx) { return; } const rect = btn.getBoundingClientRect(); const centerX = rect.left + rect.width / 2; const centerY = rect.top + rect.height / 2; const greyColors = ['#AAAAAA', '#BBBBBB', '#CCCCCC', '#DDDDDD']; const numParticles = 30; for (let i = 0; i < numParticles; i++) { const angle = Math.random() * Math.PI * 2; const radiusX = rect.width / 2; const radiusY = rect.height / 2; const emitX = centerX + Math.cos(angle) * radiusX; const emitY = centerY + Math.sin(angle) * radiusY; const speedMagnitude = 0.5 + Math.random() * 1; const vx = Math.cos(angle) * speedMagnitude * (0.5 + Math.random() * 0.5); const vy = Math.sin(angle) * speedMagnitude * (0.5 + Math.random() * 0.5) - (0.2 + Math.random() * 0.3); createGenericParticle(emitX, emitY, { color: greyColors[Math.floor(Math.random() * greyColors.length)], size: Math.random() * 5 + 3, speedX: vx, speedY: vy, gravity: -0.015, life: 40 + Math.random() * 30, alphaDecay: 0.96, initialSpread: 2 }); } }
function startVapeParticleStream() { const btn = document.getElementById('startVapeTimerButton'); if (!btn || vapeParticleIntervalId || !particleCtx) { return; } const rect = btn.getBoundingClientRect(); const centerX = rect.left + rect.width / 2; const centerY = rect.top + rect.height / 2; vapeParticleIntervalId = setInterval(() => { if (!isVapeTimerRunning) { stopVapeParticleStream(); return; } const angle = Math.random() * Math.PI * 2; const radiusX = rect.width / 2; const radiusY = rect.height / 2; const emitX = centerX + Math.cos(angle) * radiusX; const emitY = centerY + Math.sin(angle) * radiusY; const speedMagnitude = 0.2 + Math.random() * 0.3; const vx = Math.cos(angle) * speedMagnitude; const vy = Math.sin(angle) * speedMagnitude - (0.1 + Math.random() * 0.2); createGenericParticle(emitX, emitY, { color: '#F0F0F0', size: Math.random() * 3 + 2, count: 1, speedX: vx, speedY: vy, gravity: -0.025, life: 70 + Math.random() * 40, alphaDecay: 0.99, initialSpread: 1 }); }, 200); }
function stopVapeParticleStream() { if (vapeParticleIntervalId) { clearInterval(vapeParticleIntervalId); vapeParticleIntervalId = null; } }

// Load & Save State
function loadState() { userPoints = parseInt(localStorage.getItem('idk_user_points_val' + localStorageKeySuffix)) || 0; smokeFreeStreak = parseInt(localStorage.getItem('smoketrack_streak' + localStorageKeySuffix)) || 0; healthMilestones = parseInt(localStorage.getItem('smoketrack_milestones' + localStorageKeySuffix)) || 0; dailyCigaretteLimit = parseInt(localStorage.getItem('smoketrack_cig_limit' + localStorageKeySuffix)) || 5; vapeSessionDurationLimit = parseInt(localStorage.getItem('smoketrack_vape_session_limit' + localStorageKeySuffix)) || 30; dailyTotalVapeTimeLimit = parseInt(localStorage.getItem('smoketrack_vape_daily_limit' + localStorageKeySuffix)) || 300; smokeLog = JSON.parse(localStorage.getItem('smoketrack_log_v2' + localStorageKeySuffix)) || []; lastLogDate = localStorage.getItem('smoketrack_last_log_date' + localStorageKeySuffix) || ''; todayCigaretteCount = parseInt(localStorage.getItem('smoketrack_today_cig' + localStorageKeySuffix)) || 0; todayTotalVapeTime = parseInt(localStorage.getItem('smoketrack_today_vape_time' + localStorageKeySuffix)) || 0; lastDayStreakIncremented = localStorage.getItem('smoketrack_last_streak_date' + localStorageKeySuffix) || ''; ownedThemes = JSON.parse(localStorage.getItem('idk_owned_themes' + localStorageKeySuffix)) || ['default']; currentTheme = localStorage.getItem('idk_current_theme' + localStorageKeySuffix) || 'default'; const sil = document.getElementById('setLimitInput'); if (sil) { sil.value = dailyCigaretteLimit; } const sdvtl = document.getElementById('setDailyVapeTimeLimitInput'); if (sdvtl) { sdvtl.value = Math.floor(dailyTotalVapeTimeLimit / 60); } const svsl = document.getElementById('setVapeSessionLimitInput'); if (svsl) { svsl.value = formatTimerDisplay(vapeSessionDurationLimit); } }
function saveState() { localStorage.setItem('idk_user_points_val' + localStorageKeySuffix, userPoints.toString()); localStorage.setItem('smoketrack_streak' + localStorageKeySuffix, smokeFreeStreak.toString()); localStorage.setItem('smoketrack_milestones' + localStorageKeySuffix, healthMilestones.toString()); localStorage.setItem('smoketrack_cig_limit' + localStorageKeySuffix, dailyCigaretteLimit.toString()); localStorage.setItem('smoketrack_vape_session_limit' + localStorageKeySuffix, vapeSessionDurationLimit.toString()); localStorage.setItem('smoketrack_vape_daily_limit' + localStorageKeySuffix, dailyTotalVapeTimeLimit.toString()); localStorage.setItem('smoketrack_log_v2' + localStorageKeySuffix, JSON.stringify(smokeLog)); localStorage.setItem('smoketrack_last_log_date' + localStorageKeySuffix, lastLogDate); localStorage.setItem('smoketrack_today_cig' + localStorageKeySuffix, todayCigaretteCount.toString()); localStorage.setItem('smoketrack_today_vape_time' + localStorageKeySuffix, todayTotalVapeTime.toString()); localStorage.setItem('smoketrack_last_streak_date' + localStorageKeySuffix, lastDayStreakIncremented); localStorage.setItem('idk_owned_themes' + localStorageKeySuffix, JSON.stringify(ownedThemes)); localStorage.setItem('idk_current_theme' + localStorageKeySuffix, currentTheme); }

// Theme Application
function applyThemeOnPage(themeId) { const themeToApply = themes[themeId] || themes.default; currentTheme = themeId; if (themeToApply && themeToApply.cssVariables) { const themeVars = themeToApply.cssVariables; for (const [key, value] of Object.entries(themeVars)) { document.documentElement.style.setProperty(key, value); } document.documentElement.style.setProperty('--theme-text-main', themeVars['--theme-primary-dark']); document.documentElement.style.setProperty('--theme-border-main', themeVars['--theme-primary-dark']); } else { console.warn(`Theme ID "${themeId}" not found. Applying default.`); applyThemeOnPage('default'); return; } }

// Core Logic
function checkDateAndResetCounts() { const currentDate = getCurrentDateString(); if (currentDate !== lastLogDate && lastLogDate !== '') { console.log(`Date changed from ${lastLogDate} to ${currentDate}. Checking yesterday's limits and resetting counts.`); const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1); const yesterdayCigsUnder = todayCigaretteCount <= dailyCigaretteLimit; const yesterdayVapeUnder = todayTotalVapeTime <= dailyTotalVapeTimeLimit; const yesterdayWasUnderLimit = yesterdayCigsUnder && yesterdayVapeUnder; if (yesterdayWasUnderLimit) { smokeFreeStreak++; lastDayStreakIncremented = currentDate; showToast(`Streak Extended! ${smokeFreeStreak} Days!`); addPoints(5, `Streak: ${smokeFreeStreak} Days`); if ([1, 3, 7, 14, 30, 60, 90].includes(smokeFreeStreak)) { healthMilestones++; addPoints(Math.max(10, smokeFreeStreak * 2), `Milestone: ${smokeFreeStreak}-Day Streak!`); showToast(`MILESTONE! ${smokeFreeStreak}-Day Streak Achieved!`); } } else { smokeFreeStreak = 0; lastDayStreakIncremented = ''; showToast("Streak Reset. Keep trying!", 3000); } todayCigaretteCount = 0; todayTotalVapeTime = 0; lastLogDate = currentDate; saveState(); } else if (lastLogDate === '') { lastLogDate = currentDate; saveState(); } }
// logCigaretteEvent and vape timer functions are defined above with the new confirmation logic
function checkAndWarnLimits() { const cigOver = todayCigaretteCount > dailyCigaretteLimit; const vapeOver = todayTotalVapeTime > dailyTotalVapeTimeLimit; if (cigOver) { showToast(`Warning: Cigarette limit (${dailyCigaretteLimit}) exceeded!`, 3000); } if (vapeOver) { showToast(`Warning: Daily vape time limit (${formatTime(dailyTotalVapeTimeLimit)}) exceeded!`, 3000); } }

// UI Update Functions
function updateHeaderDisplays() { const upd = document.getElementById('userPoints'); if (upd) { upd.textContent = userPoints; } const sfsd = document.getElementById('smokeFreeStreak'); if (sfsd) { sfsd.textContent = smokeFreeStreak; } const sd = document.getElementById('streakDisplay'); if (sd) { sd.textContent = `${smokeFreeStreak} Days`; } const hmd = document.getElementById('healthMilestones'); if (hmd) { hmd.textContent = healthMilestones; } const supd = document.getElementById('shopUserPoints'); if (supd) { supd.textContent = userPoints; } }
function updateStatusDisplay() { const tccd = document.getElementById('todayCigaretteCount'); if (tccd) { tccd.textContent = todayCigaretteCount; } const cld = document.getElementById('cigaretteLimitDisplay'); if (cld) { cld.textContent = dailyCigaretteLimit; } if (tccd && tccd.parentElement) { tccd.parentElement.classList.toggle('over-limit', todayCigaretteCount > dailyCigaretteLimit); } const ttvtd = document.getElementById('todayTotalVapeTimeDisplay'); if (ttvtd) { ttvtd.textContent = formatTime(todayTotalVapeTime); } const dvtld = document.getElementById('dailyVapeTimeLimitDisplay'); if (dvtld) { dvtld.textContent = formatTime(dailyTotalVapeTimeLimit); } if (ttvtd && ttvtd.parentElement) { ttvtd.parentElement.classList.toggle('over-limit', todayTotalVapeTime > dailyTotalVapeTimeLimit); } const svtb = document.getElementById('startVapeTimerButton'); if (svtb) { svtb.disabled = isVapeTimerRunning; } const stpvtb = document.getElementById('stopVapeTimerButton'); if (stpvtb) { stpvtb.disabled = !isVapeTimerRunning; stpvtb.style.display = isVapeTimerRunning ? 'inline-block' : 'none'; } const vtd = document.getElementById('vapeTimerDisplay'); if (vtd && !isVapeTimerRunning) { vtd.textContent = formatTimerDisplay(0); vtd.classList.remove('warning', 'counting-down'); } if (cigaretteLogConfirmationStep !== 0 && document.getElementById('logCigaretteButton')) { const currentDate = getCurrentDateString(); if(lastLogDate !== currentDate) { resetCigaretteButton(); }} }
function renderSmokeLog() { const sl = document.getElementById('smokeLogList'); if (!sl) { return; } sl.innerHTML = ''; const logsToRender = smokeLog.slice(0, 30); const nlp = document.getElementById('noLogsPlaceholder'); if (logsToRender.length === 0) { if (nlp) { nlp.style.display = 'block'; } return; } else { if (nlp) { nlp.style.display = 'none'; } } logsToRender.forEach(log => { const listItem = document.createElement('li'); listItem.className = 'moment-card'; listItem.style.cssText = 'opacity:1; animation:none; padding:8px; margin-bottom:8px;'; const logTime = new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); const logDate = new Date(log.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric'}); let iconClass = '', iconColor = '', text = '', details = ''; let reasonIconBaseClass = 'add-reason-icon'; let reasonIconExtraClass = log.reason ? 'fas fa-comment-dots has-reason' : 'far fa-comment-dots'; if (log.type === 'cigarette') { iconClass = 'fas fa-smoking'; iconColor = 'var(--theme-highlight-accent)'; text = 'Cigarette'; } else if (log.type === 'vape') { iconClass = 'fas fa-vial'; iconColor = 'var(--theme-primary-accent)'; text = 'Vape Session'; details = log.duration ? `(${formatTime(log.duration)})` : ''; } listItem.innerHTML = `<div class="log-item-content"><div class="log-item-details"><i class="${iconClass}" style="color: ${iconColor}; margin-right: 8px; font-size: 18px;"></i><span>${text} ${details}</span></div><div class="log-item-reason-icon-container"><span class="log-item-time">${logDate} @ ${logTime}</span><i class="${reasonIconBaseClass} ${reasonIconExtraClass}"></i></div></div>`; const reasonIconElement = listItem.querySelector('.add-reason-icon'); if (reasonIconElement) { const reasonTitle = log.reason ? 'Edit Reason' : 'Add Reason'; reasonIconElement.setAttribute('title', reasonTitle); reasonIconElement.setAttribute('data-timestamp', log.timestamp); } sl.appendChild(listItem); }); }

// Reason Modal Logic
function handleOpenReasonModal(timestamp) { const lE = smokeLog.find(log => log.timestamp === timestamp); const rmo = document.getElementById('reasonModalOverlay'); const ri = document.getElementById('reasonInput'); const rlti = document.getElementById('reasonLogTimestamp'); if (!lE || !rmo || !ri || !rlti) { return; } ri.value = lE.reason || ''; rlti.value = timestamp; rmo.classList.add('show'); ri.focus(); }
function handleCloseReasonModal() { const rmo = document.getElementById('reasonModalOverlay'); if (rmo) { rmo.classList.remove('show'); } const ri = document.getElementById('reasonInput'); if (ri) { ri.value = ''; } const rlti = document.getElementById('reasonLogTimestamp'); if (rlti) { rlti.value = ''; } }
function handleSaveReason() { const rlti = document.getElementById('reasonLogTimestamp'); const ri = document.getElementById('reasonInput'); if(!rlti || !ri) return; const t = parseInt(rlti.value); const nR = ri.value.trim(); if (isNaN(t)) { return; } const lE = smokeLog.find(log => log.timestamp === t); if (lE) { lE.reason = nR; saveState(); renderSmokeLog(); showToast(nR ? "Reason Saved!" : "Reason Cleared."); } handleCloseReasonModal(); }

// Event Listeners (ensure all selectors used here are defined at the top)
const lcb = document.getElementById('logCigaretteButton'); if (lcb) { lcb.addEventListener('click', handleLogCigaretteClick); }
// ... (rest of the event listeners copied from the expanded version)
