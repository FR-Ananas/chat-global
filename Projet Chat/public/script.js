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

        const loadingPopup = document.getElementById("loadingPopup");
        loadingPopup.style.display = "block";

        setTimeout(() => {
            loadingPopup.style.display = "none";
            document.querySelector(".login-page").style.display = "none";
            document.querySelector(".chat-page").style.display = "flex";

            onlineCount++;
            updateUserCount();
        }, 2000);
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
        messages.scrollTop = messages.scrollHeight;
    }
}

function updateUserCount() {
    const userCountElement = document.getElementById("userCount");
    userCountElement.textContent = `${onlineCount}/${maxUsers} online`;
}
