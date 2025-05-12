// smoke-tracker-script.js

document.addEventListener('DOMContentLoaded', () => {
    // --- Constants and State Variables ---
    const localStorageKeySuffix = '_v27_theme_shop'; // Keep consistent

    // --- Element Selectors ---
    const userPointsDisplay = document.getElementById('userPoints');
    const smokeFreeStreakDisplay = document.getElementById('smokeFreeStreak'); // In header
    const streakDisplay = document.getElementById('streakDisplay'); // In progress section
    const healthMilestonesDisplay = document.getElementById('healthMilestones');
    const shopUserPointsDisplay = document.getElementById('shopUserPoints');

    const logCigaretteButton = document.getElementById('logCigaretteButton');

    // Vape Timer Elements
    const startVapeTimerButton = document.getElementById('startVapeTimerButton');
    const stopVapeTimerButton = document.getElementById('stopVapeTimerButton');
    const vapeTimerDisplay = document.getElementById('vapeTimerDisplay');
    const setVapeSessionLimitInput = document.getElementById('setVapeSessionLimitInput');
    const saveVapeSessionLimitButton = document.getElementById('saveVapeSessionLimitButton');

    // Cigarette Limit Elements
    const todayCigaretteCountDisplay = document.getElementById('todayCigaretteCount');
    const cigaretteLimitDisplay = document.getElementById('cigaretteLimitDisplay');
    const setLimitInput = document.getElementById('setLimitInput');
    const saveLimitButton = document.getElementById('saveLimitButton');

    // Daily Vape Time Limit Elements
    const todayTotalVapeTimeDisplay = document.getElementById('todayTotalVapeTimeDisplay');
    const dailyVapeTimeLimitDisplay = document.getElementById('dailyVapeTimeLimitDisplay');
    const setDailyVapeTimeLimitInput = document.getElementById('setDailyVapeTimeLimitInput');
    const saveDailyVapeTimeLimitButton = document.getElementById('saveDailyVapeTimeLimitButton');

    const smokeLogList = document.getElementById('smokeLogList');
    const noLogsPlaceholder = document.getElementById('noLogsPlaceholder');
    const toastNotification = document.getElementById('toastNotification');

    // --- State ---
    let userPoints = 0;
    let smokeFreeStreak = 0; // Consecutive days under *both* limits
    let healthMilestones = 0;
    let dailyCigaretteLimit = 5;
    let vapeSessionDurationLimit = 30; // Default session limit in seconds (e.g., 0:30)
    let dailyTotalVapeTimeLimit = 300; // Default daily total limit in seconds (e.g., 5 minutes)
    let smokeLog = []; // Array of { type: 'cigarette'/'vape', timestamp: Date.now(), duration?: seconds }
    let lastLogDate = ''; // YYYY-MM-DD
    let todayCigaretteCount = 0;
    let todayTotalVapeTime = 0; // In seconds
    let lastDayStreakIncremented = ''; // YYYY-MM-DD

    // Timer Runtime State (Not saved)
    let isVapeTimerRunning = false;
    let vapeTimerStartTime = null;
    let vapeTimerIntervalId = null;

    // --- Helper Functions ---
    function formatTime(totalSeconds) {
        if (isNaN(totalSeconds) || totalSeconds < 0) {
            return "0m 0s";
        }
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = Math.floor(totalSeconds % 60);
        return `${minutes}m ${seconds}s`;
    }

    function formatTimerDisplay(totalSeconds) {
        if (isNaN(totalSeconds) || totalSeconds < 0) {
            return "00:00";
        }
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = Math.floor(totalSeconds % 60);
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    function parseMMSS(timeString) {
        if (!timeString || typeof timeString !== 'string') return null;
        const parts = timeString.split(':');
        if (parts.length !== 2) return null;
        const minutes = parseInt(parts[0], 10);
        const seconds = parseInt(parts[1], 10);
        if (isNaN(minutes) || isNaN(seconds) || minutes < 0 || seconds < 0 || seconds >= 60) {
            return null;
        }
        return (minutes * 60) + seconds;
    }

    function showToast(message, duration = 2500) {
        if (toastNotification) {
            toastNotification.textContent = message;
            toastNotification.classList.add('show');
            setTimeout(() => {
                toastNotification.classList.remove('show');
            }, duration);
        } else { console.log("Toast:", message); }
    }

     function triggerPointsFlash() {
        const mainPointsDisplay = document.querySelector('.header-stats-bar .points-display:first-child');
        if(mainPointsDisplay) mainPointsDisplay.classList.add('points-earned-flash');
        setTimeout(() => { if(mainPointsDisplay) mainPointsDisplay.classList.remove('points-earned-flash'); }, 500);
    }

    function addPoints(amount, reason = "") {
        if (amount > 0) {
            userPoints += amount;
            showToast(`+${amount} PTS! ${reason}`.trim(), amount > 5 ? 3000 : 2500); // Longer toast for bigger gains
            triggerPointsFlash();
            updateHeaderDisplays();
            saveState(); // Save points immediately
        }
    }

    function getCurrentDateString() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // --- Load & Save State ---
    function loadState() {
        userPoints = parseInt(localStorage.getItem('idk_user_points_val' + localStorageKeySuffix)) || 0;
        smokeFreeStreak = parseInt(localStorage.getItem('smoketrack_streak' + localStorageKeySuffix)) || 0;
        healthMilestones = parseInt(localStorage.getItem('smoketrack_milestones' + localStorageKeySuffix)) || 0;
        dailyCigaretteLimit = parseInt(localStorage.getItem('smoketrack_cig_limit' + localStorageKeySuffix)) || 5;
        vapeSessionDurationLimit = parseInt(localStorage.getItem('smoketrack_vape_session_limit' + localStorageKeySuffix)) || 30;
        dailyTotalVapeTimeLimit = parseInt(localStorage.getItem('smoketrack_vape_daily_limit' + localStorageKeySuffix)) || 300;
        smokeLog = JSON.parse(localStorage.getItem('smoketrack_log_v2' + localStorageKeySuffix)) || []; // Changed key for new format
        lastLogDate = localStorage.getItem('smoketrack_last_log_date' + localStorageKeySuffix) || '';
        todayCigaretteCount = parseInt(localStorage.getItem('smoketrack_today_cig' + localStorageKeySuffix)) || 0;
        todayTotalVapeTime = parseInt(localStorage.getItem('smoketrack_today_vape_time' + localStorageKeySuffix)) || 0;
        lastDayStreakIncremented = localStorage.getItem('smoketrack_last_streak_date' + localStorageKeySuffix) || '';

        // Set input values from loaded limits
        if (setLimitInput) setLimitInput.value = dailyCigaretteLimit;
        if (setDailyVapeTimeLimitInput) setDailyVapeTimeLimitInput.value = Math.floor(dailyTotalVapeTimeLimit / 60); // Input is in minutes
        if (setVapeSessionLimitInput) setVapeSessionLimitInput.value = formatTimerDisplay(vapeSessionDurationLimit); // Input is MM:SS
    }

    function saveState() {
        localStorage.setItem('idk_user_points_val' + localStorageKeySuffix, userPoints.toString());
        localStorage.setItem('smoketrack_streak' + localStorageKeySuffix, smokeFreeStreak.toString());
        localStorage.setItem('smoketrack_milestones' + localStorageKeySuffix, healthMilestones.toString());
        localStorage.setItem('smoketrack_cig_limit' + localStorageKeySuffix, dailyCigaretteLimit.toString());
        localStorage.setItem('smoketrack_vape_session_limit' + localStorageKeySuffix, vapeSessionDurationLimit.toString());
        localStorage.setItem('smoketrack_vape_daily_limit' + localStorageKeySuffix, dailyTotalVapeTimeLimit.toString());
        localStorage.setItem('smoketrack_log_v2' + localStorageKeySuffix, JSON.stringify(smokeLog)); // Use new key
        localStorage.setItem('smoketrack_last_log_date' + localStorageKeySuffix, lastLogDate);
        localStorage.setItem('smoketrack_today_cig' + localStorageKeySuffix, todayCigaretteCount.toString());
        localStorage.setItem('smoketrack_today_vape_time' + localStorageKeySuffix, todayTotalVapeTime.toString());
        localStorage.setItem('smoketrack_last_streak_date' + localStorageKeySuffix, lastDayStreakIncremented);
    }

    // --- Core Logic ---

    function checkDateAndResetCounts() {
        const currentDate = getCurrentDateString();
        if (currentDate !== lastLogDate && lastLogDate !== '') { // Only process if date changed AND there was a previous date
            console.log(`Date changed from ${lastLogDate} to ${currentDate}. Checking yesterday's limits and resetting counts.`);

            // --- Streak Calculation (Checks YESTERDAY's totals) ---
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = getCurrentDateString(yesterday); // Helper needed if not using simple string compare

            const yesterdayCigsUnder = todayCigaretteCount <= dailyCigaretteLimit;
            const yesterdayVapeUnder = todayTotalVapeTime <= dailyTotalVapeTimeLimit;
            const yesterdayWasUnderLimit = yesterdayCigsUnder && yesterdayVapeUnder;

            // Logic assumes lastLogDate *was* yesterday if date changed. More robust check might be needed.
            if (yesterdayWasUnderLimit) {
                smokeFreeStreak++;
                lastDayStreakIncremented = currentDate; // Mark today as the day streak was incremented
                showToast(`Streak Extended! ${smokeFreeStreak} Days!`);
                addPoints(5, `Streak: ${smokeFreeStreak} Days`);

                if ([1, 3, 7, 14, 30, 60, 90].includes(smokeFreeStreak)) { // Added 1 day milestone
                    healthMilestones++;
                    addPoints(Math.max(10, smokeFreeStreak * 2), `Milestone: ${smokeFreeStreak}-Day Streak!`);
                    showToast(`MILESTONE! ${smokeFreeStreak}-Day Streak Achieved!`);
                }
            } else {
                // Went over limit yesterday, reset streak
                smokeFreeStreak = 0;
                lastDayStreakIncremented = '';
                showToast("Streak Reset. Keep trying!", 3000);
            }

            // --- Reset Daily Counts for TODAY ---
            todayCigaretteCount = 0;
            todayTotalVapeTime = 0;
            lastLogDate = currentDate; // Update the last log date to today

            saveState(); // Save the reset counts and new date/streak info
        } else if (lastLogDate === '') {
             // First time using the app or data cleared
             lastLogDate = currentDate;
             saveState();
        }
    }

    function logCigaretteEvent() {
        checkDateAndResetCounts();
        todayCigaretteCount++;
        const logEntry = { type: 'cigarette', timestamp: Date.now() };
        smokeLog.unshift(logEntry);
        if (smokeLog.length > 100) smokeLog.pop(); // Limit log size

        showToast("Cigarette logged.");
        checkAndWarnLimits();
        updateStatusDisplay();
        renderSmokeLog();
        saveState();
    }

    function startVapeTimer() {
        if (isVapeTimerRunning) return;
        checkDateAndResetCounts();

        isVapeTimerRunning = true;
        vapeTimerStartTime = Date.now();
        startVapeTimerButton.disabled = true;
        stopVapeTimerButton.disabled = false;
        stopVapeTimerButton.style.display = 'inline-block'; // Show stop button

        vapeTimerDisplay.classList.remove('warning'); // Ensure warning is off initially
        vapeTimerDisplay.textContent = formatTimerDisplay(0);

        vapeTimerIntervalId = setInterval(() => {
            const elapsedMillis = Date.now() - vapeTimerStartTime;
            const elapsedSeconds = Math.floor(elapsedMillis / 1000);
            vapeTimerDisplay.textContent = formatTimerDisplay(elapsedSeconds);

            // Check if session limit is exceeded and add visual warning
            if (vapeSessionDurationLimit > 0 && elapsedSeconds > vapeSessionDurationLimit) {
                 vapeTimerDisplay.classList.add('warning');
                 // Optional: auto-stop? For now, just visual cue.
            } else {
                 vapeTimerDisplay.classList.remove('warning');
            }

        }, 1000);

        showToast("Vape timer started!");
    }

    function stopVapeTimer() {
        if (!isVapeTimerRunning) return;

        clearInterval(vapeTimerIntervalId);
        isVapeTimerRunning = false;
        const endTime = Date.now();
        const durationSeconds = Math.max(1, Math.round((endTime - vapeTimerStartTime) / 1000)); // Log at least 1 second

        todayTotalVapeTime += durationSeconds;

        const logEntry = {
            type: 'vape',
            timestamp: endTime, // Log end time
            duration: durationSeconds
        };
        smokeLog.unshift(logEntry);
        if (smokeLog.length > 100) smokeLog.pop(); // Limit log size

        // Reset UI
        vapeTimerStartTime = null;
        vapeTimerIntervalId = null;
        startVapeTimerButton.disabled = false;
        stopVapeTimerButton.disabled = true;
        stopVapeTimerButton.style.display = 'none'; // Hide stop button
        vapeTimerDisplay.textContent = formatTimerDisplay(0); // Reset display
        vapeTimerDisplay.classList.remove('warning');

        showToast(`Vape session logged: ${formatTime(durationSeconds)}`);
        checkAndWarnLimits(); // Check daily total limit now
        updateStatusDisplay();
        renderSmokeLog();
        saveState();
    }

     function checkAndWarnLimits() {
        const cigOver = todayCigaretteCount > dailyCigaretteLimit;
        const vapeOver = todayTotalVapeTime > dailyTotalVapeTimeLimit;

        if (cigOver) {
            showToast(`Warning: Cigarette limit (${dailyCigaretteLimit}) exceeded!`, 3000);
        }
         if (vapeOver) {
            showToast(`Warning: Daily vape time limit (${formatTime(dailyTotalVapeTimeLimit)}) exceeded!`, 3000);
        }
    }

    // --- UI Update Functions ---
    function updateHeaderDisplays() {
        if (userPointsDisplay) userPointsDisplay.textContent = userPoints;
        if (smokeFreeStreakDisplay) smokeFreeStreakDisplay.textContent = smokeFreeStreak;
        if (streakDisplay) streakDisplay.textContent = `${smokeFreeStreak} Days`; // Update streak in progress section too
        if (healthMilestonesDisplay) healthMilestonesDisplay.textContent = healthMilestones;
        if (shopUserPointsDisplay) shopUserPointsDisplay.textContent = userPoints;
    }

    function updateStatusDisplay() {
        // Cigarettes
        if (todayCigaretteCountDisplay) todayCigaretteCountDisplay.textContent = todayCigaretteCount;
        if (cigaretteLimitDisplay) cigaretteLimitDisplay.textContent = dailyCigaretteLimit;
        if (todayCigaretteCountDisplay) todayCigaretteCountDisplay.parentElement.classList.toggle('over-limit', todayCigaretteCount > dailyCigaretteLimit);

        // Vape Time
        if (todayTotalVapeTimeDisplay) todayTotalVapeTimeDisplay.textContent = formatTime(todayTotalVapeTime);
        if (dailyVapeTimeLimitDisplay) dailyVapeTimeLimitDisplay.textContent = formatTime(dailyTotalVapeTimeLimit);
         if (todayTotalVapeTimeDisplay) todayTotalVapeTimeDisplay.parentElement.classList.toggle('over-limit', todayTotalVapeTime > dailyTotalVapeTimeLimit);

        // Timer Buttons initial state
        if (startVapeTimerButton) startVapeTimerButton.disabled = isVapeTimerRunning;
        if (stopVapeTimerButton) {
            stopVapeTimerButton.disabled = !isVapeTimerRunning;
            stopVapeTimerButton.style.display = isVapeTimerRunning ? 'inline-block' : 'none';
        }
        if (vapeTimerDisplay && !isVapeTimerRunning) {
            vapeTimerDisplay.textContent = formatTimerDisplay(0); // Ensure reset if not running
             vapeTimerDisplay.classList.remove('warning');
        }
    }

    function renderSmokeLog() {
        if (!smokeLogList) return;
        smokeLogList.innerHTML = ''; // Clear existing list

        const logsToRender = smokeLog.slice(0, 25); // Show more logs

        if (logsToRender.length === 0) {
            if (noLogsPlaceholder) noLogsPlaceholder.style.display = 'block';
            return;
        } else {
             if (noLogsPlaceholder) noLogsPlaceholder.style.display = 'none';
        }


        logsToRender.forEach(log => {
            const listItem = document.createElement('li');
            listItem.className = 'moment-card';
            listItem.style.opacity = '1'; listItem.style.animation = 'none';
            listItem.style.padding = '8px'; listItem.style.marginBottom = '8px';

            const logTime = new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const logDate = new Date(log.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric'});

            let iconClass = ''; let iconColor = ''; let text = ''; let details = '';

            if (log.type === 'cigarette') {
                iconClass = 'fas fa-smoking';
                iconColor = 'var(--theme-highlight-accent)';
                text = 'Cigarette';
            } else if (log.type === 'vape') {
                iconClass = 'fas fa-vial';
                iconColor = 'var(--theme-primary-accent)';
                text = 'Vape Session';
                details = log.duration ? `(${formatTime(log.duration)})` : ''; // Show duration
            }

            listItem.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">
                    <span style="margin-right: 10px;"><i class="${iconClass}" style="color: ${iconColor}; margin-right: 8px;"></i> ${text} ${details}</span>
                    <span style="font-size: 14px; color: #666; white-space: nowrap;">${logDate} @ ${logTime}</span>
                </div>
            `;
            smokeLogList.appendChild(listItem);
        });
    }

    // --- Event Listeners ---
    if (logCigaretteButton) logCigaretteButton.addEventListener('click', logCigaretteEvent);
    if (startVapeTimerButton) startVapeTimerButton.addEventListener('click', startVapeTimer);
    if (stopVapeTimerButton) stopVapeTimerButton.addEventListener('click', stopVapeTimer);

    // Cigarette Limit Listener
    if (saveLimitButton && setLimitInput) {
        saveLimitButton.addEventListener('click', () => {
            const newLimit = parseInt(setLimitInput.value);
            if (!isNaN(newLimit) && newLimit >= 0) {
                dailyCigaretteLimit = newLimit;
                updateStatusDisplay();
                checkAndWarnLimits(); // Re-check warning with new limit
                saveState();
                showToast(`Cigarette limit set to ${dailyCigaretteLimit}.`);
            } else {
                showToast("Invalid limit value.");
                setLimitInput.value = dailyCigaretteLimit;
            }
        });
    }

    // Vape Session Limit Listener
    if (saveVapeSessionLimitButton && setVapeSessionLimitInput) {
         saveVapeSessionLimitButton.addEventListener('click', () => {
            const parsedSeconds = parseMMSS(setVapeSessionLimitInput.value);
            if (parsedSeconds !== null && parsedSeconds >= 0) {
                 vapeSessionDurationLimit = parsedSeconds;
                 saveState();
                 showToast(`Vape session limit set to ${formatTimerDisplay(vapeSessionDurationLimit)}.`);
                 // Update display format in case user entered "1:5" -> "01:05"
                 setVapeSessionLimitInput.value = formatTimerDisplay(vapeSessionDurationLimit);
            } else {
                 showToast("Invalid session limit format (use MM:SS).");
                 setVapeSessionLimitInput.value = formatTimerDisplay(vapeSessionDurationLimit); // Reset
            }
         });
    }

     // Daily Vape Time Limit Listener
    if (saveDailyVapeTimeLimitButton && setDailyVapeTimeLimitInput) {
        saveDailyVapeTimeLimitButton.addEventListener('click', () => {
            const newLimitMinutes = parseInt(setDailyVapeTimeLimitInput.value);
             if (!isNaN(newLimitMinutes) && newLimitMinutes >= 0) {
                dailyTotalVapeTimeLimit = newLimitMinutes * 60; // Store as seconds
                updateStatusDisplay();
                checkAndWarnLimits(); // Re-check warning
                saveState();
                showToast(`Daily vape time limit set to ${newLimitMinutes} minutes.`);
            } else {
                showToast("Invalid limit value (minutes).");
                setDailyVapeTimeLimitInput.value = Math.floor(dailyTotalVapeTimeLimit / 60); // Reset
            }
        });
    }


    // --- Initial Setup ---
    loadState();
    checkDateAndResetCounts(); // IMPORTANT: Run check before first render/update
    updateHeaderDisplays();
    updateStatusDisplay(); // Includes setting initial button states
    renderSmokeLog();

    console.log("Smoke Tracker Initialized (v2 - Timer).");
    console.log("Current State:", { userPoints, smokeFreeStreak, dailyCigaretteLimit, vapeSessionDurationLimit, dailyTotalVapeTimeLimit, todayCigaretteCount, todayTotalVapeTime, lastLogDate });

}); // End DOMContentLoaded
