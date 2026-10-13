// DOM Elements
const tabButtons = document.querySelectorAll('.tab-button');
const tabPanes = document.querySelectorAll('.tab-pane');
const evidenceItems = document.querySelectorAll('.evidence-item');
const suspectCards = document.querySelectorAll('.suspect-card');
const clueCountElement = document.getElementById('clue-count');
const suspectCountElement = document.getElementById('suspect-count');
const noteInput = document.querySelector('.note-input textarea');
const addNoteButton = document.querySelector('.note-input button');
const notesList = document.querySelector('.notes-list');

// State
let cluesFound = 0;
let suspectsInterviewed = 0;
let notes = [];
let currentEvidence = null;
let currentSuspect = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Set up event listeners
    setupTabNavigation();
    setupEvidenceItems();
    setupSuspectCards();
    setupNoteTaking();
    loadNotesFromLocalStorage();
    updateCounts();
});

// Tab Navigation
function setupTabNavigation() {
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');

            // Update active tab button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Update active tab pane
            tabPanes.forEach(pane => {
                if (pane.id === tabId) {
                    pane.classList.add('active');
                } else {
                    pane.classList.remove('active');
                }
            });
        });
    });
}

// Evidence Items
function setupEvidenceItems() {
    evidenceItems.forEach(item => {
        item.addEventListener('click', () => {
            const clueId = item.getAttribute('data-clue');
            analyzeEvidence(clueId, item);
        });
    });
}

