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
const progressFill = document.getElementById('investigation-progress');
const progressText = progressFill.querySelector('.progress-text');
const filterButtons = document.querySelectorAll('.filter-button');
const toggleNotesButton = document.getElementById('toggle-notes');
const mapViewButton = document.getElementById('map-view');

// State
let cluesFound = 0;
let suspectsInterviewed = 0;
let notes = [];
let currentEvidence = null;
let currentSuspect = null;
let currentFilter = 'all';
let notesVisible = true;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Set up event listeners
    setupTabNavigation();
    setupEvidenceItems();
    setupSuspectCards();
    setupNoteTaking();
    setupFilters();
    setupControls();
    loadNotesFromLocalStorage();
    updateCounts();
    updateProgress();

    // Add animations
    addAnimations();
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

            // Add animation
            const activePane = document.getElementById(tabId);
            if (activePane) {
                activePane.style.animation = 'fadeIn 0.5s ease';
            }
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
        <div class="modal-header">
            <h2>${evidenceDetails.title}</h2>
            <div class="evidence-category-tag">${evidenceDetails.category}</div>
        </div>
        <div class="evidence-detail">
            <div class="evidence-image">
                <img src="${evidenceDetails.image}" alt="${evidenceDetails.title}">
            </div>
            <div class="evidence-content">
                <div class="evidence-description">
                    <h3>Initial Description</h3>
                    <p>${evidenceDetails.description}</p>
                </div>
                <div class="evidence-analysis">
                    <h3>Analysis</h3>
                    <p>${evidenceDetails.analysis}</p>
                </div>
                <div class="evidence-implications">
                    <h3>Implications</h3>
                    <p>${evidenceDetails.implications}</p>
                </div>
                <div class="evidence-connections">
                    <h3>Connections</h3>
                    <ul>${evidenceDetails.connections.map(conn => `<li>${conn}</li>`).join('')}</ul>
                </div>
            </div>
        </div>
    `;

    // Show modal
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);

    // Update evidence status
    const statusElement = element.querySelector('.evidence-status');
    statusElement.textContent = 'Analyzed';
    statusElement.classList.add('analyzed');

    // Update clue count
    if (!element.classList.contains('analyzed')) {
        element.classList.add('analyzed');
        cluesFound++;
        updateCounts();
        updateProgress();
        saveProgress();
    }

    // Close modal functionality
    const closeModalButton = modal.querySelector('.close-modal');
    closeModalButton.addEventListener('click', () => {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    });

    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
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
            category: "FINGERPRINTS",
            image: "https://picsum.photos/seed/fingerprint-detail/600/400.jpg",
            description: "A partial print found on the skylight frame. The print is smudged but shows distinctive characteristics.",
            analysis: "The fingerprint belongs to James Riley, the security chief. This is significant as he claimed to be at home during the heist. The partial nature suggests the wearer was wearing gloves, but a small portion of the thumb was exposed, possibly from a tear in the glove material.",
            implications: "This suggests either Riley was involved in the heist or someone deliberately framed him. His access to security systems makes him a prime suspect. The partial print could indicate an inside job where someone with knowledge of security protocols was involved.",
            connections: [
                "Matches security chief James Riley",
                "Inconsistent with his alibi of being at home",
                "Suggests possible knowledge of security protocols",
                "May indicate an inside job"
            ]
        },
        2: {
            title: "Footprint Analysis",
            category: "TRACE EVIDENCE",
            image: "https://picsum.photos/seed/footprints-detail/600/400.jpg",
            description: "Unusual shoe prints in the garden below the skylight. The prints are distinctive and match a rare brand of climbing shoes.",
            analysis: "The prints belong to professional climbing equipment. These shoes are custom-made and very expensive, likely only available to a few individuals in the city. The tread pattern is unique, showing a specialized design for urban climbing with features that minimize sound and leave minimal traces.",
            implications: "The thief was highly prepared and had specialized equipment. This points to a professional art thief rather than an amateur job. The choice of specialized footwear suggests prior knowledge of the gallery's security layout and potential escape routes.",
            connections: [
                "Matches rare professional climbing shoes",
                "Indicates high level of preparation",
                "Suggests professional art thief",
                "Implies prior knowledge of gallery layout"
            ]
        },
        3: {
            title: "Security Footage Analysis",
            category: "DIGITAL EVIDENCE",
            image: "https://picsum.photos/seed/security-footage-detail/600/400.jpg",
            description: "Blurred footage from multiple cameras shows a figure entering through the skylight. The figure appears to be wearing dark clothing.",
            analysis: "Enhanced image processing reveals the figure is wearing a distinctive ring on their right hand. The footage also shows the person moving with purpose and familiarity with the gallery layout. The timestamp shows entry at 01:15 AM, during a routine security system check cycle.",
            implications: "The thief knew exactly where to go and what to take, suggesting inside knowledge. The ring might be a key identifier for the suspect. The timing during the security check cycle indicates precise knowledge of the gallery's security protocols.",
            connections: [
                "Distinctive ring visible on right hand",
                "Familiarity with gallery layout",
                "Entry during security system check cycle",
                "Suggests inside knowledge of protocols"
            ]
        },
        4: {
            title: "Paint Residue Analysis",
            category: "TRACE EVIDENCE",
            image: "https://picsum.photos/seed/paint-residue-detail/600/400.jpg",
            description: "Blue paint chips found near the empty painting frame. The chips match the color of the painting's protective coating.",
            analysis: "The paint residue contains traces of a chemical compound used in high-end art restoration. This suggests the thief may have some expertise in art handling. The residue also contains microscopic particles that match the specific type of varnish used on the painting.",
            implications: "The thief likely had knowledge of art preservation and handling, possibly indicating a connection to the art world. The presence of restoration chemicals suggests either professional art knowledge or deliberate contamination to mislead investigators.",
            connections: [
                "Matches painting's protective coating",
                "Contains art restoration chemicals",
                "Suggests art handling expertise",
                "May indicate connection to art world"
            ]
        },
        5: {
            title: "Jewel Fragment Analysis",
            category: "TRACE EVIDENCE",
            image: "https://picsum.photos/seed/jewel-fragment-detail/600/400.jpg",
            description: "A small diamond fragment from the painting's ornate frame. The frame was specifically designed to include these decorative elements.",
            analysis: "The diamond is of exceptional quality and likely came from the frame's decorative elements. It's not a random piece but part of the original frame design. The cut and clarity suggest it was intentionally removed, possibly as a trophy or to sell separately.",
            implications: "The thief deliberately removed this fragment, possibly as a trophy or to sell separately. This suggests a motive beyond simple theft. The selective nature of the theft points to someone with specific knowledge of the painting's value and components.",
            connections: [
                "From the painting's original frame",
                "Exceptional quality diamond",
                "Intentionally removed, not accidental",
                "Suggests specific knowledge of painting's value"
            ]
        },
        6: {
            title: "Gallery Records Analysis",
            category: "DIGITAL EVIDENCE",
            image: "https://picsum.photos/seed/gallery-records-detail/600/400.jpg",
            description: "Visitor logs from the day before the heist show several suspicious entries. One person spent an unusually long time in the gallery after closing.",
            analysis: "The records show that Sophia Laurent, the art appraiser, stayed in the gallery for over two hours after closing time. She claimed to be doing a 'last-minute assessment' of the painting. Security logs confirm she was the last person to access the painting before the theft.",
            implications: "This contradicts her alibi of being with a client during the heist. She may have been casing the gallery or creating an opportunity for the theft. Her access to the painting and knowledge of its security make her a strong suspect.",
            connections: [
                "Sophia Laurent stayed 2+ hours after closing",
                "Last person to access painting before theft",
                "Contradicts her alibi during heist",
                "Had access to painting and security information"
            ]
        },
        7: {
            title: "Insurance Policy Analysis",
            category: "DIGITAL EVIDENCE",
            image: "https://picsum.photos/seed/insurance-policy-detail/600/400.jpg",
            description: "Details about the painting's insurance coverage reveal some interesting clauses and recent changes.",
            analysis: "The insurance policy was recently updated to increase coverage by 50%. Additionally, there's a clause that pays out immediately if the painting is 'irreparably damaged' rather than stolen. The policy was updated by Marcus Sterling, the gallery owner, just three weeks before the theft.",
            implications: "This creates a potential motive for someone to benefit from the painting's disappearance, possibly through an insurance scam. The timing of the policy update and the specific clause suggest premeditation.",
            connections: [
                "Policy updated by Marcus Sterling",
                "Coverage increased by 50% recently",
                "Immediate payout for 'irreparable damage'",
                "Updated just three weeks before theft"
            ]
        },
        8: {
            title: "Anonymous Tip Analysis",
            category: "DIGITAL EVIDENCE",
            image: "https://picsum.photos/seed/anonymous-tip-detail/600/400.jpg",
            description: "A cryptic note received anonymously the day after the heist mentions 'the inside job' and references a specific detail only an insider would know.",
            analysis: "The note references the painting's hidden security features that weren't publicly known. This suggests the sender has inside knowledge of both the gallery and the painting. The note was delivered to the detective's office in an unmarked envelope with no return address.",
            implications: "The tipster may be trying to guide the investigation or divert attention from their own involvement. The 'inside job' reference suggests a conspiracy. The specific detail about security features indicates the sender has direct knowledge of the gallery's operations.",
            connections: [
                "References hidden security features",
                "Suggests inside knowledge",
                "Mentions 'inside job' conspiracy",
                "Delivered directly to detective's office"
            ]
        }
    };

    return evidenceData[clueId] || {
        title: "Unknown Evidence",
        category: "UNKNOWN",
        image: "https://picsum.photos/seed/unknown-evidence/600/400.jpg",
        description: "No information available.",
        analysis: "Analysis pending.",
        implications: "Implications unknown.",
        connections: ["No connections identified"]
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
        <div class="modal-header">
            <h2>${suspectDetails.name}</h2>
            <div class="suspect-role-tag">${suspectDetails.role}</div>
        </div>
        <div class="suspect-detail">
            <div class="suspect-profile">
                <div class="suspect-photo">
                    <img src="${suspectDetails.image}" alt="${suspectDetails.name}">
                </div>
                <div class="suspect-basics">
                    <div class="suspect-info-item">
                        <span class="info-label">Age:</span>
                        <span class="info-value">${suspectDetails.age}</span>
                    </div>
                    <div class="suspect-info-item">
                        <span class="info-label">Background:</span>
                        <span class="info-value">${suspectDetails.background}</span>
                    </div>
                    <div class="suspect-info-item">
                        <span class="info-label">Motive:</span>
                        <span class="info-value">${suspectDetails.motive}</span>
                    </div>
                </div>
            </div>
            <div class="suspect-interview">
                <h3>Interview Transcript</h3>
                <div class="interview-content">
                    <div class="question">
                        <span class="q-label">Q:</span>
                        <span class="q-text">${suspectDetails.question}</span>
                    </div>
                    <div class="answer">
                        <span class="a-label">A:</span>
                        <span class="a-text">${suspectDetails.answer}</span>
                    </div>
                </div>
            </div>
            <div class="suspect-revelation">
                <h3>New Information</h3>
                <p>${suspectDetails.revelation}</p>
            </div>
            <div class="suspect-evidence">
                <h3>Connecting Evidence</h3>
                <ul>${suspectDetails.evidence.map(ev => `<li>${ev}</li>`).join('')}</ul>
            </div>
        </div>
    `;

    // Show modal
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);

    // Update suspect status
    const statusElement = element.querySelector('.suspect-status');
    statusElement.textContent = 'Interviewed';
    statusElement.classList.add('interviewed');

    // Update suspect count
    if (!element.classList.contains('interviewed')) {
        element.classList.add('interviewed');
        suspectsInterviewed++;
        updateCounts();
        updateProgress();
        saveProgress();
    }

    // Close modal functionality
    const closeModalButton = modal.querySelector('.close-modal');
    closeModalButton.addEventListener('click', () => {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    });

    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
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
            role: "GALLERY OWNER",
            age: "52",
            image: "https://picsum.photos/seed/suspect1/400/400.jpg",
            background: "Art collector and businessman who founded the Sterling Gallery 15 years ago. Known for his passion for impressionist art and shrewd business deals.",
            motive: "Financial difficulties and recent expansion of the gallery have created significant debt pressure. The painting's insurance policy was recently increased with a special clause for 'irreparable damage'.",
            question: "Where were you during the night of the theft?",
            answer: "I was at a charity event downtown, the 'Art for Tomorrow' gala. I left around 11:30 PM and went straight home. My wife can confirm I arrived home around midnight.",
            revelation: "Further investigation reveals that Sterling updated the insurance policy just three weeks before the theft, increasing coverage by 50% and adding a clause for immediate payout in case of 'irreparable damage' rather than theft.",
            evidence: [
                "Updated insurance policy with unusual条款",
                "Financial records showing significant debt",
                "Security footage leaving charity event early",
                "Knowledge of gallery security systems"
            ]
        },
        2: {
            name: "Isabella Chen",
            role: "CHIEF CURATOR",
            age: "41",
            image: "https://picsum.photos/seed/suspect2/400/400.jpg",
            background: "Renowned art historian with expertise in impressionist paintings. Previously worked at the Metropolitan Museum of Art before joining the Sterling Gallery 8 years ago.",
            motive: "Professional rivalry and desire to establish her own gallery. She has been secretly planning to open her own space and needed capital.",
            question: "What can you tell us about the security measures for the painting?",
            answer: "The painting had standard security - motion sensors, pressure plates, and infrared beams. We also had 24/7 security patrols. Nothing out of the ordinary. I was working late that night, cataloging new acquisitions.",
            revelation: "Gallery records show Chen stayed in the gallery for over 2 hours after closing time on the day before the theft. She was the last person to access the painting before it was stolen.",
            evidence: [
                "Stayed late on the day before theft",
                "Last person to access the painting",
                "Recent research on specialized art theft techniques",
                "Unexplained transfers to offshore accounts"
            ]
        },
        3: {
            name: "James Riley",
            role: "SECURITY CHIEF",
            age: "38",
            image: "https://picsum.photos/seed/suspect3/400/400.jpg",
            background: "Former police officer with specialized training in art protection. Hired by Sterling 5 years ago to design the gallery's security system.",
            motive: "Blackmail opportunity and financial incentive. Discovered evidence of Sterling's financial irregularities and was being paid to keep quiet.",
            question: "How did the thief bypass the security system?",
            answer: "It's puzzling. The system showed no alerts during the night. The thief must have known the exact timing when the security system was undergoing its daily check cycle. I was at home with my family, as my wife can attest.",
            revelation: "A partial fingerprint matching Riley was found on the skylight frame. The print shows characteristics of someone wearing gloves with a tear in the thumb area.",
            evidence: [
                "Partial fingerprint found at scene",
                "Knowledge of security system cycles",
                "Unexplained large deposits into personal accounts",
                "Access to all security protocols and codes"
            ]
        },
        4: {
            name: "Sophia Laurent",
            role: "ART APPRAISER",
            age: "45",
            image: "https://picsum.photos/seed/suspect4/400/400.jpg",
            background: "Internationally recognized art appraiser with connections to high-end collectors. Known for her expertise in impressionist and post-impressionist art.",
            motive: "Personal collection and professional reputation. She has been secretly acquiring pieces for her private collection and needed this specific painting to complete a series.",
            question: "Have you had any contact with potential buyers for the painting?",
            answer: "As chief appraiser, I do occasionally discuss pieces with serious collectors, but always through proper channels. I was dining with a client that evening, discussing another piece entirely. I can provide their contact information.",
            revelation: "Anonymous tip received specifically mentions Laurent's unusual interest in the painting and her knowledge of its hidden security features not publicly disclosed.",
            evidence: [
                "Anonymous tip mentioning specific knowledge",
                "Recent searches for specialized art handling",
                "Private collection missing similar pieces",
                "Client alibi cannot be verified"
            ]
        }
    };

    return suspectData[suspectId] || {
        name: "Unknown Suspect",
        role: "UNKNOWN",
        age: "??",
        image: "https://picsum.photos/seed/unknown-suspect/400/400.jpg",
        background: "No information available.",
        motive: "Unknown motive.",
        question: "No questions available.",
        answer: "No response available.",
        revelation: "No revelations available.",
        evidence: ["No evidence identified"]
    };
}

