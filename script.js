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
    let ctx, particles = []; // Declare ctx here
    if (particleCanvas) {
        ctx = particleCanvas.getContext('2d'); // Initialize if canvas exists
        particleCanvas.width = window.innerWidth;
        particleCanvas.height = window.innerHeight;
        window.addEventListener('resize', () => {
            if (particleCanvas) {
                particleCanvas.width = window.innerWidth;
                particleCanvas.height = window.innerHeight;
            }
        });
    }

    const shopToolbar = document.getElementById('shopToolbar');
    const shopToolbarHeader = document.getElementById('shopToolbarHeader');
    const shopAccordionContent = document.getElementById('shopAccordionContent');
    const shopUserPointsDisplay = document.getElementById('shopUserPoints');


    // --- SHARED DATA & CONFIG ---
    const localStorageKeySuffix = '_v27_theme_shop';
    const themes = { // THIS MUST BE COMPLETE AND MATCH shop-script.js
        default: {
            name: "Default Retro", cost: 0, owned: true,
            description: "The classic look and feel of IDKY, with its signature teal and orange accents.",
            cssVariables: {
                '--theme-primary-dark': '#264653', '--theme-primary-accent': '#2A9D8F',
                '--theme-secondary-accent': '#E9C46A', '--theme-tertiary-accent': '#F4A261',
                '--theme-highlight-accent': '#E76F51', '--theme-light-bg': '#EAEAEA',
                '--theme-card-bg': '#FFFFFF', '--theme-text-on-dark': '#EAEAEA',
                '--theme-page-bg': 'rgb(174, 217, 211)'
            }
        },
        oceanDepths: {
            name: "Ocean Depths", cost: 1,
            description: "Dive into cool blue tranquility with shades of the deep sea and clear waters.",
            cssVariables: {
                '--theme-primary-dark': '#03045E', '--theme-primary-accent': '#0077B6',
                '--theme-secondary-accent': '#00B4D8', '--theme-tertiary-accent': '#90E0EF',
                '--theme-highlight-accent': '#CAF0F8', '--theme-light-bg': '#E0FBFC',
                '--theme-card-bg': '#FFFFFF', '--theme-text-on-dark': '#CAF0F8',
                '--theme-page-bg': '#ADE8F4'
            }
        },
        volcanoRush: {
            name: "Volcano Rush", cost: 1,
            description: "Fiery reds and oranges evoke the heat of a volcanic eruption for intense focus.",
            cssVariables: {
                '--theme-primary-dark': '#2B0000', '--theme-primary-accent': '#6A0000',
                '--theme-secondary-accent': '#FF4500', '--theme-tertiary-accent': '#FF8C00',
                '--theme-highlight-accent': '#AE2012', '--theme-light-bg': '#FFF2E6',
                '--theme-card-bg': '#FFFFFF', '--theme-text-on-dark': '#FFDAB9',
                '--theme-page-bg': '#FFCDB2'
            }
        },
        techOrangeBlue: {
            name: "Tech Orange & Blue", cost: 1,
            description: "A modern, sleek palette combining energetic orange with professional blues and grays.",
            cssVariables: {
                '--theme-primary-dark': '#004C97', '--theme-primary-accent': '#4A7DB5',
                '--theme-secondary-accent': '#FF6600', '--theme-tertiary-accent': '#C0C0C0',
                '--theme-highlight-accent': '#FF7700', '--theme-light-bg': '#F0F0F0',
                '--theme-card-bg': '#FFFFFF', '--theme-text-on-dark': '#F0F0F0',
                '--theme-page-bg': '#E8E8E8'
            }
        },
        forestGreens: {
            name: "Forest Greens", cost: 1,
            description: "Earthy and calming greens, from deep forest shades to light mossy tones.",
            cssVariables: {
                '--theme-primary-dark': '#1A2B12', '--theme-primary-accent': '#335128',
                '--theme-secondary-accent': '#526F35', '--theme-tertiary-accent': '#8A9A5B',
                '--theme-highlight-accent': '#E0E7A3', '--theme-light-bg': '#F0F5E0',
                '--theme-card-bg': '#FFFFFF', '--theme-text-on-dark': '#E0E7A3',
                '--theme-page-bg': '#D8E0C0'
            }
        }
    };
    let currentTheme = localStorage.getItem('idk_current_theme' + localStorageKeySuffix) || 'default';
    let userPoints = parseInt(localStorage.getItem('idk_user_points_val' + localStorageKeySuffix)) || 0;
    let userStupidPoints = parseInt(localStorage.getItem('idk_user_stupid_points_val' + localStorageKeySuffix)) || 0;
    let userProvidedApiKey = localStorage.getItem('idk_user_openai_api_key' + localStorageKeySuffix) || '';
    let loggedMoments = JSON.parse(localStorage.getItem('idk_moments' + localStorageKeySuffix)) || [];
    let archivedKnowledge = JSON.parse(localStorage.getItem('idk_archived_knowledge' + localStorageKeySuffix)) || [];
    let deeplyUnderstoodKnowledge = JSON.parse(localStorage.getItem('idk_deeply_understood' + localStorageKeySuffix)) || [];
    // ownedThemes is primarily managed by shop-script.js, but we read it here for saveMoments
    let ownedThemes = JSON.parse(localStorage.getItem('idk_owned_themes' + localStorageKeySuffix)) || ['default'];


    let currentQuizQuestionsData = [];
    let currentQuizQuestionIndex = 0;
    let currentQuizCorrectAnswersCount = 0;
    let selectedQuizOptionElement = null;
    let isDeepDiveQuiz = false;
    let currentDeepDiveQuizMoment = null;
    // --- END SHARED DATA & CONFIG ---


    if(userApiKeyInput) userApiKeyInput.value = userProvidedApiKey;

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

    function createParticle(x, y, color, size, count, spread, speedMultiplier = 1) {
        if (!ctx) return; // Guard if canvas/ctx not present
        for (let i = 0; i < count; i++) { particles.push({ x, y, size: Math.random() * size + 2, color, vx: (Math.random() - 0.5) * spread * speedMultiplier, vy: (Math.random() - 0.5) * spread * speedMultiplier, life: 60 + Math.random() * 30 });}}
    function updateAndDrawParticles() {
        if (!ctx || !particleCanvas) return; // Guard
        ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height); for (let i = particles.length - 1; i >= 0; i--) { const p = particles[i]; p.x += p.vx; p.y += p.vy; p.vy += 0.05; p.life--; if (p.life <= 0) { particles.splice(i, 1); continue; } ctx.fillStyle = p.color; ctx.globalAlpha = p.life / 90; ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size); } ctx.globalAlpha = 1; if (particles.length > 0) { requestAnimationFrame(updateAndDrawParticles); }}
    function triggerParticleBurst(type = 'small', customX, customY) {
        if (!ctx) return; // Guard
        const cX = customX !== undefined ? customX : window.innerWidth / 2;
        const cY = customY !== undefined ? customY : window.innerHeight / 3;
        let clr, sz, cnt, sprd, spd;
        if (type === 'perfectQuiz') { clr = themes[currentTheme]?.cssVariables['--theme-secondary-accent'] || '#E9C46A'; sz = 8; cnt = 100; sprd = 8; spd = 1.5; }
        else if (type === 'correctAnswer') { clr = themes[currentTheme]?.cssVariables['--theme-primary-accent'] || '#2A9D8F'; sz = 6; cnt = 50; sprd = 5; spd = 1; }
        else if (type === 'dumbAnswer') { clr = themes[currentTheme]?.cssVariables['--theme-highlight-accent'] || '#E76F51'; sz = 5; cnt = 30; sprd = 4; spd = 0.8;}
        else if (type === 'masteredItem') { clr = themes[currentTheme]?.cssVariables['--theme-secondary-accent'] || '#E9C46A'; sz = 7; cnt = 40; sprd = 6; spd = 1.2; }
        createParticle(cX, cY, clr, sz, cnt, sprd, spd);
        if ((particles.length > 0 && particles.length <= cnt) || type === 'dumbAnswer' || type === 'masteredItem') { // Start if new particles added
            requestAnimationFrame(updateAndDrawParticles);
        }
    }
    function formatAnswerForRetroDisplay(text) { if (!text || typeof text !== 'string') return text; const p = '     > '; let h = text.split('\n').map(l => l.trim() === '' ? '' : p + l).join('<br>'); h = h.replace(/^<br>\s*/, '').replace(/\s*<br>$/, ''); h = h.replace(/(<br>\s*){2,}/g, '<br>'); return h; }
    function showToast(message, duration = 2500) { if(toastNotification) {toastNotification.textContent = message; toastNotification.classList.add('show'); setTimeout(() => { toastNotification.classList.remove('show'); }, duration); }}
    function autoSetInitialType(text) { const lT = text.toLowerCase().trim(); if (lT.endsWith('?')) return 'question'; const qS = ['what', 'when', 'where', 'who', 'why', 'how', 'is ', 'are ', 'do ', 'does ', 'did ', 'can ', 'could ', 'will ', 'would ', 'should ', 'may ', 'might ']; for (const s of qS) { if (lT.startsWith(s)) return 'question'; } return 'statement'; }
    function triggerPointsFlash() { const mainPointsDisplay = document.querySelector('.header-stats-bar .points-display:first-child'); if(mainPointsDisplay) mainPointsDisplay.classList.add('points-earned-flash'); setTimeout(() => { if(mainPointsDisplay) mainPointsDisplay.classList.remove('points-earned-flash'); }, 500); }

    function applyThemeOnIndex(themeId) {
        const themeToApply = themes[themeId] || themes.default; // Fallback to default
        if (themeToApply && themeToApply.cssVariables) {
            const themeVars = themeToApply.cssVariables;
            for (const [key, value] of Object.entries(themeVars)) {
                document.documentElement.style.setProperty(key, value);
            }
            document.documentElement.style.setProperty('--theme-text-main', themeVars['--theme-primary-dark']);
            document.documentElement.style.setProperty('--theme-border-main', themeVars['--theme-primary-dark']);
        } else {
            console.error("Default theme or its CSS variables are missing.");
        }
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
    }

    if (shopToolbar && shopToolbarHeader && shopAccordionContent) {
        shopToolbarHeader.addEventListener('click', (e) => {
            if (e.target.closest('a.shop-page-link-button')) { // If click is on the link itself
                window.location.href = "shop.html"; // Navigate
                return; // Prevent accordion toggle if we had one
            }
            // If toolbar is just a direct link area now, this toggles the visibility of the link container
            // shopToolbar.classList.toggle('expanded');
            // OR, make the entire header clickable to go to shop:
             window.location.href = "shop.html";
        });

        shopAccordionContent.innerHTML = `
            <div class="theme-item" style="justify-content: center; padding: 10px; cursor:pointer;" onclick="window.location.href='shop.html'">
                <span class="shop-page-link-button">
                    <i class="fas fa-store"></i> VISIT THEME EMPORIUM
                </span>
            </div>`;
        if (!document.getElementById('shopLinkButtonStyle')) {
            const styleSheet = document.createElement("style");
            styleSheet.id = 'shopLinkButtonStyle';
            styleSheet.innerText = `
                .shop-page-link-button { display: inline-block; padding: 8px 15px; background-color: var(--theme-secondary-accent); color: var(--theme-primary-dark); text-decoration: none; font-size: 16px; border: var(--pixel-border-width) solid var(--theme-primary-dark); box-shadow: 1px 1px 0 var(--theme-primary-dark); transition: all 0.1s ease; }
                .shop-page-link-button:hover { background-color: color-mix(in srgb, var(--theme-secondary-accent) 90%, black); transform: translateY(-1px); box-shadow: 2px 2px 0 var(--theme-primary-dark); }
                .shop-page-link-button:active { transform: translate(1px, 1px); box-shadow: none; }
            `;
            document.head.appendChild(styleSheet);
        }
        // Ensure toolbar is not expanded by default if it's just a link container
        // shopToolbar.classList.remove('expanded');
    }

    // --- All other core app functions (renderMoments, AI logic, Quiz logic, etc.) ---
    // These should be the full functions from before.
    function renderMoments() { /* ... full function ... */ }
    function renderArchivedKnowledge() { /* ... full function ... */ }
    function renderDeeplyUnderstoodKnowledge() { /* ... full function ... */ }
    function handleCheckboxChange(event) { /* ... full function ... */ }
    function handleTextContainerClick(event) { /* ... full function ... */ }
    function handleReviewButtonClick(event) { /* ... full function ... */ }
    function handleRegenerateButtonClick(event) { /* ... full function ... */ }
    function toggleAnswerExpansion(timestamp) { /* ... full function ... */ }
    function saveMoments() { /* ... full function, ensure ownedThemes and currentTheme are saved from global vars */ }
    function toggleUserReviewedStatus(timestamp) { /* ... full function ... */ }
    function toggleArchiveRevisedStatus(timestamp) { /* ... full function ... */ }
    async function handleDeepDiveClick(timestamp) { /* ... full function ... */ }
    // logButton and selectAllButton event listeners need to be guarded if elements might not exist
    if(logButton) logButton.addEventListener('click', () => { /* ... full function ... */ });
    if(selectAllButton) selectAllButton.addEventListener('click', () => { /* ... full function ... */ });

    // AI Prompts and fetchAIAnswerLogic function
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
    async function fetchAIAnswerLogic(moment, isRegeneration = false, isQuizQuestionGen = false, quizMomentContext = null, isDeepDiveGen = false, deepDiveContext = null, isDeepDiveMCQGen = false, deepDiveQuestionNumber = 1) { /* ... full function, exactly as before ... */ }
    async function fetchSingleAIAnswer(moment, listItemElement, expandAfterFetch = false) { /* ... full function ... */ }
    async function regenerateAIAnswer(moment, listItemElement) { /* ... full function ... */ }
    if(processSelectedButton) processSelectedButton.addEventListener('click', async () => { /* ... full function ... */ });
    // Quiz logic
    async function startQuiz(isForArchivedItem = false, specificArchivedMoment = null) { /* ... full function ... */ }
    function displayMCQQuestion() { /* ... full function ... */ }
    function selectQuizOption(optionDiv, optionText) { /* ... full function ... */ }
    if(submitQuizAnswerButton) submitQuizAnswerButton.addEventListener('click', () => { /* ... full function ... */ });
    if(nextQuizQuestionButton) nextQuizQuestionButton.addEventListener('click', () => { currentQuizQuestionIndex++; displayMCQQuestion(); });
    if(finishQuizButton) finishQuizButton.addEventListener('click', finishMCQQuiz);
    if(closeQuizButton) closeQuizButton.addEventListener('click', () => { if(quizModalOverlay) quizModalOverlay.classList.remove('show'); });
    function finishMCQQuiz() { /* ... full function ... */ }

    // Accordion listeners
    if(archiveHeader) archiveHeader.addEventListener('click', () => { if(archivedItemsListContainer && archiveToggleIcon) {archivedItemsListContainer.classList.toggle('expanded'); archiveToggleIcon.classList.toggle('expanded');} });
    if(deepenedHeader) deepenedHeader.addEventListener('click', () => { if(deepenedItemsListContainer && deepenedToggleIcon) {deepenedItemsListContainer.classList.toggle('expanded'); deepenedToggleIcon.classList.toggle('expanded');} });


    // Initial calls for index.html
    applyThemeOnIndex(currentTheme);
    renderMoments();
    renderArchivedKnowledge();
    renderDeeplyUnderstoodKnowledge();
    // updateCountersAndPointsDisplay(); // This is called within renderDeeplyUnderstoodKnowledge
    if (shopUserPointsDisplay) shopUserPointsDisplay.textContent = userPoints;
});
