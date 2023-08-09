const userRouter = require('./routes/users');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

require('dotenv').config();


// Flash Middleware Start //
app.use(cookieParser("rastgeleScript"));
app.use(session({
  cookie: { maxAge: 6000000 },
  resave: true,
  secret: "uwd+B5-Y=UMg-=MD",
  saveUninitialized: true
}));
app.use(flash());
// Flash Middleware End //

// Passport Initialize Start //
app.use(passport.initialize());
app.use(passport.session());

// Passport Initialize End //


// Global Res.Locals Start //
app.use((req, res, next) => {
  res.locals.flashSuccess = req.flash("flashSuccess");
  res.locals.flashError = req.flash("flashError");

  res.locals.passportSuccess = req.flash("success");
  res.locals.passportFailure = req.flash("error");

  res.locals.user = req.user;
  next();
});
// Global Res.Locals End //

 
// MongoDB Connection Start //
const mongoDbConnection = mongoose.connect(process.env.MONGODB_CONNECTION_STRING);

mongoose.connection.on("open", () => {
  console.log("MongoDB Bağlantısı Kuruldu");
});
mongoose.connection.on("error", (err) => {
  console.log("MongoDB Bağlantısı Kurulamadı", err);
});
// MongoDB Connection End //


app.use(express.static("public"));
// Handlebars Engine Middleware Start
const hbs = exphbs.create({
  defaultLayout: 'layout',
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
// Handlebars Engine Middleware End

// BodyParser Middleware Start //
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// BodyParser Middleware End //

// Router Middleware Start
app.use('/', userRouter); // "userRouter" middleware'i root path '/' altında kullanmak için
app.use((req, res, next) => {
  res.render("./pages/404");
});
// Router Middleware End



const TableMessage = require("./models/Message");

let allUsers = [];

io.on('connection', (socket) => {

    allUsers.push({
        id: socket.id,
        username: 'default',
        room_id: "0"
    })

    io.emit('total_user_count', allUsers.length);

    socket.on('join_room', (msg) => {
      let findIndex = allUsers.findIndex( item => item.id === socket.id );
      allUsers[findIndex] = {
        id: socket.id,
        username: msg.username,
        room_id: msg.room_id
      } 

      socket.join(msg.room_id);
      
      io.in(msg.room_id).emit('room_users', allUsers.filter(x => x.room_id == msg.room_id));

      TableMessage.find({
        roomId: msg.room_id
      }).then((messages) => {
        io.to(socket.id).emit('old_messages', messages);
      }).catch((err) => {
        console.log(err);
      });
    });

    socket.on("send_message", (msg) => {
      io.in(msg.room_id).emit('send_message', msg);
      new TableMessage({
        content: msg.message,
        roomId: msg.room_id,
        username: msg.username,
      }).save();
    });
    
    socket.on('disconnect', () => {
        let removeIndex = allUsers.findIndex( item => item.id === socket.id );
        let findRoomId = allUsers[removeIndex].room_id;
        allUsers.splice(removeIndex, 1);

        io.emit('total_user_count', allUsers.length);
        io.in(findRoomId).emit('room_users', allUsers.filter(x => x.room_id == findRoomId));
    });
});

const PORT = 3000;
server.listen(process.env.PORT || PORT, () => {
  console.log(`Sunucu "http://localhost:${PORT}/" adresinde çalışacak.`);
});