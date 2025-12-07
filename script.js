// Configuration
const ADMIN_PASSWORD = 'admin123'; // Mot de passe admin par défaut
const STORAGE_KEY = 'drawAppData';
const ADMIN_KEY = 'drawAppAdmin';

// Éléments du DOM
const participantCountInput = document.getElementById('participantCount');
const generateBtn = document.getElementById('generateBtn');
const participantsContainer = document.getElementById('participantsContainer');
const drawBtn = document.getElementById('drawBtn');
const clearBtn = document.getElementById('clearBtn');
const resultSection = document.getElementById('resultSection');
const winnerDisplay = document.getElementById('winner');
const errorSection = document.getElementById('errorSection');
const errorMessage = document.getElementById('errorMessage');
const adminLoginPanel = document.getElementById('adminLoginPanel');
const adminPanel = document.getElementById('adminPanel');
const adminPasswordInput = document.getElementById('adminPassword');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const shareLinkInput = document.getElementById('shareLink');
const copyLinkBtn = document.getElementById('copyLinkBtn');
const adminBadge = document.getElementById('adminBadge');
const participantBadge = document.getElementById('participantBadge');
const subtitle = document.getElementById('subtitle');
const numberSelector = document.getElementById('numberSelector');
const inputSection = document.getElementById('inputSection');

// Variables globales
let isAdmin = false;
let sessionId = null;
let isParticipantMode = false;

// Fonction pour générer un ID de session unique
function generateSessionId() {
    return 'draw_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Fonction pour obtenir l'ID de session depuis l'URL
function getSessionIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// Fonction pour sauvegarder les données
function saveData() {
    if (!isAdmin || !sessionId) return;
    
    const participants = getParticipants();
    const data = {
        sessionId: sessionId,
        participants: participants,
        timestamp: Date.now()
    };
    
    localStorage.setItem(STORAGE_KEY + '_' + sessionId, JSON.stringify(data));
}

// Fonction pour charger les données
function loadData() {
    const urlSessionId = getSessionIdFromURL();
    
    if (urlSessionId) {
        // Mode participant - charger depuis l'ID de l'URL
        const data = localStorage.getItem(STORAGE_KEY + '_' + urlSessionId);
        if (data) {
            try {
                const parsed = JSON.parse(data);
                sessionId = urlSessionId;
                isParticipantMode = true;
                displayParticipants(parsed.participants);
                return true;
            } catch (e) {
                console.error('Erreur lors du chargement des données:', e);
            }
        }
    } else {
        // Mode admin - vérifier si déjà connecté
        const adminSession = localStorage.getItem(ADMIN_KEY);
        if (adminSession) {
            try {
                const parsed = JSON.parse(adminSession);
                sessionId = parsed.sessionId;
                isAdmin = true;
                const data = localStorage.getItem(STORAGE_KEY + '_' + sessionId);
                if (data) {
                    const parsedData = JSON.parse(data);
                    displayParticipants(parsedData.participants);
                } else {
                    generateParticipantFields();
                }
                showAdminInterface();
                return true;
            } catch (e) {
                console.error('Erreur lors du chargement de la session admin:', e);
            }
        }
    }
    
    return false;
}

// Fonction pour afficher les participants (mode lecture seule pour participants)
function displayParticipants(participants) {
    if (!participants || participants.length === 0) {
        generateParticipantFields();
        return;
    }
    
    participantsContainer.innerHTML = '';
    
    participants.forEach((name, index) => {
        const inputGroup = document.createElement('div');
        inputGroup.className = 'participant-input-group';
        
        const numberLabel = document.createElement('span');
        numberLabel.className = 'participant-number';
        numberLabel.textContent = `${index + 1}.`;
        
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'participant-input';
        input.id = `participant-${index + 1}`;
        input.value = name;
        input.disabled = isParticipantMode; // Désactiver en mode participant
        
        // Écouter les changements pour sauvegarder (admin seulement)
        if (isAdmin) {
            input.addEventListener('input', () => {
                saveData();
            });
        }
        
        inputGroup.appendChild(numberLabel);
        inputGroup.appendChild(input);
        participantsContainer.appendChild(inputGroup);
    });
}

// Fonction pour générer les champs de participants
function generateParticipantFields() {
    const count = parseInt(participantCountInput.value);
    
    if (count < 2 || count > 50) {
        showError('Le nombre de participants doit être entre 2 et 50.');
        return;
    }

    participantsContainer.innerHTML = '';
    
    for (let i = 1; i <= count; i++) {
        const inputGroup = document.createElement('div');
        inputGroup.className = 'participant-input-group';
        
        const numberLabel = document.createElement('span');
        numberLabel.className = 'participant-number';
        numberLabel.textContent = `${i}.`;
        
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'participant-input';
        input.id = `participant-${i}`;
        input.placeholder = `Participant ${i}`;
        input.disabled = isParticipantMode; // Désactivé seulement en mode participant
        
        // Écouter les changements pour sauvegarder
        if (isAdmin) {
            input.addEventListener('input', () => {
                saveData();
            });
        }
        
        inputGroup.appendChild(numberLabel);
        inputGroup.appendChild(input);
        participantsContainer.appendChild(inputGroup);
    }

    // Focus sur le premier champ si admin
    if (isAdmin) {
        const firstInput = document.getElementById('participant-1');
        if (firstInput) {
            firstInput.focus();
        }
    }

    hideError();
    
    if (isAdmin) {
        saveData();
    }
}

// Fonction pour récupérer les participants depuis les champs
function getParticipants() {
    const inputs = participantsContainer.querySelectorAll('.participant-input');
    const participants = [];
    
    inputs.forEach(input => {
        const value = input.value.trim();
        if (value.length > 0) {
            participants.push(value);
        }
    });
    
    return participants;
}

// Fonction pour afficher une erreur
function showError(message) {
    errorMessage.textContent = message;
    errorSection.classList.remove('hidden');
    resultSection.classList.add('hidden');
}

// Fonction pour cacher l'erreur
function hideError() {
    errorSection.classList.add('hidden');
}

// Fonction pour effectuer le tirage au sort
function drawWinner() {
    hideError();
    
    const participants = getParticipants();

    if (participants.length === 0) {
        showError('Veuillez entrer au moins un participant.');
        return;
    }

    if (participants.length === 1) {
        showError('Il faut au moins deux participants pour un tirage au sort.');
        return;
    }

    // Tirage au sort aléatoire
    const randomIndex = Math.floor(Math.random() * participants.length);
    const winner = participants[randomIndex];

    // Afficher le résultat
    winnerDisplay.textContent = winner;
    resultSection.classList.remove('hidden');

    // Animation de tirage
    animateDraw(participants);
}

// Animation de tirage
function animateDraw(participants) {
    let iterations = 0;
    const maxIterations = 20;
    const interval = 50;

    const animation = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * participants.length);
        winnerDisplay.textContent = participants[randomIndex];
        iterations++;

        if (iterations >= maxIterations) {
            clearInterval(animation);
            // Afficher le vrai gagnant
            const finalIndex = Math.floor(Math.random() * participants.length);
            winnerDisplay.textContent = participants[finalIndex];
        }
    }, interval);
}

