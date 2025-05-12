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
    const shopUserPointsDisplay = document.getElementById('shopUserPoints'); // In toolbar
    const toastNotification = document.getElementById('toastNotification');

    // Smoking/Vaping Elements
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

    // Reason Modal Elements
    const reasonModalOverlay = document.getElementById('reasonModalOverlay');
    const reasonInput = document.getElementById('reasonInput');
    const reasonLogTimestampInput = document.getElementById('reasonLogTimestamp');
    const saveReasonButton = document.getElementById('saveReasonButton');
    const cancelReasonButton = document.getElementById('cancelReasonButton');

    // Shop Toolbar Elements
    const shopToolbar = document.getElementById('shopToolbar');
    const shopToolbarHeader = document.getElementById('shopToolbarHeader');
    const shopAccordionContent = document.getElementById('shopAccordionContent');
    const shopToggleIcon = document.getElementById('shopToggleIcon'); // Assumed ID for chevron

    // --- State ---
    let userPoints = 0;
    let smokeFreeStreak = 0;
    let healthMilestones = 0;
    let dailyCigaretteLimit = 5;
    let vapeSessionDurationLimit = 30;
    let dailyTotalVapeTimeLimit = 300;
    let smokeLog = [];
    let lastLogDate = '';
    let todayCigaretteCount = 0;
    let todayTotalVapeTime = 0;
    let lastDayStreakIncremented = '';
    // Timer State
    let isVapeTimerRunning = false; let vapeTimerStartTime = null; let vapeTimerIntervalId = null;
    let vapeTimerTargetEndTime = null; let vapeTimerMode = 'up';
    // --- Theme State ---
    let ownedThemes = ['default'];
    let currentTheme = 'default';

    // --- Theme Data Object (MUST MATCH other JS files) ---
    const themes = {
        default: { name: "Default Retro", cost: 0, owned: true, description: "The classic look and feel.", cssVariables: { '--theme-primary-dark': '#264653', '--theme-primary-accent': '#2A9D8F', '--theme-secondary-accent': '#E9C46A', '--theme-tertiary-accent': '#F4A261', '--theme-highlight-accent': '#E76F51', '--theme-light-bg': '#EAEAEA', '--theme-card-bg': '#FFFFFF', '--theme-text-on-dark': '#EAEAEA', '--theme-page-bg': 'rgb(174, 217, 211)' } },
        oceanDepths: { name: "Ocean Depths", cost: 1, description: "Dive into cool blue tranquility.", cssVariables: { '--theme-primary-dark': '#03045E', '--theme-primary-accent': '#0077B6', '--theme-secondary-accent': '#00B4D8', '--theme-tertiary-accent': '#90E0EF', '--theme-highlight-accent': '#CAF0F8', '--theme-light-bg': '#E0FBFC', '--theme-card-bg': '#FFFFFF', '--theme-text-on-dark': '#CAF0F8', '--theme-page-bg': '#ADE8F4' } },
        volcanoRush: { name: "Volcano Rush", cost: 1, description: "Fiery reds and oranges.", cssVariables: { '--theme-primary-dark': '#2B0000', '--theme-primary-accent': '#6A0000', '--theme-secondary-accent': '#FF4500', '--theme-tertiary-accent': '#FF8C00', '--theme-highlight-accent': '#AE2012', '--theme-light-bg': '#FFF2E6', '--theme-card-bg': '#FFFFFF', '--theme-text-on-dark': '#FFDAB9', '--theme-page-bg': '#FFCDB2' } },
        techOrangeBlue: { name: "Tech Orange & Blue", cost: 1, description: "A modern tech-inspired palette.", cssVariables: { '--theme-primary-dark': '#004C97', '--theme-primary-accent': '#4A7DB5', '--theme-secondary-accent': '#FF6600', '--theme-tertiary-accent': '#C0C0C0', '--theme-highlight-accent': '#FF7700', '--theme-light-bg': '#F0F0F0', '--theme-card-bg': '#FFFFFF', '--theme-text-on-dark': '#F0F0F0', '--theme-page-bg': '#E8E8E8' } },
        forestGreens: { name: "Forest Greens", cost: 1, description: "Earthy and calming greens.", cssVariables: { '--theme-primary-dark': '#1A2B12', '--theme-primary-accent': '#335128', '--theme-secondary-accent': '#526F35', '--theme-tertiary-accent': '#8A9A5B', '--theme-highlight-accent': '#E0E7A3', '--theme-light-bg': '#F0F5E0', '--theme-card-bg': '#FFFFFF', '--theme-text-on-dark': '#E0E7A3', '--theme-page-bg': '#D8E0C0' } }
    };


    // --- Helper Functions (formatTime, formatTimerDisplay, parseMMSS, showToast, triggerPointsFlash, addPoints, getCurrentDateString - Unchanged) ---
    function formatTime(totalSeconds) { if (isNaN(totalSeconds) || totalSeconds < 0) return "0m 0s"; const m = Math.floor(totalSeconds / 60); const s = Math.floor(totalSeconds % 60); return `${m}m ${s}s`; }
    function formatTimerDisplay(totalSeconds) { if (isNaN(totalSeconds) || totalSeconds < 0) return "00:00"; const m = Math.floor(totalSeconds / 60); const s = Math.floor(totalSeconds % 60); return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`; }
    function parseMMSS(timeString) { if (!timeString || typeof timeString !== 'string') return null; const p = timeString.split(':'); if (p.length !== 2) return null; const m = parseInt(p[0], 10); const s = parseInt(p[1], 10); if (isNaN(m) || isNaN(s) || m < 0 || s < 0 || s >= 60) return null; return (m * 60) + s; }
    function showToast(message, duration = 2500) { if (toastNotification) { toastNotification.textContent = message; toastNotification.classList.add('show'); setTimeout(() => { toastNotification.classList.remove('show'); }, duration); } else { console.log("Toast:", message); } }
    function triggerPointsFlash() { const d = document.querySelector('.header-stats-bar .points-display:first-child'); if(d) d.classList.add('points-earned-flash'); setTimeout(() => { if(d) d.classList.remove('points-earned-flash'); }, 500); }
    function addPoints(amount, reason = "") { if (amount > 0) { userPoints += amount; showToast(`+${amount} PTS! ${reason}`.trim(), amount > 5 ? 3000 : 2500); triggerPointsFlash(); updateHeaderDisplays(); saveState(); } }
    function getCurrentDateString() { const t = new Date(); const y = t.getFullYear(); const m = String(t.getMonth() + 1).padStart(2, '0'); const d = String(t.getDate()).padStart(2, '0'); return `${y}-${m}-${d}`; }

    // --- Load & Save State ---
    function loadState() {
        // Load regular tracker state
        userPoints = parseInt(localStorage.getItem('idk_user_points_val' + localStorageKeySuffix)) || 0;
        smokeFreeStreak = parseInt(localStorage.getItem('smoketrack_streak' + localStorageKeySuffix)) || 0;
        healthMilestones = parseInt(localStorage.getItem('smoketrack_milestones' + localStorageKeySuffix)) || 0;
        dailyCigaretteLimit = parseInt(localStorage.getItem('smoketrack_cig_limit' + localStorageKeySuffix)) || 5;
        vapeSessionDurationLimit = parseInt(localStorage.getItem('smoketrack_vape_session_limit' + localStorageKeySuffix)) || 30;
        dailyTotalVapeTimeLimit = parseInt(localStorage.getItem('smoketrack_vape_daily_limit' + localStorageKeySuffix)) || 300;
        smokeLog = JSON.parse(localStorage.getItem('smoketrack_log_v2' + localStorageKeySuffix)) || [];
        lastLogDate = localStorage.getItem('smoketrack_last_log_date' + localStorageKeySuffix) || '';
        todayCigaretteCount = parseInt(localStorage.getItem('smoketrack_today_cig' + localStorageKeySuffix)) || 0;
        todayTotalVapeTime = parseInt(localStorage.getItem('smoketrack_today_vape_time' + localStorageKeySuffix)) || 0;
        lastDayStreakIncremented = localStorage.getItem('smoketrack_last_streak_date' + localStorageKeySuffix) || '';

        // --- Load Theme State ---
        ownedThemes = JSON.parse(localStorage.getItem('idk_owned_themes' + localStorageKeySuffix)) || ['default'];
        currentTheme = localStorage.getItem('idk_current_theme' + localStorageKeySuffix) || 'default';

        // Set input values from loaded limits
        if (setLimitInput) setLimitInput.value = dailyCigaretteLimit;
        if (setDailyVapeTimeLimitInput) setDailyVapeTimeLimitInput.value = Math.floor(dailyTotalVapeTimeLimit / 60);
        if (setVapeSessionLimitInput) setVapeSessionLimitInput.value = formatTimerDisplay(vapeSessionDurationLimit);
    }

    function saveState() {
        // Save regular tracker state
        localStorage.setItem('idk_user_points_val' + localStorageKeySuffix, userPoints.toString());
        localStorage.setItem('smoketrack_streak' + localStorageKeySuffix, smokeFreeStreak.toString());
        localStorage.setItem('smoketrack_milestones' + localStorageKeySuffix, healthMilestones.toString());
        localStorage.setItem('smoketrack_cig_limit' + localStorageKeySuffix, dailyCigaretteLimit.toString());
        localStorage.setItem('smoketrack_vape_session_limit' + localStorageKeySuffix, vapeSessionDurationLimit.toString());
        localStorage.setItem('smoketrack_vape_daily_limit' + localStorageKeySuffix, dailyTotalVapeTimeLimit.toString());
        localStorage.setItem('smoketrack_log_v2' + localStorageKeySuffix, JSON.stringify(smokeLog));
        localStorage.setItem('smoketrack_last_log_date' + localStorageKeySuffix, lastLogDate);
        localStorage.setItem('smoketrack_today_cig' + localStorageKeySuffix, todayCigaretteCount.toString());
        localStorage.setItem('smoketrack_today_vape_time' + localStorageKeySuffix, todayTotalVapeTime.toString());
        localStorage.setItem('smoketrack_last_streak_date' + localStorageKeySuffix, lastDayStreakIncremented);

        // --- Save Theme State ---
        localStorage.setItem('idk_owned_themes' + localStorageKeySuffix, JSON.stringify(ownedThemes)); // Needed? Maybe not here.
        localStorage.setItem('idk_current_theme' + localStorageKeySuffix, currentTheme);
    }

     // --- Theme Application Logic ---
    function applyThemeOnPage(themeId) {
        const themeToApply = themes[themeId] || themes.default;
        currentTheme = themeId; // Update state

        if (themeToApply && themeToApply.cssVariables) {
            const themeVars = themeToApply.cssVariables;
            for (const [key, value] of Object.entries(themeVars)) {
                document.documentElement.style.setProperty(key, value);
            }
            document.documentElement.style.setProperty('--theme-text-main', themeVars['--theme-primary-dark']);
            document.documentElement.style.setProperty('--theme-border-main', themeVars['--theme-primary-dark']);
        } else {
            console.warn(`Theme ID "${themeId}" not found. Applying default.`);
            applyThemeOnPage('default');
            return;
        }
        saveState(); // Save the new theme choice
    }

    // --- Core Logic (checkDateAndResetCounts, logCigaretteEvent, startVapeTimer, stopVapeTimer, checkAndWarnLimits - Unchanged) ---
    function checkDateAndResetCounts() { const d=getCurrentDateString(); if(d!==lastLogDate&&lastLogDate!==''){console.log(`Date changed from ${lastLogDate} to ${d}. Checking limits.`); const y=new Date();y.setDate(y.getDate()-1); const yS=getCurrentDateString(y); const cU=todayCigaretteCount<=dailyCigaretteLimit; const vU=todayTotalVapeTime<=dailyTotalVapeTimeLimit; const yWUL=cU&&vU; if(yWUL){smokeFreeStreak++;lastDayStreakIncremented=d;showToast(`Streak Extended! ${smokeFreeStreak} Days!`);addPoints(5,`Streak: ${smokeFreeStreak} Days`); if([1,3,7,14,30,60,90].includes(smokeFreeStreak)){healthMilestones++;addPoints(Math.max(10,smokeFreeStreak*2),`Milestone: ${smokeFreeStreak}-Day Streak!`);showToast(`MILESTONE! ${smokeFreeStreak}-Day Streak Achieved!`);}}else{smokeFreeStreak=0;lastDayStreakIncremented='';showToast("Streak Reset. Keep trying!",3000);} todayCigaretteCount=0;todayTotalVapeTime=0;lastLogDate=d;saveState();}else if(lastLogDate===''){lastLogDate=d;saveState();}}
    function logCigaretteEvent() { checkDateAndResetCounts(); todayCigaretteCount++; const lE={type:'cigarette',timestamp:Date.now(),reason:''}; smokeLog.unshift(lE); if(smokeLog.length>100)smokeLog.pop(); showToast("Cigarette logged."); checkAndWarnLimits(); updateStatusDisplay(); renderSmokeLog(); saveState(); }
    function startVapeTimer() { if(isVapeTimerRunning)return; checkDateAndResetCounts(); isVapeTimerRunning=true; vapeTimerStartTime=Date.now(); startVapeTimerButton.disabled=true; stopVapeTimerButton.disabled=false; stopVapeTimerButton.style.display='inline-block'; vapeTimerDisplay.classList.remove('warning','counting-down'); if(vapeSessionDurationLimit>0){vapeTimerMode='down';vapeTimerTargetEndTime=vapeTimerStartTime+vapeSessionDurationLimit*1000;vapeTimerDisplay.textContent=formatTimerDisplay(vapeSessionDurationLimit);vapeTimerDisplay.classList.add('counting-down');showToast(`Vape timer started (Counting down from ${formatTimerDisplay(vapeSessionDurationLimit)})!`);}else{vapeTimerMode='up';vapeTimerTargetEndTime=null;vapeTimerDisplay.textContent=formatTimerDisplay(0);showToast("Vape timer started (Counting up)!");} vapeTimerIntervalId=setInterval(()=>{if(vapeTimerMode==='down'){const rM=vapeTimerTargetEndTime-Date.now();if(rM<=0){vapeTimerDisplay.textContent="00:00";showToast("Vape session limit reached!",3000);vapeTimerDisplay.classList.add('warning');stopVapeTimer(true);}else{const rS=Math.ceil(rM/1000);vapeTimerDisplay.textContent=formatTimerDisplay(rS);}}else{const eM=Date.now()-vapeTimerStartTime;const eS=Math.floor(eM/1000);vapeTimerDisplay.textContent=formatTimerDisplay(eS);}},1000);}
    function stopVapeTimer(autoStopped=false) { if(!isVapeTimerRunning)return; clearInterval(vapeTimerIntervalId); isVapeTimerRunning=false; const eT=Date.now(); let dS; if(vapeTimerMode==='down'){if(autoStopped){dS=vapeSessionDurationLimit;}else{dS=Math.max(1,Math.round((eT-vapeTimerStartTime)/1000));dS=Math.min(dS,vapeSessionDurationLimit);}}else{dS=Math.max(1,Math.round((eT-vapeTimerStartTime)/1000));} todayTotalVapeTime+=dS; const lE={type:'vape',timestamp:eT,duration:dS,reason:''}; smokeLog.unshift(lE); if(smokeLog.length>100)smokeLog.pop(); vapeTimerStartTime=null;vapeTimerTargetEndTime=null;vapeTimerIntervalId=null;vapeTimerMode='up'; startVapeTimerButton.disabled=false; stopVapeTimerButton.disabled=true;stopVapeTimerButton.style.display='none'; vapeTimerDisplay.textContent=formatTimerDisplay(0); vapeTimerDisplay.classList.remove('warning','counting-down'); if(!autoStopped){showToast(`Vape session logged: ${formatTime(dS)}`);} checkAndWarnLimits(); updateStatusDisplay(); renderSmokeLog(); saveState();}
    function checkAndWarnLimits() { const cO=todayCigaretteCount>dailyCigaretteLimit;const vO=todayTotalVapeTime>dailyTotalVapeTimeLimit; if(cO){showToast(`Warning: Cigarette limit (${dailyCigaretteLimit}) exceeded!`,3000);} if(vO){showToast(`Warning: Daily vape time limit (${formatTime(dailyTotalVapeTimeLimit)}) exceeded!`,3000);}}


    // --- UI Update Functions ---
    // updateHeaderDisplays - Unchanged
    function updateHeaderDisplays() { if (userPointsDisplay) userPointsDisplay.textContent = userPoints; if (smokeFreeStreakDisplay) smokeFreeStreakDisplay.textContent = smokeFreeStreak; if (streakDisplay) streakDisplay.textContent = `${smokeFreeStreak} Days`; if (healthMilestonesDisplay) healthMilestonesDisplay.textContent = healthMilestones; if (shopUserPointsDisplay) shopUserPointsDisplay.textContent = userPoints; } // Updated points in toolbar too
    // updateStatusDisplay - Unchanged
    function updateStatusDisplay() { if(todayCigaretteCountDisplay)todayCigaretteCountDisplay.textContent=todayCigaretteCount; if(cigaretteLimitDisplay)cigaretteLimitDisplay.textContent=dailyCigaretteLimit; if(todayCigaretteCountDisplay)todayCigaretteCountDisplay.parentElement.classList.toggle('over-limit',todayCigaretteCount>dailyCigaretteLimit); if(todayTotalVapeTimeDisplay)todayTotalVapeTimeDisplay.textContent=formatTime(todayTotalVapeTime); if(dailyVapeTimeLimitDisplay)dailyVapeTimeLimitDisplay.textContent=formatTime(dailyTotalVapeTimeLimit); if(todayTotalVapeTimeDisplay)todayTotalVapeTimeDisplay.parentElement.classList.toggle('over-limit',todayTotalVapeTime>dailyTotalVapeTimeLimit); if(startVapeTimerButton)startVapeTimerButton.disabled=isVapeTimerRunning; if(stopVapeTimerButton){stopVapeTimerButton.disabled=!isVapeTimerRunning;stopVapeTimerButton.style.display=isVapeTimerRunning?'inline-block':'none';} if(vapeTimerDisplay&&!isVapeTimerRunning){vapeTimerDisplay.textContent=formatTimerDisplay(0);vapeTimerDisplay.classList.remove('warning','counting-down');} }

    // renderSmokeLog - Unchanged (renders reason icon)
    function renderSmokeLog() { if (!smokeLogList) return; smokeLogList.innerHTML = ''; const lTR = smokeLog.slice(0, 30); if (lTR.length === 0) { if(noLogsPlaceholder)noLogsPlaceholder.style.display='block'; return; } else { if(noLogsPlaceholder)noLogsPlaceholder.style.display='none'; } lTR.forEach(log => { const lI = document.createElement('li'); lI.className = 'moment-card'; lI.style.opacity='1';lI.style.animation='none';lI.style.padding='8px';lI.style.marginBottom='8px'; const lT = new Date(log.timestamp).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}); const lD = new Date(log.timestamp).toLocaleDateString([],{month:'short',day:'numeric'}); let iC='';let iCo='';let t='';let d=''; let rIC=log.reason?'fas fa-comment-dots has-reason':'far fa-comment-dots'; if(log.type==='cigarette'){iC='fas fa-smoking';iCo='var(--theme-highlight-accent)';t='Cigarette';}else if(log.type==='vape'){iC='fas fa-vial';iCo='var(--theme-primary-accent)';t='Vape Session';d=log.duration?`(${formatTime(log.duration)})`:'';} lI.innerHTML=`<div class="log-item-content"><div class="log-item-details"><i class="${iC}" style="color: ${iCo}; margin-right: 8px; font-size: 18px;"></i><span>${t} ${d}</span></div><div class="log-item-reason-icon-container"><span class="log-item-time">${lD} @ ${lT}</span><i class="${rIC} add-reason-icon" data-timestamp="${log.timestamp}" title="${log.reason?'Edit Reason':'Add Reason'}"></i></div></div>`; smokeLogList.appendChild(lI); }); }

    // --- Reason Modal Logic (handleOpenReasonModal, handleCloseReasonModal, handleSaveReason - Unchanged) ---
    function handleOpenReasonModal(timestamp){const lE=smokeLog.find(log=>log.timestamp===timestamp);if(!lE||!reasonModalOverlay)return; reasonInput.value=lE.reason||'';reasonLogTimestampInput.value=timestamp;reasonModalOverlay.classList.add('show');reasonInput.focus();}
    function handleCloseReasonModal(){if(reasonModalOverlay)reasonModalOverlay.classList.remove('show'); reasonInput.value='';reasonLogTimestampInput.value='';}
    function handleSaveReason(){const t=parseInt(reasonLogTimestampInput.value);const nR=reasonInput.value.trim();if(isNaN(t))return; const lE=smokeLog.find(log=>log.timestamp===t);if(lE){lE.reason=nR;saveState();renderSmokeLog();showToast(nR?"Reason Saved!":"Reason Cleared.");} handleCloseReasonModal();}


    // --- NEW: Shop Toolbar Rendering and Interaction ---
    function renderThemeOptionsInToolbar() {
        if (!shopAccordionContent) return;
        shopAccordionContent.innerHTML = ''; // Clear previous options

        Object.entries(themes).forEach(([themeId, themeData]) => {
            if (ownedThemes.includes(themeId)) { // Only show owned themes
                const themeItem = document.createElement('div');
                themeItem.className = 'theme-item-toolbar';

                let previewHTML = '<div class="theme-item-toolbar-preview">';
                const colorKeys = ['--theme-primary-dark', '--theme-primary-accent', '--theme-secondary-accent']; // Show 3 colors
                for (let i = 0; i < 3; i++) {
                    previewHTML += `<span style="background-color: ${themeData.cssVariables[colorKeys[i]]};"></span>`;
                }
                previewHTML += '</div>';

                let actionHTML;
                if (currentTheme === themeId) {
                    actionHTML = `<span class="current-theme-indicator">CURRENT</span>`;
                } else {
                    actionHTML = `<button data-theme-id="${themeId}">APPLY</button>`;
                }

                themeItem.innerHTML = `
                    ${previewHTML}
                    <span class="theme-item-toolbar-name">${themeData.name}</span>
                    <span class="theme-item-toolbar-action">${actionHTML}</span>
                `;

                const applyButton = themeItem.querySelector('button');
                if (applyButton) {
                    applyButton.addEventListener('click', (e) => {
                        e.stopPropagation(); // Prevent header click
                        applyThemeOnPage(themeId);
                        showToast(`${themeData.name} theme applied!`);
                        // Re-render options to update 'CURRENT' indicator
                        renderThemeOptionsInToolbar();
                         // Optionally collapse toolbar after selection
                         // shopToolbar.classList.remove('expanded');
                         // shopToggleIcon.classList.remove('expanded');
                    });
                }
                shopAccordionContent.appendChild(themeItem);
            }
        });
         if (shopAccordionContent.children.length === 0) { // Handle case where only default is owned?
             shopAccordionContent.innerHTML = '<div style="text-align:center; padding: 10px; color: #888;">Visit Shop for more themes!</div>';
         }
    }

    // --- Event Listeners ---
    // Log Buttons
    if (logCigaretteButton) logCigaretteButton.addEventListener('click', logCigaretteEvent);
    if (startVapeTimerButton) startVapeTimerButton.addEventListener('click', startVapeTimer);
    if (stopVapeTimerButton) stopVapeTimerButton.addEventListener('click', () => stopVapeTimer(false));

    // Limit Buttons
    if (saveLimitButton && setLimitInput) { saveLimitButton.addEventListener('click', () => { const nL=parseInt(setLimitInput.value); if(!isNaN(nL)&&nL>=0){dailyCigaretteLimit=nL;updateStatusDisplay();checkAndWarnLimits();saveState();showToast(`Cigarette limit set to ${dailyCigaretteLimit}.`);} else {showToast("Invalid limit value.");setLimitInput.value=dailyCigaretteLimit;}}); }
    if (saveVapeSessionLimitButton && setVapeSessionLimitInput) { saveVapeSessionLimitButton.addEventListener('click', () => { const pS=parseMMSS(setVapeSessionLimitInput.value); if(pS!==null&&pS>=0){vapeSessionDurationLimit=pS;saveState();showToast(`Vape session limit set to ${formatTimerDisplay(vapeSessionDurationLimit)} ${pS===0?'(Count Up)':''}.`);setVapeSessionLimitInput.value=formatTimerDisplay(vapeSessionDurationLimit);} else {showToast("Invalid session limit format (MM:SS).");setVapeSessionLimitInput.value=formatTimerDisplay(vapeSessionDurationLimit);}}); }
    if (saveDailyVapeTimeLimitButton && setDailyVapeTimeLimitInput) { saveDailyVapeTimeLimitButton.addEventListener('click', () => { const nLM=parseInt(setDailyVapeTimeLimitInput.value); if(!isNaN(nLM)&&nLM>=0){dailyTotalVapeTimeLimit=nLM*60;updateStatusDisplay();checkAndWarnLimits();saveState();showToast(`Daily vape time limit set to ${nLM} minutes.`);} else {showToast("Invalid limit value (minutes).");setDailyVapeTimeLimitInput.value=Math.floor(dailyTotalVapeTimeLimit/60);}}); }

    // Reason Modal Listeners
    if (smokeLogList) { smokeLogList.addEventListener('click', (event) => { if(event.target.classList.contains('add-reason-icon')){ const t=parseInt(event.target.dataset.timestamp); if(!isNaN(t)){handleOpenReasonModal(t);}}}});}
    if (saveReasonButton) saveReasonButton.addEventListener('click', handleSaveReason);
    if (cancelReasonButton) cancelReasonButton.addEventListener('click', handleCloseReasonModal);
    if (reasonModalOverlay) reasonModalOverlay.addEventListener('click', (event) => { if(event.target===reasonModalOverlay){handleCloseReasonModal();}});

    // --- NEW: Shop Toolbar Listener ---
    if (shopToolbarHeader && shopToolbar && shopToggleIcon) {
        shopToolbarHeader.addEventListener('click', () => {
            const isExpanded = shopToolbar.classList.toggle('expanded');
            shopToggleIcon.classList.toggle('expanded', isExpanded); // Sync icon
            if (isExpanded) {
                renderThemeOptionsInToolbar(); // Render/update themes when opened
            }
        });
    }


    // --- Initial Setup ---
    loadState();
    applyThemeOnPage(currentTheme); // Apply theme *after* loading state
    checkDateAndResetCounts();
    updateHeaderDisplays(); // Includes toolbar points display
    updateStatusDisplay();
    renderSmokeLog();

    console.log("Smoke Tracker Initialized (v4 - Inline Theme Change).");
}); // End DOMContentLoaded
