const socket = io();

const messages = document.getElementById('messages');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

// Envoyer un message
sendButton.addEventListener('click', () => {
  const message = messageInput.value;
  if (message.trim()) {
    socket.emit('chat message', message);
    messageInput.value = '';
  }
});

// Recevoir un message
socket.on('chat message', (msg) => {
  const div = document.createElement('div');
  div.textContent = msg;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight; // Scroller vers le bas
});
