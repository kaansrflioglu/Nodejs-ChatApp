const express = require("express");
const session = require("express-session");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const http = require("http");
const flash = require("express-flash");
const Router = require("./routes/router");
const socketConnection = require("./socket");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = socketConnection(server);
app.use(flash());

app.use(
  session({
    cookie: { maxAge: 6000000 },
    resave: true,
    secret: "09e8f526fa2d70d745b007ae614c9d0841727e33",
    saveUninitialized: true,
  })
);

const mongoDbConnection = mongoose.connect(
  process.env.MONGODB_CONNECTION_STRING
);

mongoose.connection.on("open", () => {
  console.log("MongoDB Connection Established.");
});
mongoose.connection.on("error", (err) => {
  console.log("MongoDB Connection Failed.", err);
});

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));

const handlebars = exphbs.create({
  defaultLayout: "layout",
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
});

app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");
app.set("views", "./views");

app.use("/", Router);

app.use((req, res, next) => {
  res.render("./pages/404");
});

const PORT = process.env.PORT;
server.listen(PORT || 3000, () => {
  console.log(`The server is running at "http://localhost:${PORT}/"`);
});
