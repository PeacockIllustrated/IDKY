// shop-script.js
document.addEventListener('DOMContentLoaded', () => {
    const themeGallery = document.getElementById('themeGallery');
    const shopPageUserPointsDisplay = document.getElementById('shopPageUserPoints');
    const particleCanvasShop = document.getElementById('particleCanvasShop');

    let shopCtx, shopParticles = [];
    if (particleCanvasShop) {
        shopCtx = particleCanvasShop.getContext('2d');
        particleCanvasShop.width = window.innerWidth;
        particleCanvasShop.height = window.innerHeight;
        window.addEventListener('resize', () => {
            if (particleCanvasShop) {
                particleCanvasShop.width = window.innerWidth;
                particleCanvasShop.height = window.innerHeight;
            }
        });
    }

    // --- SHARED DATA & CONFIG ---
    const localStorageKeySuffix = '_v27_theme_shop'; // MUST MATCH script.js

    const themes = {
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

    let userPoints = parseInt(localStorage.getItem('idk_user_points_val' + localStorageKeySuffix)) || 0;
    let ownedThemes = JSON.parse(localStorage.getItem('idk_owned_themes' + localStorageKeySuffix)) || ['default'];
    let currentTheme = localStorage.getItem('idk_current_theme' + localStorageKeySuffix) || 'default';
    // --- END SHARED DATA & CONFIG ---

    function showToast(message, duration = 2500) {
        const existingToast = document.querySelector('.shop-toast-notification'); // Unique class
        if (existingToast) existingToast.remove();

        const toast = document.createElement('div');
        toast.className = 'shop-toast-notification'; // Use a distinct class
        toast.textContent = message;
        document.body.appendChild(toast);

        // Apply styles similar to main app's toast, but ensure they use theme variables
        toast.style.position = 'fixed';
        toast.style.bottom = '70px'; // Above shop toolbar if it were visible
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%)';
        toast.style.backgroundColor = 'var(--theme-primary-dark)';
        toast.style.color = 'var(--theme-text-on-dark)';
        toast.style.padding = '10px 20px';
        toast.style.fontFamily = "'VT323', monospace";
        toast.style.fontSize = "16px";
        toast.style.border = `var(--pixel-border-width) solid var(--theme-primary-accent)`;
        toast.style.boxShadow = `2px 2px 0px var(--theme-primary-accent)`;
        toast.style.zIndex = '4000'; // High z-index
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease-out, bottom 0.3s ease-out';

        // Trigger animation
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.bottom = '80px';
        }, 10);


        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.bottom = '70px';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    function applyThemeOnPage(themeId) {
        if (themes[themeId]) {
            const themeVars = themes[themeId].cssVariables;
            for (const [key, value] of Object.entries(themeVars)) {
                document.documentElement.style.setProperty(key, value);
            }
            // Ensure derived variables are also set
            document.documentElement.style.setProperty('--theme-text-main', themeVars['--theme-primary-dark']);
            document.documentElement.style.setProperty('--theme-border-main', themeVars['--theme-primary-dark']);

            currentTheme = themeId;
            localStorage.setItem('idk_current_theme' + localStorageKeySuffix, currentTheme);
            renderShopPageThemes();
        }
    }

    function saveShopData() {
        localStorage.setItem('idk_user_points_val' + localStorageKeySuffix, userPoints.toString());
        localStorage.setItem('idk_owned_themes' + localStorageKeySuffix, JSON.stringify(ownedThemes));
        localStorage.setItem('idk_current_theme' + localStorageKeySuffix, currentTheme); // Current theme also saved here
    }

    function renderShopPageThemes() {
        if (!themeGallery) return;
        themeGallery.innerHTML = '';

        Object.entries(themes).forEach(([themeId, themeData]) => {
            const card = document.createElement('div');
            card.className = 'shop-theme-card';
            card.dataset.themeId = themeId;

            let previewHTML = '<div class="shop-theme-preview-large">';
            const previewColors = themeData.cssVariables;
            const colorKeys = ['--theme-primary-dark', '--theme-primary-accent', '--theme-secondary-accent', '--theme-tertiary-accent', '--theme-highlight-accent'];
            for(let i=0; i < 5; i++) {
                previewHTML += `<span style="background-color: ${previewColors[colorKeys[i % colorKeys.length]]};"></span>`;
            }
            previewHTML += '</div>';

            const isOwned = ownedThemes.includes(themeId);
            const isActive = currentTheme === themeId;
            let buttonHTML;
            let statusHTML = ''; // Default to empty

            if (isActive) {
                buttonHTML = `<button class="shop-theme-button equipped-button" disabled>EQUIPPED</button>`;
                statusHTML = `<div class="shop-theme-status active">CURRENTLY ACTIVE</div>`;
            } else if (isOwned) {
                buttonHTML = `<button class="shop-theme-button apply-button" data-action="apply">APPLY</button>`;
                statusHTML = `<div class="shop-theme-status owned">OWNED</div>`;
            } else {
                buttonHTML = `<button class="shop-theme-button buy-button" data-action="buy" ${userPoints < themeData.cost ? 'disabled' : ''}>BUY</button>`;
                // For non-owned, show cost below description, not in status area
                statusHTML = `<div class="shop-theme-cost"><i class="fas fa-coins"></i> ${themeData.cost} PTS</div>`;
            }

            card.innerHTML = `
                ${previewHTML}
                <h3 class="shop-theme-name">${themeData.name}</h3>
                <p class="shop-theme-description">
                    ${themeData.description || `A stylish '${themeData.name}' experience.`}
                </p>
                ${statusHTML} 
                ${buttonHTML}
            `;
            themeGallery.appendChild(card);

            const button = card.querySelector('.shop-theme-button');
            if (button) {
                button.addEventListener('click', () => handleShopPageThemeAction(themeId, themeData, button.dataset.action));
            }
        });
        if(shopPageUserPointsDisplay) shopPageUserPointsDisplay.textContent = userPoints;
    }

    function handleShopPageThemeAction(themeId, themeData, action) {
        const cardElement = themeGallery.querySelector(`.shop-theme-card[data-theme-id="${themeId}"]`);
        let particleColor = themeData.cssVariables['--theme-secondary-accent']; // Default particle color

        if (action === 'apply') {
            applyThemeOnPage(themeId);
            showToast(`${themeData.name} theme APPLIED!`);
            if(cardElement && particleCanvasShop) {
                const rect = cardElement.getBoundingClientRect();
                createShopParticle(rect.left + rect.width/2, rect.top + rect.height/2, particleColor, 5, 30, 5, 1.2);
            }
        } else if (action === 'buy') {
            if (userPoints >= themeData.cost) {
                userPoints -= themeData.cost;
                ownedThemes.push(themeId);
                saveShopData(); 
                applyThemeOnPage(themeId); 
                showToast(`Purchased & Applied ${themeData.name}!`);
                if(cardElement && particleCanvasShop) {
                    const rect = cardElement.getBoundingClientRect();
                    createShopParticle(rect.left + rect.width/2, rect.top + rect.height/2, particleColor, 8, 60, 8, 1.5); // Bigger burst for purchase
                }
            } else {
                showToast("Not enough PTS!");
            }
        }
        // Re-render needed to update button states (e.g., BUY -> APPLY, enable/disable)
        // and points display on the shop page itself.
        renderShopPageThemes(); 
    }

    // Particle effects for shop page
    function createShopParticle(x, y, color, size, count, spread, speedMultiplier = 1) {
        if (!particleCanvasShop || !shopCtx) return;
        for (let i = 0; i < count; i++) {
            shopParticles.push({
                x, y,
                size: Math.random() * size + 2, 
                color,
                vx: (Math.random() - 0.5) * spread * speedMultiplier,
                vy: (Math.random() * -2 - 1) * speedMultiplier, 
                life: 40 + Math.random() * 25 
            });
        }
        // Ensure animation loop starts if it's not already running for shopParticles
        if (shopParticles.length > 0 && !shopParticles.some(p => p.isAnimating)) { // A bit simplistic check
             shopParticles.forEach(p => p.isAnimating = true); // Mark them to avoid re-triggering loop unnecessarily
             requestAnimationFrame(updateAndDrawParticlesShop);
        }
    }

    function updateAndDrawParticlesShop() {
        if (!particleCanvasShop || !shopCtx) return;
        shopCtx.clearRect(0, 0, particleCanvasShop.width, particleCanvasShop.height);
        let stillAnimating = false;
        for (let i = shopParticles.length - 1; i >= 0; i--) {
            const p = shopParticles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.08; 
            p.life--;
            if (p.life <= 0) {
                shopParticles.splice(i, 1);
                continue;
            }
            shopCtx.fillStyle = p.color;
            shopCtx.globalAlpha = Math.max(0, p.life / 65); // Ensure alpha doesn't go negative
            shopCtx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
            stillAnimating = true; // If any particle is still alive, we need to keep animating
        }
        shopCtx.globalAlpha = 1;
        if (stillAnimating) {
            requestAnimationFrame(updateAndDrawParticlesShop);
        } else {
            shopParticles.forEach(p => delete p.isAnimating); // Clear animation flag
        }
    }

    // Initial setup for shop page
    document.body.classList.add('shop-active');
    if(shopPageUserPointsDisplay) shopPageUserPointsDisplay.textContent = userPoints;
    applyThemeOnPage(currentTheme); // Apply current theme immediately
    // renderShopPageThemes(); // This is called by applyThemeOnPage, so it's redundant here
});
