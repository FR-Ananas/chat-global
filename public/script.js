const socket = io();

const loginDiv = document.getElementById('login');
const loginPopup = document.getElementById('login-popup');
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

let users = {};

function showPopup(message, isError = false) {
  popup.textContent = message;
  popup.classList.toggle('error', isError);
  popup.style.display = 'block';
  setTimeout(() => popup.style.display = 'none', 3000);
}

function updateUserList() {
  userList.innerHTML = '';  // Clear existing list
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
    socket.emit('newUser', username);
    loginPopup.style.display = 'none';
    chatDiv.style.display = 'block';
    messageInput.disabled = false;
    sendBtn.disabled = false;
  }
});

sendBtn.addEventListener('click', () => {
  const message = messageInput.value.trim();
  const username = usernameInput.value.trim();
  if (message) {
    socket.emit('message', { username, message });
    messageInput.value = '';
  }
});

socket.on('message', (data) => {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message');

  // On extrait correctement les propriétés username et message du data reçu
  messageDiv.innerHTML = `<span>${data.username} :</span> ${data.message}`;
  
  messagesDiv.appendChild(messageDiv);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

socket.on('userNotification', (message) => {
  showPopup(message);
});

socket.on('updateUsers', (usersList) => {
  users = usersList;  // Update the users object
  updateUserList();  // Update the user list in the UI
});

socket.on('disconnect', () => {
  showPopup('Vous avez été déconnecté.', true);
});
