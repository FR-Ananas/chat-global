const socket = io();

const loginDiv = document.getElementById('login');
const chatDiv = document.getElementById('chat');
const usernameInput = document.getElementById('username');
const messageInput = document.getElementById('message');
const messagesDiv = document.getElementById('messages');
const loginBtn = document.getElementById('login-btn');
const sendBtn = document.getElementById('send-btn');
const userList = document.getElementById('users');
const popup = document.createElement('div');
popup.classList.add('popup');
document.body.appendChild(popup);

const users = {};

function showPopup(message, isError = false) {
  popup.textContent = message;
  popup.classList.toggle('error', isError);
  popup.style.display = 'block';
  setTimeout(() => popup.style.display = 'none', 3000);
}

function updateUserList() {
  userList.innerHTML = '';
  for (let id in users) {
    const user = users[id];
    const li = document.createElement('li');
    const status = document.createElement('div');
    status.classList.add('status');
    status.style.backgroundColor = user.status === 'connected' ? 'green' : 'red';
    const username = document.createElement('span');
    username.classList.add('user');
    username.textContent = user.username;

    li.appendChild(status);
    li.appendChild(username);
    userList.appendChild(li);
  }
}

loginBtn.addEventListener('click', () => {
  const username = usernameInput.value.trim();
  if (username) {
    socket.emit('newUser', username);  // Envoi du pseudo au serveur
    users[username] = { username, status: 'connected' };  // Ajouter l'utilisateur à la liste
    loginDiv.style.display = 'none';  // Masquer le formulaire de connexion
    chatDiv.style.display = 'block';  // Afficher le chat
  }
});

sendBtn.addEventListener('click', () => {
  const message = messageInput.value.trim();
  const username = usernameInput.value.trim();
  if (message) {
    socket.emit('message', { username, message });  // Envoi du message au serveur
    messageInput.value = '';  // Réinitialiser le champ de texte
  }
});

socket.on('message', (data) => {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message');
  messageDiv.innerHTML = `<span>${data.username} :</span> ${data.message}`;
  messagesDiv.appendChild(messageDiv);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;  // Faire défiler vers le bas
});

socket.on('userNotification', (message) => {
  showPopup(message);
});

socket.on('updateUsers', (users) => {
  updateUserList();
});

socket.on('disconnect', () => {
  showPopup('Vous avez été déconnecté.', true);
});
