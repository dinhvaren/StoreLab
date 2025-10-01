const homeRouter = require("./home");
const authRouter = require("./auth");
const adminRouter = require("./admin");

function route(app) {
  app.use("/", homeRouter);
  app.use("/auth", authRouter);
  app.use("/admin", authRouter);
}

module.exports = route;
