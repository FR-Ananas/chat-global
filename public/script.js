// Connexion au serveur Socket.IO
const socket = io();

// Récupération des éléments du DOM
const loginDiv = document.getElementById('login');
const chatDiv = document.getElementById('chat');
const usernameInput = document.getElementById('username');
const messageInput = document.getElementById('message');
const messagesDiv = document.getElementById('messages');
const loginBtn = document.getElementById('login-btn');
const sendBtn = document.getElementById('send-btn');

// Fonction pour afficher un message dans le chat
function displayMessage(username, message) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message');
  messageDiv.innerHTML = `<span>${username} :</span> ${message}`;
  messagesDiv.appendChild(messageDiv);
  messagesDiv.scrollTop = messagesDiv.scrollHeight; // Faites défiler vers le bas
}

// Lorsque l'utilisateur clique sur "Se connecter"
loginBtn.addEventListener('click', () => {
  const username = usernameInput.value.trim();
  if (username) {
    socket.emit('newUser', username); // Envoi du pseudo au serveur
    loginDiv.style.display = 'none'; // Masquer la page de connexion
    chatDiv.style.display = 'block'; // Afficher la zone de chat
  }
});

// Lorsque l'utilisateur clique sur "Envoyer"
sendBtn.addEventListener('click', () => {
  const message = messageInput.value.trim();
  const username = usernameInput.value.trim();
  if (message) {
    socket.emit('message', { username, message }); // Envoi du message au serveur
    messageInput.value = ''; // Réinitialiser l'input
  }
});

// Recevoir les messages du serveur
socket.on('message', (data) => {
  displayMessage(data.username, data.message);
});

// Recevoir la notification d'un nouvel utilisateur ou de quelqu'un qui se déconnecte
socket.on('userJoined', (username) => {
  displayMessage('Système', `${username} a rejoint le chat.`);
});
