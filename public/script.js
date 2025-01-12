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

        // Show loading popup
        const loadingPopup = document.getElementById("loadingPopup");
        loadingPopup.style.display = "block";

        // Simulate loading
        setTimeout(() => {
            loadingPopup.style.display = "none";
            document.querySelector(".login-page").style.display = "none";
            document.querySelector(".chat-page").style.display = "flex";

            // Increase online user count
            onlineCount++;
            updateUserCount();
        }, 2000); // 2 seconds loading time
    }
}

function sendMessage() {
    const input = document.getElementById("chatInput");
    const messages = document.getElementById("messages");

