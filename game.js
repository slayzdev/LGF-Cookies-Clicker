class CookieGame {
    constructor() {
        this.cookies = 0;
        this.cookiesPerSecond = 0;
        this.upgrades = {
            cursor: { owned: 0, baseCost: 15, baseProduction: 0.1 },
            grandma: { owned: 0, baseCost: 100, baseProduction: 1 },
            farm: { owned: 0, baseCost: 1100, baseProduction: 8 },
            mine: { owned: 0, baseCost: 12000, baseProduction: 47 },
            factory: { owned: 0, baseCost: 130000, baseProduction: 260 },
            bank: { owned: 0, baseCost: 1400000, baseProduction: 1400 },
            temple: { owned: 0, baseCost: 20000000, baseProduction: 7800 },
            wizard: { owned: 0, baseCost: 330000000, baseProduction: 44000 },
            shipment: { owned: 0, baseCost: 5100000000, baseProduction: 260000 }
        };
        this.achievements = {
            cookies: [
                { id: 'cookies1', name: 'Cookie Débutant', description: 'Produire 100 cookies', requirement: 100, unlocked: false },
                { id: 'cookies2', name: 'Cookie Amateur', description: 'Produire 1,000 cookies', requirement: 1000, unlocked: false },
                { id: 'cookies3', name: 'Cookie Professionnel', description: 'Produire 100,000 cookies', requirement: 100000, unlocked: false },
                { id: 'cookies4', name: 'Cookie Maître', description: 'Produire 1 million de cookies', requirement: 1000000, unlocked: false },
                { id: 'cookies5', name: 'Cookie Légende', description: 'Produire 100 millions de cookies', requirement: 100000000, unlocked: false },
                { id: 'cookies6', name: 'Cookie Univers', description: 'Produire 1 milliard de cookies', requirement: 1000000000, unlocked: false }
            ],
            clicks: [
                { id: 'clicks1', name: 'Cliqueur Novice', description: 'Cliquer 100 fois', requirement: 100, unlocked: false },
                { id: 'clicks2', name: 'Cliqueur Expert', description: 'Cliquer 1,000 fois', requirement: 1000, unlocked: false },
                { id: 'clicks3', name: 'Cliqueur Fou', description: 'Cliquer 10,000 fois', requirement: 10000, unlocked: false },
                { id: 'clicks4', name: 'Cliqueur Légendaire', description: 'Cliquer 100,000 fois', requirement: 100000, unlocked: false }
            ],
            cps: [
                { id: 'cps1', name: 'Production Modeste', description: 'Atteindre 10 cookies/s', requirement: 10, unlocked: false },
                { id: 'cps2', name: 'Production Décente', description: 'Atteindre 100 cookies/s', requirement: 100, unlocked: false },
                { id: 'cps3', name: 'Production Impressionnante', description: 'Atteindre 1,000 cookies/s', requirement: 1000, unlocked: false },
                { id: 'cps4', name: 'Production Massive', description: 'Atteindre 10,000 cookies/s', requirement: 10000, unlocked: false },
                { id: 'cps5', name: 'Production Titanesque', description: 'Atteindre 100,000 cookies/s', requirement: 100000, unlocked: false }
            ],
            golden: [
                { id: 'golden1', name: 'Chance Dorée', description: 'Cliquer sur 1 cookie doré', requirement: 1, unlocked: false },
                { id: 'golden2', name: 'Chasseur de Trésors', description: 'Cliquer sur 10 cookies dorés', requirement: 10, unlocked: false },
                { id: 'golden3', name: 'Chercheur d\'Or', description: 'Cliquer sur 50 cookies dorés', requirement: 50, unlocked: false }
            ],
            buildings: [
                { id: 'build1', name: 'Petit Empire', description: 'Posséder 10 bâtiments', requirement: 10, unlocked: false },
                { id: 'build2', name: 'Empire Grandissant', description: 'Posséder 50 bâtiments', requirement: 50, unlocked: false },
                { id: 'build3', name: 'Empire Colossal', description: 'Posséder 100 bâtiments', requirement: 100, unlocked: false }
            ],
            combo: [
                { id: 'combo1', name: 'Combo x10', description: 'Atteindre un combo de 10 clics', requirement: 10, unlocked: false },
                { id: 'combo2', name: 'Combo x50', description: 'Atteindre un combo de 50 clics', requirement: 50, unlocked: false },
                { id: 'combo3', name: 'Combo x100', description: 'Atteindre un combo de 100 clics', requirement: 100, unlocked: false }
            ]
        };
        this.clicks = 0;
        this.goldenClicks = 0;
        this.combo = 0;
        this.maxCombo = 0;
        this.lastClickTime = 0;
        this.activeEffects = [];
        this.init();
    }

    init() {
        // Gestion de l'écran de démarrage
        const splashScreen = document.querySelector('.splash-screen');
        setTimeout(() => {
            splashScreen.classList.add('fade-out');
            setTimeout(() => {
                splashScreen.remove();
            }, 1000);
        }, 6000);

        // Reste du code init
        this.initElements();
        this.initEventListeners();
        this.loadGame();
        this.updateDisplay();
        this.startAutoSave();
        this.startGoldenCookieSpawner();
        this.updateAchievements();
        this.updateUpgrades();
    }

    initElements() {
        this.cookieElement = document.getElementById('cookie');
        this.cookieCountElement = document.getElementById('cookie-count');
        this.cpsElement = document.getElementById('cps');
        this.achievementsListElement = document.getElementById('achievements-list');
        this.upgradeElements = document.querySelectorAll('.upgrade');
    }

    initEventListeners() {
        this.cookieElement.addEventListener('click', () => this.clickCookie());
        this.upgradeElements.forEach(element => {
            element.addEventListener('click', () => {
                const upgradeId = element.dataset.id;
                this.buyUpgrade(upgradeId);
            });
        });
        setInterval(() => this.updateGame(), 1000);
    }

    startAutoSave() {
        setInterval(() => this.saveGame(), 30000);
    }

    startGoldenCookieSpawner() {
        setInterval(() => {
            if (Math.random() < 0.1) this.spawnGoldenCookie();
        }, 10000);
    }

    spawnGoldenCookie() {
        const goldenCookie = document.createElement('div');
        goldenCookie.className = 'golden-cookie';
        goldenCookie.style.left = Math.random() * (window.innerWidth - 60) + 'px';
        goldenCookie.style.top = Math.random() * (window.innerHeight - 60) + 'px';
        
        goldenCookie.addEventListener('click', () => {
            this.goldenClicks++;
            this.applyGoldenCookieEffect();
            document.body.removeChild(goldenCookie);
            this.checkAchievements();
        });

        document.body.appendChild(goldenCookie);
        setTimeout(() => {
            if (document.body.contains(goldenCookie)) {
                document.body.removeChild(goldenCookie);
            }
        }, 15000);
    }

    applyGoldenCookieEffect() {
        const effects = [
            { name: 'Frénésie', multiplier: 7, duration: 30, type: 'click' },
            { name: 'Chance Dorée', multiplier: 3, duration: 60, type: 'production' },
            { name: 'Pluie de Cookies', cookies: this.cookiesPerSecond * 900 }
        ];

        const effect = effects[Math.floor(Math.random() * effects.length)];
        
        if (effect.cookies) {
            this.cookies += effect.cookies;
            this.showNotification(`Pluie de Cookies ! +${this.formatNumber(effect.cookies)} cookies`, 'success');
        } else {
            this.addEffect(effect);
            this.showNotification(`${effect.name} activé pour ${effect.duration} secondes !`, 'success');
        }
    }

    addEffect(effect) {
        // Supprimer l'effet existant du même type s'il existe
        this.activeEffects = this.activeEffects.filter(e => e.type !== effect.type);
        
        effect.endTime = Date.now() + effect.duration * 1000;
        this.activeEffects.push(effect);
        
        setTimeout(() => {
            this.activeEffects = this.activeEffects.filter(e => e !== effect);
            this.showNotification(`${effect.name} terminé !`, 'info');
            this.updateCookiesPerSecond();
        }, effect.duration * 1000);
    }

    clickCookie() {
        const now = Date.now();
        if (now - this.lastClickTime < 300) {
            this.combo++;
            if (this.combo > this.maxCombo) {
                this.maxCombo = this.combo;
                this.checkAchievements();
            }
        } else {
            this.combo = 1;
        }
        this.lastClickTime = now;

        const baseGain = 1;
        let gain = baseGain;

        // Appliquer les effets actifs
        const clickEffect = this.activeEffects.find(e => e.type === 'click');
        if (clickEffect) {
            gain *= clickEffect.multiplier;
        }

        // Bonus de combo
        gain *= (1 + this.combo * 0.1);

        this.cookies += gain;
        this.clicks++;
        this.createParticle(gain);
        if (this.combo > 1) {
            this.createComboText();
        }
        this.checkAchievements();
        this.updateDisplay();
    }

    createParticle(gain) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        if (this.combo > 1) particle.classList.add('combo');
        
        particle.textContent = '+' + this.formatNumber(gain);
        
        const rect = this.cookieElement.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        
        particle.style.setProperty('--x', (Math.random() * 200 - 100) + 'px');
        particle.style.setProperty('--y', (-100 - Math.random() * 100) + 'px');
        
        document.body.appendChild(particle);
        setTimeout(() => document.body.removeChild(particle), 1000);
    }

    createComboText() {
        const text = document.createElement('div');
        text.className = 'combo-text';
        text.textContent = 'Combo x' + this.combo;
        
        const rect = this.cookieElement.getBoundingClientRect();
        text.style.left = (rect.left + rect.width / 2) + 'px';
        text.style.top = (rect.top - 20) + 'px';
        
        document.body.appendChild(text);
        setTimeout(() => document.body.removeChild(text), 1000);
    }

    buyUpgrade(upgradeId) {
        const upgrade = this.upgrades[upgradeId];
        const cost = this.calculateUpgradeCost(upgradeId);
        
        if (this.cookies >= cost) {
            this.cookies -= cost;
            upgrade.owned++;
            this.updateCookiesPerSecond();
            this.checkAchievements();
            this.showNotification(`${upgradeId.charAt(0).toUpperCase() + upgradeId.slice(1)} acheté !`, 'success');
        } else {
            this.showNotification('Pas assez de cookies !', 'error');
        }
    }

    calculateUpgradeCost(upgradeId) {
        const upgrade = this.upgrades[upgradeId];
        if (!upgrade || isNaN(upgrade.baseCost) || isNaN(upgrade.owned)) return 0;
        return Math.floor(upgrade.baseCost * Math.pow(1.15, upgrade.owned));
    }

    updateCookiesPerSecond() {
        let cps = 0;
        for (const [id, upgrade] of Object.entries(this.upgrades)) {
            if (!upgrade || isNaN(upgrade.baseProduction) || isNaN(upgrade.owned)) continue;
            cps += upgrade.baseProduction * upgrade.owned;
        }

        // Appliquer les effets actifs
        const productionEffect = this.activeEffects.find(e => e.type === 'production');
        if (productionEffect && !isNaN(productionEffect.multiplier)) {
            cps *= productionEffect.multiplier;
        }

        this.cookiesPerSecond = isNaN(cps) ? 0 : cps;
        this.updateDisplay();
    }

    updateGame() {
        this.cookies += this.cookiesPerSecond;
        this.checkAchievements();
        this.updateDisplay();
        this.updateUpgrades();
    }

    updateDisplay() {
        // Vérifier que les valeurs sont des nombres valides
        const cookieCount = isNaN(this.cookies) ? 0 : this.cookies;
        const cpsValue = isNaN(this.cookiesPerSecond) ? 0 : this.cookiesPerSecond;
        
        this.cookieCountElement.textContent = this.formatNumber(Math.floor(cookieCount));
        this.cpsElement.textContent = this.formatNumber(cpsValue);
        this.updateUpgrades();
    }

    updateUpgrades() {
        this.upgradeElements.forEach(element => {
            const upgradeId = element.dataset.id;
            const upgrade = this.upgrades[upgradeId];
            
            if (!upgrade) return; // Ignorer si l'amélioration n'existe pas
            
            // Vérifier que les valeurs sont des nombres valides
            const cost = this.calculateUpgradeCost(upgradeId);
            const owned = isNaN(upgrade.owned) ? 0 : upgrade.owned;
            const production = isNaN(upgrade.baseProduction) ? 0 : upgrade.baseProduction;
            
            const costElement = element.querySelector('.cost');
            const ownedElement = element.querySelector('.owned');
            const productionElement = element.querySelector('.production');
            
            if (costElement) costElement.textContent = this.formatNumber(cost);
            if (ownedElement) ownedElement.textContent = owned;
            if (productionElement) productionElement.textContent = this.formatNumber(production * owned);
            
            element.classList.toggle('can-buy', this.cookies >= cost);
        });
    }

    checkAchievements() {
        let unlocked = false;
        
        // Vérifier les succès de cookies
        this.achievements.cookies.forEach(achievement => {
            if (!achievement.unlocked && this.cookies >= achievement.requirement) {
                achievement.unlocked = true;
                unlocked = true;
            }
        });

        // Vérifier les succès de clics
        this.achievements.clicks.forEach(achievement => {
            if (!achievement.unlocked && this.clicks >= achievement.requirement) {
                achievement.unlocked = true;
                unlocked = true;
            }
        });

        // Vérifier les succès de CPS
        this.achievements.cps.forEach(achievement => {
            if (!achievement.unlocked && this.cookiesPerSecond >= achievement.requirement) {
                achievement.unlocked = true;
                unlocked = true;
            }
        });

        // Vérifier les succès de cookies dorés
        this.achievements.golden.forEach(achievement => {
            if (!achievement.unlocked && this.goldenClicks >= achievement.requirement) {
                achievement.unlocked = true;
                unlocked = true;
            }
        });

        // Vérifier les succès de bâtiments
        const totalBuildings = Object.values(this.upgrades).reduce((sum, upgrade) => sum + upgrade.owned, 0);
        this.achievements.buildings.forEach(achievement => {
            if (!achievement.unlocked && totalBuildings >= achievement.requirement) {
                achievement.unlocked = true;
                unlocked = true;
            }
        });

        // Vérifier les succès de combo
        this.achievements.combo.forEach(achievement => {
            if (!achievement.unlocked && this.maxCombo >= achievement.requirement) {
                achievement.unlocked = true;
                unlocked = true;
            }
        });

        if (unlocked) {
            this.updateAchievements();
            this.showNotification('Nouveau succès débloqué !', 'success');
        }
    }

    updateAchievements() {
        this.achievementsListElement.innerHTML = '';
        
        const categories = Object.entries(this.achievements);
        categories.forEach(([category, achievements]) => {
            achievements.forEach(achievement => {
                const element = document.createElement('div');
                element.className = 'achievement' + (achievement.unlocked ? ' unlocked' : '');
                element.innerHTML = `
                    <strong>${achievement.name}</strong>
                    <p>${achievement.description}</p>
                `;
                this.achievementsListElement.appendChild(element);
            });
        });
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = 'notification ' + type;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => document.body.removeChild(notification), 500);
        }, 2000);
    }

    formatNumber(num) {
        // Vérifier si le nombre est valide
        if (isNaN(num) || !isFinite(num)) return '0';
        
        if (num >= 1e9) return (num / 1e9).toFixed(2) + ' milliards';
        if (num >= 1e6) return (num / 1e6).toFixed(2) + ' millions';
        if (num >= 1e3) return (num / 1e3).toFixed(2) + ' k';
        return Math.floor(num).toString();
    }

    saveGame() {
        const saveData = {
            cookies: this.cookies,
            upgrades: this.upgrades,
            clicks: this.clicks,
            goldenClicks: this.goldenClicks,
            achievements: this.achievements,
            maxCombo: this.maxCombo
        };
        localStorage.setItem('cookieGame', JSON.stringify(saveData));
    }

    loadGame() {
        const saveData = localStorage.getItem('cookieGame');
        if (saveData) {
            try {
                const data = JSON.parse(saveData);
                // Vérifier et nettoyer les données chargées
                this.cookies = isNaN(data.cookies) ? 0 : data.cookies;
                this.clicks = isNaN(data.clicks) ? 0 : data.clicks;
                this.goldenClicks = isNaN(data.goldenClicks) ? 0 : data.goldenClicks;
                this.maxCombo = isNaN(data.maxCombo) ? 0 : data.maxCombo;
                
                // Nettoyer les améliorations
                if (data.upgrades) {
                    for (const [id, upgrade] of Object.entries(data.upgrades)) {
                        if (this.upgrades[id]) {
                            this.upgrades[id].owned = isNaN(upgrade.owned) ? 0 : upgrade.owned;
                        }
                    }
                }
                
                // Restaurer les succès
                if (data.achievements) {
                    for (const category in this.achievements) {
                        if (data.achievements[category]) {
                            this.achievements[category].forEach((achievement, index) => {
                                if (data.achievements[category][index]) {
                                    achievement.unlocked = !!data.achievements[category][index].unlocked;
                                }
                            });
                        }
                    }
                }
            } catch (error) {
                console.error('Erreur lors du chargement de la sauvegarde:', error);
                this.showNotification('Erreur lors du chargement de la sauvegarde', 'error');
            }
        }
    }
}

new CookieGame(); 