// Fonction pour effacer
function clearInput() {
    if (!isAdmin) return;
    
    const inputs = participantsContainer.querySelectorAll('.participant-input');
    inputs.forEach(input => {
        input.value = '';
    });
    resultSection.classList.add('hidden');
    hideError();
    
    saveData();
    
    // Focus sur le premier champ
    const firstInput = document.getElementById('participant-1');
    if (firstInput) {
        firstInput.focus();
    }
}

// Fonction pour se connecter en admin
function loginAsAdmin() {
    const password = adminPasswordInput.value.trim();
    
    if (password === ADMIN_PASSWORD) {
        isAdmin = true;
        sessionId = generateSessionId();
        
        // Sauvegarder la session admin
        localStorage.setItem(ADMIN_KEY, JSON.stringify({
            sessionId: sessionId,
            timestamp: Date.now()
        }));
        
        // Cacher le panneau de connexion et vider le champ
        adminLoginPanel.classList.add('hidden');
        adminPasswordInput.value = '';
        
        // Afficher l'interface admin
        showAdminInterface();
        
        // Générer le lien de partage
        updateShareLink();
        
        // Générer les champs par défaut (avec un petit délai pour s'assurer que tout est affiché)
        setTimeout(() => {
            generateParticipantFields();
        }, 100);
    } else {
        showError('Mot de passe incorrect.');
        adminPasswordInput.value = '';
        adminPasswordInput.focus();
    }
}

// Fonction pour se déconnecter
function logout() {
    isAdmin = false;
    sessionId = null;
    localStorage.removeItem(ADMIN_KEY);
    window.location.href = window.location.pathname; // Recharger sans paramètres
}

