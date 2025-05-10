// script.js
document.addEventListener('DOMContentLoaded', () => {
    const idkInput = document.getElementById('idkInput');
    const logButton = document.getElementById('logButton');
    const selectAllButton = document.getElementById('selectAllButton');
    const selectedCountDisplay = document.getElementById('selectedCount');
    const reviewedCountDisplay = document.getElementById('reviewedCountDisplay');
    const testKnowledgeButton = document.getElementById('testKnowledgeButton');
    const processSelectedButton = document.getElementById('processSelectedButton');
    const momentsList = document.getElementById('momentsList');
    const noMomentsPlaceholder = document.getElementById('noMomentsPlaceholder');
    const overallLoadingIndicator = document.getElementById('overallLoadingIndicator');
    const toastNotification = document.getElementById('toastNotification');
    const userPointsDisplay = document.getElementById('userPoints');
    const stupidPointsDisplay = document.getElementById('userStupidPoints');
    const goldStarsDisplay = document.getElementById('goldStars');

    const userApiKeyInput = document.getElementById('userApiKeyInput');
    const saveApiKeyButton = document.getElementById('saveApiKeyButton');

    const quizModalOverlay = document.getElementById('quizModalOverlay');
    // ... (other quiz consts)

    const archiveHeader = document.getElementById('archiveHeader');
    // ... (other accordion consts)

    const particleCanvas = document.getElementById('particleCanvas');
    const ctx = particleCanvas.getContext('2d');
    let particles = [];
    if (particleCanvas) { // Guard against shop page not having this
        particleCanvas.width = window.innerWidth;
        particleCanvas.height = window.innerHeight;
        window.addEventListener('resize', () => {
            if (particleCanvas) {
                particleCanvas.width = window.innerWidth;
                particleCanvas.height = window.innerHeight;
            }
        });
    }


    // Shop Toolbar elements on index.html
    const shopToolbar = document.getElementById('shopToolbar');
    const shopToolbarHeader = document.getElementById('shopToolbarHeader');
    const shopAccordionContent = document.getElementById('shopAccordionContent');
    const shopUserPointsDisplay = document.getElementById('shopUserPoints'); // For points in toolbar

    // --- SHARED DATA & CONFIG ---
    const localStorageKeySuffix = '_v27_theme_shop';
    const themes = {
        default: { name: "Default Retro", cost: 0, owned: true, description: "The classic look and feel.", cssVariables: { '--theme-primary-dark': '#264653', '--theme-primary-accent': '#2A9D8F', '--theme-secondary-accent': '#E9C46A', '--theme-tertiary-accent': '#F4A261', '--theme-highlight-accent': '#E76F51', '--theme-light-bg': '#EAEAEA', '--theme-card-bg': '#FFFFFF', '--theme-text-on-dark': '#EAEAEA', '--theme-page-bg': 'rgb(174, 217, 211)' } },
        oceanDepths: { name: "Ocean Depths", cost: 1, description: "Dive into cool blue tranquility.", cssVariables: { '--theme-primary-dark': '#03045E', '--theme-primary-accent': '#0077B6', '--theme-secondary-accent': '#00B4D8', '--theme-tertiary-accent': '#90E0EF', '--theme-highlight-accent': '#CAF0F8', '--theme-light-bg': '#E0FBFC', '--theme-card-bg': '#FFFFFF', '--theme-text-on-dark': '#CAF0F8', '--theme-page-bg': '#ADE8F4' } },
        volcanoRush: { name: "Volcano Rush", cost: 1, description: "Fiery reds and oranges.", cssVariables: { '--theme-primary-dark': '#2B0000', '--theme-primary-accent': '#6A0000', '--theme-secondary-accent': '#FF4500', '--theme-tertiary-accent': '#FF8C00', '--theme-highlight-accent': '#AE2012', '--theme-light-bg': '#FFF2E6', '--theme-card-bg': '#FFFFFF', '--theme-text-on-dark': '#FFDAB9', '--theme-page-bg': '#FFCDB2' } },
        techOrangeBlue: { name: "Tech Orange & Blue", cost: 1, description: "A modern tech-inspired palette.", cssVariables: { '--theme-primary-dark': '#004C97', '--theme-primary-accent': '#4A7DB5', '--theme-secondary-accent': '#FF6600', '--theme-tertiary-accent': '#C0C0C0', '--theme-highlight-accent': '#FF7700', '--theme-light-bg': '#F0F0F0', '--theme-card-bg': '#FFFFFF', '--theme-text-on-dark': '#F0F0F0', '--theme-page-bg': '#E8E8E8' } },
        forestGreens: { name: "Forest Greens", cost: 1, description: "Earthy and calming greens.", cssVariables: { '--theme-primary-dark': '#1A2B12', '--theme-primary-accent': '#335128', '--theme-secondary-accent': '#526F35', '--theme-tertiary-accent': '#8A9A5B', '--theme-highlight-accent': '#E0E7A3', '--theme-light-bg': '#F0F5E0', '--theme-card-bg': '#FFFFFF', '--theme-text-on-dark': '#E0E7A3', '--theme-page-bg': '#D8E0C0' } }
    };
    let currentTheme = localStorage.getItem('idk_current_theme' + localStorageKeySuffix) || 'default';
    // Note: userPoints, ownedThemes etc. are loaded from localStorage within their respective functions or globally if needed by both scripts.
    // For index.html, userPoints is loaded globally. ownedThemes is not directly used by index.html's JS beyond saving.
    let userPoints = parseInt(localStorage.getItem('idk_user_points_val' + localStorageKeySuffix)) || 0;
    let userStupidPoints = parseInt(localStorage.getItem('idk_user_stupid_points_val' + localStorageKeySuffix)) || 0;
    // --- END SHARED DATA & CONFIG ---


    if(userApiKeyInput && userProvidedApiKey) { // This is fine, userApiKeyInput only on index.html
        userApiKeyInput.value = userProvidedApiKey;
    }

    if(saveApiKeyButton) { // Fine
        saveApiKeyButton.addEventListener('click', () => {
            // ... (save API key logic)
            const newKey = userApiKeyInput.value.trim();
            if (newKey && (newKey.startsWith('sk-') || newKey.startsWith('sk-proj-'))) {
                userProvidedApiKey = newKey;
                localStorage.setItem('idk_user_openai_api_key' + localStorageKeySuffix, userProvidedApiKey);
                showToast("API KEY SAVED!");
            } else if (newKey === "") {
                userProvidedApiKey = "";
                localStorage.removeItem('idk_user_openai_api_key' + localStorageKeySuffix);
                showToast("API KEY CLEARED.");
            } else {
                showToast("INVALID API KEY FORMAT.");
            }
        });
    }

    function createParticle(x, y, color, size, count, spread, speedMultiplier = 1) { /* ... same ... */ }
    function updateAndDrawParticles() { /* ... same ... */ }
    function triggerParticleBurst(type = 'small', customX, customY) { /* ... same, ensure theme variables are used ... */ }
    function formatAnswerForRetroDisplay(text) { /* ... same ... */ }
    function showToast(message, duration = 2500) { /* ... same ... */ }
    function autoSetInitialType(text) { /* ... same ... */ }
    function triggerPointsFlash() { /* ... same ... */ }


    function applyThemeOnIndex(themeId) { // Renamed for clarity for index.html
        if (themes[themeId] && themes[themeId].cssVariables) { // Check cssVariables exists
            const themeVars = themes[themeId].cssVariables;
            for (const [key, value] of Object.entries(themeVars)) {
                document.documentElement.style.setProperty(key, value);
            }
            document.documentElement.style.setProperty('--theme-text-main', themeVars['--theme-primary-dark']);
            document.documentElement.style.setProperty('--theme-border-main', themeVars['--theme-primary-dark']);
        } else {
            console.warn(`Theme "${themeId}" or its CSS variables not found. Applying default.`);
            if (themes.default && themes.default.cssVariables) { // Apply default if specified theme fails
                 const defaultVars = themes.default.cssVariables;
                 for (const [key, value] of Object.entries(defaultVars)) {
                    document.documentElement.style.setProperty(key, value);
                }
                document.documentElement.style.setProperty('--theme-text-main', defaultVars['--theme-primary-dark']);
                document.documentElement.style.setProperty('--theme-border-main', defaultVars['--theme-primary-dark']);
            }
        }
    }

    function updateCountersAndPointsDisplay() {
        // This function is called from renderMoments, renderDeeply, etc.
        // It should only try to update elements that exist on index.html
        const reviewedCount = loggedMoments.filter(m => m.userMarkedReviewed).length;
        const reviewedWithAnswersCount = loggedMoments.filter(m => m.userMarkedReviewed && m.answer).length;

        if(reviewedCountDisplay) reviewedCountDisplay.textContent = `(${reviewedCount}/${loggedMoments.length} Reviewed)`;
        if(testKnowledgeButton) testKnowledgeButton.disabled = reviewedWithAnswersCount < 1;

        const selectedCount = loggedMoments.filter(m => m.selectedForBatch).length;
        if (selectedCountDisplay) { selectedCountDisplay.textContent = `${selectedCount} SEL`; }
        if(processSelectedButton) processSelectedButton.disabled = selectedCount === 0;

        if (loggedMoments.length > 0 && loggedMoments.length > 0) { // check loggedMoments length once
            if(selectAllButton) selectAllButton.textContent = (selectedCount === loggedMoments.length && selectedCount > 0) ? "DESEL. ALL" : "SEL. ALL";
        } else {
            if(selectAllButton) selectAllButton.textContent = "SEL. ALL";
        }

        if(userPointsDisplay) userPointsDisplay.textContent = userPoints;
        if (stupidPointsDisplay) { stupidPointsDisplay.textContent = userStupidPoints; }
        if (goldStarsDisplay) { goldStarsDisplay.textContent = deeplyUnderstoodKnowledge.length; }

        // Update points in the shop toolbar on index.html
        if (shopUserPointsDisplay) {
             shopUserPointsDisplay.textContent = userPoints;
        }
    }

    // --- SHOP TOOLBAR (INDEX.HTML) SPECIFIC LOGIC ---
    if (shopToolbar && shopToolbarHeader && shopAccordionContent) {
        shopToolbarHeader.addEventListener('click', (e) => {
            // Prevent toggling if the click was on the link itself (though link navigation takes precedence)
            if (e.target.closest('a')) return;
            // Simple navigation, or you could toggle a small link visible
            window.location.href = "shop.html";
        });

        // Set the content of the shop toolbar to be a link to the shop page
        shopAccordionContent.innerHTML = `
            <div class="theme-item" style="justify-content: center; padding: 10px; cursor:pointer;" onclick="window.location.href='shop.html'">
                <span class="shop-page-link-button">
                    <i class="fas fa-store"></i> VISIT THEME EMPORIUM
                </span>
            </div>`;
        // The CSS for .shop-page-link-button should ideally be in style.css if it's used here.
        // Or ensure the dynamic style injection is robust or added to style.css
        if (!document.getElementById('shopLinkButtonStyle')) {
            const styleSheet = document.createElement("style");
            styleSheet.id = 'shopLinkButtonStyle';
            styleSheet.innerText = `
                .shop-page-link-button { 
                    display: inline-block; padding: 8px 15px; 
                    background-color: var(--theme-secondary-accent); 
                    color: var(--theme-primary-dark); 
                    text-decoration: none; font-size: 16px; 
                    border: var(--pixel-border-width) solid var(--theme-primary-dark); 
                    box-shadow: 1px 1px 0 var(--theme-primary-dark);
                    transition: all 0.1s ease;
                }
                .shop-page-link-button:hover {
                    background-color: color-mix(in srgb, var(--theme-secondary-accent) 90%, black);
                    transform: translateY(-1px);
                    box-shadow: 2px 2px 0 var(--theme-primary-dark);
                }
                 .shop-page-link-button:active {
                    transform: translate(1px, 1px);
                    box-shadow: none;
                }
            `;
            document.head.appendChild(styleSheet);
        }
    }


    // --- CORE APP LOGIC (renderMoments, AI, Quiz, etc.) ---
    // ... (renderMoments function - ensure all getElementById are guarded with if(element))
    // ... (renderArchivedKnowledge function - guard element access)
    // ... (renderDeeplyUnderstoodKnowledge function - guard element access)
    // ... (handleCheckboxChange, handleTextContainerClick, etc. - should be fine if elements are specific to index.html)
    // ... (saveMoments - ensure it saves userPoints, ownedThemes, currentTheme correctly)
    // ... (All AI and Quiz logic)
    // --- Make sure all your existing functions from the previous full script.js are here ---
    // For brevity, I'm not pasting them all again, but they are crucial.
    // The error was not in those core functions, but in how shop elements were accessed.

    function renderMoments() {
        if (!momentsList) return;
        momentsList.innerHTML = '';
        const anyMoments = loggedMoments.length > 0;
        if(noMomentsPlaceholder) noMomentsPlaceholder.style.display = anyMoments ? 'none' : 'block';
        if(processSelectedButton) processSelectedButton.style.display = anyMoments ? 'block' : 'none';
        const listControlsBar = document.querySelector('.list-controls-bar');
        if (listControlsBar) listControlsBar.style.display = anyMoments ? 'flex' : 'none';

        loggedMoments.forEach((moment) => {
           const listItem = document.createElement('li'); listItem.className = `moment-card type-${moment.type}`; listItem.id = `moment-item-${moment.timestamp}`;
           if (moment.newlyAdded) { listItem.classList.add('newly-added'); setTimeout(() => { const el = document.getElementById(`moment-item-${moment.timestamp}`); if (el) el.classList.remove('newly-added'); moment.newlyAdded = false; }, 2000); }
           if (moment.type === 'statement' && moment.aiVerdict) { listItem.classList.add(`verdict-${moment.aiVerdict}`);}
           if (moment.userMarkedReviewed) { listItem.classList.add('user-reviewed');}
           let sT = '', sC = 'status-pending'; if (moment.type === 'question') { sT = 'QSTN'; sC = 'status-question'; } else if (moment.type === 'statement') { if (moment.aiVerdict === 'correct') { sT = 'OK'; sC = 'status-correct'; } else if (moment.aiVerdict === 'incorrect') { sT = 'X'; sC = 'status-incorrect'; } else if (moment.aiVerdict === 'unclear') { sT = '???'; sC = 'status-unclear'; } else { sT = 'STMT'; }}
           const pSHTML = '<span class="spinner-char"></span> PROCESSING...'; const dAT = (moment.type === 'statement' && !moment.aiVerdict) ? 'NEEDS VALIDATION.' : 'NO AI INSIGHT YET.'; const dAnswerHTML = moment.answer ? formatAnswerForRetroDisplay(moment.answer) : dAT; const aCHTML = moment.isProcessing || moment.isRegenerating ? pSHTML : dAnswerHTML; const reviewIconClass = moment.userMarkedReviewed ? 'fa-check-circle' : 'fa-book-open';
           listItem.innerHTML = `<div class="moment-header"><div class="moment-checkbox-container"><input type="checkbox" data-timestamp="${moment.timestamp}" ${moment.selectedForBatch ? 'checked' : ''}></div><div class="moment-text-container" data-timestamp="${moment.timestamp}"><div class="moment-main-text"><span class="moment-text">${moment.text}</span><span class="moment-timestamp">${new Date(moment.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} <span class="status-indicator ${sC}">${sT}</span></span></div><i class="fas fa-caret-down expand-icon ${moment.isAnswerExpanded ? 'expanded' : ''}"></i></div><div class="moment-actions"><button class="action-button review-button ${moment.userMarkedReviewed ? 'reviewed-true' : ''}" data-timestamp="${moment.timestamp}" title="${moment.userMarkedReviewed ? 'Mark Unreviewed' : 'Mark Reviewed'}"><i class="fas ${reviewIconClass}"></i></button></div></div><div class="moment-answer-wrapper ${moment.isAnswerExpanded ? 'expanded' : ''}"><div class="moment-answer-content" id="answer-content-${moment.timestamp}">${aCHTML}</div>${moment.answer && !moment.isProcessing && !moment.isRegenerating ? `<div class="regenerate-answer-button-container"><button class="regenerate-answer-button" data-timestamp="${moment.timestamp}" ${moment.hasBeenRegenerated ? 'disabled' : ''}><i class="fas fa-redo"></i> ${moment.hasBeenRegenerated ? "REGEN'D" : 'REGEN (1)'}</button></div>` : ''}</div>`;
           momentsList.appendChild(listItem);
           if (moment.isProcessing || moment.isRegenerating) { const acd = listItem.querySelector(`#answer-content-${moment.timestamp}`); if(acd) { const scs = acd.querySelector('.spinner-char'); if(scs && !moment.spinnerInterval) { let sCh = ["|", "/", "-", "\\"]; let cI = 0; moment.spinnerInterval = setInterval(() => { scs.textContent = sCh[cI++ % sCh.length]; }, 150);}}} else if (moment.spinnerInterval) { clearInterval(moment.spinnerInterval); moment.spinnerInterval = null; }
        });
        document.querySelectorAll('.moment-checkbox-container input[type="checkbox"]').forEach(cb => cb.addEventListener('change', handleCheckboxChange)); document.querySelectorAll('.moment-text-container').forEach(tc => tc.addEventListener('click', handleTextContainerClick)); document.querySelectorAll('.review-button').forEach(btn => btn.addEventListener('click', handleReviewButtonClick)); document.querySelectorAll('.regenerate-answer-button').forEach(btn => btn.addEventListener('click', handleRegenerateButtonClick));
        updateCountersAndPointsDisplay();
   }
   function renderArchivedKnowledge() {
       if(!archivedMomentsList || !noArchivedPlaceholder) return;
       archivedMomentsList.innerHTML = ''; if (archivedKnowledge.length === 0) { noArchivedPlaceholder.style.display = 'block'; return; } noArchivedPlaceholder.style.display = 'none';
       archivedKnowledge.forEach((moment) => { const listItem = document.createElement('li'); listItem.className = 'moment-card archived-moment-card'; listItem.classList.add(`type-${moment.type}`); if (moment.type === 'statement' && moment.aiVerdict) { listItem.classList.add(`verdict-${moment.aiVerdict}`); } if (moment.isRevisedForDeepTest) { listItem.classList.add('archive-revised');}
       let sT = '', sC = 'status-pending'; if (moment.type === 'question') { sT = 'QSTN'; sC = 'status-question';} else if (moment.type === 'statement') { if (moment.aiVerdict === 'correct') { sT = 'OK'; sC = 'status-correct'; } else if (moment.aiVerdict === 'incorrect') { sT = 'X'; sC = 'status-incorrect'; } else if (moment.aiVerdict === 'unclear') { sT = '???'; sC = 'status-unclear'; } else { sT = 'STMT'; }}
       const dAnswerHTML = moment.answer ? formatAnswerForRetroDisplay(moment.answer) : 'Archived without answer data.'; const deepDiveAnswerHTML = moment.deepDiveAnswer ? formatAnswerForRetroDisplay(moment.deepDiveAnswer) : ''; const reviseIconClass = moment.isRevisedForDeepTest ? 'fa-check-square' : 'fa-book-reader'; const canTakeDeepDiveTest = moment.isRevisedForDeepTest && moment.deepDiveAnswer;
       listItem.innerHTML = `<div class="moment-header"><div class="moment-text-container" data-timestamp="${moment.timestamp}"><div class="moment-main-text"><span class="moment-text">${moment.text}</span><span class="moment-timestamp">ARCHIVED: ${new Date(moment.archivedTimestamp || moment.timestamp).toLocaleDateString()} <span class="status-indicator ${sC}">${sT}</span></span></div><i class="fas fa-caret-down expand-icon ${moment.isAnswerExpanded ? 'expanded' : ''}"></i></div><div class="moment-actions"><button class="action-button deep-dive-button" data-timestamp="${moment.timestamp}" title="Deepen Understanding"><i class="fas fa-brain"></i></button><button class="action-button archive-revise-button ${moment.isRevisedForDeepTest ? 'archive-revised-true' : ''}" data-timestamp="${moment.timestamp}" title="${moment.isRevisedForDeepTest ? 'Mark Unrevised' : 'Mark Revised for Deep Test'}"><i class="fas ${reviseIconClass}"></i></button><button class="action-button archive-deep-dive-test-button" data-timestamp="${moment.timestamp}" title="Take Deep Dive Test" ${!canTakeDeepDiveTest ? 'disabled' : ''}><i class="fas fa-vial"></i> Test</button></div></div><div class="moment-answer-wrapper ${moment.isAnswerExpanded ? 'expanded' : ''}"><div class="moment-answer-content"><strong>Original Insight:</strong><br>${dAnswerHTML}</div>${moment.deepDiveAnswer || moment.isDeepDiveProcessing ? `<div class="deep-dive-answer-container"><div class="moment-answer-content" id="deep-dive-answer-${moment.timestamp}">${moment.isDeepDiveProcessing ? '<span class="spinner-char"></span> DEEPENING...' : deepDiveAnswerHTML}</div></div>` : ''}</div>`;
       archivedMomentsList.appendChild(listItem);
       listItem.querySelector('.moment-text-container').addEventListener('click', () => { const aM = archivedKnowledge.find(am => am.timestamp === moment.timestamp); if(aM) { aM.isAnswerExpanded = !aM.isAnswerExpanded; saveMoments(); renderArchivedKnowledge(); }});
       listItem.querySelector('.deep-dive-button').addEventListener('click', (e) => { e.stopPropagation(); handleDeepDiveClick(moment.timestamp); });
       listItem.querySelector('.archive-revise-button').addEventListener('click', (e) => { e.stopPropagation(); toggleArchiveRevisedStatus(moment.timestamp); });
       listItem.querySelector('.archive-deep-dive-test-button').addEventListener('click', (e) => { e.stopPropagation(); if(canTakeDeepDiveTest) startDeepDiveQuiz(moment); }); });
       updateCountersAndPointsDisplay();
   }
    function renderDeeplyUnderstoodKnowledge() {
       if(!deepenedMomentsList || !noDeepenedPlaceholder) return;
       deepenedMomentsList.innerHTML = '';
       noDeepenedPlaceholder.style.display = deeplyUnderstoodKnowledge.length === 0 ? 'block' : 'none';

       deeplyUnderstoodKnowledge.forEach((moment) => {
           const listItem = document.createElement('li');
           listItem.className = 'moment-card deepened-moment-card';
           listItem.dataset.timestamp = moment.timestamp;
           const displayAnswerHTML = moment.answer ? formatAnswerForRetroDisplay(moment.answer) : '';
           const deepDiveAnswerHTML = moment.deepDiveAnswer ? formatAnswerForRetroDisplay(moment.deepDiveAnswer) : '';
           listItem.innerHTML = `<div class="moment-header"><div class="moment-text-container" data-timestamp="${moment.timestamp}"><div class="moment-main-text"><span class="moment-text">${moment.text}</span><span class="moment-timestamp">MASTERED: ${new Date(moment.deeplyUnderstoodTimestamp || Date.now()).toLocaleDateString()}</span></div><i class="fas fa-caret-down expand-icon ${moment.isAnswerExpanded ? 'expanded' : ''}"></i></div></div><div class="moment-answer-wrapper ${moment.isAnswerExpanded ? 'expanded' : ''}">${moment.answer ? `<div class="moment-answer-content"><strong>Original Insight:</strong><br>${displayAnswerHTML}</div>` : ''}${moment.deepDiveAnswer ? `<div class="deep-dive-answer-container"><div class="moment-answer-content"><strong>Deep Dive:</strong><br>${deepDiveAnswerHTML}</div></div>` : ''}</div>`;
           deepenedMomentsList.appendChild(listItem);

           listItem.querySelector('.moment-text-container').addEventListener('click', (event) => {
               const deepMoment = deeplyUnderstoodKnowledge.find(dm => dm.timestamp === moment.timestamp);
               if (deepMoment) {
                   deepMoment.isAnswerExpanded = !deepMoment.isAnswerExpanded;
                   deepMoment.justClickedForCelebration = true;
                   saveMoments();
                   renderDeeplyUnderstoodKnowledge();
               }
           });
       });

       deeplyUnderstoodKnowledge.forEach(moment => {
           if (moment.justClickedForCelebration) {
               const cardElement = deepenedMomentsList.querySelector(`.deepened-moment-card[data-timestamp="${moment.timestamp}"]`);
               if (cardElement) {
                   cardElement.classList.add('mastered-celebrate-pop');
                   const rect = cardElement.getBoundingClientRect();
                   const particleX = rect.left + rect.width / 2;
                   const particleY = rect.top + rect.height / 2;
                   triggerParticleBurst('masteredItem', particleX, particleY);
                   showToast("MASTERED! WELL DONE!", 1500);

                   setTimeout(() => {
                       cardElement.classList.remove('mastered-celebrate-pop');
                   }, 500);
               }
               delete moment.justClickedForCelebration;
               // saveMoments(); // No need to save for a transient UI flag removal here, saveMoments in parent call handles it
           }
       });
       updateCountersAndPointsDisplay();
   }
   function handleCheckboxChange(event) { const ts = parseInt(event.target.dataset.timestamp); const mom = loggedMoments.find(m => m.timestamp === ts); if (mom) mom.selectedForBatch = event.target.checked; saveMoments(); updateCountersAndPointsDisplay(); }
   function handleTextContainerClick(event) { const ts = parseInt(event.currentTarget.dataset.timestamp); const mom = loggedMoments.find(m => m.timestamp === ts); if (mom && !mom.answer && !mom.isProcessing && !mom.isRegenerating) { const liEl = document.getElementById(`moment-item-${ts}`); fetchSingleAIAnswer(mom, liEl, true);} else { toggleAnswerExpansion(ts);}}
   function handleReviewButtonClick(event) { const ts = parseInt(event.currentTarget.dataset.timestamp); toggleUserReviewedStatus(ts); }
   function handleRegenerateButtonClick(event) { const ts = parseInt(event.currentTarget.dataset.timestamp); const mom = loggedMoments.find(m => m.timestamp === ts); const liEl = document.getElementById(`moment-item-${ts}`); if (mom && liEl && !mom.hasBeenRegenerated) { regenerateAIAnswer(mom, liEl); } }
   function toggleAnswerExpansion(timestamp) { const m = loggedMoments.find(mo => mo.timestamp === timestamp); if (m) {m.isAnswerExpanded = !m.isAnswerExpanded; saveMoments(); renderMoments();}}
   function saveMoments() { // This saveMoments is for index.html context
       // It saves main app data and also shared theme/points data
       deeplyUnderstoodKnowledge.forEach(m => {
           if (Object.prototype.hasOwnProperty.call(m, 'justClickedForCelebration')) {
               delete m.justClickedForCelebration;
           }
       });
       localStorage.setItem('idk_moments' + localStorageKeySuffix, JSON.stringify(loggedMoments));
       localStorage.setItem('idk_archived_knowledge' + localStorageKeySuffix, JSON.stringify(archivedKnowledge));
       localStorage.setItem('idk_deeply_understood' + localStorageKeySuffix, JSON.stringify(deeplyUnderstoodKnowledge));
       localStorage.setItem('idk_user_points_val' + localStorageKeySuffix, userPoints.toString());
       localStorage.setItem('idk_user_stupid_points_val' + localStorageKeySuffix, userStupidPoints.toString());
       // These are primarily managed by shop-script.js but good to save from here if they were somehow changed globally
       let ownedThemesFromStorage = JSON.parse(localStorage.getItem('idk_owned_themes' + localStorageKeySuffix)) || ['default'];
       localStorage.setItem('idk_owned_themes' + localStorageKeySuffix, JSON.stringify(ownedThemesFromStorage));
       localStorage.setItem('idk_current_theme' + localStorageKeySuffix, currentTheme);
   }
   function toggleUserReviewedStatus(timestamp) { const m = loggedMoments.find(mo => mo.timestamp === timestamp); if (m) { m.userMarkedReviewed = !m.userMarkedReviewed; showToast(m.userMarkedReviewed ? "REVIEWED!" : "UNREVIEWED."); saveMoments(); renderMoments(); renderArchivedKnowledge(); renderDeeplyUnderstoodKnowledge(); } }
   function toggleArchiveRevisedStatus(timestamp) { const moment = archivedKnowledge.find(m => m.timestamp === timestamp); if (moment) { moment.isRevisedForDeepTest = !moment.isRevisedForDeepTest; showToast(moment.isRevisedForDeepTest ? "REVISED FOR DEEPER TEST!" : "Marked Unrevised."); saveMoments(); renderArchivedKnowledge(); }}
   async function handleDeepDiveClick(timestamp) {
       const moment = archivedKnowledge.find(m => m.timestamp === timestamp);
       if (!moment || moment.isDeepDiveProcessing) return;
       moment.isDeepDiveProcessing = true; moment.isAnswerExpanded = true; renderArchivedKnowledge();
       try {
           const deepDiveText = await fetchAIAnswerLogic(null, false, false, null, true, moment);
           moment.deepDiveAnswer = deepDiveText; showToast("Knowledge Deepened!");
       } catch (e) { console.error("Error fetching deep dive:", e); moment.deepDiveAnswer = `DEEP DIVE ERROR: ${e.message}`; }
       finally { moment.isDeepDiveProcessing = false; saveMoments(); renderArchivedKnowledge(); }
   }
   if(logButton) { // Ensure logButton exists before adding listener
        logButton.addEventListener('click', () => {
            const t = idkInput.value.trim();
            if (t) {
                const iT = autoSetInitialType(t);
                loggedMoments.unshift({text: t, timestamp: Date.now(), type: iT, aiVerdict: null, userMarkedReviewed: false, answer: null, isAnswerExpanded: false, hasBeenRegenerated: false, selectedForBatch: false, isProcessing: false, isRegenerating: false, newlyAdded: true, spinnerInterval: null, deepDiveAnswer: null, isRevisedForDeepTest: false, isDeepDiveProcessing: false, isDeeplyUnderstood: false});
                idkInput.value = ''; showToast("MOMENT LOGGED!");
                saveMoments(); renderMoments(); renderArchivedKnowledge(); renderDeeplyUnderstoodKnowledge();
            } else { showToast("INPUT TEXT REQUIRED."); }
        });
   }
   if(selectAllButton) {
        selectAllButton.addEventListener('click', () => {
            const allSelected = loggedMoments.length > 0 && loggedMoments.every(m => m.selectedForBatch);
            const targetState = !allSelected;
            loggedMoments.forEach(m => m.selectedForBatch = targetState);
            saveMoments(); renderMoments();
        });
   }
   // AI Prompts and fetchAIAnswerLogic function ...
   const AI_MCQ_PROMPT_SYSTEM = `...`; // Keep full prompts
   const AI_DEEPEN_UNDERSTANDING_PROMPT_SYSTEM = `...`;
   const AI_DEEP_DIVE_MCQ_PROMPT_SYSTEM = `...`;
   const AI_STATEMENT_SYSTEM_PROMPT = `...`;
   const AI_REGENERATE_SYSTEM_PROMPT = `...`;
   async function fetchAIAnswerLogic(moment, isRegeneration = false, isQuizQuestionGen = false, quizMomentContext = null, isDeepDiveGen = false, deepDiveContext = null, isDeepDiveMCQGen = false, deepDiveQuestionNumber = 1) { /* ... same full function ... */ }
   async function fetchSingleAIAnswer(moment, listItemElement, expandAfterFetch = false) { /* ... same full function ... */ }
   async function regenerateAIAnswer(moment, listItemElement) { /* ... same full function ... */ }
   if(processSelectedButton) {
        processSelectedButton.addEventListener('click', async () => { /* ... same full function ... */ });
   }
   // Quiz logic (startQuiz, displayMCQQuestion, selectQuizOption, submitQuizAnswerButton, next/finish/close quiz) ...
   async function startQuiz(isForArchivedItem = false, specificArchivedMoment = null) { /* ... same full function ... */ }
   function displayMCQQuestion() { /* ... same full function ... */ }
   function selectQuizOption(optionDiv, optionText) { /* ... same full function ... */ }
   if(submitQuizAnswerButton) submitQuizAnswerButton.addEventListener('click', () => { /* ... same full function ... */ });
   if(nextQuizQuestionButton) nextQuizQuestionButton.addEventListener('click', () => { currentQuizQuestionIndex++; displayMCQQuestion(); });
   if(finishQuizButton) finishQuizButton.addEventListener('click', finishMCQQuiz);
   if(closeQuizButton) closeQuizButton.addEventListener('click', () => { quizModalOverlay.classList.remove('show'); });
   function finishMCQQuiz() { /* ... same full function ... */ }

   // Accordion listeners (ensure elements exist)
   if(archiveHeader) archiveHeader.addEventListener('click', () => { archivedItemsListContainer.classList.toggle('expanded'); archiveToggleIcon.classList.toggle('expanded'); });
   if(deepenedHeader) deepenedHeader.addEventListener('click', () => { deepenedItemsListContainer.classList.toggle('expanded'); deepenedToggleIcon.classList.toggle('expanded'); });


    // Initial calls for index.html
    applyThemeOnIndex(currentTheme); // Apply theme first
    renderMoments();
    renderArchivedKnowledge();
    renderDeeplyUnderstoodKnowledge(); // This also calls updateCountersAndPointsDisplay
    // updateCountersAndPointsDisplay(); // Called by renders above, especially renderDeeply...
    if (shopUserPointsDisplay) shopUserPointsDisplay.textContent = userPoints; // Ensure toolbar points are set
});
