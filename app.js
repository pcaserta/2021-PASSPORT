const express = require("express");
const app = new express();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const auth = () => {
  return (req, res, next) => {
    passport.authenticate("local", (error, user, info) => {
      if (error) res.status(400).json({ statusCode: 200, message: error });
      req.login(user, function (error) {
        if (error) return next(error);
        next();
      });
    })(req, res, next);
  };
};

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res
    .status(400)
    .json({ statusCode: 400, message: "not authenticated" });
};

//Auth() is middleware that intercepts request to the auth callback
app.post("authenticate", auth(), (req, res) => {
  res.status(200).json({ statusCode: 200, message: "hello" });
});

app.get("/getData", isLoggedIn, (req, res) => {
  res.json("data");
});

passport.use(
  new LocalStrategy(function (username, password, done) {
    if (username === "admin" && password == "admin") {
      return done(null, username);
    } else {
      return done("unauthorized access", false);
    }
  })
);

passport.serializeUser(function (user, done) {
  if (user) done(null, user);
});

passport.deserializeUser(function (id, done) {
  done(null, id);
});

app.use(passport.initialize());
app.use(passport.session());

app.listen(3000, () => {
  console.log("App running on port 3000");
});