function analyzeEvidence(clueId, element) {
    // Show modal with evidence details
    const modal = document.getElementById('evidence-modal') || createEvidenceModal();
    const modalContent = modal.querySelector('.modal-content');

    // Set modal content based on evidence
    const evidenceDetails = getEvidenceDetails(clueId);
    modalContent.innerHTML = `
        <span class="close-modal">&times;</span>
        <h2>${evidenceDetails.title}</h2>
        <div class="evidence-detail">
            <div class="evidence-icon-large">
                <i class="${evidenceDetails.icon}"></i>
            </div>
            <p>${evidenceDetails.description}</p>
            <div class="analysis-result">
                <h3>Analysis</h3>
                <p>${evidenceDetails.analysis}</p>
            </div>
            <div class="implications">
                <h3>Implications</h3>
                <p>${evidenceDetails.implications}</p>
            </div>
        </div>
    `;

    // Show modal
    modal.style.display = 'flex';

    // Update evidence status
    const statusElement = element.querySelector('.evidence-status');
    statusElement.textContent = 'Analyzed';
    statusElement.classList.add('analyzed');

    // Update clue count
    if (!element.classList.contains('analyzed')) {
        element.classList.add('analyzed');
        cluesFound++;
        updateCounts();
        saveProgress();
    }

    // Close modal functionality
    const closeModalButton = modal.querySelector('.close-modal');
    closeModalButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

function createEvidenceModal() {
    const modal = document.createElement('div');
    modal.id = 'evidence-modal';
    modal.className = 'modal';
    document.body.appendChild(modal);
    return modal;
}

function getEvidenceDetails(clueId) {
    const evidenceData = {
        1: {
            title: "Fingerprint Analysis",
            icon: "fas fa-fingerprint",
            description: "A partial print found on the skylight frame. The print is smudged but shows distinctive characteristics.",
            analysis: "The fingerprint belongs to James Riley, the security chief. This is significant as he claimed to be at home during the heist.",
            implications: "This suggests either Riley was involved in the heist or someone deliberately framed him. His access to security systems makes him a prime suspect."
        },
        2: {
            title: "Footprint Analysis",
            icon: "fas fa-shoe-prints",
            description: "Unusual shoe prints in the garden below the skylight. The prints are distinctive and match a rare brand of climbing shoes.",
            analysis: "The prints belong to professional climbing equipment. These shoes are custom-made and very expensive, likely only available to a few individuals in the city.",
            implications: "The thief was highly prepared and had specialized equipment. This points to a professional art thief rather than an amateur job."
        },
        3: {
            title: "Security Footage Analysis",
            icon: "fas fa-camera",
            description: "Blurred footage from multiple cameras shows a figure entering through the skylight. The figure appears to be wearing dark clothing.",
            analysis: "Enhanced image processing reveals the figure is wearing a distinctive ring on their right hand. The footage also shows the person moving with purpose and familiarity with the gallery layout.",
            implications: "The thief knew exactly where to go and what to take, suggesting inside knowledge. The ring might be a key identifier for the suspect."
        },
        4: {
            title: "Paint Residue Analysis",
            icon: "fas fa-palette",
            description: "Blue paint chips found near the empty painting frame. The chips match the color of the painting's protective coating.",
            analysis: "The paint residue contains traces of a chemical compound used in high-end art restoration. This suggests the thief may have some expertise in art handling.",
            implications: "The thief likely had knowledge of art preservation and handling, possibly indicating a connection to the art world."
        },
        5: {
            title: "Jewel Fragment Analysis",
            icon: "fas fa-gem",
            description: "A small diamond fragment from the painting's ornate frame. The frame was specifically designed to include these decorative elements.",
            analysis: "The diamond is of exceptional quality and likely came from the frame's decorative elements. It's not a random piece but part of the original frame design.",
            implications: "The thief deliberately removed this fragment, possibly as a trophy or to sell separately. This suggests a motive beyond simple theft."
        },
        6: {
            title: "Gallery Records Analysis",
            icon: "fas fa-file",
            description: "Visitor logs from the day before the heist show several suspicious entries. One person spent an unusually long time in the gallery after closing.",
            analysis: "The records show that Sophia Laurent, the art appraiser, stayed in the gallery for over two hours after closing time. She claimed to be doing a 'last-minute assessment' of the painting.",
            implications: "This contradicts her alibi of being with a client during the heist. She may have been casing the gallery or creating an opportunity for the theft."
        },
        7: {
            title: "Insurance Policy Analysis",
            icon: "fas fa-certificate",
            description: "Details about the painting's insurance coverage reveal some interesting clauses and recent changes.",
            analysis: "The insurance policy was recently updated to increase coverage by 50%. Additionally, there's a clause that pays out immediately if the painting is 'irreparably damaged' rather than stolen.",
            implications: "This creates a potential motive for someone to benefit from the painting's disappearance, possibly through an insurance scam."
        },
        8: {
            title: "Anonymous Tip Analysis",
            icon: "fas fa-envelope",
            description: "A cryptic note received anonymously the day after the heist mentions 'the inside job' and references a specific detail only an insider would know.",
            analysis: "The note references the painting's hidden security features that weren't publicly known. This suggests the sender has inside knowledge of both the gallery and the painting.",
            implications: "The tipster may be trying to guide the investigation or divert attention from their own involvement. The 'inside job' reference suggests a conspiracy."
        }
    };

    return evidenceData[clueId] || {
        title: "Unknown Evidence",
        icon: "fas fa-question",
        description: "No information available.",
        analysis: "Analysis pending.",
        implications: "Implications unknown."
    };
}

// Suspect Cards
function setupSuspectCards() {
    suspectCards.forEach(card => {
        card.addEventListener('click', () => {
            const suspectId = card.getAttribute('data-suspect');
            interviewSuspect(suspectId, card);
        });
    });
}

function interviewSuspect(suspectId, element) {
    // Show modal with suspect details
    const modal = document.getElementById('suspect-modal') || createSuspectModal();
    const modalContent = modal.querySelector('.modal-content');

    // Set modal content based on suspect
    const suspectDetails = getSuspectDetails(suspectId);
    modalContent.innerHTML = `
        <span class="close-modal">&times;</span>
        <h2>${suspectDetails.name}</h2>
        <div class="suspect-detail">
            <div class="suspect-photo-large">
                <img src="https://picsum.photos/seed/suspect${suspectId}/400/400.jpg" alt="${suspectDetails.name}">
            </div>
            <div class="suspect-info-large">
                <div class="suspect-role">${suspectDetails.role}</div>
                <div class="suspect-bio">
                    <h3>Background</h3>
                    <p>${suspectDetails.background}</p>
                </div>
                <div class="suspect-interview">
                    <h3>Interview Transcript</h3>
                    <p>${suspectDetails.interview}</p>
                </div>
                <div class="suspect-revelation">
                    <h3>New Information</h3>
                    <p>${suspectDetails.revelation}</p>
                </div>
            </div>
        </div>
    `;

    // Show modal
    modal.style.display = 'flex';

    // Update suspect status
    const statusElement = element.querySelector('.suspect-status');
    statusElement.textContent = 'Interviewed';
    statusElement.classList.add('interviewed');

    // Update suspect count
    if (!element.classList.contains('interviewed')) {
        element.classList.add('interviewed');
        suspectsInterviewed++;
        updateCounts();
        saveProgress();
    }

    // Close modal functionality
    const closeModalButton = modal.querySelector('.close-modal');
    closeModalButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

function createSuspectModal() {
    const modal = document.createElement('div');
    modal.id = 'suspect-modal';
    modal.className = 'modal';
    document.body.appendChild(modal);
    return modal;
}

function getSuspectDetails(suspectId) {
    const suspectData = {
        1: {
            name: "Marcus Sterling",
            role: "Gallery Owner",
            background: "Marcus founded the Sterling Gallery 15 years ago after inheriting a substantial fortune. He's known for his passion for art and has built the gallery into one of the most prestigious in the city. However, he's facing financial difficulties with a new expansion project.",
            interview: "I was at the charity event downtown as I told you. The whole board can vouch for me. That painting is my pride and joy - why would I steal it? Unless... someone wants me to look guilty to force me to sell the gallery at a discount. That makes more sense than me stealing my own property.",
            revelation: "Marcus reveals that he's been approached by a mysterious buyer offering to buy the gallery at below market value. The buyer seemed particularly interested in the Sterling family collection, which includes the stolen painting. He believes this buyer orchestrated the theft to pressure him into selling."
        },
        2: {
            name: "Isabella Chen",
            role: "Chief Curator",
            background: "Isabella has been with the gallery for 10 years and is considered an expert in modern art. She has a PhD in art history and is responsible for acquisitions and exhibitions. She's known for her attention to detail and has a reputation for being somewhat aloof.",
            interview: "I was working late as I often do. The painting needed special attention before the exhibition. I left around 11 PM, well before the security system was activated. I have nothing to hide - the painting was in perfect condition when I left.",
            revelation: "Isabella admits to having personal disagreements with Marcus about the direction of the gallery. She believes he's prioritizing profit over art preservation. She also reveals that she discovered the painting had been restored several times, which significantly decreased its value - information that wasn't publicly disclosed."
        },
        3: {
            name: "James Riley",
            role: "Security Chief",
            background: "James joined the gallery's security team 5 years ago and was promoted to chief 2 years ago. He has a military background and is known for his meticulous attention to security protocols. He's responsible for the security system and has access to all areas of the gallery.",
            interview: "I was home with my family all night. My wife can confirm. The fingerprint must be from when I inspected the skylight last week during routine checks. I've been working here for years - why would I risk my job and reputation for a painting?",
            revelation: "James confesses that he's been receiving anonymous threats warning him not to interfere with 'the operation'. He was instructed to disable certain security features on the night of the heist under the guise of a 'system upgrade'. He was afraid to come forward initially."
        },
        4: {
            name: "Sophia Laurent",
            role: "Art Appraiser",
            background: "Sophia is an independent art appraiser who works with the gallery on special projects. She has connections to high-end collectors and auction houses worldwide. She's known for her expertise in contemporary art and has a reputation for being discreet.",
            interview: "I was having dinner with a client discussing potential acquisitions. We met at an upscale restaurant downtown. I wouldn't risk my reputation by getting involved in something like this - my career depends on trust and discretion.",
            revelation: "Sophia reveals that she was approached by a collector willing to pay an extraordinary amount for the painting. The collector insisted on complete anonymity and provided details that only someone with inside knowledge would know. She admits to meeting with this collector but claims she refused to participate in any illegal activities."
        }
    };

    return suspectData[suspectId] || {
        name: "Unknown Suspect",
        role: "Unknown Role",
        background: "No information available.",
        interview: "No interview available.",
        revelation: "No revelation available."
    };
}

// Note Taking
function setupNoteTaking() {
    addNoteButton.addEventListener('click', addNote);

    // Allow adding notes with Ctrl+Enter
    noteInput.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            addNote();
        }
    });
}

