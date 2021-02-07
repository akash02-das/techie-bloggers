require("dotenv").config();

// Import Packages
const express = require("express");
const mongoose = require("mongoose");
const config = require("config");

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
