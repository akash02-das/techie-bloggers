const express = require("express");
const morgan = require("morgan");

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

app.get("/", (request, response) => {
  response.render("pages/auth/signup", { title: "Create A New Account" });

  response.json({
    message: "Hello Bloggers",
  });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
