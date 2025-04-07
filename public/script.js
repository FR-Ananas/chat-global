const socket = io();

const username = localStorage.getItem('username');
const chatBox = document.getElementById('chatBox');
const messageInput = document.getElementById('messageInput');
const usersModal = document.getElementById('usersModal');
const usersList = document.getElementById('usersList');

// Couleur générée aléatoirement pour les bulles de chaque utilisateur
// On va garder des couleurs par défaut pour les bulles
const defaultBubbleColor = '#e0f7fa'; // Couleur bleue claire pour les messages

if (!username) {
    window.location.href = 'index.html';
}

// Signal au serveur qu'un nouvel utilisateur s'est connecté
socket.emit('newUser', { username });
socket.username = username;

// Mise à jour des messages
socket.on('message', (data) => {
    const messageElement = document.createElement('div');
    messageElement.textContent = `${data.username}: ${data.message}`;
    messageElement.classList.add('chat-message');
    
    // Appliquer la couleur de fond par défaut pour toutes les bulles
    messageElement.style.backgroundColor = defaultBubbleColor;

    if (data.username === socket.username) {
        messageElement.classList.add('user'); // Bulle à droite pour l'utilisateur
    }
    
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
});

// Mise à jour de la liste des utilisateurs connectés
socket.on('userList', (users) => {
    usersList.innerHTML = '';
    users.forEach((user) => {
        const li = document.createElement('li');
        li.textContent = user.username;
        usersList.appendChild(li);
    });
});

// Envoi d'un message
document.getElementById('sendMessage').addEventListener('click', () => {
    const message = messageInput.value.trim();
    if (message) {
        socket.emit('message', { username, message });
        messageInput.value = '';
    }
});

// Ouverture du modal des utilisateurs
document.getElementById('showUsers').addEventListener('click', () => {
    usersModal.classList.remove('hidden');
    usersModal.classList.add('slide-in');
});

document.querySelectorAll('.closeModal').forEach((button) => {
    button.addEventListener('click', () => {
        usersModal.classList.add('hidden');
        // Enlever l'animation après la fermeture
        usersModal.classList.remove('slide-in');
    });
});

// Signaler la déconnexion lors de la fermeture de la page
window.addEventListener('beforeunload', () => {
    socket.emit('disconnectUser', username);
});
