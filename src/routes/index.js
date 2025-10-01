const homeRouter = require("./home");
const authRouter = require("./auth");
const adminRouter = require("./admin");
const orderRouter = require("./order");

function route(app) {
  app.use("/", homeRouter);
  app.use("/auth", authRouter);
  app.use("/admin", adminRouter);
  app.use("/orders", orderRouter);
}

module.exports = route;