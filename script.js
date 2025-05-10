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
    const quizModalTitle = document.getElementById('quizModalTitle');
    const quizQuestionNumber = document.getElementById('quizQuestionNumber');
    const quizQuestionText = document.getElementById('quizQuestionText');
    const quizOptionsContainer = document.getElementById('quizOptionsContainer');
    const quizFeedbackArea = document.getElementById('quizFeedbackArea');
    const submitQuizAnswerButton = document.getElementById('submitQuizAnswerButton');
    const nextQuizQuestionButton = document.getElementById('nextQuizQuestionButton');
    const finishQuizButton = document.getElementById('finishQuizButton');
    const closeQuizButton = document.getElementById('closeQuizButton');

    const archiveHeader = document.getElementById('archiveHeader');
    const archiveToggleIcon = document.getElementById('archiveToggleIcon');
    const archivedItemsListContainer = document.getElementById('archivedItemsListContainer');
    const archivedMomentsList = document.getElementById('archivedMomentsList');
    const noArchivedPlaceholder = document.getElementById('noArchivedPlaceholder');

    const deepenedHeader = document.getElementById('deepenedHeader');
    const deepenedToggleIcon = document.getElementById('deepenedToggleIcon');
    const deepenedItemsListContainer = document.getElementById('deepenedItemsListContainer');
    const deepenedMomentsList = document.getElementById('deepenedMomentsList');
    const noDeepenedPlaceholder = document.getElementById('noDeepenedPlaceholder');

    const particleCanvas = document.getElementById('particleCanvas');
    const ctx = particleCanvas.getContext('2d');
    let particles = [];
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
    window.addEventListener('resize', () => { particleCanvas.width = window.innerWidth; particleCanvas.height = window.innerHeight; });

    // Shop UI Elements
    const shopToolbar = document.getElementById('shopToolbar');
    const shopToolbarHeader = document.getElementById('shopToolbarHeader');
    const shopAccordionContent = document.getElementById('shopAccordionContent');
    const shopUserPointsDisplay = document.getElementById('shopUserPoints');

    // Ambient Particle Effect Variables
    let ambientEmitters = [];
    const AMBIENT_PARTICLE_RATE = 2;
    const AMBIENT_PARTICLE_LIFESPAN_FACTOR = 4;

    let localStorageKeySuffix = '_v28_ambient_particles_fix'; // Updated suffix
    let loggedMoments = JSON.parse(localStorage.getItem('idk_moments' + localStorageKeySuffix)) || [];
    let archivedKnowledge = JSON.parse(localStorage.getItem('idk_archived_knowledge' + localStorageKeySuffix)) || [];
    let deeplyUnderstoodKnowledge = JSON.parse(localStorage.getItem('idk_deeply_understood' + localStorageKeySuffix)) || [];
    let userPoints = parseInt(localStorage.getItem('idk_user_points_val' + localStorageKeySuffix)) || 0;
    let userStupidPoints = parseInt(localStorage.getItem('idk_user_stupid_points_val' + localStorageKeySuffix)) || 0;
    let userProvidedApiKey = localStorage.getItem('idk_user_openai_api_key' + localStorageKeySuffix) || '';

    const themes = {
        default: {
            name: "Default Retro", cost: 0, owned: true,
            cssVariables: {
                '--theme-primary-dark': '#264653', '--theme-primary-accent': '#2A9D8F', '--theme-secondary-accent': '#E9C46A',
                '--theme-tertiary-accent': '#F4A261', '--theme-highlight-accent': '#E76F51', '--theme-light-bg': '#EAEAEA',
                '--theme-card-bg': '#FFFFFF', '--theme-text-on-dark': '#EAEAEA', '--theme-page-bg': 'rgb(174, 217, 211)'
            }
        },
        oceanDepths: {
            name: "Ocean Depths", cost: 50,
            cssVariables: {
                '--theme-primary-dark': '#03045E', '--theme-primary-accent': '#0077B6', '--theme-secondary-accent': '#00B4D8',
                '--theme-tertiary-accent': '#90E0EF', '--theme-highlight-accent': '#CAF0F8', '--theme-light-bg': '#E0FBFC',
                '--theme-card-bg': '#FFFFFF', '--theme-text-on-dark': '#CAF0F8', '--theme-page-bg': '#ADE8F4'
            }
        },
        volcanoRush: {
            name: "Volcano Rush", cost: 75,
            cssVariables: {
                '--theme-primary-dark': '#2B0000', '--theme-primary-accent': '#6A0000', '--theme-secondary-accent': '#FF4500',
                '--theme-tertiary-accent': '#FF8C00', '--theme-highlight-accent': '#AE2012', '--theme-light-bg': '#FFF2E6',
                '--theme-card-bg': '#FFFFFF', '--theme-text-on-dark': '#FFDAB9', '--theme-page-bg': '#FFCDB2'
            }
        }
    };
    let ownedThemes = JSON.parse(localStorage.getItem('idk_owned_themes' + localStorageKeySuffix)) || ['default'];
    let currentTheme = localStorage.getItem('idk_current_theme' + localStorageKeySuffix) || 'default';

    let currentQuizQuestionsData = [];
    let currentQuizQuestionIndex = 0;
    let currentQuizCorrectAnswersCount = 0;
    let selectedQuizOptionElement = null;
    let isDeepDiveQuiz = false;
    let currentDeepDiveQuizMoment = null;

    if(userApiKeyInput && userProvidedApiKey) {
        userApiKeyInput.value = userProvidedApiKey;
    }

    if(saveApiKeyButton) {
        saveApiKeyButton.addEventListener('click', () => {
            const newKey = userApiKeyInput.value.trim();
            if (newKey && (newKey.startsWith('sk-') || newKey.startsWith('sk-proj-'))) {
                userProvidedApiKey = newKey;
                localStorage.setItem('idk_user_openai_api_key' + localStorageKeySuffix, userProvidedApiKey);
                showToast("API KEY SAVED!");
            } else if (newKey === "") {
                userProvidedApiKey = "";
                localStorage.removeItem('idk_user_openai_api_key' + localStorageKeySuffix);
                showToast("API KEY CLEARED.");
            }else {
                showToast("INVALID API KEY FORMAT.");
            }
        });
    }

    function createParticle(x, y, color, size, count, spread, speedMultiplier = 1, type = "burst") {
        for (let i = 0; i < count; i++) {
            let particleLife = 60 + Math.random() * 30;
            let particleSize = Math.random() * size + 2;
            let vx = (Math.random() - 0.5) * spread * speedMultiplier;
            let vy = (Math.random() - 0.5) * spread * speedMultiplier;

            if (type === "ambientFocus") {
                particleLife = (90 + Math.random() * 60) * AMBIENT_PARTICLE_LIFESPAN_FACTOR;
                particleSize = Math.random() * (size - 1) + 1;
                const angle = Math.random() * Math.PI * 2;
                const emitSpeed = (Math.random() * 0.2 + 0.05) * speedMultiplier;
                vx = Math.cos(angle) * emitSpeed;
                vy = Math.sin(angle) * emitSpeed;
            }

            particles.push({
                x, y, size: particleSize, color, vx, vy,
                life: particleLife, initialLife: particleLife, type
            });
        }
    }

    function updateAndDrawParticles() {
        ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

        ambientEmitters.forEach(emitter => {
            if (emitter.isActive && emitter.element) {
                const rect = emitter.element.getBoundingClientRect();
                // Check if the element is actually visible and has dimensions
                if (rect.height > 0 && rect.width > 0 && emitter.element.classList.contains('expanded')) {
                    const themeColor = getComputedStyle(document.documentElement).getPropertyValue(emitter.colorVar).trim() || themes.default.cssVariables[emitter.colorVar];
                    
                    for (let i = 0; i < AMBIENT_PARTICLE_RATE; i++) {
                        let x, y;
                        const edgeChoice = Math.random();
                        const particleOffset = 3;

                        if (edgeChoice < 0.25) {
                            x = rect.left + Math.random() * rect.width;
                            y = rect.top - particleOffset;
                        } else if (edgeChoice < 0.5) {
                            x = rect.left + Math.random() * rect.width;
                            y = rect.bottom + particleOffset;
                        } else if (edgeChoice < 0.75) {
                            x = rect.left - particleOffset;
                            y = rect.top + Math.random() * rect.height;
                        } else {
                            x = rect.right + particleOffset;
                            y = rect.top + Math.random() * rect.height;
                        }
                        createParticle(x, y, themeColor, 2.5, 1, 0.2, 0.2, "ambientFocus");
                    }
                }
            }
        });

        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            if (p.type !== "ambientFocus") {
                p.vy += 0.05;
            } else {
                p.vx *= 0.98;
                p.vy *= 0.98;
            }
            p.life--;

            if (p.life <= 0) {
                particles.splice(i, 1);
                continue;
            }
            ctx.fillStyle = p.color;
            const alphaFactor = p.type === "ambientFocus" ? (p.life / p.initialLife) * 0.35 : p.life / 90;
            ctx.globalAlpha = Math.max(0, Math.min(1, alphaFactor));
            ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
        }
        ctx.globalAlpha = 1;
        requestAnimationFrame(updateAndDrawParticles);
    }

    function triggerParticleBurst(type = 'small', customX, customY) {
        const cX = customX !== undefined ? customX : window.innerWidth / 2;
        const cY = customY !== undefined ? customY : window.innerHeight / 3;
        let clr, sz, cnt, sprd, spd;
        const defaultColorVar = '--theme-secondary-accent'; 

        if (type === 'perfectQuiz') {
            clr = getComputedStyle(document.documentElement).getPropertyValue('--theme-secondary-accent').trim() || themes.default.cssVariables[defaultColorVar];
            sz = 8; cnt = 100; sprd = 8; spd = 1.5;
        } else if (type === 'correctAnswer') {
            clr = getComputedStyle(document.documentElement).getPropertyValue('--theme-primary-accent').trim() || themes.default.cssVariables['--theme-primary-accent'];
            sz = 6; cnt = 50; sprd = 5; spd = 1;
        } else if (type === 'dumbAnswer') {
            clr = getComputedStyle(document.documentElement).getPropertyValue('--theme-highlight-accent').trim() || themes.default.cssVariables['--theme-highlight-accent'];
            sz = 5; cnt = 30; sprd = 4; spd = 0.8;
        } else if (type === 'masteredItem') {
            clr = getComputedStyle(document.documentElement).getPropertyValue('--theme-secondary-accent').trim() || themes.default.cssVariables[defaultColorVar];
            sz = 7; cnt = 40; sprd = 6; spd = 1.2;
        } else { // Default burst if type not recognized
             clr = getComputedStyle(document.documentElement).getPropertyValue('--theme-tertiary-accent').trim() || themes.default.cssVariables['--theme-tertiary-accent'];
             sz = 4; cnt = 20; sprd = 3; spd = 1;
        }

        createParticle(cX, cY, clr, sz, cnt, sprd, spd, "burst");
    }

    function formatAnswerForRetroDisplay(text) { if (!text || typeof text !== 'string') return text; const p = '     > '; let h = text.split('\n').map(l => l.trim() === '' ? '' : p + l).join('<br>'); h = h.replace(/^<br>\s*/, '').replace(/\s*<br>$/, ''); h = h.replace(/(<br>\s*){2,}/g, '<br>'); return h; }
    function showToast(message, duration = 2500) { toastNotification.textContent = message; toastNotification.classList.add('show'); setTimeout(() => { toastNotification.classList.remove('show'); }, duration); }
    function autoSetInitialType(text) { const lT = text.toLowerCase().trim(); if (lT.endsWith('?')) return 'question'; const qS = ['what', 'when', 'where', 'who', 'why', 'how', 'is ', 'are ', 'do ', 'does ', 'did ', 'can ', 'could ', 'will ', 'would ', 'should ', 'may ', 'might ']; for (const s of qS) { if (lT.startsWith(s)) return 'question'; } return 'statement'; }
    function triggerPointsFlash() {
        const mainPointsDisplay = document.querySelector('.header-stats-bar .points-display:first-child');
        if(mainPointsDisplay) mainPointsDisplay.classList.add('points-earned-flash');
        setTimeout(() => { if(mainPointsDisplay) mainPointsDisplay.classList.remove('points-earned-flash'); }, 500);
    }

    function updateCountersAndPointsDisplay() {
        const reviewedCount = loggedMoments.filter(m => m.userMarkedReviewed).length;
        const reviewedWithAnswersCount = loggedMoments.filter(m => m.userMarkedReviewed && m.answer).length;
        if(reviewedCountDisplay) reviewedCountDisplay.textContent = `(${reviewedCount}/${loggedMoments.length} Reviewed)`;
        if(testKnowledgeButton) testKnowledgeButton.disabled = reviewedWithAnswersCount < 1;

        const selectedCount = loggedMoments.filter(m => m.selectedForBatch).length;
        if (selectedCountDisplay) { selectedCountDisplay.textContent = `${selectedCount} SEL`; }
        if(processSelectedButton) processSelectedButton.disabled = selectedCount === 0;

        if (loggedMoments.length > 0) {
            if(selectAllButton) selectAllButton.textContent = (selectedCount === loggedMoments.length && selectedCount > 0) ? "DESEL. ALL" : "SEL. ALL";
        } else {
            if(selectAllButton) selectAllButton.textContent = "SEL. ALL";
        }
        if(userPointsDisplay) userPointsDisplay.textContent = userPoints;
        if (stupidPointsDisplay) { stupidPointsDisplay.textContent = userStupidPoints; }
        if (goldStarsDisplay) { goldStarsDisplay.textContent = deeplyUnderstoodKnowledge.length; }
        if (shopUserPointsDisplay) shopUserPointsDisplay.textContent = userPoints;
        renderShopItems();
    }

    function applyTheme(themeId) {
        if (themes[themeId]) {
            const themeVars = themes[themeId].cssVariables;
            for (const [key, value] of Object.entries(themeVars)) {
                document.documentElement.style.setProperty(key, value);
            }
            document.documentElement.style.setProperty('--theme-text-main', themeVars['--theme-primary-dark']);
            document.documentElement.style.setProperty('--theme-border-main', themeVars['--theme-primary-dark']);

            currentTheme = themeId;
            localStorage.setItem('idk_current_theme' + localStorageKeySuffix, currentTheme);
            renderShopItems();
        }
    }

    function renderShopItems() {
        if (!shopAccordionContent) return;
        document.querySelectorAll('.theme-item').forEach(item => {
            const themeId = item.dataset.themeId;
            const themeData = themes[themeId];
            const button = item.querySelector('.theme-button');
            const costSpan = item.querySelector('.theme-cost');
            const statusSpan = item.querySelector('.theme-status');

            if (ownedThemes.includes(themeId)) {
                if (costSpan) costSpan.style.display = 'none';
                if (statusSpan) {
                    statusSpan.style.display = 'inline';
                    statusSpan.textContent = (currentTheme === themeId) ? "EQUIPPED" : "";
                }
                button.textContent = "APPLY";
                button.classList.add('apply-button');
                button.disabled = (currentTheme === themeId);
            } else {
                if (costSpan) costSpan.style.display = 'inline-block';
                if (statusSpan) statusSpan.style.display = 'none';
                button.textContent = "BUY";
                button.classList.remove('apply-button');
                button.disabled = (userPoints < themeData.cost);
            }
        });
        if(shopUserPointsDisplay) shopUserPointsDisplay.textContent = userPoints;
    }

    if (shopToolbarHeader) {
        shopToolbarHeader.addEventListener('click', () => {
            shopToolbar.classList.toggle('expanded');
        });
    }

    document.querySelectorAll('.theme-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const themeId = e.target.dataset.themeId;
            const themeData = themes[themeId];

            if (ownedThemes.includes(themeId)) {
                applyTheme(themeId);
                showToast(`${themes[themeId].name} theme APPLIED!`);
            } else {
                if (userPoints >= themeData.cost) {
                    userPoints -= themeData.cost;
                    ownedThemes.push(themeId);
                    localStorage.setItem('idk_owned_themes' + localStorageKeySuffix, JSON.stringify(ownedThemes));
                    saveMoments();
                    updateCountersAndPointsDisplay();
                    applyTheme(themeId);
                    showToast(`Purchased & Applied ${themeData.name}!`);
                } else {
                    showToast("Not enough PTS!");
                }
            }
        });
    });

    function updateAmbientEmitters(targetEmitterContainerId, isExpanding) {
        ambientEmitters.forEach(emitter => {
            if (emitter.id === targetEmitterContainerId) {
                emitter.isActive = isExpanding;
                if (isExpanding) {
                    emitter.element = document.getElementById(targetEmitterContainerId); // Ensure element ref is current
                }
            } else {
                emitter.isActive = false;
            }
        });
    }
    
    if (archivedItemsListContainer) {
        ambientEmitters.push({ id: 'archivedItemsListContainer', element: archivedItemsListContainer, isActive: false, colorVar: '--theme-primary-accent' });
    }
    if (deepenedItemsListContainer) {
        ambientEmitters.push({ id: 'deepenedItemsListContainer', element: deepenedItemsListContainer, isActive: false, colorVar: '--theme-secondary-accent' });
    }

    if (archiveHeader) {
        archiveHeader.addEventListener('click', () => {
            const isNowExpanded = archivedItemsListContainer.classList.toggle('expanded');
            archiveToggleIcon.classList.toggle('expanded');
            updateAmbientEmitters('archivedItemsListContainer', isNowExpanded);
            if (isNowExpanded && deepenedItemsListContainer.classList.contains('expanded')) {
                deepenedItemsListContainer.classList.remove('expanded');
                deepenedToggleIcon.classList.remove('expanded');
                updateAmbientEmitters('deepenedItemsListContainer', false);
            }
        });
    }

    if (deepenedHeader) {
        deepenedHeader.addEventListener('click', () => {
            const isNowExpanded = deepenedItemsListContainer.classList.toggle('expanded');
            deepenedToggleIcon.classList.toggle('expanded');
            updateAmbientEmitters('deepenedItemsListContainer', isNowExpanded);
            if (isNowExpanded && archivedItemsListContainer.classList.contains('expanded')) {
                archivedItemsListContainer.classList.remove('expanded');
                archiveToggleIcon.classList.remove('expanded');
                updateAmbientEmitters('archivedItemsListContainer', false);
            }
        });
    }

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
                saveMoments();
            }
        });
        updateCountersAndPointsDisplay();
    }

    function handleCheckboxChange(event) { const ts = parseInt(event.target.dataset.timestamp); const mom = loggedMoments.find(m => m.timestamp === ts); if (mom) mom.selectedForBatch = event.target.checked; saveMoments(); updateCountersAndPointsDisplay(); }
    function handleTextContainerClick(event) { const ts = parseInt(event.currentTarget.dataset.timestamp); const mom = loggedMoments.find(m => m.timestamp === ts); if (mom && !mom.answer && !mom.isProcessing && !mom.isRegenerating) { const liEl = document.getElementById(`moment-item-${ts}`); fetchSingleAIAnswer(mom, liEl, true);} else { toggleAnswerExpansion(ts);}}
    function handleReviewButtonClick(event) { const ts = parseInt(event.currentTarget.dataset.timestamp); toggleUserReviewedStatus(ts); }
    function handleRegenerateButtonClick(event) { const ts = parseInt(event.currentTarget.dataset.timestamp); const mom = loggedMoments.find(m => m.timestamp === ts); const liEl = document.getElementById(`moment-item-${ts}`); if (mom && liEl && !mom.hasBeenRegenerated) { regenerateAIAnswer(mom, liEl); } }
    function toggleAnswerExpansion(timestamp) { const m = loggedMoments.find(mo => mo.timestamp === timestamp); if (m) {m.isAnswerExpanded = !m.isAnswerExpanded; saveMoments(); renderMoments();}}

    function saveMoments() {
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
    }
    function toggleUserReviewedStatus(timestamp) { const m = loggedMoments.find(mo => mo.timestamp === timestamp); if (m) { m.userMarkedReviewed = !m.userMarkedReviewed; showToast(m.userMarkedReviewed ? "REVIEWED!" : "UNREVIEWED."); saveMoments(); renderMoments(); renderArchivedKnowledge(); renderDeeplyUnderstoodKnowledge(); } }
    function toggleArchiveRevisedStatus(timestamp) { const moment = archivedKnowledge.find(m => m.timestamp === timestamp); if (moment) { moment.isRevisedForDeepTest = !moment.isRevisedForDeepTest; showToast(moment.isRevisedForDeepTest ? "REVISED FOR DEEPER TEST!" : "Marked Unrevised."); saveMoments(); renderArchivedKnowledge(); }}

    async function handleDeepDiveClick(timestamp) {
        const moment = archivedKnowledge.find(m => m.timestamp === timestamp);
        if (!moment || moment.isDeepDiveProcessing) return;
        moment.isDeepDiveProcessing = true;
        moment.isAnswerExpanded = true;
        renderArchivedKnowledge();
        try {
            const deepDiveText = await fetchAIAnswerLogic(null, false, false, null, true, moment);
            moment.deepDiveAnswer = deepDiveText;
            showToast("Knowledge Deepened!");
        } catch (e) {
            console.error("Error fetching deep dive:", e);
            moment.deepDiveAnswer = `DEEP DIVE ERROR: ${e.message}`;
        } finally {
            moment.isDeepDiveProcessing = false;
            saveMoments();
            renderArchivedKnowledge();
        }
    }
    logButton.addEventListener('click', () => {
        const t = idkInput.value.trim();
        if (t) {
            const iT = autoSetInitialType(t);
            loggedMoments.unshift({text: t, timestamp: Date.now(), type: iT, aiVerdict: null, userMarkedReviewed: false, answer: null, isAnswerExpanded: false, hasBeenRegenerated: false, selectedForBatch: false, isProcessing: false, isRegenerating: false, newlyAdded: true, spinnerInterval: null, deepDiveAnswer: null, isRevisedForDeepTest: false, isDeepDiveProcessing: false, isDeeplyUnderstood: false});
            idkInput.value = '';
            showToast("MOMENT LOGGED!");
            saveMoments();
            renderMoments();
            renderArchivedKnowledge();
            renderDeeplyUnderstoodKnowledge();
        } else {
            showToast("INPUT TEXT REQUIRED.");
        }
    });
    selectAllButton.addEventListener('click', () => {
        const allSelected = loggedMoments.length > 0 && loggedMoments.every(m => m.selectedForBatch);
        const targetState = !allSelected;
        loggedMoments.forEach(m => m.selectedForBatch = targetState);
        saveMoments();
        renderMoments();
    });

    const AI_MCQ_PROMPT_SYSTEM = `You are a quiz question generator. Based on the user's original logged text and an AI explanation, create a single, concise question to test comprehension of this information. Then provide ONE correct answer, ONE plausible but incorrect distractor, AND ONE silly, obviously wrong, or humorous "dumb answer" distractor. Format your entire response *strictly* as:\nQ: [Your Question Here]\nC: [The Correct Answer Here]\nD1: [Plausible Distractor 1 Here]\nDUMB: [The Silly/Dumb Distractor Here]\nDo not add any other text or conversational pleasantries.`;
    const AI_DEEPEN_UNDERSTANDING_PROMPT_SYSTEM = `The user previously logged: "[USER_LOG_TEXT]" and received this explanation: "[ORIGINAL_AI_ANSWER]". They now want to deepen their understanding. Provide a concise explanation that includes 3 new distinct pieces of information, facts, or related concepts that expand on the original topic. Keep the retro interface style and output in plain text.`;
    const AI_DEEP_DIVE_MCQ_PROMPT_SYSTEM = `You are an advanced quiz question generator. The user has received an initial explanation and a "deep dive" explanation for a topic.
Original Log: "[USER_LOG_TEXT]"
Initial Explanation: "[ORIGINAL_AI_ANSWER]"
Deep Dive Explanation: "[DEEP_DIVE_AI_ANSWER]"
Your task is to generate a challenging multiple-choice question based *primarily* on a *specific new piece of information* from the "Deep Dive Explanation". The target new information is the [TARGET_INFO_FOCUS] new detail/fact mentioned in the Deep Dive Explanation.
Provide ONE correct answer and TWO plausible but incorrect distractor answers. Format your entire response *strictly* as:\nQ: [Your Challenging Question Here, focused on the [TARGET_INFO_FOCUS] new detail from the Deep Dive Explanation]\nC: [The Correct Answer Here]\nD1: [Plausible Distractor 1 Here]\nD2: [Plausible Distractor 2 Here]\nDo not add any other text or conversational pleasantries.`;
    const AI_STATEMENT_SYSTEM_PROMPT = `You are a factual validation assistant... Output in plain text suitable for a retro computer interface.`;
    const AI_REGENERATE_SYSTEM_PROMPT = `You are a helpful assistant... Output in plain text suitable for a retro computer interface.`;

    async function fetchAIAnswerLogic(moment, isRegeneration = false, isQuizQuestionGen = false, quizMomentContext = null, isDeepDiveGen = false, deepDiveContext = null, isDeepDiveMCQGen = false, deepDiveQuestionNumber = 1) {
        const apiKeyToUse = userProvidedApiKey;

        if (!apiKeyToUse) {
           showToast("NO API KEY SET. PLEASE ENTER ONE.", 3000);
           console.error('OpenAI API Key is missing! Cannot make API calls.');
           throw new Error('OpenAI API Key is missing!');
        }

        let systemPrompt = "You are a helpful assistant. Your output should be suitable for a retro computer interface.";
        let userQuery = "";
        let modelToUse = 'gpt-3.5-turbo';
        let maxTokens = 200;
        const focusHints = ["first", "second", "third"];

        if (isDeepDiveMCQGen && deepDiveContext) {
            let targetInfoFocus = focusHints[deepDiveQuestionNumber - 1] || "a distinct";
            systemPrompt = AI_DEEP_DIVE_MCQ_PROMPT_SYSTEM
                            .replace("[USER_LOG_TEXT]", deepDiveContext.text || '(Original log text not available)')
                            .replace("[ORIGINAL_AI_ANSWER]", deepDiveContext.answer || '(Initial explanation not available)')
                            .replace("[DEEP_DIVE_AI_ANSWER]", deepDiveContext.deepDiveAnswer || '(Deeper explanation not available)')
                            .replace(/\[TARGET_INFO_FOCUS\]/g, targetInfoFocus);
            userQuery = `Generate challenging MCQ question #${deepDiveQuestionNumber} for this topic, focusing on the ${targetInfoFocus} new aspect from the Deep Dive Explanation.`;
            maxTokens = 180;
        } else if (isDeepDiveGen && deepDiveContext) {
            systemPrompt = AI_DEEPEN_UNDERSTANDING_PROMPT_SYSTEM
                            .replace("[USER_LOG_TEXT]", deepDiveContext.text)
                            .replace("[ORIGINAL_AI_ANSWER]", deepDiveContext.answer || "(No original answer available)");
            userQuery = "Please provide the deeper explanation with 3 new pieces of information as per the system prompt context.";
            maxTokens = 250;
        } else if (isQuizQuestionGen && quizMomentContext) {
            systemPrompt = AI_MCQ_PROMPT_SYSTEM;
            userQuery = `User's original log: "${quizMomentContext.text}"\nAI's explanation: "${quizMomentContext.answer || '(N/A)'}"\n\nGenerate MCQ with one dumb answer.`;
            maxTokens = 160;
        } else if (moment) {
            if (isRegeneration) { systemPrompt = AI_REGENERATE_SYSTEM_PROMPT; userQuery = `Original query/statement: "${moment.text}"`;}
            else if (moment.type === 'question') { userQuery = `Explain this to me simply, like for a retro computer interface: "${moment.text}"`;}
            else if (moment.type === 'statement') { systemPrompt = AI_STATEMENT_SYSTEM_PROMPT; userQuery = `Statement to validate: "${moment.text}"`;}
            else { userQuery = moment.text;}
        } else { throw new Error("Invalid parameters for AI logic."); }

        const requestBodyToOpenAI = {model: modelToUse, messages: [{ "role": "system", "content": systemPrompt }, { "role": "user", "content": userQuery }], max_tokens: maxTokens, temperature: isQuizQuestionGen || isDeepDiveMCQGen ? 0.75 : (isRegeneration ? 0.6 : (isDeepDiveGen ? 0.5 : 0.4))};
        const response = await fetch('https://api.openai.com/v1/chat/completions', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKeyToUse}`}, body: JSON.stringify(requestBodyToOpenAI)});
        if (!response.ok) { const eD = await response.json().catch(() => ({error: {message: "Unknown API error"}})); console.error("OpenAI API Error:", eD); throw new Error(`API Error (${response.status}): ${eD.error?.message || 'Unknown'}`);}
        const data = await response.json(); let rawAnswerText = data.choices[0]?.message?.content.trim() || "NO RESPONSE.";

        if (moment && !isQuizQuestionGen && !isDeepDiveGen && !isDeepDiveMCQGen && moment.type === 'statement' && !isRegeneration) { if (rawAnswerText.startsWith('[CORRECT]')) { moment.aiVerdict = 'correct'; rawAnswerText = rawAnswerText.substring(9).trim(); } else if (rawAnswerText.startsWith('[INCORRECT]')) { moment.aiVerdict = 'incorrect'; rawAnswerText = rawAnswerText.substring(11).trim(); } else if (rawAnswerText.startsWith('[UNCLEAR]')) { moment.aiVerdict = 'unclear'; rawAnswerText = rawAnswerText.substring(9).trim(); } }
        return rawAnswerText;
    }

    async function fetchSingleAIAnswer(moment, listItemElement, expandAfterFetch = false) { if (moment.isProcessing || moment.isRegenerating) return; moment.isProcessing = true; if (expandAfterFetch) moment.isAnswerExpanded = false; renderMoments(); renderArchivedKnowledge(); renderDeeplyUnderstoodKnowledge(); try { const aT = await fetchAIAnswerLogic(moment); moment.answer = aT; if (expandAfterFetch) moment.isAnswerExpanded = true; } catch (e) { moment.answer = `ERROR: ${e.message}`; if (expandAfterFetch) moment.isAnswerExpanded = true;  } finally { moment.isProcessing = false; saveMoments(); renderMoments(); renderArchivedKnowledge(); renderDeeplyUnderstoodKnowledge();}}
    async function regenerateAIAnswer(moment, listItemElement) { if (moment.hasBeenRegenerated || moment.isProcessing || moment.isRegenerating) return; moment.isRegenerating = true; moment.isAnswerExpanded = true; renderMoments(); renderArchivedKnowledge(); renderDeeplyUnderstoodKnowledge(); try { const aT = await fetchAIAnswerLogic(moment, true); moment.answer = aT; moment.hasBeenRegenerated = true; showToast("RESPONSE REGENERATED!"); } catch (e) { moment.answer = `REGEN ERROR: ${e.message}`; } finally { moment.isRegenerating = false; saveMoments(); renderMoments(); renderArchivedKnowledge(); renderDeeplyUnderstoodKnowledge();}}
    processSelectedButton.addEventListener('click', async () => { const iTP = loggedMoments.filter(m => m.selectedForBatch && !m.isProcessing && !m.isRegenerating); if (iTP.length === 0) { showToast("NO ITEMS SELECTED."); return; } processSelectedButton.disabled = true; overallLoadingIndicator.textContent = `PROCESSING 0/${iTP.length}...`; overallLoadingIndicator.style.display = 'block'; let pC = 0; for (const m of iTP) { m.isProcessing = true; renderMoments(); renderArchivedKnowledge(); renderDeeplyUnderstoodKnowledge(); try { const aT = await fetchAIAnswerLogic(m); m.answer = aT; m.isAnswerExpanded = true; } catch (e) { m.answer = `ERROR: ${e.message}`; m.isAnswerExpanded = true; } finally { m.isProcessing = false; m.selectedForBatch = false; pC++; overallLoadingIndicator.textContent = `PROCESSING ${pC}/${iTP.length}...`; saveMoments(); renderMoments(); renderArchivedKnowledge(); renderDeeplyUnderstoodKnowledge();}} overallLoadingIndicator.textContent = `BATCH COMPLETE! ${pC} ITEMS.`; showToast(`BATCH OK: ${pC} PROCESSED!`); setTimeout(() => { overallLoadingIndicator.style.display = 'none'; }, 3000); processSelectedButton.disabled = false; });

    async function startQuiz(isForArchivedItem = false, specificArchivedMoment = null) {
        isDeepDiveQuiz = isForArchivedItem;
        currentDeepDiveQuizMoment = isForArchivedItem ? specificArchivedMoment : null;
        const itemsForQuizSource = isForArchivedItem ? [specificArchivedMoment] : loggedMoments.filter(m => m.userMarkedReviewed && m.answer);
        if (itemsForQuizSource.length === 0 || (isForArchivedItem && !specificArchivedMoment)) { showToast(isForArchivedItem ? "Error starting deep dive test." : "NO REVIEWED ITEMS TO TEST!"); return; }

        currentQuizQuestionsData = [];
        const prepButton = isForArchivedItem ? document.querySelector(`.archive-deep-dive-test-button[data-timestamp="${specificArchivedMoment.timestamp}"]`) : testKnowledgeButton;
        if (prepButton) { prepButton.disabled = true; prepButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';}

        if (isForArchivedItem) {
            for (let i = 0; i < 3; i++) {
                try {
                    const mcqText = await fetchAIAnswerLogic(null, false, false, null, false, specificArchivedMoment, true, i + 1);
                    const qMatch = mcqText.match(/Q:\s*([\s\S]*?)\nC:/i); const cMatch = mcqText.match(/C:\s*([\s\S]*?)\nD1:/i); const d1Match = mcqText.match(/D1:\s*([\s\S]*?)\nD2:/i); const d2Match = mcqText.match(/D2:\s*([\s\S]*?)$/i);
                    if (qMatch && cMatch && d1Match && d2Match) { let opts = [cMatch[1].trim(), d1Match[1].trim(), d2Match[1].trim()]; opts.sort(() => 0.5 - Math.random()); currentQuizQuestionsData.push({ question: qMatch[1].trim(), options: opts, correctAnswerText: cMatch[1].trim(), originalMomentTimestamp: specificArchivedMoment.timestamp, isDumb: false }); } else { console.warn(`Deep Dive MCQ PARSE FAIL (Q${i+1}):`, mcqText); currentQuizQuestionsData.push(null); }
                } catch (e) { console.error(`Error gen deep dive MCQ (Q${i+1}):`, e); currentQuizQuestionsData.push(null); }
            }
            currentQuizQuestionsData = currentQuizQuestionsData.filter(q => q !== null);
        } else {
            const shuffled = itemsForQuizSource.sort(() => 0.5 - Math.random()); const itemsForThisQuiz = shuffled.slice(0, 3);
            for (const item of itemsForThisQuiz) {
                try {
                    const mcqText = await fetchAIAnswerLogic(null, false, true, item);
                    const qMatch = mcqText.match(/Q:\s*([\s\S]*?)\nC:/i); const cMatch = mcqText.match(/C:\s*([\s\S]*?)\nD1:/i); const d1Match = mcqText.match(/D1:\s*([\s\S]*?)\nDUMB:/i); const dumbMatch = mcqText.match(/DUMB:\s*([\s\S]*?)$/i);
                    if (qMatch && cMatch && d1Match && dumbMatch) {
                        let options = [cMatch[1].trim(), d1Match[1].trim(), dumbMatch[1].trim()];
                        let dumbAnswerText = dumbMatch[1].trim();
                        options.sort(() => 0.5 - Math.random());
                        currentQuizQuestionsData.push({ question: qMatch[1].trim(), options, correctAnswerText: cMatch[1].trim(), originalMomentTimestamp: item.timestamp, dumbAnswerText: dumbAnswerText });
                    } else { console.warn("Regular MCQ PARSE FAIL (DUMB):", mcqText); }
                } catch (e) { console.error("Error gen quiz MCQ:", e); }
            }
        }

        if (prepButton) { prepButton.disabled = false; prepButton.innerHTML = isForArchivedItem ? '<i class="fas fa-vial"></i> Test' : 'Test Knowledge!';}
        if (currentQuizQuestionsData.length > 0) { currentQuizQuestionIndex = 0; currentQuizCorrectAnswersCount = 0; quizModalTitle.textContent = isForArchivedItem ? `DEEP DIVE: ${specificArchivedMoment.text.substring(0,20)}...` : "KNOWLEDGE TEST!"; displayMCQQuestion(); quizModalOverlay.classList.add('show'); closeQuizButton.style.display = 'none'; finishQuizButton.style.display = 'none'; }
        else { showToast("COULDN'T PREPARE QUIZ QUESTIONS. TRY AGAIN."); }
    }
    testKnowledgeButton.addEventListener('click', () => startQuiz(false, null));
    function startDeepDiveQuiz(archivedMoment) { startQuiz(true, archivedMoment); }

    function displayMCQQuestion() { if (currentQuizQuestionIndex < currentQuizQuestionsData.length) { const qD = currentQuizQuestionsData[currentQuizQuestionIndex]; quizQuestionNumber.textContent = `QUESTION ${currentQuizQuestionIndex + 1} OF ${currentQuizQuestionsData.length}`; quizQuestionText.textContent = qD.question; quizOptionsContainer.innerHTML = ''; qD.options.forEach(oT => { const oD = document.createElement('div'); oD.classList.add('quiz-option'); oD.textContent = oT; oD.addEventListener('click', () => selectQuizOption(oD, oT)); quizOptionsContainer.appendChild(oD); }); quizFeedbackArea.textContent = 'CHOOSE AN OPTION.'; quizFeedbackArea.className = 'quiz-feedback-area'; submitQuizAnswerButton.style.display = 'inline-block'; submitQuizAnswerButton.disabled = true; nextQuizQuestionButton.style.display = 'none'; finishQuizButton.style.display = 'none'; selectedQuizOptionElement = null; } else { finishMCQQuiz(); }}
    function selectQuizOption(optionDiv, optionText) { if (submitQuizAnswerButton.style.display === 'none') return; if (selectedQuizOptionElement) { selectedQuizOptionElement.classList.remove('selected'); } optionDiv.classList.add('selected'); selectedQuizOptionElement = optionDiv; submitQuizAnswerButton.disabled = false; }

    submitQuizAnswerButton.addEventListener('click', () => {
        if (!selectedQuizOptionElement) return;
        const userAnswerText = selectedQuizOptionElement.textContent;
        const qData = currentQuizQuestionsData[currentQuizQuestionIndex];
        const isCorrect = userAnswerText === qData.correctAnswerText;
        const isDumbSelection = !isDeepDiveQuiz && qData.dumbAnswerText && userAnswerText === qData.dumbAnswerText;
        const pointsForThisQuestion = isDeepDiveQuiz ? 3 : 2;

        if (isDumbSelection) {
            userStupidPoints++;
            quizFeedbackArea.textContent = "FOOL. +1 STUPID POINT! 👎";
            quizFeedbackArea.className = 'quiz-feedback-area incorrect';
            selectedQuizOptionElement.classList.add('incorrect');
            showToast("OH DEAR... +1 STUPID POINT!");
            triggerParticleBurst('dumbAnswer');
            quizOptionsContainer.querySelectorAll('.quiz-option').forEach(opt => { if (opt.textContent === qData.correctAnswerText) { opt.classList.add('correct'); }});
        } else if (isCorrect) {
            quizFeedbackArea.textContent = `CORRECT! +${pointsForThisQuestion} PTS!`; quizFeedbackArea.className = 'quiz-feedback-area correct'; selectedQuizOptionElement.classList.add('correct'); currentQuizCorrectAnswersCount++; userPoints += pointsForThisQuestion; triggerPointsFlash(); triggerParticleBurst('correctAnswer'); showToast(`CORRECT! +${pointsForThisQuestion} PTS!`);
            if (!isDeepDiveQuiz) {
                const momentToArchiveIndex = loggedMoments.findIndex(m => m.timestamp === qData.originalMomentTimestamp);
                if (momentToArchiveIndex > -1) { const momentToArchive = loggedMoments.splice(momentToArchiveIndex, 1)[0]; const cardElement = document.getElementById(`moment-item-${qData.originalMomentTimestamp}`); if(cardElement) cardElement.classList.add('archiving'); setTimeout(() => { momentToArchive.isArchived = true; momentToArchive.archivedTimestamp = Date.now(); momentToArchive.isAnswerExpanded = false; archivedKnowledge.unshift(momentToArchive); saveMoments(); renderMoments(); renderArchivedKnowledge(); renderDeeplyUnderstoodKnowledge(); }, 500);} else { saveMoments(); updateCountersAndPointsDisplay(); }
            } else { saveMoments(); updateCountersAndPointsDisplay(); }
        } else {
            quizFeedbackArea.textContent = `INCORRECT. Correct was: ${qData.correctAnswerText}`; quizFeedbackArea.className = 'quiz-feedback-area incorrect'; selectedQuizOptionElement.classList.add('incorrect'); quizOptionsContainer.querySelectorAll('.quiz-option').forEach(opt => { if (opt.textContent === qData.correctAnswerText) { opt.classList.add('correct'); }});
        }
        quizOptionsContainer.querySelectorAll('.quiz-option').forEach(opt => { opt.style.pointerEvents = 'none'; }); submitQuizAnswerButton.style.display = 'none';
        if (currentQuizQuestionIndex < currentQuizQuestionsData.length - 1) { nextQuizQuestionButton.style.display = 'inline-block'; }
        else { finishQuizButton.style.display = 'inline-block'; }
    });

    nextQuizQuestionButton.addEventListener('click', () => { currentQuizQuestionIndex++; displayMCQQuestion(); });
    finishQuizButton.addEventListener('click', finishMCQQuiz);
    closeQuizButton.addEventListener('click', () => { quizModalOverlay.classList.remove('show'); });

    function finishMCQQuiz() {
        let quizResultText = `QUIZ FINISHED! YOU GOT ${currentQuizCorrectAnswersCount} OF ${currentQuizQuestionsData.length} CORRECT.`;
        const perfectScoreBonus = isDeepDiveQuiz ? 7 : 5;
        let earnedPerfectBonus = false;

        if (currentQuizCorrectAnswersCount === currentQuizQuestionsData.length && currentQuizQuestionsData.length > 0) {
            userPoints += perfectScoreBonus;
            earnedPerfectBonus = true;
            triggerPointsFlash(); triggerParticleBurst('perfectQuiz');
            quizResultText += `\nPERFECT SCORE! +${perfectScoreBonus} <i class="fas fa-coins points-icon"></i> BONUS!`;

            if (isDeepDiveQuiz && currentDeepDiveQuizMoment) {
                const momentToMasterIndex = archivedKnowledge.findIndex(m => m.timestamp === currentDeepDiveQuizMoment.timestamp);
                if (momentToMasterIndex > -1) {
                    const momentToMaster = archivedKnowledge.splice(momentToMasterIndex, 1)[0];
                    momentToMaster.isDeeplyUnderstood = true;
                    momentToMaster.deeplyUnderstoodTimestamp = Date.now();
                    momentToMaster.isAnswerExpanded = false;
                    deeplyUnderstoodKnowledge.unshift(momentToMaster);
                    showToast(`"${momentToMaster.text.substring(0,20)}..." FULLY MASTERED & MOVED!`);
                }
            }
        }
        saveMoments(); renderMoments(); renderArchivedKnowledge(); renderDeeplyUnderstoodKnowledge();
        quizFeedbackArea.innerHTML = quizResultText.replace(/\n/g, '<br>');
        showToast(earnedPerfectBonus ? `PERFECT QUIZ! +${perfectScoreBonus} BONUS PTS!` : `QUIZ DONE. ${currentQuizCorrectAnswersCount}/${currentQuizQuestionsData.length}.`);
        submitQuizAnswerButton.style.display = 'none'; nextQuizQuestionButton.style.display = 'none';
        finishQuizButton.style.display = 'none'; closeQuizButton.style.display = 'inline-block';
        currentDeepDiveQuizMoment = null;
    }

    archiveHeader.addEventListener('click', () => {
        const isNowExpanded = archivedItemsListContainer.classList.toggle('expanded');
        archiveToggleIcon.classList.toggle('expanded');
        updateAmbientEmitters('archivedItemsListContainer', isNowExpanded);
        if (isNowExpanded && deepenedItemsListContainer.classList.contains('expanded')) {
            deepenedItemsListContainer.classList.remove('expanded');
            deepenedToggleIcon.classList.remove('expanded');
            updateAmbientEmitters('deepenedItemsListContainer', false);
        }
    });
    deepenedHeader.addEventListener('click', () => {
        const isNowExpanded = deepenedItemsListContainer.classList.toggle('expanded');
        deepenedToggleIcon.classList.toggle('expanded');
        updateAmbientEmitters('deepenedItemsListContainer', isNowExpanded);
        if (isNowExpanded && archivedItemsListContainer.classList.contains('expanded')) {
            archivedItemsListContainer.classList.remove('expanded');
            archiveToggleIcon.classList.remove('expanded');
            updateAmbientEmitters('archivedItemsListContainer', false);
        }
    });

    // Initial Setup
    applyTheme(currentTheme);
    renderMoments();
    renderArchivedKnowledge();
    renderDeeplyUnderstoodKnowledge();
    requestAnimationFrame(updateAndDrawParticles);
});
