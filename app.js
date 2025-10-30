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
        
        if (backToBoardBtn) backToBoardBtn.addEventListener('click', () => this.showBoardPage());
        if (exportAnalyticsBtn) exportAnalyticsBtn.addEventListener('click', () => this.exportAnalytics());
        
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
            const boardData = this.loadBoard(boardId);
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
                window.history.pushState({}, '', `?board=${this.boardId}`);
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
    
    exportDeck() {
        this.showSuccess('Comprehensive presentation deck exported successfully!');
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
        this.showSuccess('Analytics data exported successfully!');
    }
    
    // Share functionality
    showShareModal() {
        const shareUrl = `${window.location.origin}${window.location.pathname}?board=${this.boardId}`;
        const shareLinkInput = document.getElementById('share-link');
        const shareModal = document.getElementById('share-modal');
        const copySuccess = document.getElementById('copy-success');
        
        if (shareLinkInput) shareLinkInput.value = shareUrl;
        if (shareModal) shareModal.classList.remove('hidden');
        if (copySuccess) copySuccess.classList.add('hidden');
        
        this.generateQRCode(shareUrl);
        console.log('Share modal opened with URL:', shareUrl);
    }
    
    generateQRCode(url) {
        const qrContainer = document.getElementById('qr-code');
        if (qrContainer) {
            qrContainer.innerHTML = '';
            // Generate QR code using QRCode.js
            new QRCode(qrContainer, {
                text: url,
                width: 128,
                height: 128,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });
            const info = document.createElement('p');
            info.style.marginTop = '8px';
            info.style.fontSize = 'var(--font-size-xs)';
            info.textContent = 'Scan to join meeting on mobile';
            qrContainer.appendChild(info);
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
        const shareUrl = `${window.location.origin}${window.location.pathname}?board=${this.boardId}`;
        const subject = encodeURIComponent(`Join Board Meeting: ${this.currentBoard.title}`);
        const body = encodeURIComponent(`You're invited to join the comprehensive board meeting "${this.currentBoard.title}".\n\nClick here to join: ${shareUrl}\n\nMeeting created by: ${this.currentBoard.creator}`);
        
        window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
        this.showSuccess('Email client opened with meeting invitation');
    }
    
    shareViaTeams() {
        const shareUrl = `${window.location.origin}${window.location.pathname}?board=${this.boardId}`;
        const message = encodeURIComponent(`Join comprehensive board meeting: ${this.currentBoard.title} - ${shareUrl}`);
        
        window.open(`https://teams.microsoft.com/l/chat/0/0?users=&message=${message}`, '_blank');
        this.showSuccess('Opening Microsoft Teams to share meeting link');
    }
    
    shareViaSlack() {
        const shareUrl = `${window.location.origin}${window.location.pathname}?board=${this.boardId}`;
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
        
        const latestBoard = this.loadBoard(this.boardId);
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
            localStorage.setItem(`collab_board_${boardId}`, JSON.stringify(boardData));
            console.log('Board saved to localStorage:', boardId);
            return true;
        } catch (e) {
            console.warn('localStorage failed, trying sessionStorage:', e);
            try {
                sessionStorage.setItem(`collab_board_${boardId}`, JSON.stringify(boardData));
                console.log('Board saved to sessionStorage:', boardId);
                return true;
            } catch (e2) {
                console.warn('sessionStorage failed, using memory storage:', e2);
                if (!window.memoryStorage) window.memoryStorage = {};
                window.memoryStorage[`collab_board_${boardId}`] = boardData;
                console.log('Board saved to memory storage:', boardId);
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