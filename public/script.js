const socket = io();

const loginPopup = document.getElementById('login-popup');
const chatDiv = document.getElementById('chat');
const usernameInput = document.getElementById('username');
const messageInput = document.getElementById('message');
const messagesDiv = document.getElementById('messages');
const loginBtn = document.getElementById('login-btn');
const sendBtn = document.getElementById('send-btn');
const userMenuBtn = document.getElementById('user-menu-btn');
const userPopup = document.getElementById('user-popup');
const closeUserPopupBtn = document.getElementById('close-user-popup');
const roomInput = document.getElementById('room');
const joinRoomBtn = document.getElementById('join-room-btn');
const userList = document.getElementById('users');
const userCount = document.getElementById('user-count');

let users = {};

function showPopup(message, isError = false) {
  const popup = document.createElement('div');
  popup.classList.add('popup', isError ? 'error' : '');
  popup.textContent = message;
  document.body.appendChild(popup);
  setTimeout(() => popup.remove(), 3000);
}

function updateUserList() {
  userList.innerHTML = '';
  const onlineUsers = Object.values(users).filter(user => user.status === 'connected').length;
  userCount.textContent = onlineUsers;

  Object.values(users).forEach(user => {
    const li = document.createElement('li');
    li.innerHTML = `<div class="status" style="background-color: ${user.status === 'connected' ? 'green' : 'orange'};"></div><span class="user">${user.username}</span>`;
    userList.appendChild(li);
  });
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

joinRoomBtn.addEventListener('click', () => {
  const room = roomInput.value.trim();
  if (room) {
    socket.emit('joinRoom', room);
    roomInput.value = '';
  }
});

sendBtn.addEventListener('click', () => {
  const message = messageInput.value.trim();
  if (message) {
    socket.emit('message', { message });
    messageInput.value = '';
  }
});

socket.on('message', (data) => {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message');
  messageDiv.innerHTML = `<span>${data.username} :</span> ${data.message}`;
  messagesDiv.appendChild(messageDiv);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

socket.on('userNotification', showPopup);
socket.on('updateUsers', (usersList) => {
  users = usersList;
  updateUserList();
});
