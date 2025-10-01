const homeRouter = require("./home");
const authRouter = require("./auth");

function route(app) {
  app.use("/", homeRouter);
  app.use("/auth", authRouter);
}

module.exports = route;

