const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");

// Import Routes
const authRoutes = require("./routes/authRoutes");

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
];
app.use(middleware);

app.use("/auth", authRoutes);

app.get("/", (request, response) => {
  response.json({
    message: "Hello Bloggers",
  });
});

const PORT = process.env.PORT || 8080;
mongoose
  .connect(
    "mongodb+srv://akash-das02:aku02111993@techie-bloggers.bdrwo.mongodb.net/techie-bloggers?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    app.listen(PORT, () => {
      console.log("Database Connected!");
      console.log(`Server is running on PORT ${PORT}`);
    });
  })
  .catch((error) => {
    return console.log(error);
  });
