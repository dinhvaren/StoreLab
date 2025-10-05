// seedUsers.js
require("dotenv").config({ path: "./src/.env" });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./src/app/models/User"); // đường dẫn model của bạn

const MONGO = process.env.MONGODB_URI;

const users = [
  {
    username: "admin",
    email: "admin@vhu-ctf.io",
    password: bcrypt.hashSync("Dinhvaren@2203", 10),
    role: "admin",
    balance: 9999999,
    avatar: "https://i.pravatar.cc/150?img=5",
  },
  {
    username: "test",
    email: "test@gmail.com",
    password: bcrypt.hashSync("test123", 10),
    role: "user",
    balance: 200000,
    avatar: "https://i.pravatar.cc/150?img=47",
  },
];

(async () => {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("✅ Connected.");

    const db = mongoose.connection.db;

    try {
      await db.collection("users").dropIndex("userId_1");
      console.log("🗑️ Dropped index userId_1");
    } catch (e) {
      console.log("ℹ️ Index userId_1 not present or could not be dropped (ok):", e.message);
    }

    try {
      await db.collection("counters").deleteMany({});
      console.log("🧹 Cleared counters collection.");
    } catch (e) {
      console.log("ℹ️ counters collection not present (ok).");
    }

    await db.collection("users").deleteMany({});
    console.log("🧹 Cleared users collection.");

    // 4) Insert users
    const inserted = await User.insertMany(users);
    console.log(`📥 Inserted ${inserted.length} users.`);

    await mongoose.connection.close();
    console.log("✅ Done — connection closed.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding error:", err);
    try { await mongoose.connection.close(); } catch (e) {}
    process.exit(1);
  }
})();
