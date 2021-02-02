const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

// Import Routes
const authRoutes = require("./routes/authRoutes");
const dashboardRoute = require("./routes/dashboardRoute");

// Import Middleware
const { bindUserWithRequest } = require("./middlewares/authMiddleware");
const setLocals = require("./middlewares/setLocals");

// Sessions Store
const MONGODB_URI =
  "mongodb+srv://akash-das02:aku02111993@techie-bloggers.bdrwo.mongodb.net/techie-bloggers?retryWrites=true&w=majority";
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
  expires: 1000 * 60 * 60 * 24,
});

const app = express();

// View Engine
app.set("view engine", "ejs");
app.set("views", "views");

// Middleware Array
const middleware = [
  morgan("dev"),
  express.static("public"),
  express.urlencoded({ extended: true }),
  express.json(),
  session({
    secret: process.env.SECRET_KEY || "SECRET_KEY",
    resave: false,
    saveUninitialized: false,
    store: store,
  }),
  bindUserWithRequest(),
  setLocals(),
];
app.use(middleware);

app.use("/auth", authRoutes);
app.use("/dashboard", dashboardRoute);

app.get("/", (request, response) => {
  response.json({
    message: "Hello Bloggers",
  });
});

const PORT = process.env.PORT || 8080;
mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log("Database Connected!");
      console.log(`Server is running on PORT ${PORT}`);
    });
  })
  .catch((error) => {
    return console.log(error);
  });
