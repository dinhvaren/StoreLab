// seedUsers_save.js
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./src/app/models/User");

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
  {
    username: "dinhvaren",
    email: "dinhvaren@example.com",
    password: bcrypt.hashSync("vhuCTF{us3r_r0l3_pr1v3sc}", 10),
    role: "user",
    balance: 200000,
    avatar: "https://i.pravatar.cc/150?img=60",
  },
];

(async () => {
  try {
    await mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = mongoose.connection.db;

    try { await db.collection("users").dropIndex("userId_1"); } catch(e){}
    try { await db.collection("counters").deleteMany({}); } catch(e){}
    await db.collection("users").deleteMany({});
    console.log("Cleared users + counters.");

    for (const u of users) {
      const user = new User(u);
      await user.save();
      console.log("Saved:", user.username, " -> _id:", user._id, " userId:", user.userId);
    }

    await mongoose.connection.close();
    console.log("Done.");
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    try { await mongoose.connection.close(); } catch(e){}
    process.exit(1);
  }
})();
