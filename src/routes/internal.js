const express = require("express");
const path = require("path");
const router = express.Router();

const CTF_FLAG = process.env.SSRF_FLAG;

function normalizeIp(ip) {
  if (!ip || typeof ip !== "string") return null;
  if (ip.startsWith("::ffff:")) ip = ip.replace("::ffff:", "");
  const pct = ip.indexOf("%");
  if (pct !== -1) ip = ip.slice(0, pct);
  return ip;
}

function isLocalIp(ip) {
  if (!ip) return false;
  ip = normalizeIp(ip);
  if (!ip) return false;
  if (ip === "127.0.0.1" || ip === "::1" || ip === "0:0:0:0:0:0:0:1") return true;
  return false;
}

function isFromLocalhost(req) {
  try {
    const remote = req.socket && req.socket.remoteAddress;
    if (isLocalIp(remote)) return true;

    const connRemote = (req.connection && req.connection.remoteAddress) || null;
    if (isLocalIp(connRemote)) return true;

    const trustProxy = !!req.app && !!req.app.get && !!req.app.get('trust proxy');
    if (trustProxy) {
      const xff = req.headers['x-forwarded-for'];
      if (xff && typeof xff === 'string') {
        const first = xff.split(',')[0].trim();
        if (isLocalIp(first)) return true;
      }
    }

    return false;
  } catch (err) {
    console.error("isFromLocalhost error:", err);
    return false;
  }
}

// GET /flag
router.get("/flag", (req, res) => {
  if (!CTF_FLAG) {
    console.error("SSRF_FLAG not configured in environment");
    return res.status(500).send("Server misconfiguration");
  }

  if (!isFromLocalhost(req)) {
    const htmlPath = path.join("src", "views", "403.html");
    return res.status(403).sendFile(htmlPath, { root: process.cwd() }, (err) => {
      if (err) {
        res.status(403).type("text/plain").send("403 Forbidden");
      }
    });
  }

  res.type("text/plain").send(CTF_FLAG);
});

module.exports = router;
