const socket = io();
const username = localStorage.getItem('username');
const channel = localStorage.getItem('channel') || 'Global';
const chatBox = document.getElementById('chatBox');
const messageInput = document.getElementById('messageInput');
document.getElementById('channelName').textContent = channel;

if (!username) {
  window.location.href = 'index.html';
}

socket.emit('joinChannel', { username, channel });

socket.on('message', (data) => {
  const messageElement = document.createElement('div');
  messageElement.textContent = `${data.username}: ${data.message}`;
  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight;
});

document.getElementById('sendMessage').addEventListener('click', () => {
  const message = messageInput.value.trim();
  if (message) {
    socket.emit('message', { username, message, channel });
    messageInput.value = '';
  }
});

document.getElementById('channels').addEventListener('click', () => {
  window.location.href = 'channels.html';
});

document.getElementById('disconnect').addEventListener('click', () => {
  socket.emit('disconnectUser', username);
  localStorage.clear();
  window.location.href = 'index.html';
});
