const express = require("express");
const morgan = require("morgan");
const flash = require("connect-flash");
const config = require("config");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

// Import Middleware
const { bindUserWithRequest } = require("./authMiddleware");
const setLocals = require("./setLocals");

// Sessions Store
const MONGODB_URI = `mongodb+srv://${config.get("db-username")}:${config.get(
  "db-password"
)}@techie-bloggers.bdrwo.mongodb.net/techie-bloggers?retryWrites=true&w=majority`;

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
  expires: 1000 * 60 * 60 * 24,
});

// Middleware Array
const middlewares = [
  morgan("dev"),
  express.static("public"),
  express.urlencoded({ extended: true }),
  express.json(),
  session({
    secret: config.get("secret"),
    resave: false,
    saveUninitialized: false,
    store: store,
  }),
  flash(),
  bindUserWithRequest(),
  setLocals(),
];

module.exports = (app) => {
  middlewares.forEach((middleware) => {
    app.use(middleware);
  });
};
