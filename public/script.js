let username = "";
let onlineCount = 0;
const maxUsers = 150;

function startChat() {
    const input = document.getElementById("username");
    const errorMessage = document.getElementById("error-message");

    if (input.value.trim() === "") {
        errorMessage.style.display = "block";
    } else {
        username = input.value.trim();
        errorMessage.style.display = "none";

        // Affiche la popup de chargement
        const loadingPopup = document.getElementById("loadingPopup");
        loadingPopup.style.display = "block";

        // Simule un chargement avec un délai
        setTimeout(() => {
            loadingPopup.style.display = "none"; // Cache la popup
            document.querySelector(".login-page").style.display = "none"; // Cache la page de connexion
            document.querySelector(".chat-page").style.display = "flex"; // Affiche la page de chat

            // Augmente le nombre d'utilisateurs en ligne
            onlineCount++;
            updateUserCount();
        }, 2000); // Temps de chargement simulé (2 secondes)
    }
}

function sendMessage() {
    const input = document.getElementById("chatInput");
    const messages = document.getElementById("messages");

    if (input.value.trim() !== "") {
        const message = document.createElement("div");
        message.className = "message";
        message.innerHTML = `<strong>${username}:</strong> ${input.value.trim()}`;
        messages.appendChild(message);
        input.value = "";
        messages.scrollTop = messages.scrollHeight; // Scrolle automatiquement vers le bas
    }
}

function updateUserCount() {
    const userCountElement = document.getElementById("userCount");
    userCountElement.textContent = `${onlineCount}/${maxUsers} online`;
}
