// Contrôleur principal pour la page chat
import { initChat, destroyChat } from './chat.js';


export async function initChatPage() {
    // Initialiser le gestionnaire de chat
    initChat();
    
    // Ajouter les styles CSS si nécessaire
    addChatStyles();
}

export function destroyChatPage() {
    // Nettoyer les ressources du chat
    destroyChat();
}

function addChatStyles() {
    // Ajouter des styles supplémentaires si nécessaire
    const style = document.createElement('style');
    style.textContent = `
        .message {
            margin-bottom: 15px;
            max-width: 70%;
        }
        
        .message.sent {
            margin-left: auto;
            text-align: right;
        }
        
        .message.received {
            margin-right: auto;
            text-align: left;
        }
        
        .message-content {
            background-color: #f1f3f4;
            padding: 10px 15px;
            border-radius: 18px;
            display: inline-block;
            word-wrap: break-word;
        }
        
        .message.sent .message-content {
            background-color: #0084ff;
            color: white;
        }
        
        .message-date {
            font-size: 11px;
            color: #65676b;
            margin-top: 5px;
            display: block;
        }
        
        .chat-messages {
            height: 400px;
            overflow-y: auto;
            padding: 15px;
            background-color: #f8f9fa;
        }
        
        .chat-input-area {
            padding: 15px;
            border-top: 1px solid #e4e6ea;
            display: flex;
            gap: 10px;
            align-items: center;
        }
        
        .chat-input {
            flex: 1;
            border: 1px solid #ccd0d5;
            border-radius: 20px;
            padding: 8px 15px;
            outline: none;
        }
        
        .chat-send-btn {
            background-color: #0084ff;
            color: white;
            border: none;
            border-radius: 50%;
            width: 36px;
            height: 36px;
            cursor: pointer;
        }
        
        .chat-image-btn {
            background: none;
            border: none;
            cursor: pointer;
            padding: 5px;
        }
        
        .chat-image-btn img {
            width: 24px;
            height: 24px;
        }
        
        .conversation-item:hover {
            background-color: #f2f3f5;
        }
    `;
    
    document.head.appendChild(style);
}