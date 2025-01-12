const socket = io();
let username = '';

// Fonction pour afficher un message dans la fenêtre de chat
function displayMessage(message, type) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', type);
    messageElement.textContent = message;
    document.getElementById('messages').appendChild(messageElement);
    // Scroll automatique vers le bas
    const messagesContainer = document.getElementById('messages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Afficher le popup pour choisir un pseudo
document.getElementById('popup').style.display = 'flex';

// Gérer la saisie du pseudo
document.getElementById('set-username-button').addEventListener('click', () => {
    const inputUsername = document.getElementById('username').value.trim();
    if (inputUsername) {
        username = inputUsername; // Récupérer le pseudo
        document.getElementById('popup').style.display = 'none'; // Masquer le popup
        document.getElementById('chat-window').style.display = 'block'; // Afficher la fenêtre de chat
        socket.emit('new user', username); // Envoyer le pseudo au serveur
    } else {
        alert("Veuillez entrer un pseudo valide.");
    }
});

// Écoute de la touche "Entrée" pour soumettre le pseudo
document.getElementById('username').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const inputUsername = document.getElementById('username').value.trim();
        if (inputUsername) {
            username = inputUsername; // Récupérer le pseudo
            document.getElementById('popup').style.display = 'none'; // Masquer le popup
            document.getElementById('chat-window').style.display = 'block'; // Afficher la fenêtre de chat
            socket.emit('new user', username); // Envoyer le pseudo au serveur
        } else {
            alert("Veuillez entrer un pseudo valide.");
        }
    }
});

// Envoi d'un message au serveur lorsque l'utilisateur appuie sur le bouton "Envoyer"
document.getElementById('send-button').addEventListener('click', () => {
    const message = document.getElementById('message-input').value;
    if (message.trim()) {
        socket.emit('chat message', message);
        displayMessage(message, 'sent');
        document.getElementById('message-input').value = ''; // Vide le champ
    }
});

// Réception d'un message du serveur
socket.on('chat message', (msg) => {
    displayMessage(msg, 'received');
});
