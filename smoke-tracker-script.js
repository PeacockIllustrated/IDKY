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
    let smokeLog = [], lastLogDate = '', todayCigaretteCount = 0, todayTotalVapeTime = 0, lastDayStreakIncremented = '';
    let isVapeTimerRunning = false, vapeTimerStartTime = null, vapeTimerIntervalId = null;
    let vapeTimerTargetEndTime = null, vapeTimerMode = 'up';
    let ownedThemes = ['default'], currentTheme = 'default';
    let particleCtx = null, particles = [], isAnimatingParticles = false, vapeParticleIntervalId = null;
    let journalCurrentDate = new Date();

    // =================================================================================
    // SECTION: THEME DATA OBJECT
    // =================================================================================
    const themes = { /* ... (Full themes object as before) ... */ };

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

    // --- renderSmokeLog (Uses robust DOM creation) ---
    function renderSmokeLog(limit = 10) {
        if (!smokeLogList) { console.error("renderSmokeLog: smokeLogList element not found!"); return; }
        smokeLogList.innerHTML = '';
        const logsToDisplay = smokeLog.slice(0, limit);

        if (smokeLog.length === 0) {
            if (noLogsPlaceholder) { noLogsPlaceholder.style.display = 'block'; }
            if (viewAllLogsButton) { viewAllLogsButton.style.display = 'none'; }
            return;
        } else {
            if (noLogsPlaceholder) { noLogsPlaceholder.style.display = 'none'; }
        }

        logsToDisplay.forEach(log => {
            try {
                const listItem = document.createElement('li');
                listItem.className = 'moment-card';
                listItem.style.cssText = 'opacity:1; animation:none; padding:8px; margin-bottom:8px;';
                const logTime = new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const logDate = new Date(log.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric'});
                let iconClass = '', iconColor = '', textContentForLog = '', detailsContent = '';
                let reasonIconBaseClass = 'add-reason-icon';
                let reasonIconExtraClass = log.reason ? 'fas fa-comment-dots has-reason' : 'far fa-comment-dots';

                if (log.type === 'cigarette') { iconClass = 'fas fa-smoking'; iconColor = 'var(--theme-highlight-accent)'; textContentForLog = 'Cigarette';
                } else if (log.type === 'vape') { iconClass = 'fas fa-vial'; iconColor = 'var(--theme-primary-accent)'; textContentForLog = 'Vape Session'; detailsContent = log.duration ? `(${formatTime(log.duration)})` : '';
                } else { textContentForLog = "Unknown Log"; }

                const contentDiv = document.createElement('div'); contentDiv.className = 'log-item-content';
                const detailsDiv = document.createElement('div'); detailsDiv.className = 'log-item-details';
                const itemIcon = document.createElement('i'); itemIcon.className = iconClass; if (iconColor) itemIcon.style.color = iconColor; itemIcon.style.marginRight = '8px'; itemIcon.style.fontSize = '18px'; detailsDiv.appendChild(itemIcon);
                const textSpan = document.createElement('span'); textSpan.textContent = `${textContentForLog} ${detailsContent}`; detailsDiv.appendChild(textSpan); contentDiv.appendChild(detailsDiv);
                const reasonContainerDiv = document.createElement('div'); reasonContainerDiv.className = 'log-item-reason-icon-container';
                const timeSpan = document.createElement('span'); timeSpan.className = 'log-item-time'; timeSpan.textContent = `${logDate} @ ${logTime}`; reasonContainerDiv.appendChild(timeSpan);
                const reasonIcon = document.createElement('i'); reasonIcon.className = `${reasonIconBaseClass} ${reasonIconExtraClass}`; const reasonTitleText = log.reason ? 'Edit Reason: ' + String(log.reason).substring(0,20) + (String(log.reason).length > 20 ? '...' : '') : 'Add Reason'; reasonIcon.setAttribute('title', reasonTitleText); reasonIcon.setAttribute('data-timestamp', String(log.timestamp)); reasonContainerDiv.appendChild(reasonIcon);
                contentDiv.appendChild(reasonContainerDiv); listItem.appendChild(contentDiv);
                if(log.reason){ const reasonDisplayDiv = document.createElement('div'); reasonDisplayDiv.style.fontSize = '12px'; reasonDisplayDiv.style.paddingLeft = '28px'; reasonDisplayDiv.style.color = '#666'; reasonDisplayDiv.innerHTML = `<em>Reason: ${String(log.reason)}</em>`; listItem.appendChild(reasonDisplayDiv); }
                smokeLogList.appendChild(listItem);
            } catch (error) { console.error("Error rendering a single log item:", error, "Log data:", log); }
        });
        if (viewAllLogsButton) { viewAllLogsButton.style.display = smokeLog.length > limit ? 'block' : 'none'; }
    }

    // =================================================================================
    // SECTION: REASON MODAL LOGIC
    // =================================================================================
    function handleOpenReasonModal(timestamp) { /* ... (Keep as is) ... */ }
    function handleCloseReasonModal() { /* ... (Keep as is) ... */ }
    function handleSaveReason() { /* ... (Keep as is) ... */ }

    // =================================================================================
    // SECTION: JOURNAL MODAL LOGIC (Refactored for Robust DOM Creation)
    // =================================================================================
    function openJournalModal() {
        if (!journalModalOverlay) return;
        journalCurrentDate = new Date();
        renderJournalCalendar(journalCurrentDate.getFullYear(), journalCurrentDate.getMonth());
        if(journalSelectedDayHeader) journalSelectedDayHeader.textContent = 'Select a day to view logs.';
        if(journalDailyLogList) journalDailyLogList.innerHTML = '';
        if(journalNoLogsForDay) journalNoLogsForDay.style.display = 'none';
        journalModalOverlay.classList.add('show');
    }

    function closeJournalModal() {
        if (journalModalOverlay) journalModalOverlay.classList.remove('show');
    }

    function renderJournalCalendar(year, month) {
        if (!journalCalendarBody || !journalMonthYearDisplay) return;
        journalCalendarBody.innerHTML = '';
        journalMonthYearDisplay.textContent = `${new Date(year, month).toLocaleString('default', { month: 'long' })} ${year}`;
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        let date = 1;

        for (let i = 0; i < 6; i++) {
            const row = document.createElement('tr');
            for (let j = 0; j < 7; j++) {
                const cell = document.createElement('td');
                cell.classList.add('calendar-day-cell');
                if (i === 0 && j < firstDayOfMonth || date > daysInMonth) {
                    cell.classList.add('other-month');
                } else {
                    const dayNumberSpan = document.createElement('span');
                    dayNumberSpan.className = 'day-number';
                    dayNumberSpan.textContent = date;
                    cell.appendChild(dayNumberSpan);

                    const currentDateString = getCurrentDateString(new Date(year, month, date));
                    const logsForThisDay = smokeLog.filter(log => getCurrentDateString(new Date(log.timestamp)) === currentDateString);

                    if (logsForThisDay.length > 0) {
                        cell.classList.add('has-logs');
                        cell.dataset.date = currentDateString;
                        let dayCigCount = 0, dayVapeTime = 0;
                        logsForThisDay.forEach(log => {
                            if (log.type === 'cigarette') dayCigCount++;
                            if (log.type === 'vape' && log.duration) dayVapeTime += log.duration;
                        });
                        const iconSpan = document.createElement('span');
                        iconSpan.className = 'day-log-icon fas';
                        if (dayCigCount > dailyCigaretteLimit || dayVapeTime > dailyTotalVapeTimeLimit) {
                            iconSpan.classList.add('fa-arrow-alt-circle-up', 'exceeded');
                        } else if (dayCigCount < dailyCigaretteLimit && dayVapeTime < dailyTotalVapeTimeLimit) {
                            iconSpan.classList.add('fa-arrow-alt-circle-down', 'under-limit');
                        } else { iconSpan.classList.add('fa-minus-circle', 'met-limit'); }
                        cell.appendChild(iconSpan);
                        cell.addEventListener('click', () => { displayLogsForDayInJournal(currentDateString, logsForThisDay); });
                    }
                    date++;
                }
                row.appendChild(cell);
            }
            journalCalendarBody.appendChild(row);
            if (date > daysInMonth && i >= (Math.ceil((firstDayOfMonth + daysInMonth) / 7) -1) ) break;
        }
    }

    function handleJournalMonthChange(offset) {
        journalCurrentDate.setMonth(journalCurrentDate.getMonth() + offset);
        renderJournalCalendar(journalCurrentDate.getFullYear(), journalCurrentDate.getMonth());
        if(journalSelectedDayHeader) journalSelectedDayHeader.textContent = 'Select a day to view logs.';
        if(journalDailyLogList) journalDailyLogList.innerHTML = '';
        if(journalNoLogsForDay) journalNoLogsForDay.style.display = 'none';
    }

    function displayLogsForDayInJournal(dateString, logsForDay) {
        if (!journalDailyLogList || !journalSelectedDayHeader || !journalNoLogsForDay) return;
        const displayDate = new Date(dateString + 'T00:00:00');
        journalSelectedDayHeader.textContent = `Logs for: ${displayDate.toLocaleDateString('default', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`;
        journalDailyLogList.innerHTML = '';

        if (logsForDay.length === 0) { journalNoLogsForDay.style.display = 'block'; return; }
        journalNoLogsForDay.style.display = 'none';
        logsForDay.sort((a, b) => b.timestamp - a.timestamp);

        logsForDay.forEach(log => {
            // Using the same robust DOM creation as renderSmokeLog
            const listItem = document.createElement('li');
            listItem.className = 'moment-card';
            listItem.style.cssText = 'opacity:1; animation:none; padding:8px; margin-bottom:8px;';
            const logTime = new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            let iconClass = '', iconColor = '', textContentForLog = '', detailsContent = '';
            let reasonIconBaseClass = 'add-reason-icon';
            let reasonIconExtraClass = log.reason ? 'fas fa-comment-dots has-reason' : 'far fa-comment-dots';

            if (log.type === 'cigarette') { iconClass = 'fas fa-smoking'; iconColor = 'var(--theme-highlight-accent)'; textContentForLog = 'Cigarette';
            } else if (log.type === 'vape') { iconClass = 'fas fa-vial'; iconColor = 'var(--theme-primary-accent)'; textContentForLog = 'Vape Session'; detailsContent = log.duration ? `(${formatTime(log.duration)})` : '';
            } else { textContentForLog = "Unknown Log"; }

            const contentDiv = document.createElement('div'); contentDiv.className = 'log-item-content';
            const detailsDiv = document.createElement('div'); detailsDiv.className = 'log-item-details';
            const itemIcon = document.createElement('i'); itemIcon.className = iconClass; if (iconColor) itemIcon.style.color = iconColor; itemIcon.style.marginRight = '8px'; itemIcon.style.fontSize = '18px'; detailsDiv.appendChild(itemIcon);
            const textSpan = document.createElement('span'); textSpan.textContent = `${textContentForLog} ${detailsContent} at ${logTime}`; detailsDiv.appendChild(textSpan); contentDiv.appendChild(detailsDiv); // Added time here
            const reasonContainerDiv = document.createElement('div'); reasonContainerDiv.className = 'log-item-reason-icon-container';
            // Removed separate timeSpan here as it's now part of details
            const reasonIcon = document.createElement('i'); reasonIcon.className = `${reasonIconBaseClass} ${reasonIconExtraClass}`; const reasonTitleText = log.reason ? 'Edit Reason: ' + String(log.reason).substring(0,15) + (String(log.reason).length > 15 ? '...' : '') : 'Add Reason'; reasonIcon.setAttribute('title', reasonTitleText); reasonIcon.setAttribute('data-timestamp', String(log.timestamp));
            reasonIcon.addEventListener('click', (e) => { e.stopPropagation(); handleOpenReasonModal(log.timestamp); }); // Add listener directly
            reasonContainerDiv.appendChild(reasonIcon);
            contentDiv.appendChild(reasonContainerDiv); listItem.appendChild(contentDiv);
            if(log.reason){ const reasonDisplayDiv = document.createElement('div'); reasonDisplayDiv.style.fontSize = '12px'; reasonDisplayDiv.style.paddingLeft = '28px'; reasonDisplayDiv.style.color = '#666'; reasonDisplayDiv.innerHTML = `<em>Reason: ${String(log.reason)}</em>`; listItem.appendChild(reasonDisplayDiv); }
            journalDailyLogList.appendChild(listItem);
        });
    }


    // =================================================================================
    // SECTION: EVENT LISTENERS
    // =================================================================================
    try {
        if (logCigaretteButton) { logCigaretteButton.addEventListener('click', logCigaretteEvent); }
        if (startVapeTimerButton) { startVapeTimerButton.addEventListener('click', startVapeTimer); }
        if (stopVapeTimerButton) { stopVapeTimerButton.addEventListener('click', () => { stopVapeTimer(false); }); }
        if (saveLimitButton && setLimitInput) { saveLimitButton.addEventListener('click', () => { const nl=parseInt(setLimitInput.value); if(!isNaN(nl)&&nl>=0){dailyCigaretteLimit=nl;updateStatusDisplay();checkAndWarnLimits();saveState();showToast(`Cigarette limit set to ${dailyCigaretteLimit}.`);}else{showToast("Invalid limit.");setLimitInput.value=dailyCigaretteLimit;}}); }
        if (saveVapeSessionLimitButton && setVapeSessionLimitInput) { saveVapeSessionLimitButton.addEventListener('click', () => {const ps=parseMMSS(setVapeSessionLimitInput.value);if(ps!==null&&ps>=0){vapeSessionDurationLimit=ps;saveState();showToast(`Vape session limit: ${formatTimerDisplay(ps)} ${ps===0?'(Up)':''}.`);setVapeSessionLimitInput.value=formatTimerDisplay(ps);}else{showToast("Invalid format (MM:SS).");setVapeSessionLimitInput.value=formatTimerDisplay(vapeSessionDurationLimit);}}); }
        if (saveDailyVapeTimeLimitButton && setDailyVapeTimeLimitInput) { saveDailyVapeTimeLimitButton.addEventListener('click', () => {const nlm=parseInt(setDailyVapeTimeLimitInput.value);if(!isNaN(nlm)&&nlm>=0){dailyTotalVapeTimeLimit=nlm*60;updateStatusDisplay();checkAndWarnLimits();saveState();showToast(`Daily vape time limit: ${nlm} min.`);}else{showToast("Invalid limit (min).");setDailyVapeTimeLimitInput.value=Math.floor(dailyTotalVapeTimeLimit/60);}}); }
        if (smokeLogList) { smokeLogList.addEventListener('click', (event) => { if (event.target.classList.contains('add-reason-icon')) { const ts=parseInt(event.target.dataset.timestamp); if (!isNaN(ts)) { handleOpenReasonModal(ts); } } }); }
        if (saveReasonButton) { saveReasonButton.addEventListener('click', handleSaveReason); }
        if (cancelReasonButton) { cancelReasonButton.addEventListener('click', handleCloseReasonModal); }
        if (reasonModalOverlay) { reasonModalOverlay.addEventListener('click', (event) => { if (event.target === reasonModalOverlay) { handleCloseReasonModal(); } }); }
        if (viewAllLogsButton) { viewAllLogsButton.addEventListener('click', openJournalModal); }
        if (journalCloseButton) { journalCloseButton.addEventListener('click', closeJournalModal); }
        if (journalPrevMonthButton) { journalPrevMonthButton.addEventListener('click', () => handleJournalMonthChange(-1)); }
        if (journalNextMonthButton) { journalNextMonthButton.addEventListener('click', () => handleJournalMonthChange(1)); }
        if (journalModalOverlay) { journalModalOverlay.addEventListener('click', (event) => { if (event.target === journalModalOverlay) { closeJournalModal(); } }); }
    } catch (e) { console.error("Error attaching event listeners:", e); }


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
        renderSmokeLog();
    } catch (e) {
        console.error("Error during initial setup:", e);
        const body = document.querySelector('body');
        if (body) { body.innerHTML = '<div style="color:red; font-size:20px; padding:20px; text-align:center; font-family: monospace;">CRITICAL ERROR DURING PAGE SETUP. Check console (F12).</div>'; }
    }
    console.log("Smoke Tracker Initialized (v8.2 - Robust Journal Render).");
});