// Fonction pour afficher l'interface admin
function showAdminInterface() {
    adminLoginPanel.classList.add('hidden');
    adminPanel.classList.remove('hidden');
    adminBadge.classList.remove('hidden');
    participantBadge.classList.add('hidden');
    subtitle.textContent = 'Gérez les participants et partagez le lien';
    
    // Afficher la section de gestion des participants
    if (inputSection) {
        inputSection.style.display = 'block';
    }
    
    // Activer les champs
    if (participantCountInput) participantCountInput.disabled = false;
    if (generateBtn) generateBtn.disabled = false;
    if (clearBtn) clearBtn.disabled = false;
    if (numberSelector) numberSelector.style.opacity = '1';
    
    // Activer tous les champs de participants existants
    const participantInputs = participantsContainer.querySelectorAll('.participant-input');
    participantInputs.forEach(input => {
        input.disabled = false;
    });
    
    // Mettre à jour le lien de partage
    updateShareLink();
}

// Fonction pour afficher l'interface participant
function showParticipantInterface() {
    adminLoginPanel.classList.add('hidden');
    adminPanel.classList.add('hidden');
    adminBadge.classList.add('hidden');
    participantBadge.classList.remove('hidden');
    subtitle.textContent = 'Mode lecture seule - Vous pouvez voir et lancer le tirage';
    
    // Désactiver les champs de modification
    participantCountInput.disabled = true;
    generateBtn.disabled = true;
    clearBtn.disabled = true;
    numberSelector.style.opacity = '0.6';
}

// Fonction pour mettre à jour le lien de partage
function updateShareLink() {
    if (!sessionId) return;
    
    const shareUrl = window.location.origin + window.location.pathname + '?id=' + sessionId;
    shareLinkInput.value = shareUrl;
}

// Fonction pour copier le lien
function copyShareLink() {
    shareLinkInput.select();
    shareLinkInput.setSelectionRange(0, 99999); // Pour mobile
    
    try {
        document.execCommand('copy');
        copyLinkBtn.textContent = '✓ Copié !';
        setTimeout(() => {
            copyLinkBtn.textContent = '📋 Copier';
        }, 2000);
    } catch (err) {
        // Fallback pour les navigateurs modernes
        navigator.clipboard.writeText(shareLinkInput.value).then(() => {
            copyLinkBtn.textContent = '✓ Copié !';
            setTimeout(() => {
                copyLinkBtn.textContent = '📋 Copier';
            }, 2000);
        });
    }
}

// Événements
loginBtn.addEventListener('click', loginAsAdmin);
logoutBtn.addEventListener('click', logout);
copyLinkBtn.addEventListener('click', copyShareLink);
generateBtn.addEventListener('click', generateParticipantFields);
drawBtn.addEventListener('click', drawWinner);
clearBtn.addEventListener('click', clearInput);

// Permettre Entrée pour se connecter
adminPasswordInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        loginAsAdmin();
    }
});

// Initialisation au chargement
window.addEventListener('load', () => {
    const loaded = loadData();
    
    if (!loaded) {
        // Aucune session trouvée - afficher le panneau de connexion
        adminLoginPanel.classList.remove('hidden');
        adminPanel.classList.add('hidden');
        adminBadge.classList.add('hidden');
        participantBadge.classList.add('hidden');
        inputSection.style.display = 'none';
        adminPasswordInput.focus();
    } else if (isParticipantMode) {
        // Mode participant
        showParticipantInterface();
        inputSection.style.display = 'block';
    } else if (isAdmin) {
        // Mode admin
        showAdminInterface();
        inputSection.style.display = 'block';
    }
    
    // Polling pour mettre à jour les données en mode participant
    if (isParticipantMode) {
        setInterval(() => {
            const data = localStorage.getItem(STORAGE_KEY + '_' + sessionId);
            if (data) {
                try {
                    const parsed = JSON.parse(data);
                    displayParticipants(parsed.participants);
                } catch (e) {
                    console.error('Erreur lors de la mise à jour:', e);
                }
            }
        }, 1000); // Vérifier toutes les secondes
    }
});

// Permettre d'utiliser Entrée dans les champs pour passer au suivant (admin seulement)
participantsContainer.addEventListener('keydown', (e) => {
    if (!isAdmin) return;
    
    if (e.key === 'Enter') {
        e.preventDefault();
        const currentInput = e.target;
        const allInputs = Array.from(participantsContainer.querySelectorAll('.participant-input'));
        const currentIndex = allInputs.indexOf(currentInput);
        
        if (currentIndex < allInputs.length - 1) {
            allInputs[currentIndex + 1].focus();
        } else {
            // Si on est sur le dernier champ, lancer le tirage
            drawWinner();
        }
    }
    
    // Ctrl/Cmd + Enter pour lancer le tirage
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        drawWinner();
    }
});
