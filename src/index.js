require("dotenv").config();
const express = require("express");
const route = require("./routes");
const session = require("express-session");
const path = require("path");
const cookieParser = require("cookie-parser");
// const db = require("./database/db");
const app = express();

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const port = process.env.PORT;
const host = process.env.HOST;

route(app);

app.listen(port, () => {
  console.log(`Server is running on http://${host}:${port}`);
});