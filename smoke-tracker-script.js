// smoke-tracker-script.js

document.addEventListener('DOMContentLoaded', () => {
    // --- Constants and State Variables ---
    const localStorageKeySuffix = '_v27_theme_shop'; // Keep consistent

    // --- Element Selectors ---
    // Header & General UI
    const userPointsDisplay = document.getElementById('userPoints');
    const smokeFreeStreakDisplay = document.getElementById('smokeFreeStreak');
    const streakDisplay = document.getElementById('streakDisplay');
    const healthMilestonesDisplay = document.getElementById('healthMilestones');
    const shopUserPointsDisplay = document.getElementById('shopUserPoints');
    const toastNotification = document.getElementById('toastNotification');

    // Cigarette Elements
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


    // --- State ---
    let userPoints = 0;
    let smokeFreeStreak = 0;
    let healthMilestones = 0;
    let dailyCigaretteLimit = 5;
    let vapeSessionDurationLimit = 30; // Seconds, 0 means count up only
    let dailyTotalVapeTimeLimit = 300; // Seconds
    let smokeLog = []; // Array of { type: 'cigarette'/'vape', timestamp: Date.now(), duration?: seconds, reason?: string }
    let lastLogDate = ''; // YYYY-MM-DD
    let todayCigaretteCount = 0;
    let todayTotalVapeTime = 0; // Seconds
    let lastDayStreakIncremented = ''; // YYYY-MM-DD

    // Timer Runtime State
    let isVapeTimerRunning = false;
    let vapeTimerStartTime = null;
    let vapeTimerIntervalId = null;
    let vapeTimerTargetEndTime = null; // For countdown
    let vapeTimerMode = 'up'; // 'up' or 'down'

    // --- Helper Functions (formatTime, formatTimerDisplay, parseMMSS, showToast, triggerPointsFlash, addPoints, getCurrentDateString - Unchanged from previous) ---
    function formatTime(totalSeconds) { if (isNaN(totalSeconds) || totalSeconds < 0) return "0m 0s"; const m = Math.floor(totalSeconds / 60); const s = Math.floor(totalSeconds % 60); return `${m}m ${s}s`; }
    function formatTimerDisplay(totalSeconds) { if (isNaN(totalSeconds) || totalSeconds < 0) return "00:00"; const m = Math.floor(totalSeconds / 60); const s = Math.floor(totalSeconds % 60); return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`; }
    function parseMMSS(timeString) { if (!timeString || typeof timeString !== 'string') return null; const p = timeString.split(':'); if (p.length !== 2) return null; const m = parseInt(p[0], 10); const s = parseInt(p[1], 10); if (isNaN(m) || isNaN(s) || m < 0 || s < 0 || s >= 60) return null; return (m * 60) + s; }
    function showToast(message, duration = 2500) { if (toastNotification) { toastNotification.textContent = message; toastNotification.classList.add('show'); setTimeout(() => { toastNotification.classList.remove('show'); }, duration); } else { console.log("Toast:", message); } }
    function triggerPointsFlash() { const d = document.querySelector('.header-stats-bar .points-display:first-child'); if(d) d.classList.add('points-earned-flash'); setTimeout(() => { if(d) d.classList.remove('points-earned-flash'); }, 500); }
    function addPoints(amount, reason = "") { if (amount > 0) { userPoints += amount; showToast(`+${amount} PTS! ${reason}`.trim(), amount > 5 ? 3000 : 2500); triggerPointsFlash(); updateHeaderDisplays(); saveState(); } }
    function getCurrentDateString() { const t = new Date(); const y = t.getFullYear(); const m = String(t.getMonth() + 1).padStart(2, '0'); const d = String(t.getDate()).padStart(2, '0'); return `${y}-${m}-${d}`; }

    // --- Load & Save State ---
    function loadState() {
        userPoints = parseInt(localStorage.getItem('idk_user_points_val' + localStorageKeySuffix)) || 0;
        smokeFreeStreak = parseInt(localStorage.getItem('smoketrack_streak' + localStorageKeySuffix)) || 0;
        healthMilestones = parseInt(localStorage.getItem('smoketrack_milestones' + localStorageKeySuffix)) || 0;
        dailyCigaretteLimit = parseInt(localStorage.getItem('smoketrack_cig_limit' + localStorageKeySuffix)) || 5;
        vapeSessionDurationLimit = parseInt(localStorage.getItem('smoketrack_vape_session_limit' + localStorageKeySuffix)) || 30;
        dailyTotalVapeTimeLimit = parseInt(localStorage.getItem('smoketrack_vape_daily_limit' + localStorageKeySuffix)) || 300;
        smokeLog = JSON.parse(localStorage.getItem('smoketrack_log_v2' + localStorageKeySuffix)) || []; // Keep v2 key, reason is additive
        lastLogDate = localStorage.getItem('smoketrack_last_log_date' + localStorageKeySuffix) || '';
        todayCigaretteCount = parseInt(localStorage.getItem('smoketrack_today_cig' + localStorageKeySuffix)) || 0;
        todayTotalVapeTime = parseInt(localStorage.getItem('smoketrack_today_vape_time' + localStorageKeySuffix)) || 0;
        lastDayStreakIncremented = localStorage.getItem('smoketrack_last_streak_date' + localStorageKeySuffix) || '';

        // Set input values from loaded limits
        if (setLimitInput) setLimitInput.value = dailyCigaretteLimit;
        if (setDailyVapeTimeLimitInput) setDailyVapeTimeLimitInput.value = Math.floor(dailyTotalVapeTimeLimit / 60);
        if (setVapeSessionLimitInput) setVapeSessionLimitInput.value = formatTimerDisplay(vapeSessionDurationLimit);
    }

    function saveState() {
        localStorage.setItem('idk_user_points_val' + localStorageKeySuffix, userPoints.toString());
        localStorage.setItem('smoketrack_streak' + localStorageKeySuffix, smokeFreeStreak.toString());
        localStorage.setItem('smoketrack_milestones' + localStorageKeySuffix, healthMilestones.toString());
        localStorage.setItem('smoketrack_cig_limit' + localStorageKeySuffix, dailyCigaretteLimit.toString());
        localStorage.setItem('smoketrack_vape_session_limit' + localStorageKeySuffix, vapeSessionDurationLimit.toString());
        localStorage.setItem('smoketrack_vape_daily_limit' + localStorageKeySuffix, dailyTotalVapeTimeLimit.toString());
        localStorage.setItem('smoketrack_log_v2' + localStorageKeySuffix, JSON.stringify(smokeLog)); // Keep v2 key
        localStorage.setItem('smoketrack_last_log_date' + localStorageKeySuffix, lastLogDate);
        localStorage.setItem('smoketrack_today_cig' + localStorageKeySuffix, todayCigaretteCount.toString());
        localStorage.setItem('smoketrack_today_vape_time' + localStorageKeySuffix, todayTotalVapeTime.toString());
        localStorage.setItem('smoketrack_last_streak_date' + localStorageKeySuffix, lastDayStreakIncremented);
    }

    // --- Core Logic ---

    // checkDateAndResetCounts - Unchanged from previous version
    function checkDateAndResetCounts() {
        const currentDate = getCurrentDateString();
        if (currentDate !== lastLogDate && lastLogDate !== '') {
            console.log(`Date changed from ${lastLogDate} to ${currentDate}. Checking yesterday's limits and resetting counts.`);
            const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = getCurrentDateString(yesterday);
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
            todayCigaretteCount = 0; todayTotalVapeTime = 0; lastLogDate = currentDate;
            saveState();
        } else if (lastLogDate === '') { lastLogDate = currentDate; saveState(); }
    }

    function logCigaretteEvent() {
        checkDateAndResetCounts();
        todayCigaretteCount++;
        const logEntry = { type: 'cigarette', timestamp: Date.now(), reason: '' }; // Add empty reason field
        smokeLog.unshift(logEntry);
        if (smokeLog.length > 100) smokeLog.pop();

        showToast("Cigarette logged.");
        checkAndWarnLimits();
        updateStatusDisplay();
        renderSmokeLog(); // Will now include the 'add reason' icon
        saveState();
    }

    function startVapeTimer() {
        if (isVapeTimerRunning) return;
        checkDateAndResetCounts();

        isVapeTimerRunning = true;
        vapeTimerStartTime = Date.now();
        startVapeTimerButton.disabled = true;
        stopVapeTimerButton.disabled = false;
        stopVapeTimerButton.style.display = 'inline-block';
        vapeTimerDisplay.classList.remove('warning', 'counting-down'); // Reset visual state

        // Determine timer mode
        if (vapeSessionDurationLimit > 0) {
            vapeTimerMode = 'down';
            vapeTimerTargetEndTime = vapeTimerStartTime + vapeSessionDurationLimit * 1000;
            vapeTimerDisplay.textContent = formatTimerDisplay(vapeSessionDurationLimit);
            vapeTimerDisplay.classList.add('counting-down');
            showToast(`Vape timer started (Counting down from ${formatTimerDisplay(vapeSessionDurationLimit)})!`);
        } else {
            vapeTimerMode = 'up';
            vapeTimerTargetEndTime = null; // No target for count up
            vapeTimerDisplay.textContent = formatTimerDisplay(0);
            showToast("Vape timer started (Counting up)!");
        }

        // --- Timer Interval Logic ---
        vapeTimerIntervalId = setInterval(() => {
            if (vapeTimerMode === 'down') {
                const remainingMillis = vapeTimerTargetEndTime - Date.now();
                if (remainingMillis <= 0) {
                    // Countdown finished
                    vapeTimerDisplay.textContent = "00:00";
                    showToast("Vape session limit reached!", 3000);
                    vapeTimerDisplay.classList.add('warning'); // Flash warning at end
                    stopVapeTimer(true); // Auto-stop, indicating limit was reached
                } else {
                    const remainingSeconds = Math.ceil(remainingMillis / 1000);
                    vapeTimerDisplay.textContent = formatTimerDisplay(remainingSeconds);
                    // Optional: add warning class when remainingSeconds < 10 ?
                }
            } else { // Count 'up' mode
                const elapsedMillis = Date.now() - vapeTimerStartTime;
                const elapsedSeconds = Math.floor(elapsedMillis / 1000);
                vapeTimerDisplay.textContent = formatTimerDisplay(elapsedSeconds);
                // No warning needed for count up unless we add a different kind of limit
            }
        }, 1000); // Update every second
    }

    function stopVapeTimer(autoStopped = false) {
        if (!isVapeTimerRunning) return;

        clearInterval(vapeTimerIntervalId);
        isVapeTimerRunning = false;
        const endTime = Date.now();

        let durationSeconds;
        if (vapeTimerMode === 'down') {
            if (autoStopped) {
                // Countdown finished naturally
                durationSeconds = vapeSessionDurationLimit;
            } else {
                // Stopped manually during countdown
                durationSeconds = Math.max(1, Math.round((endTime - vapeTimerStartTime) / 1000));
                // Ensure logged duration doesn't exceed the limit if stopped manually early
                durationSeconds = Math.min(durationSeconds, vapeSessionDurationLimit);
            }
        } else {
            // Count up mode, stopped manually
            durationSeconds = Math.max(1, Math.round((endTime - vapeTimerStartTime) / 1000));
        }

        todayTotalVapeTime += durationSeconds;

        const logEntry = {
            type: 'vape',
            timestamp: endTime,
            duration: durationSeconds,
            reason: '' // Add empty reason field
        };
        smokeLog.unshift(logEntry);
        if (smokeLog.length > 100) smokeLog.pop();

        // Reset UI
        vapeTimerStartTime = null; vapeTimerTargetEndTime = null; vapeTimerIntervalId = null; vapeTimerMode = 'up';
        startVapeTimerButton.disabled = false;
        stopVapeTimerButton.disabled = true; stopVapeTimerButton.style.display = 'none';
        vapeTimerDisplay.textContent = formatTimerDisplay(0);
        vapeTimerDisplay.classList.remove('warning', 'counting-down');

        if (!autoStopped) { // Don't show redundant toast if auto-stopped
           showToast(`Vape session logged: ${formatTime(durationSeconds)}`);
        }
        checkAndWarnLimits();
        updateStatusDisplay();
        renderSmokeLog(); // Will include 'add reason' icon
        saveState();
    }

    // checkAndWarnLimits - Unchanged
     function checkAndWarnLimits() {
        const cigOver = todayCigaretteCount > dailyCigaretteLimit;
        const vapeOver = todayTotalVapeTime > dailyTotalVapeTimeLimit;
        if (cigOver) { showToast(`Warning: Cigarette limit (${dailyCigaretteLimit}) exceeded!`, 3000); }
        if (vapeOver) { showToast(`Warning: Daily vape time limit (${formatTime(dailyTotalVapeTimeLimit)}) exceeded!`, 3000); }
    }


    // --- UI Update Functions ---
    // updateHeaderDisplays - Unchanged
    function updateHeaderDisplays() {
        if (userPointsDisplay) userPointsDisplay.textContent = userPoints;
        if (smokeFreeStreakDisplay) smokeFreeStreakDisplay.textContent = smokeFreeStreak;
        if (streakDisplay) streakDisplay.textContent = `${smokeFreeStreak} Days`;
        if (healthMilestonesDisplay) healthMilestonesDisplay.textContent = healthMilestones;
        if (shopUserPointsDisplay) shopUserPointsDisplay.textContent = userPoints;
    }

    // updateStatusDisplay - Unchanged
    function updateStatusDisplay() {
        if (todayCigaretteCountDisplay) todayCigaretteCountDisplay.textContent = todayCigaretteCount;
        if (cigaretteLimitDisplay) cigaretteLimitDisplay.textContent = dailyCigaretteLimit;
        if (todayCigaretteCountDisplay) todayCigaretteCountDisplay.parentElement.classList.toggle('over-limit', todayCigaretteCount > dailyCigaretteLimit);
        if (todayTotalVapeTimeDisplay) todayTotalVapeTimeDisplay.textContent = formatTime(todayTotalVapeTime);
        if (dailyVapeTimeLimitDisplay) dailyVapeTimeLimitDisplay.textContent = formatTime(dailyTotalVapeTimeLimit);
        if (todayTotalVapeTimeDisplay) todayTotalVapeTimeDisplay.parentElement.classList.toggle('over-limit', todayTotalVapeTime > dailyTotalVapeTimeLimit);
        if (startVapeTimerButton) startVapeTimerButton.disabled = isVapeTimerRunning;
        if (stopVapeTimerButton) { stopVapeTimerButton.disabled = !isVapeTimerRunning; stopVapeTimerButton.style.display = isVapeTimerRunning ? 'inline-block' : 'none'; }
        if (vapeTimerDisplay && !isVapeTimerRunning) { vapeTimerDisplay.textContent = formatTimerDisplay(0); vapeTimerDisplay.classList.remove('warning', 'counting-down'); }
    }

    function renderSmokeLog() {
        if (!smokeLogList) return;
        smokeLogList.innerHTML = '';

        const logsToRender = smokeLog.slice(0, 30); // Show a few more logs

        if (logsToRender.length === 0) {
            if (noLogsPlaceholder) noLogsPlaceholder.style.display = 'block'; return;
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
            let reasonIconClass = log.reason ? 'fas fa-comment-dots has-reason' : 'far fa-comment-dots'; // Use filled icon if reason exists

            if (log.type === 'cigarette') {
                iconClass = 'fas fa-smoking'; iconColor = 'var(--theme-highlight-accent)'; text = 'Cigarette';
            } else if (log.type === 'vape') {
                iconClass = 'fas fa-vial'; iconColor = 'var(--theme-primary-accent)'; text = 'Vape Session';
                details = log.duration ? `(${formatTime(log.duration)})` : '';
            }

            // Structure for better alignment of reason icon
            listItem.innerHTML = `
                <div class="log-item-content">
                    <div class="log-item-details">
                        <i class="${iconClass}" style="color: ${iconColor}; margin-right: 8px; font-size: 18px;"></i>
                        <span>${text} ${details}</span>
                    </div>
                    <div class="log-item-reason-icon-container">
                         <span class="log-item-time">${logDate} @ ${logTime}</span>
                         <i class="${reasonIconClass} add-reason-icon" data-timestamp="${log.timestamp}" title="${log.reason ? 'Edit Reason' : 'Add Reason'}"></i>
                    </div>
                </div>
            `;
            smokeLogList.appendChild(listItem);
        });
    }

     // --- Reason Modal Logic ---
    function handleOpenReasonModal(timestamp) {
        const logEntry = smokeLog.find(log => log.timestamp === timestamp);
        if (!logEntry || !reasonModalOverlay) return;

        reasonInput.value = logEntry.reason || ''; // Populate existing reason or empty
        reasonLogTimestampInput.value = timestamp; // Store timestamp
        reasonModalOverlay.classList.add('show');
        reasonInput.focus(); // Focus textarea
    }

    function handleCloseReasonModal() {
        if(reasonModalOverlay) reasonModalOverlay.classList.remove('show');
        reasonInput.value = ''; // Clear textarea
        reasonLogTimestampInput.value = ''; // Clear timestamp
    }

    function handleSaveReason() {
        const timestamp = parseInt(reasonLogTimestampInput.value);
        const newReason = reasonInput.value.trim();
        if (isNaN(timestamp)) return;

        const logEntry = smokeLog.find(log => log.timestamp === timestamp);
        if (logEntry) {
            logEntry.reason = newReason;
            saveState();
            renderSmokeLog(); // Re-render to update icon state
            showToast(newReason ? "Reason Saved!" : "Reason Cleared.");
        }
        handleCloseReasonModal();
    }


    // --- Event Listeners ---
    if (logCigaretteButton) logCigaretteButton.addEventListener('click', logCigaretteEvent);
    if (startVapeTimerButton) startVapeTimerButton.addEventListener('click', startVapeTimer);
    if (stopVapeTimerButton) stopVapeTimerButton.addEventListener('click', () => stopVapeTimer(false)); // Manual stop

    // Cigarette Limit Listener
    if (saveLimitButton && setLimitInput) {
        saveLimitButton.addEventListener('click', () => {
            const newLimit = parseInt(setLimitInput.value);
            if (!isNaN(newLimit) && newLimit >= 0) { dailyCigaretteLimit = newLimit; updateStatusDisplay(); checkAndWarnLimits(); saveState(); showToast(`Cigarette limit set to ${dailyCigaretteLimit}.`); }
            else { showToast("Invalid limit value."); setLimitInput.value = dailyCigaretteLimit; }
        });
    }

    // Vape Session Limit Listener
    if (saveVapeSessionLimitButton && setVapeSessionLimitInput) {
         saveVapeSessionLimitButton.addEventListener('click', () => {
            const parsedSeconds = parseMMSS(setVapeSessionLimitInput.value);
            // Allow 0 for count-up mode
            if (parsedSeconds !== null && parsedSeconds >= 0) {
                 vapeSessionDurationLimit = parsedSeconds; saveState();
                 showToast(`Vape session limit set to ${formatTimerDisplay(vapeSessionDurationLimit)} ${parsedSeconds === 0 ? '(Count Up)' : ''}.`);
                 setVapeSessionLimitInput.value = formatTimerDisplay(vapeSessionDurationLimit);
            } else {
                 showToast("Invalid session limit format (use MM:SS).");
                 setVapeSessionLimitInput.value = formatTimerDisplay(vapeSessionDurationLimit);
            }
         });
    }

     // Daily Vape Time Limit Listener
    if (saveDailyVapeTimeLimitButton && setDailyVapeTimeLimitInput) {
        saveDailyVapeTimeLimitButton.addEventListener('click', () => {
            const newLimitMinutes = parseInt(setDailyVapeTimeLimitInput.value);
             if (!isNaN(newLimitMinutes) && newLimitMinutes >= 0) {
                dailyTotalVapeTimeLimit = newLimitMinutes * 60; updateStatusDisplay(); checkAndWarnLimits(); saveState();
                showToast(`Daily vape time limit set to ${newLimitMinutes} minutes.`);
            } else { showToast("Invalid limit value (minutes)."); setDailyVapeTimeLimitInput.value = Math.floor(dailyTotalVapeTimeLimit / 60); }
        });
    }

    // Reason Modal Listeners
    if (smokeLogList) { // Event delegation for reason icons
        smokeLogList.addEventListener('click', (event) => {
            if (event.target.classList.contains('add-reason-icon')) {
                const timestamp = parseInt(event.target.dataset.timestamp);
                if (!isNaN(timestamp)) {
                    handleOpenReasonModal(timestamp);
                }
            }
        });
    }
    if (saveReasonButton) saveReasonButton.addEventListener('click', handleSaveReason);
    if (cancelReasonButton) cancelReasonButton.addEventListener('click', handleCloseReasonModal);
    if (reasonModalOverlay) reasonModalOverlay.addEventListener('click', (event) => { // Close on overlay click
        if (event.target === reasonModalOverlay) { handleCloseReasonModal(); }
    });


    // --- Initial Setup ---
    loadState();
    checkDateAndResetCounts();
    updateHeaderDisplays();
    updateStatusDisplay();
    renderSmokeLog();

    console.log("Smoke Tracker Initialized (v3 - Reason Modal & Countdown).");
    console.log("Current State:", { userPoints, smokeFreeStreak, dailyCigaretteLimit, vapeSessionDurationLimit, dailyTotalVapeTimeLimit, todayCigaretteCount, todayTotalVapeTime, lastLogDate });

}); // End DOMContentLoaded
