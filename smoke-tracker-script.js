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
    const viewAllLogsButton = document.getElementById('viewAllLogsButton');
    const reasonModalOverlay = document.getElementById('reasonModalOverlay');
    const reasonInput = document.getElementById('reasonInput');
    const reasonLogTimestampInput = document.getElementById('reasonLogTimestamp');
    const saveReasonButton = document.getElementById('saveReasonButton');
    const cancelReasonButton = document.getElementById('cancelReasonButton');
    const journalModalOverlay = document.getElementById('journalModalOverlay');
    const journalMonthYearDisplay = document.getElementById('journalMonthYear');
    const journalPrevMonthButton = document.getElementById('journalPrevMonth');
    const journalNextMonthButton = document.getElementById('journalNextMonth');
    const journalCalendarBody = document.getElementById('journalCalendarBody');
    const journalSelectedDayHeader = document.getElementById('journalSelectedDayHeader');
    const journalDailyLogList = document.getElementById('journalDailyLogList');
    const journalNoLogsForDay = document.getElementById('journalNoLogsForDay');
    const journalCloseButton = document.getElementById('journalCloseButton');

    // --- State Variables ---
    let userPoints = 0, smokeFreeStreak = 0, healthMilestones = 0;
    let dailyCigaretteLimit = 5, vapeSessionDurationLimit = 30, dailyTotalVapeTimeLimit = 300;
    let smokeLog = []; lastLogDate = ''; todayCigaretteCount = 0, todayTotalVapeTime = 0, lastDayStreakIncremented = '';
    let isVapeTimerRunning = false, vapeTimerStartTime = null, vapeTimerIntervalId = null;
    let vapeTimerTargetEndTime = null, vapeTimerMode = 'up';
    let ownedThemes = ['default'], currentTheme = 'default';
    let particleCtx = null, particles = [], isAnimatingParticles = false, vapeParticleIntervalId = null;
    let journalCurrentDate = new Date();

    // =================================================================================
    // SECTION: THEME DATA OBJECT
    // =================================================================================
    const themes = {
        default: { name: "Default Retro", cost: 0, owned: true, cssVariables: { '--theme-primary-dark': '#264653', '--theme-primary-accent': '#2A9D8F', '--theme-secondary-accent': '#E9C46A', '--theme-tertiary-accent': '#F4A261', '--theme-highlight-accent': '#E76F51', '--theme-light-bg': '#EAEAEA', '--theme-card-bg': '#FFFFFF', '--theme-text-on-dark': '#EAEAEA', '--theme-page-bg': 'rgb(174, 217, 211)' } },
        oceanDepths: { name: "Ocean Depths", cost: 1, cssVariables: { '--theme-primary-dark': '#03045E', '--theme-primary-accent': '#0077B6', '--theme-secondary-accent': '#00B4D8', '--theme-tertiary-accent': '#90E0EF', '--theme-highlight-accent': '#CAF0F8', '--theme-light-bg': '#E0FBFC', '--theme-card-bg': '#FFFFFF', '--theme-text-on-dark': '#CAF0F8', '--theme-page-bg': '#ADE8F4' } },
        volcanoRush: { name: "Volcano Rush", cost: 1, cssVariables: { '--theme-primary-dark': '#2B0000', '--theme-primary-accent': '#6A0000', '--theme-secondary-accent': '#FF4500', '--theme-tertiary-accent': '#FF8C00', '--theme-highlight-accent': '#AE2012', '--theme-light-bg': '#FFF2E6', '--theme-card-bg': '#FFFFFF', '--theme-text-on-dark': '#FFDAB9', '--theme-page-bg': '#FFCDB2' } },
        techOrangeBlue: { name: "Tech Orange & Blue", cost: 1, cssVariables: { '--theme-primary-dark': '#004C97', '--theme-primary-accent': '#4A7DB5', '--theme-secondary-accent': '#FF6600', '--theme-tertiary-accent': '#C0C0C0', '--theme-highlight-accent': '#FF7700', '--theme-light-bg': '#F0F0F0', '--theme-card-bg': '#FFFFFF', '--theme-text-on-dark': '#F0F0F0', '--theme-page-bg': '#E8E8E8' } },
        forestGreens: { name: "Forest Greens", cost: 1, cssVariables: { '--theme-primary-dark': '#1A2B12', '--theme-primary-accent': '#335128', '--theme-secondary-accent': '#526F35', '--theme-tertiary-accent': '#8A9A5B', '--theme-highlight-accent': '#E0E7A3', '--theme-light-bg': '#F0F5E0', '--theme-card-bg': '#FFFFFF', '--theme-text-on-dark': '#E0E7A3', '--theme-page-bg': '#D8E0C0' } }
    };

    // =================================================================================
    // SECTION: HELPER FUNCTIONS
    // =================================================================================
    function formatTime(totalSeconds) { /* ... (Keep as is) ... */ }
    function formatTimerDisplay(totalSeconds) { /* ... (Keep as is) ... */ }
    function parseMMSS(timeString) { /* ... (Keep as is) ... */ }
    function showToast(message, duration = 2500) { /* ... (Keep as is) ... */ }
    function triggerPointsFlash() { /* ... (Keep as is) ... */ }
    function addPoints(amount, reason = "") { /* ... (Keep as is) ... */ }
    function getCurrentDateString(date = new Date()) { /* ... (Keep as is) ... */ }

    // =================================================================================
    // SECTION: PARTICLE SYSTEM
    // =================================================================================
    function initializeParticleCanvas() { /* ... (Keep as is) ... */ }
    function createGenericParticle(x, y, options) { /* ... (Keep as is) ... */ }
    function updateAndDrawParticles() { /* ... (Keep as is) ... */ }
    function triggerCigarettePuff() { /* ... (Keep as is - border emission) ... */ }
    function startVapeParticleStream() { /* ... (Keep as is - border emission with shadow) ... */ }
    function stopVapeParticleStream() { /* ... (Keep as is) ... */ }

    // =================================================================================
    // SECTION: LOCAL STORAGE & STATE MANAGEMENT
    // =================================================================================
    function loadState() { /* ... (Keep as is) ... */ }
    function saveState() { /* ... (Keep as is) ... */ }

    // =================================================================================
    // SECTION: THEME APPLICATION
    // =================================================================================
    function applyThemeOnPage(themeId) { /* ... (Keep as is) ... */ }

    // =================================================================================
    // SECTION: CORE SMOKE TRACKER LOGIC
    // =================================================================================
    function checkDateAndResetCounts() { /* ... (Keep as is) ... */ }
    function logCigaretteEvent() { /* ... (Keep as is) ... */ }
    function startVapeTimer() { /* ... (Keep as is) ... */ }
    function stopVapeTimer(autoStopped = false) { /* ... (Keep as is) ... */ }
    function checkAndWarnLimits() { /* ... (Keep as is) ... */ }

    // =================================================================================
    // SECTION: UI UPDATE FUNCTIONS
    // =================================================================================
    function updateHeaderDisplays() { /* ... (Keep as is) ... */ }
    function updateStatusDisplay() { /* ... (Keep as is) ... */ }

    // --- renderSmokeLog ---
    // THIS IS THE FUNCTION MOST LIKELY CAUSING THE SYNTAX ERROR
    // We will use the version that builds DOM elements programmatically for maximum safety.
    function renderSmokeLog(limit = 10) {
        if (!smokeLogList) { console.error("renderSmokeLog: smokeLogList element not found!"); return; }
        smokeLogList.innerHTML = ''; // Clear existing items

        const logsToDisplay = smokeLog.slice(0, limit);

        if (smokeLog.length === 0) {
            if (noLogsPlaceholder) { noLogsPlaceholder.style.display = 'block'; }
            if (viewAllLogsButton) { viewAllLogsButton.style.display = 'none'; }
            return;
        } else {
            if (noLogsPlaceholder) { noLogsPlaceholder.style.display = 'none'; }
        }

        if (logsToDisplay.length === 0 && smokeLog.length > 0) {
            // This case should ideally not happen if limit > 0 and smokeLog has items.
            // If it does, it might mean an issue with the limit logic or data.
             console.log("renderSmokeLog: logsToDisplay is empty but smokeLog has items. Limit:", limit);
        }

        logsToDisplay.forEach(log => {
            try { // Add a try-catch block around each item's rendering
                const listItem = document.createElement('li');
                listItem.className = 'moment-card';
                listItem.style.cssText = 'opacity:1; animation:none; padding:8px; margin-bottom:8px;';

                const logTime = new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const logDate = new Date(log.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric'});

                let iconClass = '', iconColor = '', textContentForLog = '', detailsContent = '';
                let reasonIconBaseClass = 'add-reason-icon';
                let reasonIconExtraClass = log.reason ? 'fas fa-comment-dots has-reason' : 'far fa-comment-dots';

                if (log.type === 'cigarette') {
                    iconClass = 'fas fa-smoking'; iconColor = 'var(--theme-highlight-accent)'; textContentForLog = 'Cigarette';
                } else if (log.type === 'vape') {
                    iconClass = 'fas fa-vial'; iconColor = 'var(--theme-primary-accent)'; textContentForLog = 'Vape Session';
                    detailsContent = log.duration ? `(${formatTime(log.duration)})` : '';
                } else {
                    console.warn("renderSmokeLog: Unknown log type - ", log); // Catch unknown types
                    textContentForLog = "Unknown Log";
                }

                // Build elements programmatically
                const contentDiv = document.createElement('div');
                contentDiv.className = 'log-item-content';

                const detailsDiv = document.createElement('div');
                detailsDiv.className = 'log-item-details';

                const itemIcon = document.createElement('i');
                itemIcon.className = iconClass; // iconClass should always be defined or default
                if (iconColor) itemIcon.style.color = iconColor;
                itemIcon.style.marginRight = '8px';
                itemIcon.style.fontSize = '18px';
                detailsDiv.appendChild(itemIcon);

                const textSpan = document.createElement('span');
                textSpan.textContent = `${textContentForLog} ${detailsContent}`;
                detailsDiv.appendChild(textSpan);
                contentDiv.appendChild(detailsDiv);

                const reasonContainerDiv = document.createElement('div');
                reasonContainerDiv.className = 'log-item-reason-icon-container';

                const timeSpan = document.createElement('span');
                timeSpan.className = 'log-item-time';
                timeSpan.textContent = `${logDate} @ ${logTime}`;
                reasonContainerDiv.appendChild(timeSpan);

                const reasonIcon = document.createElement('i');
                reasonIcon.className = `${reasonIconBaseClass} ${reasonIconExtraClass}`;
                const reasonTitleText = log.reason ? 'Edit Reason: ' + String(log.reason).substring(0,20) + (String(log.reason).length > 20 ? '...' : '') : 'Add Reason';
                reasonIcon.setAttribute('title', reasonTitleText);
                reasonIcon.setAttribute('data-timestamp', String(log.timestamp));
                reasonContainerDiv.appendChild(reasonIcon);

                contentDiv.appendChild(reasonContainerDiv);
                listItem.appendChild(contentDiv);

                if(log.reason){
                    const reasonDisplayDiv = document.createElement('div');
                    reasonDisplayDiv.style.fontSize = '12px';
                    reasonDisplayDiv.style.paddingLeft = '28px'; // Align with icon
                    reasonDisplayDiv.style.color = '#666'; // Or use a theme variable
                    reasonDisplayDiv.innerHTML = `<em>Reason: ${String(log.reason)}</em>`; // Use innerHTML for em if needed, or textContent
                    listItem.appendChild(reasonDisplayDiv);
                }

                smokeLogList.appendChild(listItem);
            } catch (error) {
                console.error("Error rendering a single log item:", error, "Log data:", log);
                // Optionally, append an error message to the list for this item
                const errorLi = document.createElement('li');
                errorLi.textContent = "Error displaying this log entry.";
                errorLi.style.color = "red";
                smokeLogList.appendChild(errorLi);
            }
        });

        if (viewAllLogsButton) {
            viewAllLogsButton.style.display = smokeLog.length > limit ? 'block' : 'none';
        }
    }


    // =================================================================================
    // SECTION: REASON MODAL LOGIC
    // =================================================================================
    function handleOpenReasonModal(timestamp) { /* ... (Keep as is) ... */ }
    function handleCloseReasonModal() { /* ... (Keep as is) ... */ }
    function handleSaveReason() { /* ... (Keep as is) ... */ }

    // =================================================================================
    // SECTION: JOURNAL MODAL LOGIC
    // =================================================================================
    function openJournalModal() { /* ... (Keep as is) ... */ }
    function closeJournalModal() { /* ... (Keep as is) ... */ }
    function renderJournalCalendar(year, month) { /* ... (Keep as is) ... */ }
    function handleJournalMonthChange(offset) { /* ... (Keep as is) ... */ }
    function displayLogsForDayInJournal(dateString, logsForDay) { /* ... (Keep as is) ... */ }


    // =================================================================================
    // SECTION: EVENT LISTENERS
    // =================================================================================
    // IMPORTANT: Ensure these are only added once and to valid elements.
    // If any selector is null, an error will occur here.
    try {
        if (logCigaretteButton) { logCigaretteButton.addEventListener('click', logCigaretteEvent); }
        if (startVapeTimerButton) { startVapeTimerButton.addEventListener('click', startVapeTimer); }
        if (stopVapeTimerButton) { stopVapeTimerButton.addEventListener('click', () => { stopVapeTimer(false); }); }

        if (saveLimitButton && setLimitInput) { saveLimitButton.addEventListener('click', () => { const newLimit = parseInt(setLimitInput.value); if (!isNaN(newLimit) && newLimit >= 0) { dailyCigaretteLimit = newLimit; updateStatusDisplay(); checkAndWarnLimits(); saveState(); showToast(`Cigarette limit set to ${dailyCigaretteLimit}.`); } else { showToast("Invalid limit value."); setLimitInput.value = dailyCigaretteLimit; } }); }
        if (saveVapeSessionLimitButton && setVapeSessionLimitInput) { saveVapeSessionLimitButton.addEventListener('click', () => { const parsedSeconds = parseMMSS(setVapeSessionLimitInput.value); if (parsedSeconds !== null && parsedSeconds >= 0) { vapeSessionDurationLimit = parsedSeconds; saveState(); showToast(`Vape session limit set to ${formatTimerDisplay(vapeSessionDurationLimit)} ${parsedSeconds === 0 ? '(Count Up)' : ''}.`); setVapeSessionLimitInput.value = formatTimerDisplay(vapeSessionDurationLimit); } else { showToast("Invalid session limit format (MM:SS)."); setVapeSessionLimitInput.value = formatTimerDisplay(vapeSessionDurationLimit); } }); }
        if (saveDailyVapeTimeLimitButton && setDailyVapeTimeLimitInput) { saveDailyVapeTimeLimitButton.addEventListener('click', () => { const newLimitMinutes = parseInt(setDailyVapeTimeLimitInput.value); if (!isNaN(newLimitMinutes) && newLimitMinutes >= 0) { dailyTotalVapeTimeLimit = newLimitMinutes * 60; updateStatusDisplay(); checkAndWarnLimits(); saveState(); showToast(`Daily vape time limit set to ${newLimitMinutes} minutes.`); } else { showToast("Invalid limit value (minutes)."); setDailyVapeTimeLimitInput.value = Math.floor(dailyTotalVapeTimeLimit / 60); } }); }

        if (smokeLogList) { smokeLogList.addEventListener('click', (event) => { if (event.target.classList.contains('add-reason-icon')) { const timestamp = parseInt(event.target.dataset.timestamp); if (!isNaN(timestamp)) { handleOpenReasonModal(timestamp); } } }); }
        if (saveReasonButton) { saveReasonButton.addEventListener('click', handleSaveReason); }
        if (cancelReasonButton) { cancelReasonButton.addEventListener('click', handleCloseReasonModal); }
        if (reasonModalOverlay) { reasonModalOverlay.addEventListener('click', (event) => { if (event.target === reasonModalOverlay) { handleCloseReasonModal(); } }); }

        if (viewAllLogsButton) { viewAllLogsButton.addEventListener('click', openJournalModal); }
        if (journalCloseButton) { journalCloseButton.addEventListener('click', closeJournalModal); }
        if (journalPrevMonthButton) { journalPrevMonthButton.addEventListener('click', () => handleJournalMonthChange(-1)); }
        if (journalNextMonthButton) { journalNextMonthButton.addEventListener('click', () => handleJournalMonthChange(1)); }
        if (journalModalOverlay) { journalModalOverlay.addEventListener('click', (event) => { if (event.target === journalModalOverlay) { closeJournalModal(); } }); }
    } catch (e) {
        console.error("Error attaching event listeners:", e);
    }


    // =================================================================================
    // SECTION: INITIAL SETUP
    // =================================================================================
    try {
        loadState();
        initializeParticleCanvas();
        applyThemeOnPage(currentTheme);
        checkDateAndResetCounts();
        updateHeaderDisplays();
        updateStatusDisplay();
        renderSmokeLog(); // Initial render
    } catch (e) {
        console.error("Error during initial setup:", e);
        // Display a user-friendly message on the page itself if setup fails catastrophically
        const body = document.querySelector('body');
        if (body) {
            body.innerHTML = '<div style="color:red; font-size:20px; padding:20px; text-align:center; font-family: monospace;">CRITICAL ERROR DURING PAGE SETUP. Please check the console (F12).</div>';
        }
    }

    console.log("Smoke Tracker Initialized (v8.1 - Debugging Render).");
    console.log("Initial smokeLog data:", JSON.parse(JSON.stringify(smokeLog))); // Log a copy
    console.log("Initial Theme:", currentTheme);

}); // End DOMContentLoaded
