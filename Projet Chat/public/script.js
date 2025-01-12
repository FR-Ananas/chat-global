// Références aux éléments HTML
const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');

// Demander un pseudo à l'utilisateur lors de son arrivée
let username = '';
while (!username) {
  username = prompt('Choisissez un pseudo :').trim(); // Demande un pseudo et supprime les espaces inutiles
}

// Connexion au serveur Socket.IO
const socket = io(); // Connecte automatiquement au serveur sur la même origine

// Informer le serveur du pseudo de l'utilisateur
socket.emit('newUser', username);

// Envoyer un message au serveur
sendButton.addEventListener('click', () => {
  const message = messageInput.value.trim(); // Supprimer les espaces inutiles
  if (message !== '') {
    // Envoyer le pseudo avec le message
    socket.emit('message', { username, message });
    messageInput.value = ''; // Réinitialiser le champ d'entrée
  }
});

// Recevoir des messages du serveur
socket.on('message', (data) => {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message');
  messageElement.innerHTML = `<span>${data.username}:</span> ${data.message}`;
  messagesDiv.appendChild(messageElement);
  messagesDiv.scrollTop = messagesDiv.scrollHeight; // Faire défiler vers le bas
});

// Afficher une notification lorsqu'un nouvel utilisateur se connecte
socket.on('userJoined', (newUsername) => {
  const notification = document.createElement('div');
  notification.classList.add('message');
  notification.style.color = 'gray';
  notification.textContent = `${newUsername} a rejoint le chat.`;
  messagesDiv.appendChild(notification);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});
