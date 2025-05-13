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
    const dailyProgressChartContainer = document.getElementById('dailyProgressChartContainer');
    const endOfDayTestButton = document.getElementById('endOfDayTestButton');

    // --- New Calendar Selectors ---
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

    // --- New Calendar State ---
    let calendarCurrentDate = new Date(); // Holds the date for the currently displayed calendar month/year


    // =================================================================================
    // SECTION: THEME DATA OBJECT (Keep existing)
    // =================================================================================
    const themes = { /* ... (keep your existing themes object) ... */
        default: { name: "Default Retro", cost: 0, owned: true, cssVariables: { '--theme-primary-dark': '#264653', '--theme-primary-accent': '#2A9D8F', '--theme-secondary-accent': '#E9C46A', '--theme-tertiary-accent': '#F4A261', '--theme-highlight-accent': '#E76F51', '--theme-light-bg': '#EAEAEA', '--theme-card-bg': '#FFFFFF', '--theme-text-on-dark': '#EAEAEA', '--theme-page-bg': 'rgb(174, 217, 211)' } },
        oceanDepths: { name: "Ocean Depths", cost: 1, cssVariables: { '--theme-primary-dark': '#03045E', '--theme-primary-accent': '#0077B6', '--theme-secondary-accent': '#00B4D8', '--theme-tertiary-accent': '#90E0EF', '--theme-highlight-accent': '#CAF0F8', '--theme-light-bg': '#E0FBFC', '--theme-card-bg': '#FFFFFF', '--theme-text-on-dark': '#CAF0F8', '--theme-page-bg': '#ADE8F4' } },
        volcanoRush: { name: "Volcano Rush", cost: 1, cssVariables: { '--theme-primary-dark': '#2B0000', '--theme-primary-accent': '#6A0000', '--theme-secondary-accent': '#FF4500', '--theme-tertiary-accent': '#FF8C00', '--theme-highlight-accent': '#AE2012', '--theme-light-bg': '#FFF2E6', '--theme-card-bg': '#FFFFFF', '--theme-text-on-dark': '#FFDAB9', '--theme-page-bg': '#FFCDB2' } },
        techOrangeBlue: { name: "Tech Orange & Blue", cost: 1, cssVariables: { '--theme-primary-dark': '#004C97', '--theme-primary-accent': '#4A7DB5', '--theme-secondary-accent': '#FF6600', '--theme-tertiary-accent': '#C0C0C0', '--theme-highlight-accent': '#FF7700', '--theme-light-bg': '#F0F0F0', '--theme-card-bg': '#FFFFFF', '--theme-text-on-dark': '#F0F0F0', '--theme-page-bg': '#E8E8E8' } },
        forestGreens: { name: "Forest Greens", cost: 1, cssVariables: { '--theme-primary-dark': '#1A2B12', '--theme-primary-accent': '#335128', '--theme-secondary-accent': '#526F35', '--theme-tertiary-accent': '#8A9A5B', '--theme-highlight-accent': '#E0E7A3', '--theme-light-bg': '#F0F5E0', '--theme-card-bg': '#FFFFFF', '--theme-text-on-dark': '#E0E7A3', '--theme-page-bg': '#D8E0C0' } }
    };

    // =================================================================================
    // SECTION: HELPER FUNCTIONS (Keep existing)
    // =================================================================================
    function formatTime(totalSeconds) { /* ... */ }
    function formatTimerDisplay(totalSeconds) { /* ... */ }
    function parseMMSS(timeString) { /* ... */ }
    function showToast(message, duration = 2500) { /* ... */ }
    function triggerPointsFlash() { /* ... */ }
    function addPoints(amount, reason = "") { /* ... */ }
    function getCurrentDateString() { /* ... */ }
    function getDateStringFromTimestamp(timestamp) { /* ... */ }

    // =================================================================================
    // SECTION: PARTICLE SYSTEM (Keep existing)
    // =================================================================================
    function initializeParticleCanvas() { /* ... */ }
    function createGenericParticle(x, y, options) { /* ... */ }
    function updateAndDrawParticles() { /* ... */ }
    function triggerCigarettePuff() { /* ... */ }
    function startVapeParticleStream() { /* ... */ }
    function stopVapeParticleStream() { /* ... */ }

    // =================================================================================
    // SECTION: LOG COMPACTION LOGIC (Keep existing or previous reverted version)
    // =================================================================================
    const COMPACTION_TIME_WINDOW_MS = 5 * 60 * 1000;
    const MAX_LOG_ENTRIES_AFTER_COMPACTION = 50;
    function compactSmokeLog() { /* ... (Keep the version you have) ... */ }

    // =================================================================================
    // SECTION: LOCAL STORAGE & STATE MANAGEMENT (Keep existing, including loadState/saveState)
    // =================================================================================
    function loadState() { /* ... (Keep existing loadState, including compactSmokeLog call) ... */ }
    function saveState() { /* ... (Keep existing saveState) ... */ }

    // =================================================================================
    // SECTION: THEME APPLICATION (Keep existing)
    // =================================================================================
    function applyThemeOnPage(themeId) { /* ... (Keep existing applyThemeOnPage) ... */ }

    // =================================================================================
    // SECTION: CORE SMOKE TRACKER LOGIC (Keep existing checkDate, logging, timer, limits)
    // =================================================================================
    function checkDateAndResetCounts() { /* ... */ }
    function resetCigaretteButton() { /* ... */ }
    function actuallyLogCigarette() { /* ... (Ensure it calls compactSmokeLog and relevant updates) ... */ }
    function handleLogCigaretteClick() { /* ... */ }
    function startVapeTimer() { /* ... */ }
    function stopVapeTimer(autoStopped = false) { /* ... (Ensure it calls compactSmokeLog and relevant updates) ... */ }
    function checkAndWarnLimits() { /* ... */ }

    // =================================================================================
    // SECTION: UI UPDATE FUNCTIONS (Keep existing header, status, log, chart rendering)
    // =================================================================================
    function updateHeaderDisplays() { /* ... */ }
    function updateStatusDisplay() { /* ... */ }
    function renderSmokeLog() { /* ... (Keep the version compatible with your compaction logic) ... */ }
    function renderDailyProgressChart() { /* ... */ }

    // =================================================================================
    // SECTION: REASON MODAL LOGIC (Keep existing)
    // =================================================================================
    function handleOpenReasonModal(timestamp) { /* ... */ }
    function handleCloseReasonModal() { /* ... */ }
    function handleSaveReason() { /* ... (Ensure it calls compactSmokeLog if needed) ... */ }

    // **********************************************************************************
    // *** NEW SECTION: CALENDAR LOG LOGIC (PHASE 1) ***
    // **********************************************************************************
    function aggregateDailyDataForMonth(targetMonth, targetYear) {
        const dailyData = {}; // Key: YYYY-MM-DD, Value: { cigarettes: N, vapeTime: S }
        const firstDayOfMonth = new Date(targetYear, targetMonth, 1).getTime();
        // Get the first day of the *next* month to define the end boundary
        const firstDayOfNextMonth = new Date(targetYear, targetMonth + 1, 1).getTime();

        smokeLog.forEach(log => {
            // Filter logs within the target month
            if (log.timestamp >= firstDayOfMonth && log.timestamp < firstDayOfNextMonth) {
                const dateStr = getDateStringFromTimestamp(log.timestamp);
                if (!dailyData[dateStr]) {
                    dailyData[dateStr] = { cigarettes: 0, vapeTime: 0 };
                }

                if (log.type === 'cigarette') {
                    dailyData[dateStr].cigarettes += (log.count || 1); // Add count if compacted
                } else if (log.type === 'vape' && log.duration) {
                    dailyData[dateStr].vapeTime += log.duration;
                }
            }
        });
        // console.log(`Aggregated data for ${targetMonth + 1}/${targetYear}:`, dailyData);
        return dailyData;
    }

    function styleCalendarDay(dayCell, dateString, dailyAggregatedData) {
         // Clear previous status classes
        dayCell.classList.remove('calendar-day-success', 'calendar-day-overlimit', 'calendar-day-nodata', 'today');

        const data = dailyAggregatedData[dateString];
        const todayDateString = getCurrentDateString();

        if (dateString === todayDateString) {
            dayCell.classList.add('today');
        }

        if (data) {
            const cigsOver = dailyCigaretteLimit > 0 && data.cigarettes > dailyCigaretteLimit;
            const vapeOver = dailyTotalVapeTimeLimit > 0 && data.vapeTime > dailyTotalVapeTimeLimit;

            if (cigsOver || vapeOver) {
                dayCell.classList.add('calendar-day-overlimit');
                dayCell.title = `Over Limit! Cigs: ${data.cigarettes}/${dailyCigaretteLimit > 0 ? dailyCigaretteLimit : '∞'}, Vape: ${formatTime(data.vapeTime)}/${dailyTotalVapeTimeLimit > 0 ? formatTime(dailyTotalVapeTimeLimit) : '∞'}`;
            } else {
                dayCell.classList.add('calendar-day-success');
                 dayCell.title = `Success! Cigs: ${data.cigarettes}/${dailyCigaretteLimit > 0 ? dailyCigaretteLimit : '∞'}, Vape: ${formatTime(data.vapeTime)}/${dailyTotalVapeTimeLimit > 0 ? formatTime(dailyTotalVapeTimeLimit) : '∞'}`;
            }
        } else {
            dayCell.classList.add('calendar-day-nodata');
             dayCell.title = dateString; // Default title
        }
    }


    function generateCalendar(month, year) {
        if (!calendarGridContainer || !calendarMonthYearDisplay) return;

        calendarGridContainer.innerHTML = ''; // Clear previous grid
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        calendarMonthYearDisplay.textContent = `${monthNames[month]} ${year}`;

        const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0=Sun, 1=Mon...
        const daysInMonth = new Date(year, month + 1, 0).getDate(); // Day 0 of next month gives last day of current

        // Aggregate data for the month being displayed
        const aggregatedData = aggregateDailyDataForMonth(month, year);

        const table = document.createElement('table');
        table.className = 'calendar-grid';

        // --- Create Header Row (Days of Week) ---
        const thead = table.createTHead();
        const headerRow = thead.insertRow();
        dayNames.forEach(dayName => {
            const th = document.createElement('th');
            th.textContent = dayName;
            headerRow.appendChild(th);
        });

        // --- Create Calendar Body ---
        const tbody = table.createTBody();
        let date = 1;
        for (let i = 0; i < 6; i++) { // Max 6 rows needed for a month
            const row = tbody.insertRow();
            for (let j = 0; j < 7; j++) {
                const cell = row.insertCell();
                cell.classList.add('calendar-day'); // Base class for all day cells

                if (i === 0 && j < firstDayOfMonth) {
                    // Empty cells before the 1st day
                    cell.classList.add('other-month'); // Style as empty/different month
                } else if (date > daysInMonth) {
                    // Empty cells after the last day
                    cell.classList.add('other-month');
                } else {
                    // Valid day cell
                    const daySpan = document.createElement('span');
                    daySpan.className = 'calendar-day-number';
                    daySpan.textContent = date;
                    cell.appendChild(daySpan);

                    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
                    cell.dataset.date = dateString; // Store date for potential click events later

                    // Style the cell based on aggregated data
                    styleCalendarDay(cell, dateString, aggregatedData);

                    date++;
                }
            }
            // Stop creating rows if all dates are placed
            if (date > daysInMonth) {
                 // Check if the last created row was entirely 'other-month' cells.
                 // If so, remove it for a cleaner look (optional).
                 const cells = Array.from(row.cells);
                 if(cells.every(c => c.classList.contains('other-month'))) {
                     tbody.removeChild(row);
                 }
                break;
            }
        }

        calendarGridContainer.appendChild(table);
    }
    // **********************************************************************************
    // *** END NEW SECTION: CALENDAR LOG LOGIC (PHASE 1) ***
    // **********************************************************************************

    // =================================================================================
    // SECTION: EVENT LISTENERS (Keep existing + Add New Calendar Listeners)
    // =================================================================================
    if (logCigaretteButton) { logCigaretteButton.addEventListener('click', handleLogCigaretteClick); }
    if (startVapeTimerButton) { startVapeTimerButton.addEventListener('click', startVapeTimer); }
    if (stopVapeTimerButton) { stopVapeTimerButton.addEventListener('click', () => { stopVapeTimer(false); }); }
    if (saveLimitButton && setLimitInput) { /* ... keep existing ... */ }
    if (saveVapeSessionLimitButton && setVapeSessionLimitInput) { /* ... keep existing ... */ }
    if (saveDailyVapeTimeLimitButton && setDailyVapeTimeLimitInput) { /* ... keep existing ... */ }
    if (smokeLogList) { smokeLogList.addEventListener('click', (event) => { /* ... keep existing reason listener ... */ }); }
    if (saveReasonButton) { saveReasonButton.addEventListener('click', handleSaveReason); }
    if (cancelReasonButton) { cancelReasonButton.addEventListener('click', handleCloseReasonModal); }
    if (reasonModalOverlay) { reasonModalOverlay.addEventListener('click', (event) => { /* ... keep existing ... */ }); }
    document.addEventListener('click', (event) => { /* ... keep existing cigarette button reset ... */ });
    if (endOfDayTestButton) { /* ... keep existing EOD listener ... */ }

    // --- New Calendar Event Listeners ---
    if (toggleCalendarButton && calendarLogContainer) {
        toggleCalendarButton.addEventListener('click', () => {
            const isVisible = calendarLogContainer.classList.toggle('show');
            if (isVisible) {
                // Generate calendar for the current month when first shown
                generateCalendar(calendarCurrentDate.getMonth(), calendarCurrentDate.getFullYear());
                toggleCalendarButton.innerHTML = '<i class="fas fa-calendar-times"></i> HIDE CALENDAR'; // Update button text
            } else {
                 toggleCalendarButton.innerHTML = '<i class="fas fa-calendar-alt"></i> VIEW CALENDAR LOG'; // Reset button text
            }
        });
    }

    if (prevMonthButton) {
        prevMonthButton.addEventListener('click', () => {
            calendarCurrentDate.setMonth(calendarCurrentDate.getMonth() - 1);
            generateCalendar(calendarCurrentDate.getMonth(), calendarCurrentDate.getFullYear());
        });
    }

    if (nextMonthButton) {
        nextMonthButton.addEventListener('click', () => {
            calendarCurrentDate.setMonth(calendarCurrentDate.getMonth() + 1);
            generateCalendar(calendarCurrentDate.getMonth(), calendarCurrentDate.getFullYear());
        });
    }

    // =================================================================================
    // SECTION: INITIAL SETUP
    // =================================================================================
    loadState();
    initializeParticleCanvas();
    applyThemeOnPage(currentTheme);
    checkDateAndResetCounts();
    updateHeaderDisplays();
    updateStatusDisplay();
    renderSmokeLog();
    renderDailyProgressChart();
    // Do NOT generate calendar initially, wait for button click
    resetCigaretteButton();

    console.log("Smoke Tracker Initialized (with Calendar Phase 1).");
}); // End DOMContentLoaded
