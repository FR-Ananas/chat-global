// ... autres parties du fichier

// Appliquer les paramètres à tous les éléments
function applySettings() {
  const textColor = localStorage.getItem('textColor') || '#000000';
  const bgColor = localStorage.getItem('bgColor') || '#ffffff';
  const textSize = localStorage.getItem('textSize') || '15';

  document.documentElement.style.setProperty('--text-color', textColor);
  document.documentElement.style.setProperty('--bg-color', bgColor);
  document.documentElement.style.setProperty('--text-size', `${textSize}px`);

  // Appliquer à tous les messages
  const messages = document.querySelectorAll('#chatBox div');
  messages.forEach((msg) => {
    msg.style.color = textColor;
    msg.style.fontSize = `${textSize}px`;
  });
}

// ... autres parties du fichier
