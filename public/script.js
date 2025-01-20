// Connexion au serveur WebSocket via Socket.io
const socket = io();

// Initialisation des éléments DOM
const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');

// Événement de soumission du formulaire pour se connecter
loginForm?.addEventListener('submit', (event) => {
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
