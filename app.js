// CollabBoard - Professional Board Meeting Platform with Comprehensive Agenda Customizations
class CollabBoard {
    constructor() {
        this.currentBoard = null;
        this.currentUser = null;
        this.boardId = null;
        this.updateInterval = null;
        this.currentSlide = 0;
        this.slides = [];
        this.analytics = null;
        this.charts = {};
        this.meetingStartTime = null;
        this.selectedItemType = null;
        
        // Complete item types configuration
        this.itemTypes = {
            voting: {
                simple_approval: { 
                    name: "Simple Approval", 
                    description: "Basic yes/no/abstain vote", 
                    options: ["Approve", "Reject", "Abstain"],
                    threshold: "simple_majority",
                    estimatedTime: 10,
                    requiresVoting: true
                },
                weighted_voting: { 
                    name: "Weighted Voting", 
                    description: "Votes weighted by authority", 
                    options: ["Approve", "Reject", "Abstain"],
                    weighted: true,
                    estimatedTime: 15,
                    requiresVoting: true
                },
                supermajority: { 
                    name: "Supermajority", 
                    description: "Requires 66.7% or higher", 
                    options: ["Approve", "Reject", "Abstain"],
                    threshold: 67,
                    estimatedTime: 12,
                    requiresVoting: true
                },
                conditional: { 
                    name: "Conditional Vote", 
                    description: "Vote with conditions", 
                    options: ["Approve", "Approve with conditions", "Reject", "Abstain"],
                    estimatedTime: 18,
                    requiresVoting: true
                },
                time_limited: { 
                    name: "Time-Limited Vote", 
                    description: "Vote with deadline", 
                    options: ["Yes", "No", "Abstain"],
                    hasDeadline: true,
                    estimatedTime: 10,
                    requiresVoting: true
                },
                anonymous: { 
                    name: "Anonymous Vote", 
                    description: "Secret ballot", 
                    options: ["Approve", "Reject", "Abstain"],
                    anonymous: true,
                    estimatedTime: 10,
                    requiresVoting: true
                },
                proxy: { 
                    name: "Proxy Vote", 
                    description: "Allow proxy voting", 
                    options: ["Yes", "No", "Abstain"],
                    allowProxy: true,
                    estimatedTime: 15,
                    requiresVoting: true
                },
                straw_poll: { 
                    name: "Straw Poll", 
                    description: "Non-binding opinion", 
                    options: ["Support", "Oppose", "Neutral"],
                    nonBinding: true,
                    estimatedTime: 5,
                    requiresVoting: true
                },
                priority: { 
                    name: "Priority Ranking", 
                    description: "Rank by priority", 
                    ranking: true,
                    estimatedTime: 20,
                    requiresVoting: true
                },
                consensus: { 
                    name: "Consensus Building", 
                    description: "Seek agreement", 
                    options: ["Consent", "Object", "Stand Aside"],
                    estimatedTime: 30,
                    requiresVoting: true
                },
                unanimous: { 
                    name: "Unanimous", 
                    description: "All must agree", 
                    options: ["Agree", "Object"],
                    threshold: 100,
                    estimatedTime: 25,
                    requiresVoting: true
                },
                roll_call: { 
                    name: "Roll Call Vote", 
                    description: "Recorded individual votes", 
                    options: ["Aye", "Nay", "Present"],
                    recordIndividual: true,
                    estimatedTime: 15,
                    requiresVoting: true
                }
            },
            no_voting: {
                information_only: { 
                    name: "Information Only", 
                    description: "Share information without voting", 
                    requiresVoting: false,
                    hasPresenter: true,
                    estimatedTime: 10
                },
                discussion_only: { 
                    name: "Discussion Only", 
                    description: "Open discussion without formal vote", 
                    requiresVoting: false,
                    hasPresenter: true,
                    estimatedTime: 20
                },
                presentation_only: { 
                    name: "Presentation Only", 
                    description: "Presentation without voting decision", 
                    requiresVoting: false,
                    hasPresenter: true,
                    estimatedTime: 30
                },
                update_only: { 
                    name: "Status Update", 
                    description: "Progress update, no decision needed", 
                    requiresVoting: false,
                    hasPresenter: false,
                    estimatedTime: 15
                },
                training_only: { 
                    name: "Training Session", 
                    description: "Educational content presentation", 
                    requiresVoting: false,
                    hasPresenter: true,
                    estimatedTime: 45
                },
                committee_report: { 
                    name: "Committee Report", 
                    description: "Committee findings report", 
                    requiresVoting: false,
                    hasPresenter: true,
                    estimatedTime: 20
                },
                financial_review: { 
                    name: "Financial Review", 
                    description: "Financial performance review", 
                    requiresVoting: false,
                    hasPresenter: true,
                    estimatedTime: 25
                },
                strategic_update: { 
                    name: "Strategic Update", 
                    description: "Strategy progress update", 
                    requiresVoting: false,
                    hasPresenter: true,
                    estimatedTime: 30
                }
            }
        };
        
        console.log('CollabBoard Pro with Comprehensive Agenda initialized');
        
        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }
    
