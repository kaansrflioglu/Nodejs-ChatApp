const socket = io();

const form = document.getElementById("form");
const input = document.getElementById("message");
const messages = document.getElementById("messages");

let lastUsername = null;

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = input.value.trim();

  if (userName && message) {
    socket.emit("chat message", { user: userName, message: message });
    input.value = "";
  }
});

function scrollToBottom() {
  const chatContainer = document.getElementById("messages");
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

/*
socket.on("chat message", (data) => {
  const otherUser = `<img src="assets/people.png" width="20" height="20"><strong> ${data.user}</strong><br>`;
  const sessionUser = `<strong> ${data.user}</strong><img src="assets/people.png" width="20" height="20"><br>`;
  const item = document.createElement("div");
  if (data.user === userName) {
    item.innerHTML = `${sessionUser}${element.message}`;
    item.classList.add("chat-bubble-self");
  } else {
    item.innerHTML = `${otherUser}${data.message}`;
    item.classList.add("chat-bubble");
  }
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
  scrollToBottom();
});
*/

socket.on("chat message", (data) => {
  const sessionUser = `<strong> ${data.user}</strong>&nbsp;<img src="assets/people.png" width="20" height="20"><br>`;
  const otherUser = `<img src="assets/people.png" width="20" height="20"><strong> ${data.user}</strong><br>`;
  const item = document.createElement("div");
  if (data.user === userName) {
    item.innerHTML = `${sessionUser}${data.message}`;
    item.classList.add("chat-bubble-self");
  } else {
    item.innerHTML = `${otherUser}${data.message}`;
    item.classList.add("chat-bubble");
  }
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
  scrollToBottom();
});


socket.on("old_messages", (msg) => {
  msg.forEach((element) => {
    const otherUser = `<img src="assets/people.png" width="20" height="20"><strong> ${element.user}</strong><br>`;
    const sessionUser = `<strong> ${element.user}</strong>&nbsp;<img src="assets/people.png" width="20" height="20"><br>`;
    const item = document.createElement("div");

    if (element.user === userName) {
      item.innerHTML = `${sessionUser}${element.message}`;
      item.classList.add("chat-bubble-self");
    } else {
      item.innerHTML = `${otherUser}${element.message}`;
      item.classList.add("chat-bubble");
    }
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
    scrollToBottom();
  });
});
