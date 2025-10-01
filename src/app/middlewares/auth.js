const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).sendFile("401.html", { root: "src/views" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).sendFile("401.html", { root: "src/views" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(401).sendFile("401.html", { root: "src/views" });
  }
}

function isAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).sendFile("401.html", { root: "src/views" });
  }
  if (req.user.role !== "admin") {
    return res.status(403).sendFile("403.html", { root: "src/views" });
  }
  next();
}

module.exports = { auth, isAdmin };
