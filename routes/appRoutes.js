const authRoutes = require("./authRoutes");
const dashboardRoute = require("./dashboardRoute");
const uploadRoute = require("./uploadRoutes");
const postRoute = require("./postRoute");
const apiRoutes = require("../api/routes/apiRoutes");

const routes = [
  {
    path: "/auth",
    handler: authRoutes,
  },
  {
    path: "/dashboard",
    handler: dashboardRoute,
  },
  {
    path: "/uploads",
    handler: uploadRoute,
  },
  {
    path: "/posts",
    handler: postRoute,
  },
  {
    path: "/api",
    handler: apiRoutes,
  },
  {
    path: "/",
    handler: (req, res) => {
      res.json({
        message: "Hello Bloggers",
      });
    },
  },
];

module.exports = (app) => {
  routes.forEach((route) => {
    if (route.path === "/") {
      app.get(route.path, route.handler);
    } else {
      app.use(route.path, route.handler);
    }
  });
};
