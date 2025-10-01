const homeRouter = require("./home");
const authRouter = require("./auth");
const adminRouter = require("./admin");
const orderRouter = require("./order");
const productRouter = require("./product");
const internalRouter = require("./internal");

function route(app) {
  app.use("/", homeRouter);
  app.use("/auth", authRouter);
  app.use("/admin", adminRouter);
  app.use("/orders", orderRouter);
  app.use("/", internalRouter);
  app.use("/product", productRouter);
}

module.exports = route;
