const express = require("express");
const router = express.Router();
const flash = require("express-flash");
const User = require("../models/userSchema");

router.use(flash());

router.use((req, res, next) => {
  if (req.session.loggedIn && req.session.username) {
    res.locals.username = req.session.username;
  } else {
    res.locals.username = null;
  }
  next();
});

router.get("/", (req, res, next) => {
  res.render("./pages/index");
});

router.get("/chat", (req, res, next) => {
  res.render("./pages/chat");
});

router.get("/login", (req, res, next) => {
  res.render("./pages/login", {
    successMessage: req.flash("success"),
    errorMessage: req.flash("error"),
  });
});

router.get("/register", (req, res, next) => {
  res.render("./pages/register");
});

router.post("/signin", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username, password });

    if (user) {
      req.session.loggedIn = true;
      req.session.username = username;
      req.flash("success", "Login successful");
      res.redirect("/");
    } else {
      req.flash("error", "Username or password is incorrect!");
      res.redirect("/login");
    }
  } catch (error) {
    console.error(error);
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Session could not be destroyed:", err);
      res.status(500).send("Something went wrong.");
    } else {
      res.redirect("/login");
    }
  });
});

module.exports = router;
