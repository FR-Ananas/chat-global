// Connexion au serveur WebSocket via Socket.io
const socket = io();

// Initialisation des éléments DOM
const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');

// Événement de soumission du formulaire pour se connecter
loginForm.addEventListener('submit', (event) => {
  event.preventDefault(); // Empêche l'envoi du formulaire par défaut
  const username = usernameInput.value.trim();

  if (username) {
    localStorage.setItem('username', username);
    window.location.href = 'channels.html'; // Redirige vers la page des canaux
  } else {
    alert('Veuillez entrer un pseudo valide!');
  }
});

// Vérifier si l'utilisateur est déjà connecté (présence du pseudo dans localStorage)
const storedUsername = localStorage.getItem('username');
if (storedUsername) {
  // Si l'utilisateur est déjà connecté, redirige vers la page des canaux
  window.location.href = 'channels.html';
}

// Quand l'utilisateur se connecte au chat, rejoindre un canal
socket.on('connect', () => {
  const username = localStorage.getItem('username');
  if (username) {
    // L'utilisateur rejoint un canal (par défaut 'Global')
    const currentChannel = localStorage.getItem('channel') || 'Global';
    socket.emit('joinChannel', { username, channel: currentChannel });
  }
});

// Gérer la déconnexion
function disconnectUser() {
  const username = localStorage.getItem('username');
  socket.emit('disconnectUser', username);
  localStorage.removeItem('username');
  window.location.href = 'index.html';
}

// Gestion du bouton de déconnexion sur la page du chat
const disconnectButton = document.getElementById('disconnect');
if (disconnectButton) {
  disconnectButton.addEventListener('click', () => {
    disconnectUser();
  });
}

// Quand un utilisateur est déconnecté
socket.on('userDisconnected', (username) => {
  console.log(`${username} a quitté le chat.`);
  // Mettez à jour la liste des utilisateurs en ligne dans le chat
});

// Gérer l'affichage des utilisateurs en ligne (dans le pop-up)
const usersButton = document.getElementById('showUsers');
const usersModal = document.getElementById('usersModal');
const usersList = document.getElementById('usersList');

usersButton?.addEventListener('click', () => {
  socket.emit('getUsers');
  usersModal.style.display = 'block';
});

socket.on('userList', (users) => {
  usersList.innerHTML = '';
  users.forEach((user) => {
    const userItem = document.createElement('li');
    userItem.textContent = user;
    usersList.appendChild(userItem);
  });
});

// Fermer le modal des utilisateurs
const closeModalButtons = document.querySelectorAll('.closeModal');
closeModalButtons.forEach((button) => {
  button.addEventListener('click', () => {
    usersModal.style.display = 'none';
  });
});

// Fonctionnalité de gestion des paramètres (couleur, taille, etc.)
const settingsButton = document.getElementById('settings');
const settingsModal = document.getElementById('settingsModal');
const textColorInput = document.getElementById('textColor');
const backgroundColorInput = document.getElementById('backgroundColor');
const textSizeSelect = document.getElementById('textSize');

settingsButton?.addEventListener('click', () => {
  settingsModal.style.display = 'block';
});

// Sauvegarde des paramètres de l'utilisateur
const saveSettingsButton = document.getElementById('saveSettings');
saveSettingsButton?.addEventListener('click', () => {
  const textColor = textColorInput.value;
  const backgroundColor = backgroundColorInput.value;
  const textSize = textSizeSelect.value;

  document.body.style.color = textColor;
  document.body.style.backgroundColor = backgroundColor;
  document.body.style.fontSize = `${textSize}px`;

  // Sauvegarder les paramètres dans le localStorage pour les garder lors du prochain chargement
  localStorage.setItem('textColor', textColor);
  localStorage.setItem('backgroundColor', backgroundColor);
  localStorage.setItem('textSize', textSize);

  settingsModal.style.display = 'none';
});

// Récupérer les paramètres sauvegardés lors du démarrage de la page
window.onload = () => {
  const savedTextColor = localStorage.getItem('textColor');
  const savedBackgroundColor = localStorage.getItem('backgroundColor');
  const savedTextSize = localStorage.getItem('textSize');

  if (savedTextColor) document.body.style.color = savedTextColor;
  if (savedBackgroundColor) document.body.style.backgroundColor = savedBackgroundColor;
  if (savedTextSize) document.body.style.fontSize = `${savedTextSize}px`;
};