// Note Taking
function setupNoteTaking() {
    if (addNoteButton && noteInput) {
        addNoteButton.addEventListener('click', () => {
            const noteText = noteInput.value.trim();
            if (noteText) {
                addNote(noteText);
                noteInput.value = '';
            }
        });
    }
}

function addNote(text) {
    const note = {
        id: Date.now(),
        text: text,
        date: new Date().toLocaleString(),
        timestamp: Date.now()
    };

    notes.unshift(note);
    saveNotesToLocalStorage();
    renderNotes();
}

function renderNotes() {
    if (!notesList) return;

    notesList.innerHTML = '';

    notes.forEach(note => {
        const noteElement = document.createElement('div');
        noteElement.className = 'note-item';
        noteElement.innerHTML = `
            <div class="note-header">
                <div class="note-title">Note #${note.id}</div>
                <div class="note-date">${note.date}</div>
            </div>
            <div class="note-content">${note.text}</div>
            <div class="note-actions">
                <button class="note-action delete" data-id="${note.id}">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        `;

        notesList.appendChild(noteElement);

        // Add delete functionality
        const deleteButton = noteElement.querySelector('.delete');
        deleteButton.addEventListener('click', () => {
            deleteNote(note.id);
        });
    });
}

function deleteNote(id) {
    notes = notes.filter(note => note.id !== id);
    saveNotesToLocalStorage();
    renderNotes();
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
}

