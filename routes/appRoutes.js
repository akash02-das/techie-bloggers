const authRoutes = require("./authRoutes");
const dashboardRoute = require("./dashboardRoute");

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
    path: "/",
    handler: (request, response) => {
      response.json({
        message: "Hello Bloggers",
      });
    },
  },
];

module.exports = (app) => {
  routes.forEach((route) => {
    app.use(route.path, route.handler);
  });
};
