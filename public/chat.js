// Connexion au serveur WebSocket via Socket.io
const socket = io();

// Initialisation des éléments DOM
const disconnectButton = document.getElementById('disconnect');
const usersButton = document.getElementById('showUsers');
const usersModal = document.getElementById('usersModal');
const usersList = document.getElementById('usersList');
const settingsButton = document.getElementById('settings');
const settingsModal = document.getElementById('settingsModal');

// Fonction de déconnexion de l'utilisateur
function disconnectUser() {
  const username = localStorage.getItem('username');
  socket.emit('disconnectUser', username);
  localStorage.removeItem('username');
  window.location.href = 'index.html';
}

// Vérifier si l'élément de déconnexion existe avant d'ajouter l'écouteur d'événements
if (disconnectButton) {
  disconnectButton.addEventListener('click', () => {
    disconnectUser();
  });
} else {
  console.error('Le bouton de déconnexion n\'a pas été trouvé');
}

// Vérifier si l'élément des utilisateurs existe avant d'ajouter l'écouteur d'événements
if (usersButton && usersModal && usersList) {
  usersButton.addEventListener('click', () => {
    socket.emit('getUsers');
    usersModal.style.display = 'block';
  });
} else {
  console.error('Le bouton des utilisateurs ou le modal n\'a pas été trouvé');
}

// Gérer l'affichage des utilisateurs
socket.on('userList', (users) => {
  if (usersList) {
    usersList.innerHTML = ''; // Clear the list
    users.forEach((user) => {
      const userItem = document.createElement('li');
      userItem.textContent = user;
      usersList.appendChild(userItem);
    });
  } else {
    console.error('La liste des utilisateurs n\'a pas été trouvée');
  }
});

// Fermer le modal des utilisateurs
const closeModalButtons = document.querySelectorAll('.closeModal');
closeModalButtons.forEach((button) => {
  button.addEventListener('click', () => {
    if (usersModal) {
      usersModal.style.display = 'none';
    }
  });
});

// Fonctionnalité de gestion des paramètres (couleur, taille, etc.)
if (settingsButton && settingsModal) {
  settingsButton.addEventListener('click', () => {
    settingsModal.style.display = 'block';
  });
} else {
  console.error('Le bouton des paramètres ou le modal n\'a pas été trouvé');
}

// Sauvegarde des paramètres de l'utilisateur
const saveSettingsButton = document.getElementById('saveSettings');
if (saveSettingsButton) {
  saveSettingsButton.addEventListener('click', () => {
    const textColor = document.getElementById('textColor').value;
    const backgroundColor = document.getElementById('backgroundColor').value;
    const textSize = document.getElementById('textSize').value;

    document.body.style.color = textColor;
    document.body.style.backgroundColor = backgroundColor;
    document.body.style.fontSize = `${textSize}px`;

    // Sauvegarder les paramètres dans le localStorage pour les garder lors du prochain chargement
    localStorage.setItem('textColor', textColor);
    localStorage.setItem('backgroundColor', backgroundColor);
    localStorage.setItem('textSize', textSize);

    if (settingsModal) {
      settingsModal.style.display = 'none';
    }
  });
} else {
  console.error('Le bouton de sauvegarde des paramètres n\'a pas été trouvé');
}

// Vérification et récupération des paramètres sauvegardés
window.onload = () => {
  const savedTextColor = localStorage.getItem('textColor');
  const savedBackgroundColor = localStorage.getItem('backgroundColor');
  const savedTextSize = localStorage.getItem('textSize');

  if (savedTextColor) document.body.style.color = savedTextColor;
  if (savedBackgroundColor) document.body.style.backgroundColor = savedBackgroundColor;
  if (savedTextSize) document.body.style.fontSize = `${savedTextSize}px`;

  // Debug: Afficher les paramètres dans la console (optionnel)
  console.log(`Texte: ${savedTextColor}, Fond: ${savedBackgroundColor}, Taille: ${savedTextSize}`);
};