// Filters
function setupFilters() {
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');

            // Update active filter button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Apply filter
            currentFilter = filter;
            filterEvidence();
        });
    });
}

function filterEvidence() {
    evidenceItems.forEach(item => {
        if (currentFilter === 'all' || item.getAttribute('data-category') === currentFilter) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// Controls
function setupControls() {
    if (toggleNotesButton) {
        toggleNotesButton.addEventListener('click', () => {
            notesVisible = !notesVisible;
            const notesTab = document.getElementById('notes');
            if (notesTab) {
                if (notesVisible) {
                    notesTab.style.display = 'block';
                    toggleNotesButton.innerHTML = '<i class="fas fa-sticky-note"></i> Hide Notes';
                } else {
                    notesTab.style.display = 'none';
                    toggleNotesButton.innerHTML = '<i class="fas fa-sticky-note"></i> Show Notes';
                }
            }
        });
    }

    if (mapViewButton) {
        mapViewButton.addEventListener('click', () => {
            showMapView();
        });
    }
}

function showMapView() {
    // Create map modal
    const mapModal = document.getElementById('map-modal') || createMapModal();
    const mapContent = mapModal.querySelector('.map-content');

    mapContent.innerHTML = `
        <span class="close-modal">&times;</span>
        <div class="map-header">
            <h2>Crime Scene Map</h2>
        </div>
        <div class="map-container">
            <img src="https://picsum.photos/seed/crime-map/800/600.jpg" alt="Crime Scene Map" class="map-image">
            <div class="map-markers">
                <div class="map-marker" style="top: 30%; left: 45%;" title="Gallery Entrance">
                    <i class="fas fa-map-marker-alt"></i>
                </div>
                <div class="map-marker" style="top: 25%; left: 50%;" title="Skylight">
                    <i class="fas fa-map-marker-alt"></i>
                </div>
                <div class="map-marker" style="top: 40%; left: 60%;" title="Security Room">
                    <i class="fas fa-map-marker-alt"></i>
                </div>
                <div class="map-marker" style="top: 55%; left: 35%;" title="Garden">
                    <i class="fas fa-map-marker-alt"></i>
                </div>
            </div>
        </div>
        <div class="map-legend">
            <h3>Legend</h3>
            <div class="legend-item">
                <div class="legend-marker"></div>
                <div class="legend-text">Crime Scene Location</div>
            </div>
            <div class="legend-item">
                <div class="legend-path"></div>
                <div class="legend-text">Suspected Path</div>
            </div>
        </div>
    `;

    mapModal.style.display = 'flex';
    setTimeout(() => {
        mapModal.classList.add('show');
    }, 10);

    // Close modal functionality
    const closeModalButton = mapModal.querySelector('.close-modal');
    closeModalButton.addEventListener('click', () => {
        mapModal.classList.remove('show');
        setTimeout(() => {
            mapModal.style.display = 'none';
        }, 300);
    });

    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === mapModal) {
            mapModal.classList.remove('show');
            setTimeout(() => {
                mapModal.style.display = 'none';
            }, 300);
        }
    });
}

