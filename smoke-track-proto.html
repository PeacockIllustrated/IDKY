// smoke-tracker-script.js

document.addEventListener('DOMContentLoaded', () => {
    // --- Constants and State Variables ---
    const localStorageKeySuffix = '_v27_theme_shop'; // Keep consistent with index.html

    // --- Element Selectors ---
    const userPointsDisplay = document.getElementById('userPoints');
    const smokeFreeStreakDisplay = document.getElementById('smokeFreeStreak');
    const healthMilestonesDisplay = document.getElementById('healthMilestones');
    const shopUserPointsDisplay = document.getElementById('shopUserPoints');

    const logCigaretteButton = document.getElementById('logCigaretteButton');
    const logVapeButton = document.getElementById('logVapeButton');

    const todayCigaretteCountDisplay = document.getElementById('todayCigaretteCount');
    const cigaretteLimitDisplay = document.getElementById('cigaretteLimitDisplay');
    const setLimitInput = document.getElementById('setLimitInput'); // Cigarette limit input
    const saveLimitButton = document.getElementById('saveLimitButton'); // Cigarette limit save

    // NOTE: Added elements for vape limit - YOU NEED TO ADD THESE TO smoke-tracker.html
    const todayVapeCountDisplay = document.getElementById('todayVapeCount');
    const vapeLimitDisplay = document.getElementById('vapeLimitDisplay');
    // Assume HTML elements like these exist:
    // <label for="setVapeLimitInput">Set Daily Vape Limit:</label>
    // <input type="number" id="setVapeLimitInput" ... >
    // <button id="saveVapeLimitButton">SET</button>
    const setVapeLimitInput = document.getElementById('setVapeLimitInput');
    const saveVapeLimitButton = document.getElementById('saveVapeLimitButton');

    const smokeLogList = document.getElementById('smokeLogList');
    const toastNotification = document.getElementById('toastNotification'); // Assumes toast element exists

    // --- State ---
    let userPoints = 0;
    let smokeFreeStreak = 0; // Consecutive days under *both* limits
    let healthMilestones = 0; // Simple counter for achieved goals/streaks
    let dailyCigaretteLimit = 5;
    let dailyVapeLimit = 15;
    let smokeLog = []; // Array of { type: 'cigarette'/'vape', timestamp: Date.now() }
    let lastLogDate = ''; // YYYY-MM-DD format to check for day changes
    let todayCigaretteCount = 0;
    let todayVapeCount = 0;
    let lastDayStreakIncremented = ''; // YYYY-MM-DD

    // --- Load State ---
    function loadState() {
        userPoints = parseInt(localStorage.getItem('idk_user_points_val' + localStorageKeySuffix)) || 0;
        smokeFreeStreak = parseInt(localStorage.getItem('smoketrack_streak' + localStorageKeySuffix)) || 0;
        healthMilestones = parseInt(localStorage.getItem('smoketrack_milestones' + localStorageKeySuffix)) || 0;
        dailyCigaretteLimit = parseInt(localStorage.getItem('smoketrack_cig_limit' + localStorageKeySuffix)) || 5;
        dailyVapeLimit = parseInt(localStorage.getItem('smoketrack_vape_limit' + localStorageKeySuffix)) || 15;
        smokeLog = JSON.parse(localStorage.getItem('smoketrack_log' + localStorageKeySuffix)) || [];
        lastLogDate = localStorage.getItem('smoketrack_last_log_date' + localStorageKeySuffix) || '';
        todayCigaretteCount = parseInt(localStorage.getItem('smoketrack_today_cig' + localStorageKeySuffix)) || 0;
        todayVapeCount = parseInt(localStorage.getItem('smoketrack_today_vape' + localStorageKeySuffix)) || 0;
        lastDayStreakIncremented = localStorage.getItem('smoketrack_last_streak_date' + localStorageKeySuffix) || '';

        // Set input values from loaded limits
        if (setLimitInput) setLimitInput.value = dailyCigaretteLimit;
        if (setVapeLimitInput) setVapeLimitInput.value = dailyVapeLimit;
    }

    // --- Save State ---
    function saveState() {
        localStorage.setItem('idk_user_points_val' + localStorageKeySuffix, userPoints.toString());
        localStorage.setItem('smoketrack_streak' + localStorageKeySuffix, smokeFreeStreak.toString());
        localStorage.setItem('smoketrack_milestones' + localStorageKeySuffix, healthMilestones.toString());
        localStorage.setItem('smoketrack_cig_limit' + localStorageKeySuffix, dailyCigaretteLimit.toString());
        localStorage.setItem('smoketrack_vape_limit' + localStorageKeySuffix, dailyVapeLimit.toString());
        localStorage.setItem('smoketrack_log' + localStorageKeySuffix, JSON.stringify(smokeLog));
        localStorage.setItem('smoketrack_last_log_date' + localStorageKeySuffix, lastLogDate);
        localStorage.setItem('smoketrack_today_cig' + localStorageKeySuffix, todayCigaretteCount.toString());
        localStorage.setItem('smoketrack_today_vape' + localStorageKeySuffix, todayVapeCount.toString());
        localStorage.setItem('smoketrack_last_streak_date' + localStorageKeySuffix, lastDayStreakIncremented);
    }

    // --- Utility Functions (Adapted/Simplified from index.html script) ---
    function showToast(message, duration = 2500) {
        if (toastNotification) {
            toastNotification.textContent = message;
            toastNotification.classList.add('show');
            setTimeout(() => {
                toastNotification.classList.remove('show');
            }, duration);
        } else {
            console.log("Toast:", message); // Fallback if toast element isn't present
        }
    }

    function triggerPointsFlash() {
        const mainPointsDisplay = document.querySelector('.header-stats-bar .points-display:first-child');
        if (mainPointsDisplay) {
            mainPointsDisplay.classList.add('points-earned-flash');
            setTimeout(() => {
                if (mainPointsDisplay) mainPointsDisplay.classList.remove('points-earned-flash');
            }, 500);
        }
    }

    function addPoints(amount, reason = "") {
        if (amount > 0) {
            userPoints += amount;
            showToast(`+${amount} PTS! ${reason}`.trim());
            triggerPointsFlash();
            updateHeaderDisplays();
            saveState();
            // Potential particle effect call here if needed
        }
    }

    function getCurrentDateString() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // --- Core Logic Functions ---

    function checkDateAndResetCounts() {
        const currentDate = getCurrentDateString();
        if (currentDate !== lastLogDate) {
            console.log(`Date changed from ${lastLogDate} to ${currentDate}. Resetting counts.`);

            // --- Streak Calculation (Before Resetting Counts!) ---
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = getCurrentDateString(yesterday); // Need to format yesterday's date

            // Check if *yesterday* was under the limit
            const yesterdayWasUnderLimit = (todayCigaretteCount <= dailyCigaretteLimit && todayVapeCount <= dailyVapeLimit);

            if (lastLogDate && yesterdayWasUnderLimit) { // Only update streak if there *was* a previous log day
                if (lastDayStreakIncremented === yesterdayStr) {
                    // Consecutive day under limit
                    smokeFreeStreak++;
                    lastDayStreakIncremented = currentDate; // Update streak date to today
                    showToast(`Streak Extended! ${smokeFreeStreak} Days!`);
                    addPoints(5, `Streak: ${smokeFreeStreak} Days`); // Award points for extending streak

                    // Check for milestone achievements based on streak
                    if ([3, 7, 14, 30].includes(smokeFreeStreak)) {
                         healthMilestones++;
                         addPoints(10 * (smokeFreeStreak/2), `Milestone: ${smokeFreeStreak}-Day Streak!`); // Bigger bonus for milestones
                         showToast(`MILESTONE! ${smokeFreeStreak}-Day Streak Achieved!`);
                         // Increment achievements display needed here
                    }

                } else if (lastLogDate === yesterdayStr) {
                    // It was yesterday, under limit, but streak wasn't incremented yesterday (missed a day before?)
                    // Reset streak to 1 (for yesterday)
                    smokeFreeStreak = 1;
                    lastDayStreakIncremented = currentDate; // Start streak from today
                    showToast("Streak Started: 1 Day!");
                    addPoints(2, "Streak Started!");
                } else {
                     // Gap since last under-limit day, reset streak
                    smokeFreeStreak = 0;
                    lastDayStreakIncremented = '';
                    showToast("Streak Reset.");
                }
            } else if (lastLogDate) {
                // Yesterday was over limit or no previous log day
                smokeFreeStreak = 0;
                lastDayStreakIncremented = '';
                 showToast("Streak Reset.");
            }

            // --- Reset Daily Counts ---
            todayCigaretteCount = 0;
            todayVapeCount = 0;
            lastLogDate = currentDate; // Update the last log date to today

            saveState(); // Save the reset counts and new date/streak info
        }
    }

    function logSmokeEvent(type) {
        checkDateAndResetCounts(); // Ensure counts are for today

        const logEntry = { type: type, timestamp: Date.now() };
        smokeLog.unshift(logEntry); // Add to beginning of array

        // Limit log size for performance (e.g., keep last 100 entries)
        if (smokeLog.length > 100) {
            smokeLog.pop();
        }

        let message = "";
        if (type === 'cigarette') {
            todayCigaretteCount++;
            message = "Cigarette logged.";
        } else if (type === 'vape') {
            todayVapeCount++;
            message = "Vape hit logged.";
        }

        // Check if over limit *after* logging
        const cigOver = todayCigaretteCount > dailyCigaretteLimit;
        const vapeOver = todayVapeCount > dailyVapeLimit;

        if (cigOver || vapeOver) {
            showToast(message + " Careful, over the limit!", 3000);
            // Reset streak immediately if they go over limit mid-day? Or wait till EOD check?
            // Let's wait for EOD check via checkDateAndResetCounts for simplicity
        } else {
            showToast(message);
        }

        updateStatusDisplay();
        renderSmokeLog();
        saveState();
    }

    function updateHeaderDisplays() {
        if (userPointsDisplay) userPointsDisplay.textContent = userPoints;
        if (smokeFreeStreakDisplay) smokeFreeStreakDisplay.textContent = smokeFreeStreak;
        if (healthMilestonesDisplay) healthMilestonesDisplay.textContent = healthMilestones;
        if (shopUserPointsDisplay) shopUserPointsDisplay.textContent = userPoints; // Keep shop points updated
    }

    function updateStatusDisplay() {
        if (todayCigaretteCountDisplay) todayCigaretteCountDisplay.textContent = todayCigaretteCount;
        if (cigaretteLimitDisplay) cigaretteLimitDisplay.textContent = dailyCigaretteLimit;
        if (todayVapeCountDisplay) todayVapeCountDisplay.textContent = todayVapeCount;
        if (vapeLimitDisplay) vapeLimitDisplay.textContent = dailyVapeLimit;

        // Optional: Add visual cues for being over limit
        if (todayCigaretteCountDisplay) {
           todayCigaretteCountDisplay.parentElement.classList.toggle('over-limit', todayCigaretteCount > dailyCigaretteLimit);
        }
         if (todayVapeCountDisplay) {
           todayVapeCountDisplay.parentElement.classList.toggle('over-limit', todayVapeCount > dailyVapeLimit);
        }
        // You'd need to add a CSS rule for `.over-limit { color: var(--theme-highlight-accent); font-weight: bold; }` or similar in style.css
    }

    function renderSmokeLog() {
        if (!smokeLogList) return;
        smokeLogList.innerHTML = ''; // Clear existing list

        // Render maybe the last 15-20 logs for performance
        const logsToRender = smokeLog.slice(0, 20);

        logsToRender.forEach(log => {
            const listItem = document.createElement('li');
            listItem.className = 'moment-card'; // Reuse existing style
            // Remove animation for log items to avoid constant flashing
            listItem.style.opacity = '1';
            listItem.style.animation = 'none';
            listItem.style.padding = '8px';
            listItem.style.marginBottom = '8px';

            const logTime = new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const logDate = new Date(log.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric'});

            let iconClass = '';
            let iconColor = '';
            let text = '';

            if (log.type === 'cigarette') {
                iconClass = 'fas fa-smoking';
                iconColor = 'var(--theme-highlight-accent)';
                text = 'Cigarette Logged';
            } else if (log.type === 'vape') {
                iconClass = 'fas fa-vial'; // Or fa-smog?
                iconColor = 'var(--theme-primary-accent)';
                text = 'Vape Hit Logged';
            }

            listItem.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span><i class="${iconClass}" style="color: ${iconColor}; margin-right: 8px;"></i> ${text}</span>
                    <span style="font-size: 14px; color: #666;">${logDate} @ ${logTime}</span>
                </div>
            `;
            smokeLogList.appendChild(listItem);
        });
    }

    // --- Event Listeners ---
    if (logCigaretteButton) {
        logCigaretteButton.addEventListener('click', () => logSmokeEvent('cigarette'));
    }

    if (logVapeButton) {
        logVapeButton.addEventListener('click', () => logSmokeEvent('vape'));
    }

    if (saveLimitButton && setLimitInput) {
        saveLimitButton.addEventListener('click', () => {
            const newLimit = parseInt(setLimitInput.value);
            if (!isNaN(newLimit) && newLimit >= 0) {
                dailyCigaretteLimit = newLimit;
                updateStatusDisplay();
                saveState();
                showToast(`Cigarette limit set to ${dailyCigaretteLimit}.`);
            } else {
                showToast("Invalid limit value.");
                setLimitInput.value = dailyCigaretteLimit; // Reset to current value
            }
        });
    }

    // Add listener for vape limit save button
    if (saveVapeLimitButton && setVapeLimitInput) {
         saveVapeLimitButton.addEventListener('click', () => {
            const newLimit = parseInt(setVapeLimitInput.value);
            if (!isNaN(newLimit) && newLimit >= 0) {
                dailyVapeLimit = newLimit;
                updateStatusDisplay();
                saveState();
                showToast(`Vape limit set to ${dailyVapeLimit}.`);
            } else {
                showToast("Invalid limit value.");
                setVapeLimitInput.value = dailyVapeLimit; // Reset
            }
        });
    }

    // --- Initial Setup ---
    loadState();
    checkDateAndResetCounts(); // Run on load to handle potential day change since last visit
    updateHeaderDisplays();
    updateStatusDisplay();
    renderSmokeLog();

    console.log("Smoke Tracker Initialized.");
    console.log("Current State:", { userPoints, smokeFreeStreak, healthMilestones, dailyCigaretteLimit, dailyVapeLimit, todayCigaretteCount, todayVapeCount, lastLogDate });

}); // End DOMContentLoaded
