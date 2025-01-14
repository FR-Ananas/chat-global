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
const userCount = document.getElementById('user-count');
const userPopup = document.getElementById('user-popup');
const toggleUserMenuBtn = document.getElementById('toggle-user-menu-btn');

let users = {};

function showPopup(message, isError = false) {
  const popup = document.createElement('div');
  popup.classList.add('popup');
  popup.textContent = message;
  popup.classList.toggle('error', isError);
  document.body.appendChild(popup);
  setTimeout(() => popup.remove(), 3000);
}

function updateUserList() {
  userList.innerHTML = '';  // Clear existing list
  let onlineUsers = 0;

  for (let id in users) {
    const user = users[id];
    const li = document.createElement('li');
    const status = document.createElement('div');
    status.classList.add('status');
    status.style.backgroundColor = user.status === 'connected' ? 'green' : 'orange'; // Green for connected, orange for disconnecting
    const username = document.createElement('span');
    username.classList.add('user');
    username.textContent = user.username;

    li.appendChild(status);
    li.appendChild(username);
    userList.appendChild(li);

    if (user.status === 'connected') {
      onlineUsers++;
    }
  }

  // Update user count
  userCount.textContent = onlineUsers;
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

toggleUserMenuBtn.addEventListener('click', () => {
  userPopup.style.display = userPopup.style.display === 'flex' ? 'none' : 'flex';
});

socket.on('message', (data) => {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message');
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