function createMapModal() {
    const modal = document.createElement('div');
    modal.id = 'map-modal';
    modal.className = 'modal';
    document.body.appendChild(modal);
    return modal;
}

// Update Functions
function updateCounts() {
    if (clueCountElement) clueCountElement.textContent = cluesFound;
    if (suspectCountElement) suspectCountElement.textContent = suspectsInterviewed;
}

function updateProgress() {
    const totalItems = 12; // 8 clues + 4 suspects
    const foundItems = cluesFound + suspectsInterviewed;
    const percentage = Math.round((foundItems / totalItems) * 100);

    if (progressFill) {
        progressFill.style.width = `${percentage}%`;
    }

    if (progressText) {
        progressText.textContent = `${percentage}%`;
    }
}

function saveProgress() {
    const progress = {
        cluesFound: cluesFound,
        suspectsInterviewed: suspectsInterviewed
    };
    localStorage.setItem('detectiveProgress', JSON.stringify(progress));
}

function loadProgress() {
    const savedProgress = localStorage.getItem('detectiveProgress');
    if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        cluesFound = progress.cluesFound || 0;
        suspectsInterviewed = progress.suspectsInterviewed || 0;
        updateCounts();
        updateProgress();
    }
}

// Animations
function addAnimations() {
    // Add fade-in animation to elements when they come into view
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all tab panes
    tabPanes.forEach(pane => {
        pane.style.opacity = '0';
        pane.style.transform = 'translateY(20px)';
        pane.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(pane);
    });

    // Add typing animation to case title
    const caseTitle = document.querySelector('.case-title h2');
    if (caseTitle) {
        const text = caseTitle.textContent;
        caseTitle.textContent = '';
        caseTitle.style.overflow = 'hidden';
        caseTitle.style.whiteSpace = 'nowrap';
        caseTitle.style.animation = 'typing 3s steps(40, end)';

        setTimeout(() => {
            caseTitle.textContent = text;
            caseTitle.style.animation = '';
            caseTitle.style.overflow = 'visible';
            caseTitle.style.whiteSpace = 'normal';
        }, 3000);
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }

    @keyframes typing {
        from { width: 0; }
        to { width: 100%; }
    }

    .modal {
        transition: opacity 0.3s ease;
    }

    .modal.show {
        opacity: 1;
    }

    .modal:not(.show) {
        opacity: 0;
    }

    .evidence-item {
        transition: all 0.3s ease;
    }

    .evidence-item:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
    }

    .suspect-card {
        transition: all 0.3s ease;
    }

    .suspect-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
    }

    .note-item {
        animation: fadeIn 0.5s ease;
    }

    .map-marker {
        position: absolute;
        transform: translate(-50%, -50%);
        color: var(--accent-primary);
        font-size: 1.5rem;
        animation: pulse 2s infinite;
    }

    .legend-marker {
        width: 12px;
        height: 12px;
        background-color: var(--accent-primary);
        border-radius: 50%;
    }

    .legend-path {
        width: 30px;
        height: 3px;
        background-color: var(--accent-secondary);
    }
`;
document.head.appendChild(style);
