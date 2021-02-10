const authRoutes = require("./authRoutes");
const dashboardRoute = require("./dashboardRoute");
const uploadRoutes = require("./uploadRoutes");

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
    handler: uploadRoutes,
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
    if (route.path === "/") {
      app.get(route.path, route.handler);
    } else {
      app.use(route.path, route.handler);
    }
  });
};
