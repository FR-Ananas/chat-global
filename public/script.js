const socket = io();

let username = '';

// Gérer l'affichage des utilisateurs
const userMenuBtn = document.getElementById('user-menu-btn');
const userPopup = document.getElementById('user-popup');
const closeUserPopupBtn = document.getElementById('close-user-popup');
const usersList = document.getElementById('users');
const userCount = document.getElementById('user-count');

// Lorsqu'un utilisateur clique sur "Voir les utilisateurs"
userMenuBtn.addEventListener('click', () => {
  userPopup.style.display = 'block';
});

// Fermer la fenêtre pop-up des utilisateurs
closeUserPopupBtn.addEventListener('click', () => {
  userPopup.style.display = 'none';
});

// Gérer la connexion d'un utilisateur
const loginBtn = document.getElementById('login-btn');
const usernameInput = document.getElementById('username');
const chatDiv = document.getElementById('chat');
const loginPopup = document.getElementById('login-popup');

loginBtn.addEventListener('click', () => {
  username = usernameInput.value.trim();
  if (username) {
    socket.emit('newUser', username);
    loginPopup.style.display = 'none';
    chatDiv.style.display = 'block';
  }
});

// Mettre à jour la liste des utilisateurs
socket.on('updateUsers', (users) => {
  usersList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerHTML = `<span class="status" style="background-color: ${user.status === 'connected' ? '#28a745' : '#dc3545'};"></span>${user.username}`;
    usersList.appendChild(li);
  });
  userCount.textContent = users.length;
});

// Gérer l'envoi des messages
const messageInput = document.getElementById('message');
const sendBtn = document.getElementById('send-btn');
sendBtn.addEventListener('click', () => {
  const message = messageInput.value.trim();
  if (message) {
    socket.emit('message', { message });
    messageInput.value = '';
  }
});

socket.on('message', ({ username, message }) => {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message');
  messageDiv.innerHTML = `<span>${username}:</span> ${message}`;
  document.getElementById('messages').appendChild(messageDiv);
});
