require("dotenv").config();
const express = require("express");
const route = require("./routes");
const session = require("express-session");
const path = require("path");
const cookieParser = require("cookie-parser");
const db = require("./config/database");
const app = express();
const { engine } = require("express-handlebars");

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "..", "images")));

app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    helpers: {
      eq: (a, b) => a === b,
      formatDate: (date) => {
        if (!date) return "-";
        const d = new Date(date);
        // format kiểu Việt Nam: dd/mm/yyyy, hh:mm
        return d.toLocaleString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      },
    },
    partialsDir: [
      path.join(__dirname, "views/partials"),
      path.join(__dirname, "views/home"),
      path.join(__dirname, "views/error"),
      path.join(__dirname, "views/auth"),
    ],
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
    },
    defaultLayout: "main",
  })
);

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

const port = process.env.PORT;
const host = process.env.HOST;

db.connect();

const isProduction = process.env.NODE_ENV === "production";

app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: isProduction,
      httpOnly: true,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

route(app);

app.set("trust proxy", 1);

app.listen(port, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
