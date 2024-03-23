const socket = io();

const form = document.getElementById("form");
const emailUser = document.getElementById("email");
const user = document.getElementById("username");
const pass = document.getElementById("password");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = emailUser.value.trim();
  const username = user.value.trim();
  const password = pass.value.trim();

  if (email && username && password) {
    socket.emit("register user", {
      email: email,
      username: username,
      password: password,
    });
  }
});

socket.on("register user error", function () {
  alert("This email or username is already in use!");
});

socket.on("register successful", function () {
  alert("User created.");
});