function addNote() {
    const noteText = noteInput.value.trim();
    if (noteText === '') return;

    const note = {
        id: Date.now(),
        text: noteText,
        date: new Date().toLocaleString()
    };

    notes.unshift(note);
    noteInput.value = '';
    renderNotes();
    saveNotesToLocalStorage();
}

function renderNotes() {
    notesList.innerHTML = '';

    if (notes.length === 0) {
        notesList.innerHTML = '<p class="no-notes">No notes yet. Start investigating!</p>';
        return;
    }

    notes.forEach(note => {
        const noteElement = document.createElement('div');
        noteElement.className = 'note-item';
        noteElement.innerHTML = `
            <div class="note-header">
                <div class="note-title">Note #${note.id}</div>
                <div class="note-date">${note.date}</div>
            </div>
            <div class="note-content">${note.text}</div>
        `;
        notesList.appendChild(noteElement);
    });
}

// Local Storage
function saveProgress() {
    const progress = {
        cluesFound,
        suspectsInterviewed
    };
    localStorage.setItem('detectiveProgress', JSON.stringify(progress));
}

function saveNotesToLocalStorage() {
    localStorage.setItem('detectiveNotes', JSON.stringify(notes));
}

function loadNotesFromLocalStorage() {
    const savedNotes = localStorage.getItem('detectiveNotes');
    if (savedNotes) {
        notes = JSON.parse(savedNotes);
        renderNotes();
    }

    const savedProgress = localStorage.getItem('detectiveProgress');
    if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        cluesFound = progress.cluesFound || 0;
        suspectsInterviewed = progress.suspectsInterviewed || 0;

        // Update UI based on saved progress
        evidenceItems.forEach(item => {
            if (item.classList.contains('analyzed')) {
                const statusElement = item.querySelector('.evidence-status');
                statusElement.textContent = 'Analyzed';
                statusElement.classList.add('analyzed');
            }
        });

        suspectCards.forEach(card => {
            if (card.classList.contains('interviewed')) {
                const statusElement = card.querySelector('.suspect-status');
                statusElement.textContent = 'Interviewed';
                statusElement.classList.add('interviewed');
            }
        });

        updateCounts();
    }
}

