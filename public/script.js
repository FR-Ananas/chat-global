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
const userMenuBtn = document.getElementById('user-menu-btn');
const userPopup = document.getElementById('user-popup');
const closeUserPopupBtn = document.getElementById('close-user-popup');
const settingsBtn = document.getElementById('settings-btn');
const settingsPopup = document.getElementById('settings-popup');
const closeSettingsBtn = document.getElementById('close-settings');
const changeUsernameBtn = document.getElementById('change-username-btn');
const changeUsernamePopup = document.getElementById('change-username-popup');
const saveUsernameBtn = document.getElementById('save-username-btn');
const newUsernameInput = document.getElementById('new-username');
const closeUsernamePopupBtn = document.getElementById('close-username-popup');
const changeThemeBtn = document.getElementById('change-theme-btn');
const colorPopup = document.getElementById('color-popup');
const closeColorPopupBtn = document.getElementById('close-color-popup');
const colors = document.querySelectorAll('.color');

let currentColor = '#000000';

// Fonctions pour ouvrir/fermer les popups
function showPopup(popup) {
  popup.style.display = 'block';
}

function closePopup(popup) {
  popup.style.display = 'none';
}

// Gestion des événements des boutons
loginBtn.addEventListener('click', () => {
  const username = usernameInput.value.trim();
  if (username) {
    socket.emit('newUser', username);
    loginDiv.style.display = 'none';
    chatDiv.style.display = 'block';
  }
});

sendBtn.addEventListener('click', () => {
  const message = messageInput.value.trim();
  if (message) {
    socket.emit('message', { message });
    messageInput.value = '';
  }
});

// Plus d'éléments peuvent être ajoutés pour gérer les utilisateurs connectés.