    init() {
        console.log('Initializing CollabBoard...');
        
        try {
            this.setupEventListeners();
            this.setupItemTypeSelection();
            this.setupColorVisionToggle();
            this.checkUrlForBoard();
            this.initAnalytics();
            
            // Auto-sync every 3 seconds
            this.updateInterval = setInterval(() => {
                if (this.boardId && this.currentUser) {
                    this.syncBoard();
                }
            }, 3000);
            
            console.log('CollabBoard initialized successfully');
        } catch (error) {
            console.error('Error initializing CollabBoard:', error);
        }
    }
    
    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        try {
            // Create board - with error handling
            const createBtn = document.getElementById('create-board-btn');
            if (createBtn) {
                createBtn.addEventListener('click', (e) => {
                    console.log('Create board button clicked');
                    e.preventDefault();
                    this.createBoard();
                });
                console.log('Create board button listener attached');
            } else {
                console.error('Create board button not found');
            }
            
            // Join board
            const joinBtn = document.getElementById('join-board-btn');
            if (joinBtn) {
                joinBtn.addEventListener('click', (e) => {
                    console.log('Join board button clicked');
                    e.preventDefault();
                    this.joinBoard();
                });
            }
            
            // Board actions
            this.setupBoardActionListeners();
            
            // Add agenda item
            const addItemBtn = document.getElementById('add-item-btn');
            if (addItemBtn) {
                addItemBtn.addEventListener('click', (e) => {
                    console.log('Add item button clicked');
                    e.preventDefault();
                    this.addAgendaItem();
                });
            }
            
            // Analytics and deck navigation
            this.setupNavigationListeners();
            
            // Share functionality
            this.setupShareListeners();
            
            // Modal and UI handlers
            this.setupUIListeners();
            
            // Enter key handlers
            this.setupEnterKeyHandlers();
            
            console.log('Event listeners setup complete');
        } catch (error) {
            console.error('Error setting up event listeners:', error);
        }
    }
    
    setupBoardActionListeners() {
        const shareBtn = document.getElementById('share-btn');
        const deckBtn = document.getElementById('view-deck-btn');
        const analyticsBtn = document.getElementById('view-analytics-btn');
        
        if (shareBtn) shareBtn.addEventListener('click', () => this.showShareModal());
        if (deckBtn) deckBtn.addEventListener('click', () => this.showDeck());
        if (analyticsBtn) analyticsBtn.addEventListener('click', () => this.showAnalytics());
    }
    
    setupNavigationListeners() {
        // Analytics navigation
        const backToBoardBtn = document.getElementById('back-to-board-btn');
        const exportAnalyticsBtn = document.getElementById('export-analytics-btn');
        const exportAnalyticsJsonBtn = document.getElementById('export-analytics-json-btn');
        
        if (backToBoardBtn) backToBoardBtn.addEventListener('click', () => this.showBoardPage());
        if (exportAnalyticsBtn) exportAnalyticsBtn.addEventListener('click', () => this.exportAnalytics());
        if (exportAnalyticsJsonBtn) exportAnalyticsJsonBtn.addEventListener('click', () => this.exportAnalyticsJSON());
        
        // Deck navigation
        const backFromDeckBtn = document.getElementById('back-to-board-from-deck-btn');
        const prevSlideBtn = document.getElementById('prev-slide');
        const nextSlideBtn = document.getElementById('next-slide');
        const exportDeckBtn = document.getElementById('export-deck-btn');
        
        if (backFromDeckBtn) backFromDeckBtn.addEventListener('click', () => this.showBoardPage());
        if (prevSlideBtn) prevSlideBtn.addEventListener('click', () => this.prevSlide());
        if (nextSlideBtn) nextSlideBtn.addEventListener('click', () => this.nextSlide());
        if (exportDeckBtn) exportDeckBtn.addEventListener('click', () => this.exportDeck());
    }
    
    setupShareListeners() {
        const copyLinkBtn = document.getElementById('copy-link-btn');
        const shareEmailBtn = document.getElementById('share-email');
        const shareTeamsBtn = document.getElementById('share-teams');
        const shareSlackBtn = document.getElementById('share-slack');
        
        if (copyLinkBtn) copyLinkBtn.addEventListener('click', () => this.copyLink());
        if (shareEmailBtn) shareEmailBtn.addEventListener('click', () => this.shareViaEmail());
        if (shareTeamsBtn) shareTeamsBtn.addEventListener('click', () => this.shareViaTeams());
        if (shareSlackBtn) shareSlackBtn.addEventListener('click', () => this.shareViaSlack());
    }
    
    setupUIListeners() {
        // Modal close handlers
        document.querySelectorAll('.modal-close, .modal-backdrop').forEach(el => {
            el.addEventListener('click', (e) => {
                if (e.target.classList.contains('modal-close') || e.target.classList.contains('modal-backdrop')) {
                    this.closeModal();
                }
            });
        });
        
        // Success banner close
        const closeSuccessBtn = document.getElementById('close-success');
        if (closeSuccessBtn) {
            closeSuccessBtn.addEventListener('click', () => {
                document.getElementById('success-message').classList.add('hidden');
            });
        }
        
        // Color-blind toggle button (if present)
        const cbToggle = document.getElementById('toggle-cb-btn');
        if (cbToggle) {
            cbToggle.addEventListener('click', (e) => {
                const pressed = cbToggle.getAttribute('aria-pressed') === 'true';
                this.toggleColorBlindMode(!pressed);
            });
        }
    }

    /* Color-vision / color-blind mode helpers */
    setupColorVisionToggle() {
        // Apply stored preference (if any)
        const pref = localStorage.getItem('collab_color_vision');
        const enabled = pref === 'color-blind';
        this.applyColorVisionPreference(enabled);
    }

    applyColorVisionPreference(enabled) {
        const root = document.documentElement;
        const cbToggle = document.getElementById('toggle-cb-btn');
        if (enabled) {
            root.classList.add('cb-mode');
            root.setAttribute('data-color-vision', 'color-blind');
            localStorage.setItem('collab_color_vision', 'color-blind');
            if (cbToggle) {
                cbToggle.setAttribute('aria-pressed', 'true');
                cbToggle.textContent = 'CB: On';
            }
        } else {
            root.classList.remove('cb-mode');
            root.removeAttribute('data-color-vision');
            localStorage.removeItem('collab_color_vision');
            if (cbToggle) {
                cbToggle.setAttribute('aria-pressed', 'false');
                cbToggle.textContent = 'CB Mode';
            }
        }
    }

    toggleColorBlindMode(enable) {
        this.applyColorVisionPreference(!!enable);
    }
    
    setupItemTypeSelection() {
        // Add event listeners for item type cards
        document.addEventListener('click', (e) => {
            if (e.target.closest('.item-type-card')) {
                const card = e.target.closest('.item-type-card');
                const itemType = card.dataset.type;
                this.selectItemType(itemType);
            }
        });
    }
    
    setupEnterKeyHandlers() {
        const creatorNameInput = document.getElementById('creator-name');
        const meetingTitleInput = document.getElementById('meeting-title');
        const participantNameInput = document.getElementById('participant-name');
        const itemTitleInput = document.getElementById('item-title');
        
        if (creatorNameInput) {
            creatorNameInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.createBoard();
                }
            });
        }
        
        if (meetingTitleInput) {
            meetingTitleInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.createBoard();
                }
            });
        }
        
        if (participantNameInput) {
            participantNameInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.joinBoard();
                }
            });
        }
        
        if (itemTitleInput) {
            itemTitleInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.addAgendaItem();
                }
            });
        }
    }
    
    selectItemType(itemTypeKey) {
        console.log('Selecting item type:', itemTypeKey);
        
        // Remove previous selection
        document.querySelectorAll('.item-type-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Select new card
        const selectedCard = document.querySelector(`[data-type="${itemTypeKey}"]`);
        if (selectedCard) {
            selectedCard.classList.add('selected');
        }
        
        // Find the item type in our configuration
        let itemTypeConfig = null;
        let category = null;
        
        if (this.itemTypes.voting[itemTypeKey]) {
            itemTypeConfig = this.itemTypes.voting[itemTypeKey];
            category = 'voting';
        } else if (this.itemTypes.no_voting[itemTypeKey]) {
            itemTypeConfig = this.itemTypes.no_voting[itemTypeKey];
            category = 'no-voting';
        }
        
        if (!itemTypeConfig) {
            console.error('Item type not found:', itemTypeKey);
            return;
        }
        
        this.selectedItemType = {
            key: itemTypeKey,
            config: itemTypeConfig,
            category: category
        };
        
        // Update selected type display
        this.updateSelectedTypeDisplay();
        
        // Show/hide conditional fields
        this.updateConditionalFields();
        
        // Pre-fill estimated time
        const estimatedTimeInput = document.getElementById('estimated-time');
        if (estimatedTimeInput) {
            estimatedTimeInput.value = itemTypeConfig.estimatedTime;
        }
    }
    
    updateSelectedTypeDisplay() {
        const display = document.getElementById('selected-type-display');
        const nameElement = document.getElementById('selected-type-name');
        const categoryElement = document.getElementById('selected-type-category');
        const descriptionElement = document.getElementById('selected-type-description');
        
        if (this.selectedItemType && display && nameElement && categoryElement && descriptionElement) {
            display.classList.remove('hidden');
            nameElement.textContent = this.selectedItemType.config.name;
            categoryElement.textContent = this.selectedItemType.category === 'voting' ? 'Voting Required' : 'No Voting Required';
            categoryElement.className = `status ${this.selectedItemType.category}`;
            descriptionElement.textContent = this.selectedItemType.config.description;
        } else if (display) {
            display.classList.add('hidden');
        }
    }
    
    updateConditionalFields() {
        const presenterField = document.getElementById('presenter-field');
        const thresholdField = document.getElementById('voting-threshold-field');
        const anonymousField = document.getElementById('anonymous-option');
        
        // Hide all conditional fields first
        if (presenterField) presenterField.classList.add('hidden');
        if (thresholdField) thresholdField.classList.add('hidden');
        if (anonymousField) anonymousField.classList.add('hidden');
        
        if (!this.selectedItemType) return;
        
        const config = this.selectedItemType.config;
        
        // Show presenter field for items that have presenters
        if (config.hasPresenter && presenterField) {
            presenterField.classList.remove('hidden');
        }
        
        // Show voting threshold for voting items
        if (config.requiresVoting) {
            if (thresholdField) thresholdField.classList.remove('hidden');
            if (anonymousField) anonymousField.classList.remove('hidden');
        }
    }
    
    checkUrlForBoard() {
        const urlParams = new URLSearchParams(window.location.search);
        const boardId = urlParams.get('board');
        
        console.log('Checking URL for board:', boardId);
        
        if (boardId) {
            this.boardId = boardId;
            
            // First try to load from URL hash (for shared links)
            const boardData = this.loadBoardFromUrl() || this.loadBoard(boardId);
            
            if (boardData) {
                console.log('Board found, showing join page');
                this.showJoinPage(boardData);
            } else {
                console.log('Board not found');
                this.showError('Board not found. Please check the link.');
                this.showCreatePage();
            }
        } else {
            this.showCreatePage();
        }
    }
    
    showCreatePage() {
        console.log('Showing create page');
        this.hideAllPages();
        const createPage = document.getElementById('create-page');
        if (createPage) {
            createPage.classList.remove('hidden');
        }
        window.history.pushState({}, '', window.location.pathname);
    }
    
    showJoinPage(boardData) {
        console.log('Showing join page for board:', boardData.title);
        this.hideAllPages();
        const joinPage = document.getElementById('join-page');
        if (joinPage) {
            joinPage.classList.remove('hidden');
        }
        
        const titleDisplay = document.getElementById('meeting-title-display');
        if (titleDisplay) {
            titleDisplay.textContent = boardData.title;
        }
        
        setTimeout(() => {
            const participantInput = document.getElementById('participant-name');
            if (participantInput) {
                participantInput.focus();
            }
        }, 100);
    }
    
    showBoardPage() {
        console.log('Showing board page');
        this.hideAllPages();
        const boardPage = document.getElementById('board-page');
        if (boardPage) {
            boardPage.classList.remove('hidden');
        }
        
        const isAdmin = this.currentUser.name === this.currentBoard.creator;
        console.log('User is admin:', isAdmin, 'User:', this.currentUser.name, 'Creator:', this.currentBoard.creator);
        
        if (isAdmin) {
            document.body.classList.add('is-admin');
        } else {
            document.body.classList.remove('is-admin');
        }
        
        this.updateBoardDisplay();
        this.updateQuickStats();
    }
    
    showAnalytics() {
        console.log('Showing analytics dashboard');
        this.hideAllPages();
        const analyticsPage = document.getElementById('analytics-page');
        if (analyticsPage) {
            analyticsPage.classList.remove('hidden');
        }
        
        const analyticsTitle = document.getElementById('analytics-title');
        if (analyticsTitle) {
            analyticsTitle.textContent = `${this.currentBoard.title} - Analytics`;
        }
        
        this.renderAnalyticsDashboard();
    }
    
    showDeck() {
        console.log('Generating and showing comprehensive deck');
        this.generateComprehensiveSlides();
        this.currentSlide = 0;
        
        this.hideAllPages();
        const deckPage = document.getElementById('deck-page');
        if (deckPage) {
            deckPage.classList.remove('hidden');
        }
        
        const deckTitle = document.getElementById('deck-title');
        const deckInfo = document.getElementById('deck-info');
        
        if (deckTitle) deckTitle.textContent = this.currentBoard.title;
        if (deckInfo) deckInfo.textContent = `Professional Presentation • ${this.slides.length} slides`;
        
        this.updateSlideDisplay();
        this.generateSlideThumbnails();
    }
    
    hideAllPages() {
        document.querySelectorAll('.page').forEach(page => {
            page.classList.add('hidden');
        });
    }
    
    generateBoardId() {
        return 'board_' + Math.random().toString(36).substr(2, 9);
    }
    
    createBoard() {
        console.log('Creating board...');
        
        try {
            const creatorNameInput = document.getElementById('creator-name');
            const meetingTitleInput = document.getElementById('meeting-title');
            
            if (!creatorNameInput || !meetingTitleInput) {
                console.error('Required input fields not found');
                this.showError('Required input fields not found');
                return;
            }
            
            const creatorName = creatorNameInput.value.trim();
            const meetingTitle = meetingTitleInput.value.trim();
            
            console.log('Creating board with:', { creatorName, meetingTitle });
            
            if (!creatorName) {
                this.showError('Please enter your name');
                creatorNameInput.focus();
                return;
            }
            
            if (!meetingTitle) {
                this.showError('Please enter a meeting title');
                meetingTitleInput.focus();
                return;
            }
            
            this.boardId = this.generateBoardId();
            this.meetingStartTime = new Date().toISOString();
            
            this.currentUser = {
                name: creatorName,
                role: 'admin',
                joined: new Date().toISOString()
            };
            
            const boardData = {
                boardId: this.boardId,
                title: meetingTitle,
                creator: creatorName,
                created: new Date().toISOString(),
                startTime: this.meetingStartTime,
                participants: [
                    {name: creatorName, role: 'admin', joined: new Date().toISOString()}
                ],
                agendaItems: [],
                settings: {
                    allowAnonymousVoting: false,
                    requireJustification: false,
                    votingDeadline: null,
                    quorum: Math.ceil(1 * 0.5)
                },
                analytics: {
                    totalDuration: 0,
                    participationEvents: [],
                    votingActivity: [],
                    discussionPoints: []
                }
            };
            
            console.log('Board data created:', boardData);
            
            if (this.saveBoard(this.boardId, boardData)) {
                this.currentBoard = boardData;
                
                // Generate shareable URL with embedded data
                const shareableUrl = this.getShareableUrl();
                window.history.pushState({}, '', shareableUrl);
                
                this.showBoardPage();
                this.showSuccess('Board created successfully! Share the link to invite participants.');
            } else {
                this.showError('Failed to save board data');
            }
        } catch (error) {
            console.error('Error creating board:', error);
            this.showError('Error creating board: ' + error.message);
        }
    }
    
    joinBoard() {
        console.log('Joining board...');
        
        try {
            const participantNameInput = document.getElementById('participant-name');
            if (!participantNameInput) {
                console.error('Participant name input not found');
                return;
            }
            
            const participantName = participantNameInput.value.trim();
            
            console.log('Joining board:', { participantName, boardId: this.boardId });
            
            if (!participantName) {
                this.showError('Please enter your name');
                participantNameInput.focus();
                return;
            }
            
            if (!this.boardId) {
                this.showError('No board ID found');
                return;
            }
            
            const boardData = this.loadBoard(this.boardId);
            if (!boardData) {
                this.showError('Board not found');
                return;
            }
            
            const isAdmin = participantName === boardData.creator;
            this.currentUser = {
                name: participantName,
                role: isAdmin ? 'admin' : 'member',
                joined: new Date().toISOString()
            };
            
            console.log('User joining with role:', this.currentUser);
            
            const existingParticipant = boardData.participants.find(p => p.name === participantName);
            if (!existingParticipant) {
                boardData.participants.push(this.currentUser);
                this.saveBoard(this.boardId, boardData);
            }
            
            this.currentBoard = boardData;
            this.meetingStartTime = boardData.startTime;
            this.showBoardPage();
            this.showSuccess(`Welcome to the meeting, ${participantName}!`);
        } catch (error) {
            console.error('Error joining board:', error);
            this.showError('Error joining board: ' + error.message);
        }
    }
    
    addAgendaItem() {
        console.log('Adding agenda item...');
        
        try {
            const itemTitleInput = document.getElementById('item-title');
            const itemDescriptionInput = document.getElementById('item-description');
            const estimatedTimeInput = document.getElementById('estimated-time');
            const presenterInput = document.getElementById('item-presenter');
            const votingThresholdInput = document.getElementById('voting-threshold');
            const allowAnonymousInput = document.getElementById('allow-anonymous');
            
            if (!itemTitleInput) {
                this.showError('Item title input not found');
                return;
            }
            
            const itemTitle = itemTitleInput.value.trim();
            const itemDescription = itemDescriptionInput ? itemDescriptionInput.value.trim() : '';
            const estimatedTime = estimatedTimeInput ? estimatedTimeInput.value : '';
            const presenter = presenterInput ? presenterInput.value.trim() : '';
            const votingThreshold = votingThresholdInput ? votingThresholdInput.value : 'simple';
            const allowAnonymous = allowAnonymousInput ? allowAnonymousInput.checked : false;
            
            console.log('Adding agenda item:', itemTitle, this.selectedItemType);
            
            if (!itemTitle) {
                this.showError('Please enter an agenda item title');
                itemTitleInput.focus();
                return;
            }
            
            if (!this.selectedItemType) {
                this.showError('Please select an item type');
                return;
            }
            
            if (this.currentUser.name !== this.currentBoard.creator) {
                this.showError('Only the meeting creator can add agenda items');
                return;
            }
            
            const newItem = {
                id: 'item_' + Date.now(),
                type: this.selectedItemType.key,
                typeConfig: this.selectedItemType.config,
                category: this.selectedItemType.category,
                title: itemTitle,
                description: itemDescription,
                estimatedTime: parseInt(estimatedTime) || this.selectedItemType.config.estimatedTime,
                presenter: presenter || null,
                votingThreshold: votingThreshold,
                allowAnonymous: allowAnonymous,
                votes: this.getVoteStructureForType(this.selectedItemType.key),
                userVotes: {},
                status: 'pending',
                created: new Date().toISOString(),
                startedAt: null,
                completedAt: null,
                documents: []
            };
            
            this.currentBoard.agendaItems.push(newItem);
            this.saveBoard(this.boardId, this.currentBoard);
            
            console.log('Agenda item added:', newItem);
            
            // Clear form
            this.clearItemForm();
            
            this.updateBoardDisplay();
            this.showSuccess('Agenda item added successfully!');
        } catch (error) {
            console.error('Error adding agenda item:', error);
            this.showError('Error adding agenda item: ' + error.message);
        }
    }
    
    clearItemForm() {
        const inputs = [
            'item-title', 'item-description', 'estimated-time', 
            'item-presenter', 'allow-anonymous'
        ];
        
        inputs.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                if (input.type === 'checkbox') {
                    input.checked = false;
                } else {
                    input.value = '';
                }
            }
        });
        
        // Clear selection
        document.querySelectorAll('.item-type-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        this.selectedItemType = null;
        this.updateSelectedTypeDisplay();
        this.updateConditionalFields();
    }
    
    getVoteStructureForType(itemTypeKey) {
        const config = this.itemTypes.voting[itemTypeKey] || this.itemTypes.no_voting[itemTypeKey];
        if (!config || !config.requiresVoting) {
            return {};
        }
        
        const votes = {};
        if (config.options) {
            config.options.forEach(option => {
                votes[option.toLowerCase().replace(/ /g, '_')] = 0;
            });
        } else {
            // Default structure
            votes.yes = 0;
            votes.no = 0;
            votes.abstain = 0;
        }
        
        return votes;
    }
    
    vote(itemId, choice) {
        console.log('Voting:', { itemId, choice, user: this.currentUser.name });
        
        const item = this.currentBoard.agendaItems.find(i => i.id === itemId);
        if (!item) {
            console.error('Item not found:', itemId);
            return;
        }
        
        // Remove previous vote from this user
        const previousVote = item.userVotes[this.currentUser.name];
        if (previousVote && item.votes[previousVote] !== undefined) {
            item.votes[previousVote]--;
        }
        
        // Add new vote
        item.userVotes[this.currentUser.name] = choice;
        if (item.votes[choice] !== undefined) {
            item.votes[choice]++;
        }
        
        // Calculate status based on voting method
        this.calculateItemStatus(item);
        
        console.log('Vote recorded:', item);
        
        this.saveBoard(this.boardId, this.currentBoard);
        this.updateBoardDisplay();
        this.showSuccess(`Vote recorded: ${choice.replace('_', ' ').toUpperCase()}`);
    }
    
    completeNonVotingItem(itemId) {
        console.log('Completing non-voting item:', itemId);
        
        const item = this.currentBoard.agendaItems.find(i => i.id === itemId);
        if (!item) {
            console.error('Item not found:', itemId);
            return;
        }
        
        item.status = 'completed';
        item.completedAt = new Date().toISOString();
        
        this.saveBoard(this.boardId, this.currentBoard);
        this.updateBoardDisplay();
        this.showSuccess('Item marked as completed!');
    }
    
    calculateItemStatus(item) {
        const totalVotes = Object.values(item.votes).reduce((sum, count) => sum + count, 0);
        const participantCount = this.currentBoard.participants.length;
        
        if (totalVotes === 0) {
            item.status = 'pending';
            return;
        }
        
        // Get the main voting options (exclude abstain for calculation)
        const yesVotes = item.votes.approve || item.votes.yes || item.votes.aye || item.votes.agree || item.votes.consent || item.votes.support || 0;
        const noVotes = item.votes.reject || item.votes.no || item.votes.nay || item.votes.object || item.votes.oppose || 0;
        
        // Calculate based on voting threshold
        switch (item.votingThreshold) {
            case 'unanimous':
                if (yesVotes === participantCount) {
                    item.status = 'approved';
                } else if (noVotes > 0) {
                    item.status = 'rejected';
                } else {
                    item.status = 'pending';
                }
                break;
                
            case 'supermajority':
                const supermajorityThreshold = Math.ceil(participantCount * 0.667);
                if (yesVotes >= supermajorityThreshold) {
                    item.status = 'approved';
                } else if (noVotes > participantCount - supermajorityThreshold) {
                    item.status = 'rejected';
                } else {
                    item.status = 'pending';
                }
                break;
                
            case 'three-quarters':
                const threeQuartersThreshold = Math.ceil(participantCount * 0.75);
                if (yesVotes >= threeQuartersThreshold) {
                    item.status = 'approved';
                } else if (noVotes > participantCount - threeQuartersThreshold) {
                    item.status = 'rejected';
                } else {
                    item.status = 'pending';
                }
                break;
                
            default: // Simple majority
                const decisiveVotes = yesVotes + noVotes;
                if (decisiveVotes === 0) {
                    item.status = 'pending';
                } else if (yesVotes > noVotes) {
                    item.status = 'approved';
                } else if (noVotes > yesVotes) {
                    item.status = 'rejected';
                } else {
                    item.status = 'tied';
                }
                break;
        }
        
        // Mark as completed if status is determined
        if (item.status !== 'pending' && !item.completedAt) {
            item.completedAt = new Date().toISOString();
        }
    }
    
    updateBoardDisplay() {
        console.log('Updating board display');
        
        try {
            // Update header
            const boardTitle = document.getElementById('board-title');
            const boardInfo = document.getElementById('board-info');
            const currentUser = document.getElementById('current-user');
            
            if (boardTitle) boardTitle.textContent = this.currentBoard.title;
            if (boardInfo) boardInfo.textContent = `Created by ${this.currentBoard.creator} • ${this.currentBoard.participants.length} participants`;
            if (currentUser) currentUser.textContent = this.currentUser.name;
            
            // Set user role
            const isAdmin = this.currentUser.name === this.currentBoard.creator;
            const roleElement = document.getElementById('user-role');
            if (roleElement) {
                roleElement.textContent = isAdmin ? 'Admin' : 'Member';
                roleElement.className = `status status--${isAdmin ? 'admin' : 'member'}`;
            }
            
            // Update participants
            this.updateParticipants();
            
            // Update agenda items by category
            this.updateAgendaItems();
            
            // Update quick stats
            this.updateQuickStats();
        } catch (error) {
            console.error('Error updating board display:', error);
        }
    }
    
    updateQuickStats() {
        const totalItems = this.currentBoard.agendaItems.length;
        const votingItems = this.currentBoard.agendaItems.filter(item => item.typeConfig?.requiresVoting).length;
        const completedItems = this.currentBoard.agendaItems.filter(item => 
            ['approved', 'rejected', 'tied', 'completed'].includes(item.status)
        ).length;
        
        const participationRate = this.calculateParticipationRate();
        
        const totalItemsEl = document.getElementById('total-items');
        const votingItemsEl = document.getElementById('voting-items');
        const completedItemsEl = document.getElementById('completed-items');
        const participationRateEl = document.getElementById('participation-rate');
        
        if (totalItemsEl) totalItemsEl.textContent = totalItems;
        if (votingItemsEl) votingItemsEl.textContent = votingItems;
        if (completedItemsEl) completedItemsEl.textContent = completedItems;
        if (participationRateEl) participationRateEl.textContent = `${participationRate}%`;
    }
    
    calculateParticipationRate() {
        const votingItems = this.currentBoard.agendaItems.filter(item => item.typeConfig?.requiresVoting);
        if (votingItems.length === 0) return 0;
        
        let totalPossibleVotes = 0;
        let actualVotes = 0;
        
        votingItems.forEach(item => {
            totalPossibleVotes += this.currentBoard.participants.length;
            actualVotes += Object.keys(item.userVotes).length;
        });
        
        return totalPossibleVotes > 0 ? Math.round((actualVotes / totalPossibleVotes) * 100) : 0;
    }
    
    updateParticipants() {
        const container = document.getElementById('participants-list');
        const count = document.getElementById('participant-count');
        
        if (!container || !count) return;
        
        count.textContent = this.currentBoard.participants.length;
        
        container.innerHTML = '';
        this.currentBoard.participants.forEach(participant => {
            const isAdmin = participant.name === this.currentBoard.creator;
            const div = document.createElement('div');
            div.className = `participant ${isAdmin ? 'admin' : 'member'}`;
            div.innerHTML = `
                <div class="participant-avatar">${participant.name.charAt(0).toUpperCase()}</div>
                <span>${participant.name}${isAdmin ? ' (Admin)' : ''}</span>
            `;
            container.appendChild(div);
        });
    }
    
    updateAgendaItems() {
        const votingContainer = document.getElementById('voting-items-list');
        const nonVotingContainer = document.getElementById('non-voting-items-list');
        const emptyState = document.getElementById('items-empty-state');
        
        if (!votingContainer || !nonVotingContainer || !emptyState) return;
        
        const votingItems = this.currentBoard.agendaItems.filter(item => item.category === 'voting');
        const nonVotingItems = this.currentBoard.agendaItems.filter(item => item.category === 'no-voting');
        
        if (this.currentBoard.agendaItems.length === 0) {
            emptyState.classList.remove('hidden');
            document.getElementById('voting-items-section').style.display = 'none';
            document.getElementById('non-voting-items-section').style.display = 'none';
            
            const message = this.currentUser.name === this.currentBoard.creator ? 
                'Add agenda items above to get started.' : 
                'Waiting for the admin to add agenda items.';
            const messageEl = document.getElementById('empty-state-message');
            if (messageEl) messageEl.textContent = message;
            return;
        }
        
        emptyState.classList.add('hidden');
        
        // Show/hide sections based on content
        const votingSection = document.getElementById('voting-items-section');
        const nonVotingSection = document.getElementById('non-voting-items-section');
        
        if (votingSection) votingSection.style.display = votingItems.length > 0 ? 'block' : 'none';
        if (nonVotingSection) nonVotingSection.style.display = nonVotingItems.length > 0 ? 'block' : 'none';
        
        // Render voting items
        this.renderItemsInContainer(votingContainer, votingItems, true);
        
        // Render non-voting items
        this.renderItemsInContainer(nonVotingContainer, nonVotingItems, false);
    }
    
    renderItemsInContainer(container, items, isVoting) {
        container.innerHTML = '';
        
        items.forEach(item => {
            const div = document.createElement('div');
            div.className = isVoting ? 'agenda-item' : 'agenda-item non-voting-item';
            
            const userVote = item.userVotes[this.currentUser.name];
            const totalVotes = Object.values(item.votes).reduce((sum, count) => sum + count, 0);
            
            let contentHtml = `
                <h4>
                    ${item.title}
                    <span class="item-type-badge ${item.category}">${item.typeConfig?.name || item.type}</span>
                </h4>
                <div class="item-meta">
                    <div class="item-meta-item">📋 ${item.typeConfig?.name || item.type}</div>
                    <div class="item-meta-item">⏱️ ${item.estimatedTime} min</div>
                    ${item.presenter ? `<div class="item-meta-item">👤 ${item.presenter}</div>` : ''}
                </div>
                ${item.description ? `<div class="item-description">${item.description}</div>` : ''}
            `;
            
            if (isVoting) {
                // Add voting interface
                const voteOptions = Object.keys(item.votes);
                const voteButtonsHtml = voteOptions.map(option => 
                    `<button class="vote-btn ${userVote === option ? 'selected' : ''}" 
                             onclick="app.vote('${item.id}', '${option}')">
                        ${this.getVoteOptionDisplay(option)}
                    </button>`
                ).join('');
                
                const votingResultsHtml = totalVotes > 0 ? `
                    <div class="voting-results">
                        <h5>Results (${totalVotes} vote${totalVotes !== 1 ? 's' : ''})</h5>
                        ${voteOptions.map(option => {
                            const count = item.votes[option];
                            const percentage = totalVotes > 0 ? (count / totalVotes) * 100 : 0;
                            return `
                                <div class="vote-result">
                                    <span>${this.getVoteOptionDisplay(option)}</span>
                                    <div class="vote-bar">
                                        <div class="vote-progress" style="width: ${percentage}%"></div>
                                    </div>
                                    <span class="vote-count">${count}</span>
                                </div>
                            `;
                        }).join('')}
                    </div>
                ` : '<p style="text-align: center; color: var(--color-text-secondary); font-style: italic; margin-top: var(--space-16);">No votes cast yet</p>';
                
                contentHtml += `
                    <div class="voting-interface">
                        <div class="voting-options">
                            ${voteButtonsHtml}
                        </div>
                        ${userVote ? `<div class="your-vote">✓ You voted: ${this.getVoteOptionDisplay(userVote)}</div>` : ''}
                        ${votingResultsHtml}
                    </div>
                `;
            } else {
                // Add completion interface for non-voting items
                const isCompleted = item.status === 'completed';
                const isAdmin = this.currentUser.name === this.currentBoard.creator;
                
                contentHtml += `
                    <div class="completion-interface">
                        <div class="completion-status">
                            Status: ${isCompleted ? 'Completed' : 'Pending'}
                        </div>
                        ${!isCompleted && isAdmin ? `
                            <button class="complete-btn" onclick="app.completeNonVotingItem('${item.id}')">
                                Mark as Complete
                            </button>
                        ` : ''}
                    </div>
                `;
            }
            
            // Add status indicator
            contentHtml += `
                <div class="item-status ${item.status}">
                    Status: ${item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    ${this.getStatusThreshold(item)}
                </div>
            `;
            
            div.innerHTML = contentHtml;
            container.appendChild(div);
        });
    }
    
    getVoteOptionDisplay(option) {
        const displays = {
            approve: '✓ Approve',
            reject: '✗ Reject',
            abstain: '~ Abstain',
            yes: '✓ Yes',
            no: '✗ No',
            aye: '✓ Aye',
            nay: '✗ Nay',
            present: '◦ Present',
            agree: '✓ Agree',
            object: '✗ Object',
            consent: '✓ Consent',
            'stand_aside': '◦ Stand Aside',
            support: '✓ Support',
            oppose: '✗ Oppose',
            neutral: '~ Neutral',
            'approve_with_conditions': '✓ Approve with Conditions'
        };
        return displays[option] || option.charAt(0).toUpperCase() + option.slice(1).replace('_', ' ');
    }
    
    getStatusThreshold(item) {
        if (!item.typeConfig?.requiresVoting) return '';
        
        const participantCount = this.currentBoard.participants.length;
        switch (item.votingThreshold) {
            case 'unanimous':
                return ` (Requires: ${participantCount}/${participantCount} votes)`;
            case 'supermajority':
                const supermajority = Math.ceil(participantCount * 0.667);
                return ` (Requires: ${supermajority}/${participantCount} votes)`;
            case 'three-quarters':
                const threeQuarters = Math.ceil(participantCount * 0.75);
                return ` (Requires: ${threeQuarters}/${participantCount} votes)`;
            default:
                const majority = Math.ceil(participantCount / 2);
                return ` (Requires: ${majority}/${participantCount} votes)`;
        }
    }
    
    // Enhanced Deck Generation (abbreviated for space - full implementation continues...)
    generateComprehensiveSlides() {
        this.slides = [];
        
        // Title slide with comprehensive information
        this.slides.push({
            title: this.currentBoard.title,
            type: 'title',
            content: `
                <div class="slide-content">
                    <h2>${this.currentBoard.title}</h2>
                    <p style="text-align: center; font-size: var(--font-size-xl); margin-bottom: var(--space-24); color: var(--color-primary);">
                        Comprehensive Board Meeting Presentation
                    </p>
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: var(--space-20); margin-top: var(--space-32);">
                        <div style="text-align: center;">
                            <div class="summary-count">${this.currentBoard.participants.length}</div>
                            <div>Participants</div>
                        </div>
                        <div style="text-align: center;">
                            <div class="summary-count">${this.currentBoard.agendaItems.length}</div>
                            <div>Total Items</div>
                        </div>
                        <div style="text-align: center;">
                            <div class="summary-count">${this.currentBoard.agendaItems.filter(i => i.category === 'voting').length}</div>
                            <div>Voting Items</div>
                        </div>
                    </div>
                    <p style="text-align: center; color: var(--color-text-secondary); margin-top: var(--space-24);">
                        Created by <strong>${this.currentBoard.creator}</strong><br>
                        ${new Date(this.currentBoard.created).toLocaleDateString()} • 
                        ${new Date(this.currentBoard.created).toLocaleTimeString()}
                    </p>
                </div>
            `
        });
        
        // Generate slides for each agenda item
        this.currentBoard.agendaItems.forEach((item, index) => {
            const itemConfig = this.itemTypes.voting[item.type] || this.itemTypes.no_voting[item.type];
            const itemTypeName = itemConfig ? itemConfig.name : item.type;
            
            // Build the slide content
            let slideContent = `
                <div class="slide-content">
                    <h2>Item ${index + 1}: ${item.title}</h2>
                    <div style="margin-bottom: var(--space-16);">
                        <span class="item-type-badge ${item.category}">${itemTypeName}</span>
                        <span class="item-status ${item.status}">${item.status.charAt(0).toUpperCase() + item.status.slice(1)}</span>
                    </div>
            `;
            
            // Add description if available
            if (item.description) {
                slideContent += `
                    <div style="margin-bottom: var(--space-20); padding: var(--space-16); background: var(--color-secondary); border-radius: var(--radius-md);">
                        <h4 style="margin-bottom: var(--space-8);">Description</h4>
                        <p style="color: var(--color-text-secondary);">${item.description}</p>
                    </div>
                `;
            }
            
            // Add presenter if available
            if (item.presenter) {
                slideContent += `
                    <div style="margin-bottom: var(--space-16);">
                        <strong>Presenter:</strong> ${item.presenter}
                    </div>
                `;
            }
            
            // Add estimated time if available
            if (item.estimatedTime) {
                slideContent += `
                    <div style="margin-bottom: var(--space-16);">
                        <strong>Estimated Time:</strong> ${item.estimatedTime} minutes
                    </div>
                `;
            }
            
            // Add voting results for voting items
            if (item.category === 'voting' && item.votes) {
                slideContent += `
                    <div style="margin-top: var(--space-24);">
                        <h3 style="margin-bottom: var(--space-16);">Voting Results</h3>
                        <div class="voting-results">
                `;
                
                // Calculate total votes
                const totalVotes = Object.values(item.votes).reduce((sum, count) => sum + count, 0);
                
                // Display each vote option with bar graph
                Object.entries(item.votes).forEach(([option, count]) => {
                    const percentage = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
                    slideContent += `
                        <div class="vote-result" style="margin-bottom: var(--space-12);">
                            <div style="display: flex; justify-content: space-between; margin-bottom: var(--space-4);">
                                <span style="font-weight: var(--font-weight-medium);">${this.getVoteOptionDisplay(option)}</span>
                                <span>${count} vote${count !== 1 ? 's' : ''} (${percentage}%)</span>
                            </div>
                            <div class="vote-bar">
                                <div class="vote-progress" style="width: ${percentage}%"></div>
                            </div>
                        </div>
                    `;
                });
                
                slideContent += `
                        </div>
                        <div style="margin-top: var(--space-16); padding: var(--space-12); background: var(--color-secondary); border-radius: var(--radius-md); text-align: center;">
                            <strong>Total Votes:</strong> ${totalVotes} / ${this.currentBoard.participants.length} participants
                        </div>
                `;
                
                // Add threshold information if applicable
                const threshold = this.getStatusThreshold(item);
                if (threshold) {
                    slideContent += `
                        <div style="margin-top: var(--space-12); padding: var(--space-12); background: var(--color-info); color: var(--color-text); border-radius: var(--radius-md); text-align: center;">
                            <strong>Threshold:</strong> ${threshold}
                        </div>
                    `;
                }
                
                slideContent += `
                    </div>
                `;
            }
            
            // Add completion status for non-voting items
            if (item.category === 'no-voting') {
                slideContent += `
                    <div style="margin-top: var(--space-24);">
                        <h3 style="margin-bottom: var(--space-16);">Status</h3>
                        <div style="padding: var(--space-16); background: var(--color-secondary); border-radius: var(--radius-md); text-align: center;">
                            <span class="item-status ${item.status}" style="font-size: var(--font-size-lg);">
                                ${item.status === 'completed' ? '✓ Completed' : 'Pending Review'}
                            </span>
                        </div>
                    </div>
                `;
            }
            
            slideContent += `
                </div>
            `;
            
            // Add the slide
            this.slides.push({
                title: item.title,
                type: 'agenda-item',
                itemId: item.id,
                content: slideContent
            });
        });
        
        // Add summary slide at the end
        const analytics = this.calculateMeetingAnalytics();
        this.slides.push({
            title: 'Meeting Summary',
            type: 'summary',
            content: `
                <div class="slide-content">
                    <h2>Meeting Summary</h2>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-24); margin-top: var(--space-32);">
                        <div>
                            <h3 style="margin-bottom: var(--space-16);">Overview</h3>
                            <div style="display: flex; flex-direction: column; gap: var(--space-12);">
                                <div style="padding: var(--space-12); background: var(--color-secondary); border-radius: var(--radius-md);">
                                    <div class="summary-count">${this.currentBoard.agendaItems.length}</div>
                                    <div>Total Agenda Items</div>
                                </div>
                                <div style="padding: var(--space-12); background: var(--color-secondary); border-radius: var(--radius-md);">
                                    <div class="summary-count">${analytics.completedItems}</div>
                                    <div>Completed Items</div>
                                </div>
                                <div style="padding: var(--space-12); background: var(--color-secondary); border-radius: var(--radius-md);">
                                    <div class="summary-count">${analytics.participationRate}%</div>
                                    <div>Participation Rate</div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 style="margin-bottom: var(--space-16);">Decisions</h3>
                            <div style="display: flex; flex-direction: column; gap: var(--space-12);">
                                <div style="padding: var(--space-12); background: var(--color-success); color: var(--color-white); border-radius: var(--radius-md);">
                                    <div class="summary-count">${analytics.approvedCount}</div>
                                    <div>Approved</div>
                                </div>
                                <div style="padding: var(--space-12); background: var(--color-error); color: var(--color-white); border-radius: var(--radius-md);">
                                    <div class="summary-count">${analytics.rejectedCount}</div>
                                    <div>Rejected</div>
                                </div>
                                <div style="padding: var(--space-12); background: var(--color-warning); color: var(--color-white); border-radius: var(--radius-md);">
                                    <div class="summary-count">${analytics.pendingCount}</div>
                                    <div>Pending</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `
        });
    }
    
    // Additional methods for slide generation, analytics, and utilities...
    calculateMeetingAnalytics() {
        const totalItems = this.currentBoard.agendaItems.length;
        const votingItems = this.currentBoard.agendaItems.filter(item => item.category === 'voting');
        const nonVotingItems = this.currentBoard.agendaItems.filter(item => item.category === 'no-voting');
        
        const completedItems = this.currentBoard.agendaItems.filter(item => 
            ['approved', 'rejected', 'tied', 'completed'].includes(item.status)
        ).length;
        
        const approvedCount = this.currentBoard.agendaItems.filter(item => item.status === 'approved').length;
        const rejectedCount = this.currentBoard.agendaItems.filter(item => item.status === 'rejected').length;
        const pendingCount = totalItems - completedItems;
        
        const participationRate = this.calculateParticipationRate();
        const completionRate = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
        const consensusRate = completedItems > 0 ? Math.round((approvedCount / completedItems) * 100) : 0;
        const efficiency = Math.min(100, Math.round((participationRate + completionRate) / 2));
        
        return {
            participationRate,
            completionRate,
            consensusRate,
            efficiency,
            totalDecisions: completedItems,
            approvedCount,
            rejectedCount,
            pendingCount,
            completedItems,
            votingItemsCount: votingItems.length,
            nonVotingItemsCount: nonVotingItems.length
        };
    }
    
    // Utility methods
    updateSlideDisplay() {
        const slideElement = document.getElementById('current-slide');
        const counterElement = document.getElementById('slide-counter');
        const prevBtn = document.getElementById('prev-slide');
        const nextBtn = document.getElementById('next-slide');
        
        if (!slideElement || !counterElement || !prevBtn || !nextBtn) return;
        
        if (this.slides.length === 0) {
            slideElement.innerHTML = '<div class="slide-content"><h2>No content available</h2><p>Add some agenda items to generate slides</p></div>';
            return;
        }
        
        slideElement.innerHTML = this.slides[this.currentSlide].content;
        counterElement.textContent = `${this.currentSlide + 1} / ${this.slides.length}`;
        
        prevBtn.disabled = this.currentSlide === 0;
        nextBtn.disabled = this.currentSlide === this.slides.length - 1;
    }
    
    generateSlideThumbnails() {
        const container = document.getElementById('slide-thumbs');
        if (!container) return;
        
        container.innerHTML = '';
        
        this.slides.forEach((slide, index) => {
            const thumb = document.createElement('div');
            thumb.className = `slide-thumb ${index === this.currentSlide ? 'active' : ''}`;
            thumb.onclick = () => {
                this.currentSlide = index;
                this.updateSlideDisplay();
            };
            
            const preview = slide.content.replace(/<[^>]*>/g, '').substring(0, 100);
            
            thumb.innerHTML = `
                <div class="slide-thumb-title">${index + 1}. ${slide.title}</div>
                <div class="slide-thumb-content">${preview}...</div>
            `;
            
            container.appendChild(thumb);
        });
    }
    
    prevSlide() {
        if (this.currentSlide > 0) {
            this.currentSlide--;
            this.updateSlideDisplay();
        }
    }
    
    nextSlide() {
        if (this.currentSlide < this.slides.length - 1) {
            this.currentSlide++;
            this.updateSlideDisplay();
        }
    }
    
    // Small helper to toggle loading state on buttons
    setButtonLoading(btn, isLoading, loadingText = 'Exporting…') {
        if (!btn) return;
        if (isLoading) {
            btn.dataset.originalText = btn.textContent;
            btn.textContent = loadingText;
            btn.setAttribute('aria-busy', 'true');
            btn.disabled = true;
        } else {
            const original = btn.dataset.originalText || btn.textContent;
            btn.textContent = original;
            btn.removeAttribute('aria-busy');
            btn.disabled = false;
        }
    }
    
    // Add footer to all pages in a PDF (title/date on left, page numbers on right, logo at bottom center)
    addPdfFooter(pdf, titleText) {
        const total = pdf.getNumberOfPages();
        for (let i = 1; i <= total; i++) {
            pdf.setPage(i);
            const pw = pdf.internal.pageSize.getWidth();
            const ph = pdf.internal.pageSize.getHeight();
            const margin = 40;
            
            // Add text footer
            pdf.setFontSize(9);
            pdf.setTextColor(100);
            pdf.text(titleText, margin, ph - 30);
            pdf.text(`Page ${i} of ${total}`, pw - margin, ph - 30, { align: 'right' });
            
            // Add CollabBoard logo at bottom center
            const logoWidth = 80;
            const logoHeight = 20;
            const logoX = (pw - logoWidth) / 2;
            const logoY = ph - 20;
            
            // Green square (behind)
            pdf.setFillColor(52, 168, 83); // #34A853
            pdf.roundedRect(logoX, logoY + 3, 8, 8, 1, 1, 'F');
            
            // Purple square (front)
            pdf.setFillColor(106, 13, 173); // #6A0DAD
            pdf.roundedRect(logoX + 4, logoY + 1, 9, 9, 1.2, 1.2, 'F');
            
            // "CollabBoard" text
            pdf.setFontSize(10);
            pdf.setTextColor(0, 0, 0);
            pdf.setFont(undefined, 'bold');
            pdf.text('CollabBoard', logoX + 18, logoY + 8);
            pdf.setFont(undefined, 'normal');
        }
        // Reset text color
        pdf.setTextColor(0);
    }
    
    exportDeck() {
        (async () => {
            const btn = document.getElementById('export-deck-btn');
            try {
                this.setButtonLoading(btn, true, 'Exporting deck…');
                // Ensure required libs are available
                const hasJsPDF = window.jspdf && window.jspdf.jsPDF;
                const hasHtml2Canvas = typeof window.html2canvas === 'function';
                if (!hasJsPDF || !hasHtml2Canvas) {
                    this.showError('Export dependencies not loaded. Please ensure network access and try again.');
                    return;
                }

                // Ensure slides are generated
                if (!this.slides || this.slides.length === 0) {
                    this.generateComprehensiveSlides();
                }

                const { jsPDF } = window.jspdf;
                // Landscape A4 for slide-like layout
                const pdf = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
                const pageWidth = pdf.internal.pageSize.getWidth();
                const pageHeight = pdf.internal.pageSize.getHeight();

                // Build an offscreen container for rendering each slide snapshot
                const container = document.createElement('div');
                container.style.position = 'fixed';
                container.style.left = '-20000px';
                container.style.top = '0';
                container.style.width = '1200px'; // base render width
                container.style.background = '#ffffff';
                document.body.appendChild(container);

                for (let i = 0; i < this.slides.length; i++) {
                    container.innerHTML = `
                        <div class="slide" style="width: 1200px; min-height: 675px; padding: 24px; background: #ffffff; color: var(--color-text);">
                            ${this.slides[i].content}
                        </div>
                    `;
                    // Allow layout to settle
                    await new Promise(r => setTimeout(r, 50));
                    const node = container.firstElementChild;
                    const canvas = await window.html2canvas(node, { backgroundColor: '#ffffff', scale: 2, useCORS: true });
                    const imgData = canvas.toDataURL('image/png');

                    // Scale to fit within PDF page while preserving aspect ratio
                    const imgW = pageWidth;
                    const imgH = canvas.height * (imgW / canvas.width);
                    if (i > 0) pdf.addPage();
                    const y = Math.max(0, (pageHeight - imgH) / 2);
                    pdf.addImage(imgData, 'PNG', 0, y, imgW, imgH);
                }

                document.body.removeChild(container);
                const safeTitle = (this.currentBoard?.title || 'Deck').replace(/[/\\:*?\"<>|]+/g, ' ');
                // Add consistent footer after all pages are generated
                const footerLeft = `${this.currentBoard?.title || 'CollabBoard'} • ${new Date().toLocaleString()}`;
                this.addPdfFooter(pdf, footerLeft);
                pdf.save(`CollabBoard - ${safeTitle} - Deck.pdf`);
                this.showSuccess('Presentation deck exported as PDF');
            } catch (err) {
                console.error('Export deck failed:', err);
                this.showError('Failed to export deck: ' + (err?.message || err));
            } finally {
                this.setButtonLoading(btn, false);
            }
        })();
    }
    
    // Analytics methods
    initAnalytics() {
        this.analytics = new AnalyticsDashboard(this);
    }
    
    renderAnalyticsDashboard() {
        if (!this.analytics) {
            this.initAnalytics();
        }
        this.analytics.renderDashboard();
    }
    
    exportAnalytics() {
        const btn = document.getElementById('export-analytics-btn');
        try {
            this.setButtonLoading(btn, true, 'Exporting PDF…');
            const hasJsPDF = window.jspdf && window.jspdf.jsPDF;
            if (!hasJsPDF) {
                this.showError('PDF export library not loaded. Please check your connection and try again.');
                return;
            }
            if (!this.analytics) {
                this.initAnalytics();
            }
            // Ensure charts are rendered
            this.analytics.renderDashboard();

            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
            const pw = pdf.internal.pageSize.getWidth();
            const ph = pdf.internal.pageSize.getHeight();

            const margin = 40;
            let y = margin;

            // Title and summary
            pdf.setFontSize(18);
            pdf.text('Meeting Analytics Report', margin, y);
            y += 24;
            pdf.setFontSize(12);
            const generatedAt = new Date().toLocaleString();
            const analytics = this.calculateMeetingAnalytics();
            const title = this.currentBoard?.title || 'Untitled Meeting';

            pdf.text(`Title: ${title}`, margin, y); y += 18;
            pdf.text(`Generated: ${generatedAt}`, margin, y); y += 18;
            pdf.text(`Participants: ${this.currentBoard.participants.length}`, margin, y); y += 18;
            pdf.text(`Agenda Items: ${this.currentBoard.agendaItems.length}`, margin, y); y += 18;
            pdf.text(`Efficiency: ${analytics.efficiency}%`, margin, y); y += 18;
            pdf.text(`Consensus: ${analytics.consensusRate}%`, margin, y); y += 24;

            // Helper to add a chart by canvas id
            const addChart = (canvasId, titleText) => {
                const canvas = document.getElementById(canvasId);
                if (!canvas) return false;
                const imgData = canvas.toDataURL('image/png');
                const maxW = pw - margin * 2;
                const scale = maxW / canvas.width;
                const imgW = maxW;
                const imgH = canvas.height * scale;
                if (y + 24 + imgH > ph - margin) {
                    pdf.addPage();
                    y = margin;
                }
                pdf.setFontSize(14);
                pdf.text(titleText, margin, y);
                y += 12;
                pdf.addImage(imgData, 'PNG', margin, y, imgW, imgH);
                y += imgH + 16;
                return true;
            };

            addChart('progress-chart', 'Meeting Progress');
            addChart('participation-chart', 'Participation Analysis');
            addChart('decisions-chart', 'Decision Outcomes');

            // Detailed results page
            pdf.addPage();
            y = margin;
            pdf.setFontSize(16);
            pdf.text('Detailed Results', margin, y);
            y += 22;
            pdf.setFontSize(11);
            const items = this.currentBoard.agendaItems;
            items.forEach((item, idx) => {
                const line = `${idx + 1}. ${item.title} — ${item.typeConfig?.name || item.type} — Status: ${item.status}`;
                // Wrap text if needed
                const wrapped = pdf.splitTextToSize(line, pw - margin * 2);
                if (y + wrapped.length * 14 > ph - margin) {
                    pdf.addPage();
                    y = margin;
                }
                pdf.text(wrapped, margin, y);
                y += wrapped.length * 14 + 6;
            });

            const safeTitle = title.replace(/[/\\:*?"<>|]+/g, ' ');
            // Footer across all pages
            const footerLeft = `${title} • ${generatedAt}`;
            this.addPdfFooter(pdf, footerLeft);
            pdf.save(`CollabBoard - ${safeTitle} - Analytics.pdf`);
            this.showSuccess('Analytics report exported as PDF');
        } catch (err) {
            console.error('Export analytics failed:', err);
            this.showError('Failed to export analytics: ' + (err?.message || err));
        } finally {
            this.setButtonLoading(btn, false);
        }
    }
    
    exportAnalyticsJSON() {
        const btn = document.getElementById('export-analytics-json-btn');
        try {
            this.setButtonLoading(btn, true, 'Exporting JSON…');
            if (!this.analytics) {
                this.initAnalytics();
            }
            const report = this.analytics.generateReport();
            const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            const safeTitle = (this.currentBoard?.title || 'Meeting').replace(/[/\\:*?\"<>|]+/g, ' ');
            a.href = url;
            a.download = `CollabBoard - ${safeTitle} - Analytics.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            this.showSuccess('Analytics data exported as JSON');
        } catch (err) {
            console.error('Export analytics JSON failed:', err);
            this.showError('Failed to export JSON: ' + (err?.message || err));
        } finally {
            this.setButtonLoading(btn, false);
        }
    }
    
    // Share functionality
    showShareModal() {
        // Ensure we have a board ID
        if (!this.boardId) {
            console.error('No board ID available for sharing');
            this.showError('Unable to generate share link - no board ID');
            return;
        }
        
        // Generate shareable URL with embedded data
        const shareUrl = this.getShareableUrl();
        const shareLinkInput = document.getElementById('share-link');
        const shareModal = document.getElementById('share-modal');
        const copySuccess = document.getElementById('copy-success');
        
        if (shareLinkInput) shareLinkInput.value = shareUrl;
        if (shareModal) shareModal.classList.remove('hidden');
        if (copySuccess) copySuccess.classList.add('hidden');
        
        console.log('Share modal opened with shareable URL');
        console.log('Board ID:', this.boardId);
        console.log('URL includes embedded board data for cross-browser sharing');
        
        // Generate QR code with simple board ID URL (without embedded data)
        // QR codes have size limits, so we use a simpler URL format for scanning
        const qrUrl = `${window.location.origin}${window.location.pathname}?board=${this.boardId}`;
        this.generateQRCode(qrUrl);
    }
    
    generateQRCode(url, retryCount = 0) {
        const qrContainer = document.getElementById('qr-code');
        if (!qrContainer) {
            console.error('QR code container not found');
            return;
        }
        
        console.log('Generating QR code for URL:', url);
        console.log('URL length:', url.length);
        console.log('Board ID:', this.boardId);
        
        // Clear previous QR code
        qrContainer.innerHTML = '';
        
        try {
            // Check if QRCode library is loaded
            if (typeof QRCode === 'undefined') {
                console.warn(`QRCode library not loaded yet - attempt ${retryCount + 1}/5`);
                
                // Show loading message
                qrContainer.innerHTML = '<p style="color: var(--color-text-secondary); text-align: center; font-size: var(--font-size-sm);">Generating QR code...</p>';
                
                // Retry up to 5 times with increasing delays
                if (retryCount < 5) {
                    const delay = (retryCount + 1) * 200; // 200ms, 400ms, 600ms, 800ms, 1000ms
                    setTimeout(() => {
                        this.generateQRCode(url, retryCount + 1);
                    }, delay);
                } else {
                    console.error('QRCode library failed to load after 5 attempts');
                    qrContainer.innerHTML = '<p style="color: var(--color-error); text-align: center; font-size: var(--font-size-sm);">QR Code library unavailable. Please refresh the page.</p>';
                }
                return;
            }
            
            // Verify URL contains board ID
            if (!url.includes('board=')) {
                console.error('Invalid URL - missing board parameter:', url);
                qrContainer.innerHTML = '<p style="color: var(--color-error); text-align: center;">Invalid board URL</p>';
                return;
            }
            
            // QR code size limits: 
            // - Level L: ~2953 chars
            // - Level M: ~2331 chars  
            // - Level Q: ~1663 chars
            // - Level H: ~1273 chars
            // Check if URL is too long for QR code
            if (url.length > 2000) {
                console.warn('URL too long for QR code:', url.length, 'chars. Using simple board ID URL instead.');
                qrContainer.innerHTML = `
                    <div style="text-align: center; padding: var(--space-16); color: var(--color-text-secondary);">
                        <p style="margin-bottom: var(--space-12); font-size: var(--font-size-sm);">
                            ℹ️ Board has too much data for QR code
                        </p>
                        <p style="margin: 0; font-size: var(--font-size-xs);">
                            Please share the link above instead
                        </p>
                    </div>
                `;
                return;
            }
            
            // Create wrapper for better styling
            const qrWrapper = document.createElement('div');
            qrWrapper.style.display = 'flex';
            qrWrapper.style.flexDirection = 'column';
            qrWrapper.style.alignItems = 'center';
            qrWrapper.style.padding = 'var(--space-24)';
            qrWrapper.style.backgroundColor = 'var(--color-white)';
            qrWrapper.style.borderRadius = 'var(--radius-base)';
            qrWrapper.style.margin = '0 auto';
            qrWrapper.style.maxWidth = '320px';
            qrWrapper.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
            
            // Generate QR code using QRCode.js
            // Using larger size (256x256) and Medium error correction for better readability
            new QRCode(qrWrapper, {
                text: url,
                width: 256,
                height: 256,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.M  // M provides good balance between redundancy and pattern density
            });
            
            // Add info text
            const info = document.createElement('p');
            info.style.marginTop = 'var(--space-12)';
            info.style.marginBottom = '0';
            info.style.fontSize = 'var(--font-size-sm)';
            info.style.color = 'var(--color-text-secondary)';
            info.style.textAlign = 'center';
            info.textContent = 'Scan to join meeting on mobile';
            qrWrapper.appendChild(info);
            
            qrContainer.appendChild(qrWrapper);
            console.log('✓ QR code generated successfully for board:', this.boardId);
            console.log('✓ QR code encodes URL:', url.substring(0, 100) + '...');
        } catch (error) {
            console.error('Error generating QR code:', error);
            qrContainer.innerHTML = `
                <div style="text-align: center; padding: var(--space-16); color: var(--color-error);">
                    <p style="margin-bottom: var(--space-8); font-size: var(--font-size-sm);">Failed to generate QR code</p>
                    <p style="margin: 0; font-size: var(--font-size-xs); color: var(--color-text-secondary);">${error.message || 'Unknown error'}</p>
                </div>
            `;
        }
    }
    
    async copyLink() {
        const shareLink = document.getElementById('share-link');
        const copyBtn = document.getElementById('copy-link-btn');
        const feedback = document.getElementById('copy-success');
        
        if (!shareLink || !copyBtn || !feedback) return;
        
        try {
            console.log('Copying link to clipboard');
            
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(shareLink.value);
            } else {
                shareLink.select();
                shareLink.setSelectionRange(0, 99999);
                document.execCommand('copy');
            }
            
            feedback.classList.remove('hidden');
            const originalText = copyBtn.textContent;
            copyBtn.textContent = '✅ Copied!';
            
            setTimeout(() => {
                copyBtn.textContent = originalText;
                feedback.classList.add('hidden');
            }, 3000);
            
            console.log('Link copied successfully');
        } catch (err) {
            console.error('Failed to copy link:', err);
            this.showError('Failed to copy link. Please copy manually.');
        }
    }
    
    shareViaEmail() {
        const shareUrl = this.getShareableUrl();
        const subject = encodeURIComponent(`Join Board Meeting: ${this.currentBoard.title}`);
        const body = encodeURIComponent(`You're invited to join the comprehensive board meeting "${this.currentBoard.title}".\n\nClick here to join: ${shareUrl}\n\nMeeting created by: ${this.currentBoard.creator}\n\nNote: This link contains all meeting data and works across any browser.`);
        
        window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
        this.showSuccess('Email client opened with meeting invitation');
    }
    
    shareViaTeams() {
        const shareUrl = this.getShareableUrl();
        const message = encodeURIComponent(`Join comprehensive board meeting: ${this.currentBoard.title} - ${shareUrl}`);
        
        window.open(`https://teams.microsoft.com/l/chat/0/0?users=&message=${message}`, '_blank');
        this.showSuccess('Opening Microsoft Teams to share meeting link');
    }
    
    shareViaSlack() {
        const shareUrl = this.getShareableUrl();
        const text = encodeURIComponent(`Join our comprehensive board meeting: ${this.currentBoard.title} - ${shareUrl}`);
        
        window.open(`https://slack.com/intl/en-us/help/articles/201330736-Add-apps-to-your-Slack-workspace?text=${text}`, '_blank');
        this.showSuccess('Opening Slack to share meeting link');
    }
    
    closeModal() {
        const shareModal = document.getElementById('share-modal');
        if (shareModal) shareModal.classList.add('hidden');
    }
    
    showSuccess(message) {
        const banner = document.getElementById('success-message');
        const text = document.getElementById('success-text');
        
        if (banner && text) {
            text.textContent = message;
            banner.classList.remove('hidden');
            
            setTimeout(() => {
                banner.classList.add('hidden');
            }, 5000);
        }
        
        console.log('Success message:', message);
    }
    
    showError(message) {
        alert(message);
        console.error('Error:', message);
    }
    
    syncBoard() {
        if (!this.boardId) return;
        
        // Try to load from URL first (for shared boards), then fallback to local storage
        const latestBoard = this.loadBoardFromUrl() || this.loadBoard(this.boardId);
        if (!latestBoard) return;
        
        const currentHash = this.currentBoard ? JSON.stringify(this.currentBoard).length : 0;
        const latestHash = JSON.stringify(latestBoard).length;
        
        if (currentHash !== latestHash) {
            console.log('Board updated, syncing changes');
            this.currentBoard = latestBoard;
            
            const boardPage = document.getElementById('board-page');
            if (boardPage && !boardPage.classList.contains('hidden')) {
                this.updateBoardDisplay();
            }
        }
    }
    saveBoard(boardId, boardData) {
        try {
            // Save to localStorage for persistence
            localStorage.setItem(`collab_board_${boardId}`, JSON.stringify(boardData));
            console.log('Board saved to localStorage:', boardId);
            
            // Update URL with encoded board data for sharing
            this.updateUrlWithBoardData(boardData);
            return true;
        } catch (e) {
            console.warn('localStorage failed, trying sessionStorage:', e);
            try {
                sessionStorage.setItem(`collab_board_${boardId}`, JSON.stringify(boardData));
                console.log('Board saved to sessionStorage:', boardId);
                this.updateUrlWithBoardData(boardData);
                return true;
            } catch (e2) {
                console.warn('sessionStorage failed, using memory storage:', e2);
                if (!window.memoryStorage) window.memoryStorage = {};
                window.memoryStorage[`collab_board_${boardId}`] = boardData;
                console.log('Board saved to memory storage:', boardId);
                this.updateUrlWithBoardData(boardData);
                return true;
            }
        }
    }
    
    loadBoard(boardId) {
        try {
            const data = localStorage.getItem(`collab_board_${boardId}`);
            if (data) {
                return JSON.parse(data);
            }
        } catch (e) {
            console.warn('localStorage read failed:', e);
        }
        
        try {
            const data = sessionStorage.getItem(`collab_board_${boardId}`);
            if (data) {
                return JSON.parse(data);
            }
        } catch (e) {
            console.warn('sessionStorage read failed:', e);
        }
        
        if (window.memoryStorage && window.memoryStorage[`collab_board_${boardId}`]) {
            return window.memoryStorage[`collab_board_${boardId}`];
        }
        
        console.log('Board not found in any storage:', boardId);
        return null;
    }
    
    // New methods for URL-based data sharing
    updateUrlWithBoardData(boardData) {
        try {
            // Compress and encode board data for URL
            const compressed = this.compressBoardData(boardData);
            const encoded = btoa(compressed);
            
            // Update URL hash without triggering page reload
            const newUrl = `${window.location.pathname}?board=${boardData.boardId}#data=${encoded}`;
            window.history.replaceState({}, '', newUrl);
            
            console.log('URL updated with board data for sharing');
        } catch (e) {
            console.warn('Failed to update URL with board data:', e);
        }
    }
    
    loadBoardFromUrl() {
        try {
            const hash = window.location.hash;
            if (!hash || !hash.includes('data=')) {
                return null;
            }
            
            const encoded = hash.split('data=')[1];
            const compressed = atob(encoded);
            const boardData = this.decompressBoardData(compressed);
            
            console.log('Board loaded from URL:', boardData.boardId);
            
            // Save to localStorage for this browser too
            if (boardData.boardId) {
                try {
                    localStorage.setItem(`collab_board_${boardData.boardId}`, JSON.stringify(boardData));
                } catch (e) {
                    console.warn('Could not save to localStorage:', e);
                }
            }
            
            return boardData;
        } catch (e) {
            console.warn('Failed to load board from URL:', e);
            return null;
        }
    }
    
    compressBoardData(boardData) {
        // Simple JSON stringify - in production, you could use LZString or similar
        return JSON.stringify(boardData);
    }
    
    decompressBoardData(compressed) {
        // Simple JSON parse - matches compression method
        return JSON.parse(compressed);
    }
    
    getShareableUrl() {
        if (!this.currentBoard) return '';
        
        try {
            const compressed = this.compressBoardData(this.currentBoard);
            const encoded = btoa(compressed);
            return `${window.location.origin}${window.location.pathname}?board=${this.boardId}#data=${encoded}`;
        } catch (e) {
            console.warn('Failed to generate shareable URL:', e);
            return `${window.location.origin}${window.location.pathname}?board=${this.boardId}`;
        }
    }
}

// Enhanced Analytics Dashboard Class
class AnalyticsDashboard {
    constructor(app) {
        this.app = app;
        this.charts = {};
    }
    
    renderDashboard() {
        this.updateMetrics();
        this.renderProgressChart();
        this.renderParticipationChart();
        this.renderDecisionsChart();
    }
    
    updateMetrics() {
        const analytics = this.app.calculateMeetingAnalytics();
        const duration = this.calculateMeetingDuration();
        
        const durationEl = document.getElementById('total-duration');
        const efficiencyEl = document.getElementById('efficiency-score');
        const decisionsEl = document.getElementById('decisions-made');
        const consensusEl = document.getElementById('consensus-rate');
        
        if (durationEl) durationEl.textContent = duration;
        if (efficiencyEl) efficiencyEl.textContent = `${analytics.efficiency}%`;
        if (decisionsEl) decisionsEl.textContent = analytics.totalDecisions;
        if (consensusEl) consensusEl.textContent = `${analytics.consensusRate}%`;
    }
    
    calculateMeetingDuration() {
        if (!this.app.meetingStartTime) return '0';
        const start = new Date(this.app.meetingStartTime);
        const now = new Date();
        const diffMinutes = Math.round((now - start) / (1000 * 60));
        return diffMinutes.toString();
    }
    
    renderProgressChart() {
        const ctx = document.getElementById('progress-chart');
        if (!ctx) return;
        
        const totalItems = this.app.currentBoard.agendaItems.length;
        const completedItems = this.app.currentBoard.agendaItems.filter(item => 
            ['approved', 'rejected', 'tied', 'completed'].includes(item.status)
        ).length;
        
        if (this.charts.progress) {
            this.charts.progress.destroy();
        }
        
        this.charts.progress = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Completed', 'Pending'],
                datasets: [{
                    data: [completedItems, totalItems - completedItems],
                    backgroundColor: ['#1FB8CD', '#FFC185']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
    
    renderParticipationChart() {
        const ctx = document.getElementById('participation-chart');
        if (!ctx) return;
        
        const participationData = this.app.currentBoard.participants.map(participant => {
            const votesCount = this.app.currentBoard.agendaItems.reduce((count, item) => {
                return count + (item.userVotes[participant.name] ? 1 : 0);
            }, 0);
            const totalPossible = this.app.currentBoard.agendaItems.filter(item => item.category === 'voting').length;
            return {
                name: participant.name,
                participation: totalPossible > 0 ? Math.round((votesCount / totalPossible) * 100) : 0
            };
        });
        
        if (this.charts.participation) {
            this.charts.participation.destroy();
        }
        
        this.charts.participation = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: participationData.map(p => p.name),
                datasets: [{
                    label: 'Participation %',
                    data: participationData.map(p => p.participation),
                    backgroundColor: '#1FB8CD'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }
    
    renderDecisionsChart() {
        const ctx = document.getElementById('decisions-chart');
        if (!ctx) return;
        
        const approved = this.app.currentBoard.agendaItems.filter(item => item.status === 'approved').length;
        const rejected = this.app.currentBoard.agendaItems.filter(item => item.status === 'rejected').length;
        const completed = this.app.currentBoard.agendaItems.filter(item => item.status === 'completed').length;
        const tied = this.app.currentBoard.agendaItems.filter(item => item.status === 'tied').length;
        const pending = this.app.currentBoard.agendaItems.filter(item => item.status === 'pending').length;
        
        if (this.charts.decisions) {
            this.charts.decisions.destroy();
        }
        
        this.charts.decisions = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Approved', 'Rejected', 'Completed', 'Tied', 'Pending'],
                datasets: [{
                    data: [approved, rejected, completed, tied, pending],
                    backgroundColor: ['#1FB8CD', '#B4413C', '#5D878F', '#FFC185', '#ECEBD5']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
    
    generateReport() {
        const analytics = this.app.calculateMeetingAnalytics();
        return {
            meetingTitle: this.app.currentBoard.title,
            generatedAt: new Date().toISOString(),
            duration: this.calculateMeetingDuration(),
            participants: this.app.currentBoard.participants.length,
            agendaItems: this.app.currentBoard.agendaItems.length,
            votingItems: analytics.votingItemsCount,
            nonVotingItems: analytics.nonVotingItemsCount,
            analytics,
            detailedResults: this.app.currentBoard.agendaItems.map(item => ({
                title: item.title,
                type: item.typeConfig?.name || item.type,
                category: item.category,
                status: item.status,
                votes: item.votes,
                participation: Object.keys(item.userVotes).length
            }))
        };
    }
}

// Initialize the comprehensive CollabBoard app
console.log('Initializing CollabBoard application...');
const app = new CollabBoard();

// Make functions globally available for onclick handlers
window.app = app;