// smoke-tracker-script.js

document.addEventListener('DOMContentLoaded', () => {
    // =================================================================================
    // SECTION: CONSTANTS & STATE VARIABLES
    // =================================================================================
    const localStorageKeySuffix = '_v27_theme_shop';

    // --- Element Selectors ---
    // General UI & Header
    const particleCanvas = document.getElementById('particleCanvas');
    // ... (other general selectors)
    const userPointsDisplay = document.getElementById('userPoints');
    const smokeFreeStreakDisplay = document.getElementById('smokeFreeStreak');
    const streakDisplay = document.getElementById('streakDisplay');
    const healthMilestonesDisplay = document.getElementById('healthMilestones');
    const shopUserPointsDisplay = document.getElementById('shopUserPoints');
    const toastNotification = document.getElementById('toastNotification');

    // Smoking/Vaping Elements
    const logCigaretteButton = document.getElementById('logCigaretteButton');
    // ... (other smoking/vaping selectors)
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

    // Log List Elements
    const smokeLogList = document.getElementById('smokeLogList');
    const noLogsPlaceholder = document.getElementById('noLogsPlaceholder');
    const viewAllLogsButton = document.getElementById('viewAllLogsButton'); // NEW

    // Reason Modal Elements
    const reasonModalOverlay = document.getElementById('reasonModalOverlay');
    // ... (other modal selectors)
    const reasonInput = document.getElementById('reasonInput');
    const reasonLogTimestampInput = document.getElementById('reasonLogTimestamp');
    const saveReasonButton = document.getElementById('saveReasonButton');
    const cancelReasonButton = document.getElementById('cancelReasonButton');

    // --- NEW: Journal Modal Selectors ---
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
    // ... (General App State, Smoking & Vaping State, Timer Runtime State, Theme State - same as previous) ...
    let userPoints = 0; smokeFreeStreak = 0; healthMilestones = 0;
    let dailyCigaretteLimit = 5; vapeSessionDurationLimit = 30; dailyTotalVapeTimeLimit = 300;
    let smokeLog = []; lastLogDate = ''; todayCigaretteCount = 0; todayTotalVapeTime = 0; lastDayStreakIncremented = '';
    let isVapeTimerRunning = false; vapeTimerStartTime = null; vapeTimerIntervalId = null;
    let vapeTimerTargetEndTime = null; vapeTimerMode = 'up';
    let ownedThemes = ['default']; currentTheme = 'default';
    let particleCtx = null; particles = []; isAnimatingParticles = false; vapeParticleIntervalId = null;

    // --- NEW: Journal State ---
    let journalCurrentDate = new Date(); // For calendar navigation

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
    function getCurrentDateString(date = new Date()) { // Modified to accept a date
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }

    // =================================================================================
    // SECTION: PARTICLE SYSTEM
    // =================================================================================
    function initializeParticleCanvas() { /* ... */ }
    function createGenericParticle(x, y, options) { /* ... */ }
    function updateAndDrawParticles() { /* ... */ }
    function triggerCigarettePuff() { /* ... (border emission) ... */ }
    function startVapeParticleStream() { /* ... (border emission with shadow) ... */ }
    function stopVapeParticleStream() { /* ... */ }

    // =================================================================================
    // SECTION: LOCAL STORAGE & STATE MANAGEMENT
    // =================================================================================
    function loadState() { /* ... Same as previous, ensure all relevant state is loaded ... */ }
    function saveState() { /* ... Same as previous, ensure all relevant state is saved ... */ }

    // =================================================================================
    // SECTION: THEME APPLICATION
    // =================================================================================
    function applyThemeOnPage(themeId) { /* ... Same as previous ... */ }

    // =================================================================================
    // SECTION: CORE SMOKE TRACKER LOGIC
    // =================================================================================
    function checkDateAndResetCounts() { /* ... Same as previous ... */ }
    function logCigaretteEvent() { /* ... Same, calls triggerCigarettePuff ... */ }
    function startVapeTimer() { /* ... Same, calls startVapeParticleStream ... */ }
    function stopVapeTimer(autoStopped = false) { /* ... Same, calls stopVapeParticleStream ... */ }
    function checkAndWarnLimits() { /* ... Same as previous ... */ }

    // =================================================================================
    // SECTION: UI UPDATE FUNCTIONS
    // =================================================================================
    function updateHeaderDisplays() { /* ... Same as previous ... */ }
    function updateStatusDisplay() { /* ... Same as previous ... */ }

    function renderSmokeLog(limit = 10) { // MODIFIED: Added limit parameter
        if (!smokeLogList) { return; }
        smokeLogList.innerHTML = '';
        const logsToRender = smokeLog.slice(0, limit); // Use limit

        if (smokeLog.length === 0) { // Check total log length for placeholder
            if (noLogsPlaceholder) { noLogsPlaceholder.style.display = 'block'; }
            if (viewAllLogsButton) { viewAllLogsButton.style.display = 'none';} // Hide View All if no logs
            return;
        } else {
            if (noLogsPlaceholder) { noLogsPlaceholder.style.display = 'none'; }
        }

        logsToRender.forEach(log => {
            const listItem = document.createElement('li');
            // ... (listItem creation logic same as before, including reason icon)
            listItem.className = 'moment-card'; listItem.style.cssText = 'opacity:1; animation:none; padding:8px; margin-bottom:8px;';
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

        // Show/hide "View All Logs" button
        if (viewAllLogsButton) {
            viewAllLogsButton.style.display = smokeLog.length > limit ? 'block' : 'none';
        }
    }

    // =================================================================================
    // SECTION: REASON MODAL LOGIC
    // =================================================================================
    function handleOpenReasonModal(timestamp) { /* ... Same as previous ... */ }
    function handleCloseReasonModal() { /* ... Same as previous ... */ }
    function handleSaveReason() { /* ... Same as previous ... */ }

    // =================================================================================
    // SECTION: JOURNAL MODAL LOGIC (NEW)
    // =================================================================================
    function openJournalModal() {
        if (!journalModalOverlay) return;
        journalCurrentDate = new Date(); // Reset to current month on open
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

        const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0=Sun, 1=Mon...
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        let date = 1;
        for (let i = 0; i < 6; i++) { // Max 6 rows for a month
            const row = document.createElement('tr');
            for (let j = 0; j < 7; j++) { // 7 days a week
                const cell = document.createElement('td');
                cell.classList.add('calendar-day-cell');

                if (i === 0 && j < firstDayOfMonth) {
                    // Empty cell before the first day of the month
                    cell.classList.add('other-month');
                } else if (date > daysInMonth) {
                    // Empty cell after the last day of the month
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
                        cell.dataset.date = currentDateString; // Store date for click handling

                        let dayCigCount = 0;
                        let dayVapeTime = 0;
                        logsForThisDay.forEach(log => {
                            if (log.type === 'cigarette') dayCigCount++;
                            if (log.type === 'vape' && log.duration) dayVapeTime += log.duration;
                        });

                        const iconSpan = document.createElement('span');
                        iconSpan.className = 'day-log-icon fas'; // Base Font Awesome class

                        if (dayCigCount > dailyCigaretteLimit || dayVapeTime > dailyTotalVapeTimeLimit) {
                            iconSpan.classList.add('fa-arrow-alt-circle-up', 'exceeded'); // Red Up Arrow
                        } else if (dayCigCount < dailyCigaretteLimit && dayVapeTime < dailyTotalVapeTimeLimit) {
                            iconSpan.classList.add('fa-arrow-alt-circle-down', 'under-limit'); // Green Down Arrow
                        } else {
                            iconSpan.classList.add('fa-minus-circle', 'met-limit'); // Yellow Minus Circle (Met or mixed)
                        }
                        cell.appendChild(iconSpan);

                        cell.addEventListener('click', () => {
                            displayLogsForDayInJournal(currentDateString, logsForThisDay);
                        });
                    } else {
                        // Optional: Add a subtle marker for no logs if desired, or leave blank
                        // cell.innerHTML += '<span class="day-log-icon" style="color:#ccc;">–</span>';
                    }
                    date++;
                }
                row.appendChild(cell);
            }
            journalCalendarBody.appendChild(row);
            if (date > daysInMonth && i >= (Math.ceil((firstDayOfMonth + daysInMonth) / 7) -1) ) break; // Stop if all days rendered
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

        const displayDate = new Date(dateString + 'T00:00:00'); // Ensure correct date parsing for display
        journalSelectedDayHeader.textContent = `Logs for: ${displayDate.toLocaleDateString('default', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`;
        journalDailyLogList.innerHTML = '';

        if (logsForDay.length === 0) {
            journalNoLogsForDay.style.display = 'block';
            return;
        }
        journalNoLogsForDay.style.display = 'none';

        logsForDay.sort((a, b) => b.timestamp - a.timestamp); // Show newest first for the day

        logsForDay.forEach(log => {
            const listItem = document.createElement('li');
            listItem.className = 'moment-card'; // Reuse existing styling
            listItem.style.cssText = 'opacity:1; animation:none; padding:8px; margin-bottom:8px;';

            const logTime = new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            // Date already known from header
            let iconClass = '', iconColor = '', text = '', details = '';
            let reasonIconBaseClass = 'add-reason-icon';
            let reasonIconExtraClass = log.reason ? 'fas fa-comment-dots has-reason' : 'far fa-comment-dots';

            if (log.type === 'cigarette') { iconClass = 'fas fa-smoking'; iconColor = 'var(--theme-highlight-accent)'; text = 'Cigarette'; }
            else if (log.type === 'vape') { iconClass = 'fas fa-vial'; iconColor = 'var(--theme-primary-accent)'; text = 'Vape Session'; details = log.duration ? `(${formatTime(log.duration)})` : ''; }

            listItem.innerHTML = `
                <div class="log-item-content">
                    <div class="log-item-details">
                        <i class="${iconClass}" style="color: ${iconColor}; margin-right: 8px; font-size: 18px;"></i>
                        <span>${text} ${details} at ${logTime}</span>
                    </div>
                    <div class="log-item-reason-icon-container">
                         <i class="${reasonIconBaseClass} ${reasonIconExtraClass}" data-timestamp="${log.timestamp}" title="${log.reason ? 'Edit Reason (' + log.reason.substring(0,15) + '...)' : 'Add Reason'}"></i>
                    </div>
                </div>
                ${log.reason ? `<div style="font-size:12px; padding-left: 28px; color: #666;"><em>Reason: ${log.reason}</em></div>` : ''}`;

            const reasonIconElement = listItem.querySelector('.add-reason-icon');
            if (reasonIconElement) {
                reasonIconElement.addEventListener('click', (e) => { // Add listener here
                    e.stopPropagation();
                    handleOpenReasonModal(log.timestamp);
                });
            }
            journalDailyLogList.appendChild(listItem);
        });
    }


    // =================================================================================
    // SECTION: EVENT LISTENERS
    // =================================================================================
    // Log Buttons
    if (logCigaretteButton) { logCigaretteButton.addEventListener('click', logCigaretteEvent); }
    // ... (other log and limit button listeners same as before) ...
    if (startVapeTimerButton) { startVapeTimerButton.addEventListener('click', startVapeTimer); }
    if (stopVapeTimerButton) { stopVapeTimerButton.addEventListener('click', () => { stopVapeTimer(false); }); }
    if (saveLimitButton && setLimitInput) { /* ... */ }
    if (saveVapeSessionLimitButton && setVapeSessionLimitInput) { /* ... */ }
    if (saveDailyVapeTimeLimitButton && setDailyVapeTimeLimitInput) { /* ... */ }


    // Reason Modal Listeners
    if (smokeLogList) { // For main log list
        smokeLogList.addEventListener('click', (event) => {
            if (event.target.classList.contains('add-reason-icon')) {
                const timestamp = parseInt(event.target.dataset.timestamp);
                if (!isNaN(timestamp)) { handleOpenReasonModal(timestamp); }
            }
        });
    }
    // Note: Reason icon listeners for journal logs are added dynamically in displayLogsForDayInJournal
    if (saveReasonButton) { saveReasonButton.addEventListener('click', handleSaveReason); }
    if (cancelReasonButton) { cancelReasonButton.addEventListener('click', handleCloseReasonModal); }
    if (reasonModalOverlay) {
        reasonModalOverlay.addEventListener('click', (event) => {
            if (event.target === reasonModalOverlay) { handleCloseReasonModal(); }
        });
    }

    // --- NEW: Journal Modal Event Listeners ---
    if (viewAllLogsButton) { viewAllLogsButton.addEventListener('click', openJournalModal); }
    if (journalCloseButton) { journalCloseButton.addEventListener('click', closeJournalModal); }
    if (journalPrevMonthButton) { journalPrevMonthButton.addEventListener('click', () => handleJournalMonthChange(-1)); }
    if (journalNextMonthButton) { journalNextMonthButton.addEventListener('click', () => handleJournalMonthChange(1)); }
    if (journalModalOverlay) { // Close on overlay click
        journalModalOverlay.addEventListener('click', (event) => {
            if (event.target === journalModalOverlay) { closeJournalModal(); }
        });
    }


    // =================================================================================
    // SECTION: INITIAL SETUP
    // =================================================================================
    loadState();
    initializeParticleCanvas(); // Keep particle canvas for existing effects
    applyThemeOnPage(currentTheme);
    checkDateAndResetCounts();
    updateHeaderDisplays();
    updateStatusDisplay();
    renderSmokeLog(); // Initial render of recent logs (default 10)

    console.log("Smoke Tracker Initialized (v8 - Journal Modal).");
}); // End DOMContentLoaded
