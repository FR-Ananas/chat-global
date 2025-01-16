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
const fontPopup = document.getElementById('font-popup');
const closeFontPopupBtn = document.getElementById('close-font-popup');
const fontSizePopup = document.getElementById('font-size-popup');
const closeFontSizePopupBtn = document.getElementById('close-font-size-popup');
const fontBtns = document.querySelectorAll('.font-btn');
const fontSizeBtns = document.querySelectorAll('.font-size-btn');
const colors = document.querySelectorAll('.color');

let currentColor = '#000000';
let currentFont = 'Arial';
let currentFontSize = 'medium';

// Fonction pour afficher un pop-up
function showPopup(popup) {
  popup.style.display = 'block';
}

// Fonction pour fermer un pop-up
function closePopup(popup) {
  popup.style.display = 'none';
}

// Ouvrir le pop-up de paramètres
settingsBtn.addEventListener('click', () => {
  showPopup(settingsPopup);
});

// Fermer le pop-up de paramètres
closeSettingsBtn.addEventListener('click', () => {
  closePopup(settingsPopup);
});

// Ouvrir le pop-up pour changer le pseudo
changeUsernameBtn.addEventListener('click', () => {
  showPopup(changeUsernamePopup);
});

// Fermer le pop-up pour changer le pseudo
closeUsernamePopupBtn.addEventListener('click', () => {
  closePopup(changeUsernamePopup);
});

// Sauvegarder le nouveau pseudo
saveUsernameBtn.addEventListener('click', () => {
  const newUsername = newUsernameInput.value.trim();
  if (newUsername && newUsername.length <= 15) { // Limiter à 15 caractères
    // Émettre le pseudo au serveur
    socket.emit('newUser', newUsername);
    closePopup(changeUsernamePopup);
  } else {
    alert('Le pseudo doit être compris entre 1 et 15 caractères.');
  }
});

// Ouvrir le pop-up de couleur
changeThemeBtn.addEventListener('click', () => {
  showPopup(colorPopup);
});

// Fermer le pop-up de couleur
closeColorPopupBtn.addEventListener('click', () => {
  closePopup(colorPopup);
});

// Choisir une couleur
colors.forEach(colorDiv => {
  colorDiv.addEventListener('click', () => {
    currentColor = colorDiv.style.backgroundColor;
    document.body.style.color = currentColor;
    closePopup(colorPopup);
  });
});

// Ouvrir le pop-up de la police
fontBtns.forEach(fontBtn => {
  fontBtn.addEventListener('click', (e) => {
    currentFont = e.target.dataset.font;
    document.body.style.fontFamily = currentFont;
    closePopup(fontPopup);
  });
});

// Ouvrir le pop-up de la taille de police
fontSizeBtns.forEach(fontSizeBtn => {
  fontSizeBtn.addEventListener('click', (e) => {
    currentFontSize = e.target.dataset.size;
    document.body.style.fontSize = currentFontSize === 'small' ? '12px' : currentFontSize === 'medium' ? '16px' : '20px';
    closePopup(fontSizePopup);
  });
});

// Connexion de l'utilisateur (cacher le formulaire de login et afficher le chat)
loginBtn.addEventListener('click', () => {
  const username = usernameInput.value.trim();
  if (username && username.length <= 15) {
    socket.emit('newUser', username);
    loginPopup.style.display = 'none';
    chatDiv.style.display = 'block';
    usernameInput.value = ''; // Réinitialiser le champ de pseudo
  } else {
    alert('Le pseudo doit être compris entre 1 et 15 caractères.');
  }
});

// Affichage des messages du serveur
socket.on('message', (data) => {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message');
  messageDiv.innerHTML = `<span>${data.username} :</span> ${data.message}`;
  messagesDiv.appendChild(messageDiv);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

// Mettre à jour la liste des utilisateurs
socket.on('updateUsers', (users) => {
  userList.innerHTML = '';
  Object.values(users).forEach(user => {
    const userItem = document.createElement('li');
    userItem.textContent = user.username;
    userList.appendChild(userItem);
  });
  userCount.textContent = Object.keys(users).length;
});

// Afficher les notifications de l'utilisateur
socket.on('userNotification', (message) => {
  const notification = document.createElement('div');
  notification.classList.add('message');
  notification.textContent = message;
  messagesDiv.appendChild(notification);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});
