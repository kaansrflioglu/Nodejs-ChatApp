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

socket.on("chat message", (data) => {
  const item = document.createElement("div");
  item.innerHTML = `${data.message}`;
  item.classList.add("chat-bubble-self", "row");
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
  scrollToBottom();
});

socket.on("old_messages", (msg) => {
  msg.forEach((element) => {
    const user = `<strong style="align-items: center; display: flex;"><img src="assets/people.png" width="20" height="20" />&nbsp;${element.user}</strong>`;
    const item = document.createElement("div");

    if (userName === element.user) {
      item.innerHTML = `${element.message}`;
      item.classList.add("chat-bubble-self", "row");
    } else {
      if (lastUsername !== element.user) {
        item.innerHTML = `${user}${element.message}`;
        item.classList.add("chat-bubble", "row");
        lastUsername = element.user;
      } else {
        item.innerHTML = `${element.message}`;
        item.classList.add("chat-bubble", "row");
      }
    }

    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
    scrollToBottom();
  });
});
