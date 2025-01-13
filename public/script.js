const socket = io();

// Récupération des éléments du DOM
const loginDiv = document.getElementById('login');
const chatDiv = document.getElementById('chat');
const usernameInput = document.getElementById('username');
const messageInput = document.getElementById('message');
const messagesDiv = document.getElementById('messages');
const userList = document.getElementById('user-list');
const popup = document.getElementById('popup');
const loginBtn = document.getElementById('login-btn');
const sendBtn = document.getElementById('send-btn');
const toggleUsersBtn = document.getElementById('toggle-users-btn');
const userListContainer = document.getElementById('user-list-container');

let users = {};

// Fonction pour afficher un message dans le chat
function displayMessage(username, message) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message');
  messageDiv.innerHTML = `<span>${username} :</span> ${message}`;
  messagesDiv.appendChild(messageDiv);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Fonction pour afficher une notification pop-up
function showPopup(message) {
  popup.textContent = message;
  popup.style.display = 'block';
  setTimeout(() => {
    popup.style.display = 'none';
  }, 3000);
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

    if (status === 'disconnected') {
      setTimeout(() => {
        delete users[id];
        updateUserList();
      }, 3000);
    }
  }
}

// Basculer l'affichage du menu utilisateur
toggleUsersBtn.addEventListener('click', () => {
  userListContainer.style.display =
    userListContainer.style.display === 'none' ? 'block' : 'none';
});

// Gestion de la connexion
loginBtn.addEventListener('click', () => {
  const username = usernameInput.value.trim();
  if (username) {
    socket.emit('newUser', username);
    loginDiv.style.display = 'none';
    chatDiv.style.display = 'block';
  }
});

// Gestion des messages envoyés
sendBtn.addEventListener('click', () => {
  const message = messageInput.value.trim();
  if (message) {
    socket.emit('message', message);
    messageInput.value = '';
  }
});

// Mise à jour des utilisateurs et affichage des pop-ups
socket.on('updateUsers', (serverUsers) => {
  users = serverUsers;
  updateUserList();
});

// Gestion des notifications utilisateur
socket.on('userNotification', (notification) => {
  showPopup(notification);
});

// Gestion des messages reçus
socket.on('message', ({ username, message }) => {
  displayMessage(username, message);
});
