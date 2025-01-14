* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f4f4f9;
}

#app {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 600px;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

#chat {
  width: 100%;
  display: none;
}

#user-menu {
  background-color: #f1f1f1;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 10px;
  width: 100%;
}

#user-menu h2 {
  font-size: 16px;
  margin-bottom: 10px;
}

#users {
  list-style-type: none;
  padding: 0;
}

#users li {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

#users .user {
  margin-left: 10px;
  font-size: 16px;
}

#users .status {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 5px;
}

#login-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

#login input, #message {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

#login-btn, #send-btn {
  padding: 10px;
  width: 100%;
  border: none;
  background-color: #5cb85c;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

#login-btn:hover, #send-btn:hover {
  background-color: #4cae4c;
}

#messages {
  height: 300px;
  overflow-y: scroll;
  margin-bottom: 10px;
}

.message {
  margin: 10px 0;
  padding: 8px;
  background-color: #e9ecef;
  border-radius: 4px;
  font-size: 14px;
}

.message span {
  font-weight: bold;
}

.popup {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #28a745;
  color: white;
  padding: 10px;
  border-radius: 5px;
  display: none;
}

.popup.error {
  background-color: #dc3545;
}
