const socket = io();

const username = localStorage.getItem('username');
const chatBox = document.getElementById('chatBox');
const messageInput = document.getElementById('messageInput');
const usersModal = document.getElementById('usersModal');
const settingsModal = document.getElementById('settingsModal');
const usersList = document.getElementById('usersList');

const textColorInput = document.getElementById('textColor');
const bgColorInput = document.getElementById('bgColor');
const textSizeInput = document.getElementById('textSize');

if (!username) {
    window.location.href = 'index.html';
}

// Signal au serveur qu'un nouvel utilisateur s'est connecté
socket.emit('newUser', username);
socket.username = username;

// Mise à jour des messages
socket.on('message', (data) => {
    const messageElement = document.createElement('div');
    messageElement.textContent = `${data.username}: ${data.message}`;
    messageElement.classList.add('chat-message');
    
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
        li.textContent = user;
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

// Gestion du bouton "Déconnexion"
document.getElementById('disconnect').addEventListener('click', () => {
    socket.emit('disconnectUser', username);
    localStorage.clear();
    window.location.href = 'index.html';
});

// Ouverture et fermeture des modals
document.getElementById('showUsers').addEventListener('click', () => {
    usersModal.classList.remove('hidden');
});

document.getElementById('settings').addEventListener('click', () => {
    settingsModal.classList.remove('hidden');
});

document.querySelectorAll('.closeModal').forEach((button) => {
    button.addEventListener('click', () => {
        usersModal.classList.add('hidden');
        settingsModal.classList.add('hidden');
    });
});

// Personnalisation des paramètres
textColorInput.addEventListener('input', () => {
    chatBox.style.color = textColorInput.value;
});

bgColorInput.addEventListener('input', () => {
    chatBox.style.backgroundColor = bgColorInput.value;
    document.body.style.backgroundColor = bgColorInput.value; // ← Ajout du fond global
});

textSizeInput.addEventListener('change', () => {
    chatBox.style.fontSize = `${textSizeInput.value}px`;
});

// Signaler la déconnexion lors de la fermeture de la page
window.addEventListener('beforeunload', () => {
    socket.emit('disconnectUser', username);
});
