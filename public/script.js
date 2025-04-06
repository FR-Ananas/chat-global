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

// Couleur générée aléatoirement pour les bulles de chaque utilisateur
const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

if (!username) {
    window.location.href = 'index.html';
}

// Signal au serveur qu'un nouvel utilisateur s'est connecté avec sa couleur
const userColor = getRandomColor();
socket.emit('newUser', { username, color: userColor });
socket.username = username;
socket.userColor = userColor;

// Mise à jour des messages
socket.on('message', (data) => {
    const messageElement = document.createElement('div');
    messageElement.textContent = `${data.username}: ${data.message}`;
    messageElement.classList.add('chat-message');
    
    // Appliquer la couleur de fond unique (bulles) pour chaque utilisateur
    messageElement.style.backgroundColor = data.color;

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
        li.style.color = user.color; // Appliquer la couleur unique de chaque utilisateur
        usersList.appendChild(li);
    });
});

// Envoi d'un message
document.getElementById('sendMessage').addEventListener('click', () => {
    const message = messageInput.value.trim();
    if (message) {
        socket.emit('message', { username, message, color: socket.userColor });
        messageInput.value = '';
    }
});

// Ouverture et fermeture des modals avec animation
document.getElementById('showUsers').addEventListener('click', () => {
    usersModal.classList.remove('hidden');
    usersModal.classList.add('slide-in');
});

document.getElementById('settings').addEventListener('click', () => {
    settingsModal.classList.remove('hidden');
    settingsModal.classList.add('slide-in');
});

document.querySelectorAll('.closeModal').forEach((button) => {
    button.addEventListener('click', () => {
        usersModal.classList.add('hidden');
        settingsModal.classList.add('hidden');
        // Enlever l'animation après la fermeture
        usersModal.classList.remove('slide-in');
        settingsModal.classList.remove('slide-in');
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
