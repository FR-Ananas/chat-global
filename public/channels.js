const socket = io();
const username = localStorage.getItem('username');

if (!username) {
  window.location.href = 'index.html';
}

const channelList = document.getElementById('channelList');
const channelNameInput = document.getElementById('channelName');
const channelColorInput = document.getElementById('channelColor');
const errorElement = document.getElementById('error');

socket.emit('getChannels', username);

socket.on('channels', (channels) => {
  channelList.innerHTML = '';
  channels.forEach((channel) => {
    const li = document.createElement('li');
    li.textContent = channel.name;
    li.style.color = channel.color;
    li.addEventListener('click', () => {
      localStorage.setItem('channel', channel.name);
      window.location.href = 'chat.html';
    });
    channelList.appendChild(li);
  });
});

socket.on('channelLimitExceeded', () => {
  errorElement.classList.remove('hidden');
});

document.getElementById('createChannel').addEventListener('click', () => {
  const channelName = channelNameInput.value.trim();
  const channelColor = channelColorInput.value;

  if (channelName) {
    socket.emit('createChannel', { username, name: channelName, color: channelColor });
    channelNameInput.value = '';
  }
});

document.getElementById('backToGlobal').addEventListener('click', () => {
  localStorage.setItem('channel', 'Global');
  window.location.href = 'chat.html';
});
