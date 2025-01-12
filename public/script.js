const socket = io();

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
