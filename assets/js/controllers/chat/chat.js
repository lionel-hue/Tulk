class ChatManager {
    constructor() {
        this.currentUserId = null;
        this.selectedConversationId = null;
        this.messageInterval = null;
        this.conversationInterval = null;
        this.init();
    }

    async init() {
    
        // Récupérer l'utilisateur actuel
        await this.getCurrentUser();
        
        // Initialiser les événements
        this.setupEventListeners();
        
        // Démarrer les intervalles de mise à jour
        this.startMessagePolling();
        this.startConversationPolling();
        
        // Charger les conversations initiales
        await this.loadConversations();
    }

    async getCurrentUser() {
        try {
            const response = await fetch('/api/user.php');
            const userData = await response.json();
            if (userData !== "error") {
                this.currentUserId = userData.id;
            }
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'utilisateur:', error);
        }
    }

    setupEventListeners() {
        // Événement pour envoyer un message
        const sendBtn = document.querySelector('.chat-send-btn');
        const messageInput = document.querySelector('.chat-input');
        
        if (sendBtn) {
            sendBtn.addEventListener('click', () => this.sendMessage());
        }
        
        if (messageInput) {
            messageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
        }

        // Événements pour sélectionner une conversation
        this.setupConversationSelection();
    }

    setupConversationSelection() {
        const conversationItems = document.querySelectorAll('.chat-container > div');
        conversationItems.forEach((item, index) => {
            item.style.cursor = 'pointer';
            item.addEventListener('click', () => {
                // Extraire l'ID utilisateur ou nom de la conversation
                const userName = item.querySelector('b').textContent.trim();
                this.selectConversation(userName, index + 1); // ID fictif basé sur l'index
            });
        });
    }

    async selectConversation(userName, userId) {
        this.selectedConversationId = userId;
        
        // Mettre à jour l'interface pour montrer la conversation sélectionnée
        document.querySelector('.chat-user').textContent = userName;
        
        // Charger les messages de cette conversation
        await this.loadMessages();
        
        // Masquer le label "Start a conversation" et afficher le chat
        const startLabel = document.querySelector('.start-chat-label');
        if (startLabel) {
            startLabel.style.display = 'block';
        }
    }

    async loadConversations() {
        try {
            const response = await fetch('/api/chat/conversations.php');
            const conversations = await response.json();
            
            if (conversations && conversations.length > 0) {
                this.updateConversationsList(conversations);
            }
        } catch (error) {
            console.error('Erreur lors du chargement des conversations:', error);
        }
    }

    updateConversationsList(conversations) {
        const container = document.querySelector('.chat-container');
        if (!container) return;

        container.innerHTML = '';
        
        conversations.forEach(conversation => {
            const conversationElement = this.createConversationElement(conversation);
            container.appendChild(conversationElement);
        });
        
        // Réattacher les événements
        this.setupConversationSelection();
    }

    createConversationElement(conversation) {
        const div = document.createElement('div');
        div.className = 'mt-3 d-flex justify-content-start align-items-center';
        div.style.cursor = 'pointer';
        
        div.innerHTML = `
            <img src="${conversation.image || './assets/images/default-avatar.png'}" 
                 alt="${conversation.nom}" 
                 style="width:10%;" 
                 class="rounded-circle me-4 ms-1"> 
            <b class="my-auto w-auto text-nowrap me-2">${conversation.nom}</b>
            <p class="w-auto text-nowrap overflow-scroll my-auto mx-0" 
               style="scrollbar-width:none;">${conversation.dernierMessage || 'Aucun message'}</p>
        `;
        
        div.addEventListener('click', () => {
            this.selectConversation(conversation.nom, conversation.id);
        });
        
        return div;
    }

    async loadMessages() {
        if (!this.selectedConversationId) return;

        try {
            const response = await fetch(`/api/chat/messages.php?conversation_id=${this.selectedConversationId}`);
            const messages = await response.json();
            
            if (messages && messages.length > 0) {
                this.updateMessagesDisplay(messages);
            }
        } catch (error) {
            console.error('Erreur lors du chargement des messages:', error);
        }
    }

    updateMessagesDisplay(messages) {
        const messagesContainer = document.querySelector('.chat-messages');
        if (!messagesContainer) return;

        messagesContainer.innerHTML = '';
        
        messages.forEach(message => {
            const messageElement = this.createMessageElement(message);
            messagesContainer.appendChild(messageElement);
        });
        
        // Faire défiler vers le bas
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    createMessageElement(message) {
        const div = document.createElement('div');
        const isCurrentUser = message.id_uti_1 == this.currentUserId;
        
        div.className = `message ${isCurrentUser ? 'sent' : 'received'}`;
        
        div.innerHTML = `
            <div class="message-content">
                ${message.texte}
                ${message.image ? `<img src="${message.image}" alt="Image" style="max-width: 200px; border-radius: 8px;">` : ''}
            </div>
            <span class="message-date">${this.formatDate(message.date)}</span>
        `;
        
        return div;
    }

    async sendMessage() {
        const messageInput = document.querySelector('.chat-input');
        const messageText = messageInput.value.trim();
        
        if (!messageText || !this.selectedConversationId) return;

        try {
            const formData = new FormData();
            formData.append('texte', messageText);
            formData.append('id_uti_2', this.selectedConversationId);
            
            const response = await fetch('/api/chat/send_message.php', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                messageInput.value = '';
                // Les messages seront mis à jour par le polling
            } else {
                console.error('Erreur lors de l\'envoi du message:', result.error);
            }
        } catch (error) {
            console.error('Erreur lors de l\'envoi du message:', error);
        }
    }

    startMessagePolling() {
        // Mettre à jour les messages toutes les 2 secondes
        this.messageInterval = setInterval(() => {
            if (this.selectedConversationId) {
                this.loadMessages();
            }
        }, 2000);
    }

    startConversationPolling() {
        // Mettre à jour la liste des conversations toutes les 10 secondes
        this.conversationInterval = setInterval(() => {
            this.loadConversations();
        }, 10000);
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleTimeString('fr-FR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }

    destroy() {
        // Nettoyer les intervalles
        if (this.messageInterval) {
            clearInterval(this.messageInterval);
        }
        if (this.conversationInterval) {
            clearInterval(this.conversationInterval);
        }
    }
}

// Initialiser le chat manager
let chatManager;

export function initChat() {
    chatManager = new ChatManager();
}

export function destroyChat() {
    if (chatManager) {
        chatManager.destroy();
    }
}