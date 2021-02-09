require("dotenv").config();

// Import Packages
const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const chalk = require("chalk");

const setMiddleware = require("./middlewares/middlewares");
const setRoutes = require("./routes/appRoutes");

// MONGODB URI
const MONGODB_URI = `mongodb+srv://${config.get("db-username")}:${config.get(
  "db-password"
)}@techie-bloggers.bdrwo.mongodb.net/techie-bloggers?retryWrites=true&w=majority`;

const app = express();

// View Engine
app.set("view engine", "ejs");
app.set("views", "views");

// Using Middlewares from Middlewares Directory
setMiddleware(app);

// Using Routes from Routes Directory
setRoutes(app);

app.use((request, response, next) => {
  let error = new Error("404 Page Not Found");
  error.status = 404;
  next(error);
});

app.use((error, request, response, next) => {
  if (error.status === 404) {
    return response.render("pages/error/404", { flashMessage: {} });
  }
  console.log(error);
  response.render("pages/error/500", { flashMessage: {} });
});

const PORT = process.env.PORT || 8080;
mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(chalk.bold.blue.inverse("Database Connected!"));
      console.log(chalk.green.inverse(`Server is running on PORT ${PORT}`));
    });
  })
  .catch((error) => {
    return console.log(error);
  });
