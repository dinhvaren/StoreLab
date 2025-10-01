// routes/product.js
const express = require("express");
const router = express.Router();
const axios = require("axios");
const { URL } = require("url");



// CONFIG 
const REQUEST_TIMEOUT = 5000; // ms
const MAX_CONTENT_LENGTH = 3 * 1024 * 1024; // 3 MB
const MAX_BODY_LENGTH = 3 * 1024 * 1024; // 3 MB
const MAX_REDIRECTS = 5;

// keep permissive: do NOT restrict to images
const requireImage = false;

// Optional blacklist (empty by default). Add hosts here if you want to block specific targets.
const HOST_BLACKLIST = [];

// Helper: simple blacklist check
function hostBlacklisted(hostname) {
  if (!hostname) return false;
  return HOST_BLACKLIST.includes(hostname);
}

function extractHostname(raw) {
  try {
    const u = new URL(raw);
    return u.hostname;
  } catch (e) {
    return null;
  }
}

router.get("/view", async (req, res) => {
  const url = req.query.url;
  if (!url) {
    return res.status(400).json({ message: "Missing url parameter" });
  }

  // log requester for lab monitoring
  const requesterIp = req.ip || req.connection.remoteAddress || "unknown";
  console.log(`[proxy] requester=${requesterIp} url=${url}`);

  // basic URL parse check (only allow http(s))
  let parsed;
  try {
    parsed = new URL(url);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return res.status(400).json({ message: "Only http(s) URLs are allowed" });
    }
  } catch (err) {
    return res.status(400).json({ message: "Invalid url parameter" });
  }

  // optional host blacklist check
  const hostname = extractHostname(url);
  if (hostBlacklisted(hostname)) {
    return res.status(403).json({ message: "Host blocked by proxy policy" });
  }

  try {
    // axios fetch with safeguards
    const response = await axios.get(url, {
      responseType: "arraybuffer",
      timeout: REQUEST_TIMEOUT,
      maxContentLength: MAX_CONTENT_LENGTH,
      maxBodyLength: MAX_BODY_LENGTH,
      maxRedirects: MAX_REDIRECTS,
      validateStatus: (status) => status >= 200 && status < 400,
    });

    // Optionally require image content-type (disabled in permissive mode)
    const ctype = response.headers["content-type"] || "";
    if (requireImage && !ctype.startsWith("image/")) {
      return res.status(415).json({ message: "Only image content is allowed" });
    }

    // Forward important headers
    if (response.headers["content-type"]) {
      res.set("Content-Type", response.headers["content-type"]);
    }
    if (response.headers["content-length"]) {
      res.set("Content-Length", response.headers["content-length"]);
    }

    return res.status(200).send(response.data);
  } catch (err) {
    console.error("[proxy] fetch error:", err.message);

    if (err.code === "ECONNABORTED") {
      return res.status(504).json({ message: "Upstream request timed out" });
    }
    if (err.response) {
      const status = err.response.status || 502;
      return res.status(status).json({ message: "Upstream returned error", status });
    }
    if (err.code === "ERR_FR_TOO_MANY_REDIRECTS") {
      return res.status(502).json({ message: "Too many redirects" });
    }
    if (err.message && err.message.includes("maxContentLength")) {
      return res.status(413).json({ message: "Upstream response too large" });
    }

    return res.status(502).json({ message: "Failed to fetch resource" });
  }
});

module.exports = router;
