const socketIo = require("socket.io");
const messageSchema = require("./models/messageSchema");
const userSchema = require("./models/userSchema");

function socketConnection(server) {
  const io = socketIo(server);

  io.on("connection", async (socket) => {
    const messages = await messageSchema.find({});

    socket.on("chat message", async (data) => {
      console.log("Sent Message:", data);

      try {
        const newMessage = new messageSchema({
          user: data.user,
          message: data.message,
        });
        await newMessage.save();

        io.emit("chat message", { user: data.user, message: data.message });
      } catch (error) {
        console.error("Message saving error:", error);
      }
    });

    io.to(socket.id).emit('old_messages', messages);

    socket.on("register user", async (data) => {
      try {
        const existingUser = await userSchema.findOne({
          $or: [{ email: data.email }, { username: data.username }],
        });

        if (existingUser) {
          console.log("This email or username is already in use!");
          io.emit(
            "register user error",
            "This email or username is already in use!"
          );
          return;
        }

        const newUser = new userSchema({
          email: data.email,
          username: data.username,
          password: data.password,
        });
        await newUser.save();

        io.emit("register user", {
          email: data.email,
          username: data.username,
          password: data.password,
        });
        io.emit("register successful", "User created.");
        console.log("Registered User:", data);
      } catch (error) {
        console.error("Register error:", error);
      }
    });
  });

  return io;
}

module.exports = socketConnection;