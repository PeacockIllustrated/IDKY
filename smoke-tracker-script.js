// smoke-tracker-script.js

document.addEventListener('DOMContentLoaded', () => {
    // =================================================================================
    // SECTION: CONSTANTS & STATE VARIABLES
    // =================================================================================
    const localStorageKeySuffix = '_v27_theme_shop';

    // --- Element Selectors ---
    // General UI & Header
    const userPointsDisplay = document.getElementById('userPoints');
    // ... (other general selectors)
    const smokeFreeStreakDisplay = document.getElementById('smokeFreeStreak');
    const streakDisplay = document.getElementById('streakDisplay');
    const healthMilestonesDisplay = document.getElementById('healthMilestones');
    const shopUserPointsDisplay = document.getElementById('shopUserPoints');
    const toastNotification = document.getElementById('toastNotification');


    // Cigarette Logging Elements
    const logCigaretteButton = document.getElementById('logCigaretteButton');
    // ... (other cigarette selectors)
    const todayCigaretteCountDisplay = document.getElementById('todayCigaretteCount');
    const cigaretteLimitDisplay = document.getElementById('cigaretteLimitDisplay');
    const setLimitInput = document.getElementById('setLimitInput');
    const saveLimitButton = document.getElementById('saveLimitButton');


    // Vape Timer Elements
    const startVapeTimerButton = document.getElementById('startVapeTimerButton');
    // ... (other vape selectors)
    const stopVapeTimerButton = document.getElementById('stopVapeTimerButton');
    const vapeTimerDisplay = document.getElementById('vapeTimerDisplay');
    const setVapeSessionLimitInput = document.getElementById('setVapeSessionLimitInput');
    const saveVapeSessionLimitButton = document.getElementById('saveVapeSessionLimitButton');
    const todayTotalVapeTimeDisplay = document.getElementById('todayTotalVapeTimeDisplay');
    const dailyVapeTimeLimitDisplay = document.getElementById('dailyVapeTimeLimitDisplay');
    const setDailyVapeTimeLimitInput = document.getElementById('setDailyVapeTimeLimitInput');
    const saveDailyVapeTimeLimitButton = document.getElementById('saveDailyVapeTimeLimitButton');


    // Log List Elements
    const smokeLogList = document.getElementById('smokeLogList');
    // ... (other log selectors)
    const noLogsPlaceholder = document.getElementById('noLogsPlaceholder');


    // Reason Modal Elements
    const reasonModalOverlay = document.getElementById('reasonModalOverlay');
    // ... (other modal selectors)
    const reasonInput = document.getElementById('reasonInput');
    const reasonLogTimestampInput = document.getElementById('reasonLogTimestamp');
    const saveReasonButton = document.getElementById('saveReasonButton');
    const cancelReasonButton = document.getElementById('cancelReasonButton');


    // --- NEW: Smoke Overlay Selectors ---
    const cigaretteSmokeOverlay = document.getElementById('cigaretteSmokeOverlay');
    const vapeSmokeOverlay = document.getElementById('vapeSmokeOverlay');

    // --- State Variables ---
    // ... (General App State, Smoking & Vaping State, Timer Runtime State, Theme State - same as previous) ...
    let userPoints = 0; smokeFreeStreak = 0; healthMilestones = 0;
    let dailyCigaretteLimit = 5; vapeSessionDurationLimit = 30; dailyTotalVapeTimeLimit = 300;
    let smokeLog = []; lastLogDate = ''; todayCigaretteCount = 0; todayTotalVapeTime = 0; lastDayStreakIncremented = '';
    let isVapeTimerRunning = false; vapeTimerStartTime = null; vapeTimerIntervalId = null;
    let vapeTimerTargetEndTime = null; vapeTimerMode = 'up';
    let ownedThemes = ['default']; currentTheme = 'default';


    // --- REMOVED: Particle System State ---
    // let particleCtx = null;
    // let particles = [];
    // let isAnimatingParticles = false;
    // let vapeParticleIntervalId = null;


    // =================================================================================
    // SECTION: THEME DATA OBJECT
    // =================================================================================
    const themes = { /* ... Full themes object definition ... */ };


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
    // SECTION: SMOKE OVERLAY ANIMATION FUNCTIONS
    // =================================================================================
    function triggerCigaretteSmokeScreen() {
        if (!cigaretteSmokeOverlay) return;

        cigaretteSmokeOverlay.style.display = 'block'; // Make it visible
        cigaretteSmokeOverlay.style.animation = 'none'; // Reset animation
        // Trigger reflow to restart animation
        void cigaretteSmokeOverlay.offsetWidth; // eslint-disable-line no-void
        cigaretteSmokeOverlay.style.animation = 'cigarettePuffAnim 1s ease-out forwards';

        // Hide it after animation completes (1s)
        // Note: The animation already fades it to opacity 0.
        // 'forwards' keeps it at the end state.
        // If you want to truly hide it with display:none after, add:
        // setTimeout(() => {
        //     cigaretteSmokeOverlay.style.display = 'none';
        // }, 1000);
    }

    let vapeOverlayTimeoutId = null; // To manage dissipation timeout

    function startVapeSmokeVignette() {
        if (!vapeSmokeOverlay) return;
        clearTimeout(vapeOverlayTimeoutId); // Clear any pending dissipation
        vapeSmokeOverlay.classList.remove('fade-out');
        vapeSmokeOverlay.style.display = 'block';
        // Force a reflow before adding class to ensure transition happens
        void vapeSmokeOverlay.offsetWidth;
        vapeSmokeOverlay.classList.add('active'); // This triggers the fill via CSS transition
    }

    function stopVapeSmokeVignette() {
        if (!vapeSmokeOverlay) return;
        vapeSmokeOverlay.classList.remove('active'); // Start fade out
        vapeSmokeOverlay.classList.add('fade-out');

        // Set a timeout to actually hide the element after the fade-out transition (1s)
        clearTimeout(vapeOverlayTimeoutId); // Clear previous timeout if any
        vapeOverlayTimeoutId = setTimeout(() => {
            if (vapeSmokeOverlay) { // Check if element still exists
                vapeSmokeOverlay.style.display = 'none';
                vapeSmokeOverlay.classList.remove('fade-out'); // Clean up class
            }
        }, 1000); // Matches the fade-out duration
    }

    // --- REMOVED: Particle System Functions ---
    // function initializeParticleCanvas() { /* ... */ }
    // function createGenericParticle(x, y, options) { /* ... */ }
    // function updateAndDrawParticles() { /* ... */ }
    // function triggerCigarettePuff() { /* Old particle version */ }
    // function startVapeParticleStream() { /* Old particle version */ }
    // function stopVapeParticleStream() { /* Old particle version */ }


    // =================================================================================
    // SECTION: LOCAL STORAGE & STATE MANAGEMENT
    // =================================================================================
    function loadState() { /* ... Same as previous full script ... */ }
    function saveState() { /* ... Same as previous full script ... */ }

    // =================================================================================
    // SECTION: THEME APPLICATION
    // =================================================================================
    function applyThemeOnPage(themeId) { /* ... Same as previous full script ... */ }

    // =================================================================================
    // SECTION: CORE SMOKE TRACKER LOGIC
    // =================================================================================
    function checkDateAndResetCounts() { /* ... Same as previous full script ... */ }

    function logCigaretteEvent() {
        checkDateAndResetCounts();
        todayCigaretteCount++;
        const logEntry = { type: 'cigarette', timestamp: Date.now(), reason: '' };
        smokeLog.unshift(logEntry);
        if (smokeLog.length > 100) { smokeLog.pop(); }

        triggerCigaretteSmokeScreen(); // <<<< CALL NEW OVERLAY FUNCTION

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
            // ... (countdown logic same as previous)
            vapeTimerMode = 'down';
            vapeTimerTargetEndTime = vapeTimerStartTime + vapeSessionDurationLimit * 1000;
            vapeTimerDisplay.textContent = formatTimerDisplay(vapeSessionDurationLimit);
            vapeTimerDisplay.classList.add('counting-down');
            showToast(`Vape timer started (Counting down from ${formatTimerDisplay(vapeSessionDurationLimit)})!`);
        } else {
            // ... (count up logic same as previous)
            vapeTimerMode = 'up';
            vapeTimerTargetEndTime = null;
            vapeTimerDisplay.textContent = formatTimerDisplay(0);
            showToast("Vape timer started (Counting up)!");
        }

        startVapeSmokeVignette(); // <<<< CALL NEW OVERLAY FUNCTION

        vapeTimerIntervalId = setInterval(() => {
            // ... (timer display update logic same as previous) ...
            if (vapeTimerMode === 'down') {
                const remainingMillis = vapeTimerTargetEndTime - Date.now();
                if (remainingMillis <= 0) {
                    vapeTimerDisplay.textContent = "00:00";
                    showToast("Vape session limit reached!", 3000);
                    vapeTimerDisplay.classList.add('warning');
                    stopVapeTimer(true);
                } else {
                    const remainingSeconds = Math.ceil(remainingMillis / 1000);
                    vapeTimerDisplay.textContent = formatTimerDisplay(remainingSeconds);
                }
            } else {
                const elapsedMillis = Date.now() - vapeTimerStartTime;
                const elapsedSeconds = Math.floor(elapsedMillis / 1000);
                vapeTimerDisplay.textContent = formatTimerDisplay(elapsedSeconds);
            }
        }, 1000);
    }

    function stopVapeTimer(autoStopped = false) {
        if (!isVapeTimerRunning) { return; }
        clearInterval(vapeTimerIntervalId);
        isVapeTimerRunning = false;
        // ... (duration calculation, logging, UI reset same as previous) ...
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

        stopVapeSmokeVignette(); // <<<< CALL NEW OVERLAY FUNCTION

        if (!autoStopped) { showToast(`Vape session logged: ${formatTime(durationSeconds)}`); }
        checkAndWarnLimits();
        updateStatusDisplay();
        renderSmokeLog();
        saveState();
    }

    function checkAndWarnLimits() { /* ... Same as previous full script ... */ }


    // =================================================================================
    // SECTION: UI UPDATE FUNCTIONS
    // =================================================================================
    function updateHeaderDisplays() { /* ... Same as previous full script ... */ }
    function updateStatusDisplay() { /* ... Same as previous full script ... */ }
    function renderSmokeLog() { /* ... Same as previous full script ... */ }

    // =================================================================================
    // SECTION: REASON MODAL LOGIC
    // =================================================================================
    function handleOpenReasonModal(timestamp) { /* ... Same as previous full script ... */ }
    function handleCloseReasonModal() { /* ... Same as previous full script ... */ }
    function handleSaveReason() { /* ... Same as previous full script ... */ }


    // =================================================================================
    // SECTION: EVENT LISTENERS
    // =================================================================================
    // ... (All event listeners from previous full script, no changes needed here related to smoke overlays)
    if (logCigaretteButton) { logCigaretteButton.addEventListener('click', logCigaretteEvent); }
    if (startVapeTimerButton) { startVapeTimerButton.addEventListener('click', startVapeTimer); }
    if (stopVapeTimerButton) { stopVapeTimerButton.addEventListener('click', () => { stopVapeTimer(false); }); }
    if (saveLimitButton && setLimitInput) { /* ... */ }
    if (saveVapeSessionLimitButton && setVapeSessionLimitInput) { /* ... */ }
    if (saveDailyVapeTimeLimitButton && setDailyVapeTimeLimitInput) { /* ... */ }
    if (smokeLogList) { /* ... */ }
    if (saveReasonButton) { /* ... */ }
    if (cancelReasonButton) { /* ... */ }
    if (reasonModalOverlay) { /* ... */ }


    // =================================================================================
    // SECTION: INITIAL SETUP
    // =================================================================================
    loadState();
    // REMOVED: initializeParticleCanvas();
    applyThemeOnPage(currentTheme);
    checkDateAndResetCounts();
    updateHeaderDisplays();
    updateStatusDisplay();
    renderSmokeLog();

    console.log("Smoke Tracker Initialized (v8 - Screen Overlays).");
    console.log("Initial Theme:", currentTheme);

}); // End DOMContentLoaded
