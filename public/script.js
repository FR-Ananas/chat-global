// Connexion au serveur Socket.IO
const socket = io();

// Récupération des éléments du DOM
const loginDiv = document.getElementById('login');
const chatDiv = document.getElementById('chat');
const usernameInput = document.getElementById('username');
const messageInput = document.getElementById('message');
const messagesDiv = document.getElementById('messages');
const userList = document.getElementById('user-list');
const loginBtn = document.getElementById('login-btn');
const sendBtn = document.getElementById('send-btn');

// Liste locale des utilisateurs
let users = {};

// Fonction pour afficher un message dans le chat
function displayMessage(username, message) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message');
  messageDiv.innerHTML = `<span>${username} :</span> ${message}`;
  messagesDiv.appendChild(messageDiv);
  messagesDiv.scrollTop = messagesDiv.scrollHeight; // Faites défiler vers le bas
}

// Fonction pour mettre à jour la liste des utilisateurs
function updateUserList() {
  userList.innerHTML = '';
  for (const [id, { username, status }] of Object.entries(users)) {
    const userItem = document.createElement('li');
    userItem.innerHTML = `
      <span class="status ${status === 'connected' ? 'green' : 'red'}"></span>
      ${username}
    `;
    userList.appendChild(userItem);

    // Supprimer l'utilisateur déconnecté après 3 secondes
    if (status === 'disconnected') {
      setTimeout(() => {
        delete users[id];
        updateUserList();
      }, 3000);
    }
  }
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

// Mise à jour de la liste des utilisateurs lorsqu'un nouvel utilisateur se connecte
socket.on('userJoined', (data) => {
  users[data.id] = { username: data.username, status: 'connected' };
  updateUserList();
});

// Mise à jour de la liste des utilisateurs lorsqu'un utilisateur se déconnecte
socket.on('userLeft', (data) => {
  if (users[data.id]) {
    users[data.id].status = 'disconnected';
    updateUserList();
  }
});
