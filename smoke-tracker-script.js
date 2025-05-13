// smoke-tracker-script.js (Core Logic + Calendar Hooks)

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
    const dailyProgressChartContainer = document.getElementById('dailyProgressChartContainer');
    const endOfDayTestButton = document.getElementById('endOfDayTestButton');

    // --- Calendar UI Selectors ---
    const toggleCalendarButton = document.getElementById('toggleCalendarButton');
    const calendarLogContainer = document.getElementById('calendarLogContainer');
    const calendarGridContainer = document.getElementById('calendarGridContainer');
    const calendarMonthYearDisplay = document.getElementById('calendarMonthYear');
    const prevMonthButton = document.getElementById('prevMonthButton');
    const nextMonthButton = document.getElementById('nextMonthButton');

    // --- State Variables ---
    let userPoints = 0, smokeFreeStreak = 0, healthMilestones = 0;
    let dailyCigaretteLimit = 5, vapeSessionDurationLimit = 30, dailyTotalVapeTimeLimit = 300;
    let smokeLog = [], lastLogDate = '', todayCigaretteCount = 0, todayTotalVapeTime = 0, lastDayStreakIncremented = '';
    let isVapeTimerRunning = false, vapeTimerStartTime = null, vapeTimerIntervalId = null;
    let vapeTimerTargetEndTime = null, vapeTimerMode = 'up';
    let ownedThemes = ['default'], currentTheme = 'default';
    let particleCtx = null, particles = [], isAnimatingParticles = false, vapeParticleIntervalId = null;
    let cigaretteLogConfirmationStep = 0;

    // =================================================================================
    // SECTION: THEME DATA OBJECT
    // =================================================================================
    const themes = { // Ensure this matches your other files
        default: { name: "Default Retro", cost: 0, owned: true, cssVariables: { '--theme-primary-dark': '#264653', '--theme-primary-accent': '#2A9D8F', '--theme-secondary-accent': '#E9C46A', '--theme-tertiary-accent': '#F4A261', '--theme-highlight-accent': '#E76F51', '--theme-light-bg': '#EAEAEA', '--theme-card-bg': '#FFFFFF', '--theme-text-on-dark': '#EAEAEA', '--theme-page-bg': 'rgb(174, 217, 211)' } },
        oceanDepths: { name: "Ocean Depths", cost: 1, cssVariables: { '--theme-primary-dark': '#03045E', '--theme-primary-accent': '#0077B6', '--theme-secondary-accent': '#00B4D8', '--theme-tertiary-accent': '#90E0EF', '--theme-highlight-accent': '#CAF0F8', '--theme-light-bg': '#E0FBFC', '--theme-card-bg': '#FFFFFF', '--theme-text-on-dark': '#CAF0F8', '--theme-page-bg': '#ADE8F4' } },
        volcanoRush: { name: "Volcano Rush", cost: 1, cssVariables: { '--theme-primary-dark': '#2B0000', '--theme-primary-accent': '#6A0000', '--theme-secondary-accent': '#FF4500', '--theme-tertiary-accent': '#FF8C00', '--theme-highlight-accent': '#AE2012', '--theme-light-bg': '#FFF2E6', '--theme-card-bg': '#FFFFFF', '--theme-text-on-dark': '#FFDAB9', '--theme-page-bg': '#FFCDB2' } },
        techOrangeBlue: { name: "Tech Orange & Blue", cost: 1, cssVariables: { '--theme-primary-dark': '#004C97', '--theme-primary-accent': '#4A7DB5', '--theme-secondary-accent': '#FF6600', '--theme-tertiary-accent': '#C0C0C0', '--theme-highlight-accent': '#FF7700', '--theme-light-bg': '#F0F0F0', '--theme-card-bg': '#FFFFFF', '--theme-text-on-dark': '#F0F0F0', '--theme-page-bg': '#E8E8E8' } },
        forestGreens: { name: "Forest Greens", cost: 1, cssVariables: { '--theme-primary-dark': '#1A2B12', '--theme-primary-accent': '#335128', '--theme-secondary-accent': '#526F35', '--theme-tertiary-accent': '#8A9A5B', '--theme-highlight-accent': '#E0E7A3', '--theme-light-bg': '#F0F5E0', '--theme-card-bg': '#FFFFFF', '--theme-text-on-dark': '#E0E7A3', '--theme-page-bg': '#D8E0C0' } }
    };

    // =================================================================================
    // SECTION: HELPER FUNCTIONS
    // =================================================================================
    function formatTime(totalSeconds) { if (isNaN(totalSeconds) || totalSeconds < 0) { return "0m 0s"; } const m = Math.floor(totalSeconds / 60); const s = Math.floor(totalSeconds % 60); return `${m}m ${s}s`; }
    function formatTimerDisplay(totalSeconds) { if (isNaN(totalSeconds) || totalSeconds < 0) { return "00:00"; } const m = Math.floor(totalSeconds / 60); const s = Math.floor(totalSeconds % 60); return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`; }
    function parseMMSS(timeString) { if (!timeString || typeof timeString !== 'string') { return null; } const p = timeString.split(':'); if (p.length !== 2) { return null; } const m = parseInt(p[0], 10); const s = parseInt(p[1], 10); if (isNaN(m) || isNaN(s) || m < 0 || s < 0 || s >= 60) { return null; } return (m * 60) + s; }
    function showToast(message, duration = 2500) { if (toastNotification) { toastNotification.textContent = message; toastNotification.classList.add('show'); setTimeout(() => { toastNotification.classList.remove('show'); }, duration); } else { console.log("Toast:", message); } }
    function triggerPointsFlash() { const d = document.querySelector('.header-stats-bar .points-display:first-child'); if (d) { d.classList.add('points-earned-flash'); } setTimeout(() => { if (d) { d.classList.remove('points-earned-flash'); } }, 500); }
    function addPoints(amount, reason = "") { if (amount > 0) { userPoints += amount; showToast(`+${amount} PTS! ${reason}`.trim(), amount > 5 ? 3000 : 2500); triggerPointsFlash(); updateHeaderDisplays(); saveState(); } }
    function getCurrentDateString() { const t = new Date(); const y = t.getFullYear(); const m = String(t.getMonth() + 1).padStart(2, '0'); const d = String(t.getDate()).padStart(2, '0'); return `${y}-${m}-${d}`; }
    function getDateStringFromTimestamp(timestamp) { const date = new Date(timestamp); const y = date.getFullYear(); const m = String(date.getMonth() + 1).padStart(2, '0'); const d = String(date.getDate()).padStart(2, '0'); return `${y}-${m}-${d}`; }

    // =================================================================================
    // SECTION: PARTICLE SYSTEM
    // =================================================================================
    function initializeParticleCanvas() { /* ... (Your working particle code) ... */ }
    function createGenericParticle(x, y, options) { /* ... (Your working particle code) ... */ }
    function updateAndDrawParticles() { /* ... (Your working particle code) ... */ }
    function triggerCigarettePuff() { /* ... (Your working particle code) ... */ }
    function startVapeParticleStream() { /* ... (Your working particle code) ... */ }
    function stopVapeParticleStream() { /* ... (Your working particle code) ... */ }

    // =================================================================================
    // SECTION: LOG COMPACTION LOGIC (If you kept it in the revert)
    // =================================================================================
    const COMPACTION_TIME_WINDOW_MS = 5 * 60 * 1000;
    const MAX_LOG_ENTRIES_AFTER_COMPACTION = 50;
    function compactSmokeLog() { /* ... (Your working compaction code or remove if reverted) ... */ }

    // =================================================================================
    // SECTION: LOCAL STORAGE & STATE MANAGEMENT
    // =================================================================================
    function loadState() {
        // ... (Your working loadState logic) ...
        // Ensure it loads all necessary variables like smokeLog, limits, points etc.
        // Example structure:
        userPoints = parseInt(localStorage.getItem('idk_user_points_val' + localStorageKeySuffix)) || 0;
        smokeFreeStreak = parseInt(localStorage.getItem('smoketrack_streak' + localStorageKeySuffix)) || 0;
        // ... load other state variables ...
        smokeLog = JSON.parse(localStorage.getItem('smoketrack_log_v2' + localStorageKeySuffix)) || [];
        // ... load remaining state variables ...
        currentTheme = localStorage.getItem('idk_current_theme' + localStorageKeySuffix) || 'default';

        // Update input fields based on loaded state
        if (setLimitInput) { setLimitInput.value = dailyCigaretteLimit; }
        if (setDailyVapeTimeLimitInput) { setDailyVapeTimeLimitInput.value = Math.floor(dailyTotalVapeTimeLimit / 60); }
        if (setVapeSessionLimitInput) { setVapeSessionLimitInput.value = formatTimerDisplay(vapeSessionDurationLimit); }

        // Compact logs if using compaction logic
        // if (typeof compactSmokeLog === 'function') { compactSmokeLog(); }
    }
    function saveState() {
        // ... (Your working saveState logic) ...
        // Ensure it saves all necessary variables
        // Example structure:
        localStorage.setItem('idk_user_points_val' + localStorageKeySuffix, userPoints.toString());
        // ... save other state variables ...
        localStorage.setItem('smoketrack_log_v2' + localStorageKeySuffix, JSON.stringify(smokeLog));
        // ... save remaining state variables ...
        localStorage.setItem('idk_current_theme' + localStorageKeySuffix, currentTheme);
    }

    // =================================================================================
    // SECTION: THEME APPLICATION
    // =================================================================================
    function applyThemeOnPage(themeId) {
        // ... (Your working theme application logic) ...
        const themeToApply = themes[themeId] || themes.default;
        currentTheme = themeId;
        if (themeToApply && themeToApply.cssVariables) {
             const themeVars = themeToApply.cssVariables;
             for (const [key, value] of Object.entries(themeVars)) { document.documentElement.style.setProperty(key, value); }
             document.documentElement.style.setProperty('--theme-text-main', themeVars['--theme-primary-dark']);
             document.documentElement.style.setProperty('--theme-border-main', themeVars['--theme-primary-dark']);
         } else {
             console.warn(`Theme ID "${themeId}" not found. Applying default.`);
             // Apply default explicitly if needed
             const defaultVars = themes.default.cssVariables;
             for (const [key, value] of Object.entries(defaultVars)) { document.documentElement.style.setProperty(key, value); }
             document.documentElement.style.setProperty('--theme-text-main', defaultVars['--theme-primary-dark']);
             document.documentElement.style.setProperty('--theme-border-main', defaultVars['--theme-primary-dark']);
             currentTheme = 'default';
         }
         // Save state might be needed if theme change should persist immediately,
         // but usually handled by shop script. If applying theme from here needs saving:
         // saveState();
    }

    // =================================================================================
    // SECTION: CORE SMOKE TRACKER LOGIC
    // =================================================================================
    function checkDateAndResetCounts() { /* ... (Your working logic) ... */ }
    function resetCigaretteButton() { /* ... (Your working logic) ... */ }
    function actuallyLogCigarette() {
        // ... (Your working logic) ...
        // Ensure it updates todayCigaretteCount, adds to smokeLog,
        // calls compactSmokeLog (if used), updates UI, saves state etc.
        todayCigaretteCount++;
        const logEntry = { type: 'cigarette', timestamp: Date.now(), reason: '' };
        smokeLog.unshift(logEntry);

        // compactSmokeLog(); // Call if using compaction

        triggerCigarettePuff();
        showToast("Cigarette logged.");
        checkAndWarnLimits();
        updateStatusDisplay();
        renderSmokeLog();
        renderDailyProgressChart();
        saveState();
        resetCigaretteButton();
    }
    function handleLogCigaretteClick() { /* ... (Your working 3-stage logic) ... */ }
    function startVapeTimer() { /* ... (Your working logic) ... */ }
    function stopVapeTimer(autoStopped = false) {
        // ... (Your working logic) ...
        // Ensure it calculates duration, updates todayTotalVapeTime, adds to smokeLog,
        // calls compactSmokeLog (if used), updates UI, saves state etc.
         if (!isVapeTimerRunning) { return; } clearInterval(vapeTimerIntervalId); isVapeTimerRunning = false; const endTime = Date.now(); let durationSeconds;
         // ... calculate durationSeconds ...
         if (vapeTimerMode === 'down') { if (autoStopped) { durationSeconds = vapeSessionDurationLimit; } else { durationSeconds = Math.max(1, Math.round((endTime - vapeTimerStartTime) / 1000)); durationSeconds = Math.min(durationSeconds, vapeSessionDurationLimit); } } else { durationSeconds = Math.max(1, Math.round((endTime - vapeTimerStartTime) / 1000)); }
         todayTotalVapeTime += durationSeconds;
         const logEntry = { type: 'vape', timestamp: endTime, duration: durationSeconds, reason: '' };
         smokeLog.unshift(logEntry);

         // compactSmokeLog(); // Call if using compaction

         // ... reset timer state, update UI ...
         vapeTimerStartTime = null; vapeTimerTargetEndTime = null; vapeTimerMode = 'up'; startVapeTimerButton.disabled = false; stopVapeTimerButton.disabled = true; stopVapeTimerButton.style.display = 'none'; vapeTimerDisplay.textContent = formatTimerDisplay(0); vapeTimerDisplay.classList.remove('warning', 'counting-down');
         stopVapeParticleStream();
         if (!autoStopped) { showToast(`Vape session logged: ${formatTime(durationSeconds)}`); }
         checkAndWarnLimits(); updateStatusDisplay(); renderSmokeLog(); renderDailyProgressChart();
         saveState();
    }
    function checkAndWarnLimits() { /* ... (Your working logic) ... */ }

    // =================================================================================
    // SECTION: UI UPDATE FUNCTIONS
    // =================================================================================
    function updateHeaderDisplays() { /* ... (Your working logic) ... */ }
    function updateStatusDisplay() { /* ... (Your working logic) ... */ }
    function renderSmokeLog() { /* ... (Your working logic, matching compaction if used) ... */ }
    function renderDailyProgressChart() { /* ... (Your working chart logic) ... */ }

    // =================================================================================
    // SECTION: REASON MODAL LOGIC
    // =================================================================================
    function handleOpenReasonModal(timestamp) { /* ... (Your working logic) ... */ }
    function handleCloseReasonModal() { /* ... (Your working logic) ... */ }
    function handleSaveReason() {
        // ... (Your working logic) ...
        // Ensure it finds the log, updates the reason,
        // calls compactSmokeLog (if needed), saves state, updates UI.
         const timestampToUpdate = parseInt(reasonLogTimestampInput.value);
         const newReason = reasonInput.value.trim();
         if (isNaN(timestampToUpdate)) { return; }
         const logEntryToUpdate = smokeLog.find(log => log.timestamp === timestampToUpdate);
         if (logEntryToUpdate) {
             logEntryToUpdate.reason = newReason;
             // compactSmokeLog(); // Call if using compaction and reason change affects it
             saveState();
             renderSmokeLog();
             showToast(newReason ? "Reason Saved!" : "Reason Cleared.");
         }
         handleCloseReasonModal();
    }

    // =================================================================================
    // SECTION: CALENDAR INTEGRATION SETUP
    // =================================================================================
    // This function passes necessary data and functions to calendar-logic.js
    function setupCalendarIntegration() {
        // Check if the calendar logic script has loaded and defined its init function
        if (typeof initializeCalendarLogic === 'function') {
            // Pass data, elements, and helper functions
            initializeCalendarLogic({
                // Data references (ensure these are up-to-date when calendar is used)
                getSmokeLog: () => smokeLog, // Pass a function to get the current log
                getDailyCigaretteLimit: () => dailyCigaretteLimit,
                getDailyTotalVapeTimeLimit: () => dailyTotalVapeTimeLimit,

                // DOM Elements needed by calendar logic
                elements: {
                    calendarLogContainer: calendarLogContainer,
                    calendarGridContainer: calendarGridContainer,
                    calendarMonthYearDisplay: calendarMonthYearDisplay,
                    toggleCalendarButton: toggleCalendarButton // To update button text
                },
                // Helper functions needed by calendar logic
                helpers: {
                    getDateStringFromTimestamp: getDateStringFromTimestamp,
                    formatTime: formatTime,
                    getCurrentDateString: getCurrentDateString
                }
            });

            // Attach event listeners here in the main script, but call handlers from calendar-logic
            if (toggleCalendarButton) {
                toggleCalendarButton.addEventListener('click', () => {
                    // Check if the handler exists (script loaded?) before calling
                    if (typeof handleToggleCalendar === 'function') {
                        handleToggleCalendar();
                    } else { console.error("handleToggleCalendar function not found from calendar-logic.js"); }
                });
            }
            if (prevMonthButton) {
                prevMonthButton.addEventListener('click', () => {
                    if (typeof handlePrevMonth === 'function') {
                        handlePrevMonth();
                    } else { console.error("handlePrevMonth function not found from calendar-logic.js"); }
                });
            }
            if (nextMonthButton) {
                nextMonthButton.addEventListener('click', () => {
                    if (typeof handleNextMonth === 'function') {
                        handleNextMonth();
                    } else { console.error("handleNextMonth function not found from calendar-logic.js"); }
                });
            }
             console.log("Calendar integration setup complete.");

        } else {
            console.warn("calendar-logic.js might not be loaded or initializeCalendarLogic is not defined.");
            // Optionally disable the calendar button if the logic isn't available
            if(toggleCalendarButton) {
                toggleCalendarButton.disabled = true;
                toggleCalendarButton.textContent = "Calendar Unavailable";
            }
        }
    }

    // =================================================================================
    // SECTION: EVENT LISTENERS (Core + EOD)
    // =================================================================================
    // --- Attach your core event listeners ---
    if (logCigaretteButton) { logCigaretteButton.addEventListener('click', handleLogCigaretteClick); }
    if (startVapeTimerButton) { startVapeTimerButton.addEventListener('click', startVapeTimer); }
    if (stopVapeTimerButton) { stopVapeTimerButton.addEventListener('click', () => { stopVapeTimer(false); }); }
    if (saveLimitButton && setLimitInput) { saveLimitButton.addEventListener('click', () => { /* Your limit saving logic */ const newLimit = parseInt(setLimitInput.value); if (!isNaN(newLimit) && newLimit >= 0) { dailyCigaretteLimit = newLimit; updateStatusDisplay(); checkAndWarnLimits(); saveState(); renderDailyProgressChart(); showToast(`Cigarette limit set to ${dailyCigaretteLimit > 0 ? dailyCigaretteLimit : 'Off'}.`); } else { showToast("Invalid limit value."); setLimitInput.value = dailyCigaretteLimit; } }); }
    if (saveVapeSessionLimitButton && setVapeSessionLimitInput) { saveVapeSessionLimitButton.addEventListener('click', () => { /* Your limit saving logic */ const parsedSeconds = parseMMSS(setVapeSessionLimitInput.value); if (parsedSeconds !== null && parsedSeconds >= 0) { vapeSessionDurationLimit = parsedSeconds; saveState(); showToast(`Vape session limit set to ${formatTimerDisplay(vapeSessionDurationLimit)} ${parsedSeconds === 0 ? '(Count Up)' : ''}.`); setVapeSessionLimitInput.value = formatTimerDisplay(vapeSessionDurationLimit); } else { showToast("Invalid session limit format (MM:SS)."); setVapeSessionLimitInput.value = formatTimerDisplay(vapeSessionDurationLimit); } }); }
    if (saveDailyVapeTimeLimitButton && setDailyVapeTimeLimitInput) { saveDailyVapeTimeLimitButton.addEventListener('click', () => { /* Your limit saving logic */ const newLimitMinutes = parseInt(setDailyVapeTimeLimitInput.value); if (!isNaN(newLimitMinutes) && newLimitMinutes >= 0) { dailyTotalVapeTimeLimit = newLimitMinutes * 60; updateStatusDisplay(); checkAndWarnLimits(); saveState(); showToast(`Daily vape time limit set to ${newLimitMinutes > 0 ? newLimitMinutes + ' minutes' : 'Off'}.`); } else { showToast("Invalid limit value (minutes)."); setDailyVapeTimeLimitInput.value = Math.floor(dailyTotalVapeTimeLimit / 60); } }); }
    if (smokeLogList) { smokeLogList.addEventListener('click', (event) => { const targetIcon = event.target.closest('.add-reason-icon'); if (targetIcon) { const timestamp = parseInt(targetIcon.dataset.timestamp); if (!isNaN(timestamp)) { handleOpenReasonModal(timestamp); } } }); }
    if (saveReasonButton) { saveReasonButton.addEventListener('click', handleSaveReason); }
    if (cancelReasonButton) { cancelReasonButton.addEventListener('click', handleCloseReasonModal); }
    if (reasonModalOverlay) { reasonModalOverlay.addEventListener('click', (event) => { if (event.target === reasonModalOverlay) { handleCloseReasonModal(); } }); }
    document.addEventListener('click', (event) => { if (logCigaretteButton && !logCigaretteButton.contains(event.target) && cigaretteLogConfirmationStep !== 0) { resetCigaretteButton(); } });
    if (endOfDayTestButton) { endOfDayTestButton.addEventListener('click', () => { showToast("Simulating End Of Day process...", 2000); let tempYesterday = new Date(); tempYesterday.setDate(tempYesterday.getDate() - 1); lastLogDate = getDateStringFromTimestamp(tempYesterday.getTime()); checkDateAndResetCounts(); updateHeaderDisplays(); updateStatusDisplay(); renderSmokeLog(); renderDailyProgressChart(); showToast("E.O.D. simulation complete. Counts reset for 'today'.", 3000); }); }
    // Note: Calendar listeners are attached inside setupCalendarIntegration

    // =================================================================================
    // SECTION: INITIAL SETUP
    // =================================================================================
    loadState(); // Load saved data
    initializeParticleCanvas(); // Setup particles
    applyThemeOnPage(currentTheme); // Apply saved theme
    checkDateAndResetCounts(); // Check for day rollover
    updateHeaderDisplays(); // Update points, streak etc.
    updateStatusDisplay(); // Update counts, limits
    renderSmokeLog(); // Render recent logs
    renderDailyProgressChart(); // Render chart
    resetCigaretteButton(); // Ensure button is in default state

    setupCalendarIntegration(); // Initialize calendar logic and attach its listeners

    console.log("Smoke Tracker Initialized (Core + Calendar Hooks).");
}); // End DOMContentLoaded