// Utility Functions
function updateCounts() {
    clueCountElement.textContent = cluesFound;
    suspectCountElement.textContent = suspectsInterviewed;

    // Check if all clues and suspects have been processed
    if (cluesFound === 8 && suspectsInterviewed === 4) {
        showConclusion();
    }
}

function showConclusion() {
    const conclusionModal = document.getElementById('conclusion-modal') || createConclusionModal();
    const modalContent = conclusionModal.querySelector('.modal-content');

    modalContent.innerHTML = `
        <span class="close-modal">&times;</span>
        <h2>Case Solved</h2>
        <div class="conclusion-content">
            <div class="conclusion-summary">
                <h3>The Investigation</h3>
                <p>After analyzing all evidence and interviewing all suspects, you've uncovered the truth behind the heist.</p>
            </div>
            <div class="culprit-reveal">
                <h3>The Culprit</h3>
                <p>Isabella Chen, the Chief Curator, orchestrated the entire operation. She had been planning this for months, using her knowledge of security protocols and the painting's location.</p>
            </div>
            <div class="motive">
                <h3>The Motive</h3>
                <p>Isabella discovered that the painting had been restored multiple times, significantly decreasing its value. She planned to steal it, claim it was damaged beyond restoration, and collect the insurance payout to fund her own gallery.</p>
            </div>
            <div class="method">
                <h3>The Method</h3>
                <p>Isabella disabled security features during a supposed 'system upgrade' and provided inside information to an anonymous buyer. She then used her knowledge of the gallery to bypass security and steal the painting.</p>
            </div>
            <div class="resolution">
                <h3>The Resolution</h3>
                <p>With your thorough investigation, Isabella has been arrested and charged with grand theft. The painting has been recovered and will be returned to the gallery. The insurance company has been notified, and the gallery will receive compensation for the damage.</p>
            </div>
            <button id="restart-case">Start New Case</button>
        </div>
    `;

    conclusionModal.style.display = 'flex';

    // Close modal functionality
    const closeModalButton = conclusionModal.querySelector('.close-modal');
    closeModalButton.addEventListener('click', () => {
        conclusionModal.style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === conclusionModal) {
            conclusionModal.style.display = 'none';
        }
    });

    // Restart case functionality
    const restartButton = document.getElementById('restart-case');
    restartButton.addEventListener('click', () => {
        localStorage.removeItem('detectiveProgress');
        localStorage.removeItem('detectiveNotes');
        location.reload();
    });
}

function createConclusionModal() {
    const modal = document.createElement('div');
    modal.id = 'conclusion-modal';
    modal.className = 'modal';
    document.body.appendChild(modal);
    return modal;
}
