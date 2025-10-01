require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./src/app/models/Product");

const MONGO = process.env.MONGODB_URI;

const products = [
  {
    title: "T-shirt Cyber Security Blue Team",
    description: "T-shirt phong cách Blue Team — thích hợp cho defender.",
    price: 199000,
    stock: "In stock",
    imageUrl: "https://ih1.redbubble.net/image.1096611532.4256/ra,baby_tee,x750,000000:44f0b734a5,front-pad,600x600,f8f8f8.jpg",
    isFlag: false,
    flagValue: null,
  },
  {
    title: "T-shirt Network Hacker Infosec",
    description: "Áo Network Hacker — thích hợp cho pentesters.",
    price: 149000,
    stock: "Low stock",
    imageUrl: "https://ih1.redbubble.net/image.4954051389.5378/ssrco,classic_tee,mens,fafafa:ca443f4786,front_alt,square_product,600x600.jpg",
    isFlag: false,
    flagValue: null,
  },
  {
    title: "T-shirt Cyber Hacker Ethical Hacking",
    description: "Áo Cyber Hacker — ethical hacking vibes.",
    price: 169000,
    stock: "In stock",
    imageUrl: "https://ih1.redbubble.net/image.2128462354.3764/ssrco,classic_tee,mens,101010:01c5ca27c6,front_alt,square_product,600x600.jpg",
    isFlag: false,
    flagValue: null,
  },
  {
    title: "T-shirt Hacker Gifts for a Ethical",
    description: "Hacker gifts — phong cách nhẹ, phù hợp làm quà.",
    price: 159000,
    stock: "In stock",
    imageUrl: "https://ih1.redbubble.net/image.2218982164.9729/ssrco,classic_tee,mens,101010:01c5ca27c6,front_alt,square_product,600x600.jpg",
    isFlag: false,
    flagValue: null,
  },
  {
    title: "T-shirt Hacker Cat Cyberpunk",
    description: "Hacker Cat — phong cách cyberpunk dễ thương.",
    price: 139000,
    stock: "In stock",
    imageUrl: "https://ih1.redbubble.net/image.4602622832.4788/ssrco,classic_tee,mens,fafafa:ca443f4786,front_alt,square_product,600x600.u3.jpg",
    isFlag: false,
    flagValue: null,
  },
  {
    title: "T-shirt it not bug",
    description: "Áo 'it not bug' — meme dev/hacker.",
    price: 129000,
    stock: "In stock",
    imageUrl: "https://ih1.redbubble.net/image.3449915915.2302/ssrco,classic_tee,mens,fafafa:ca443f4786,front_alt,square_product,600x600.jpg",
    isFlag: false,
    flagValue: null,
  },
  {
    title: "T-shirt chat gpt",
    description: "Áo ChatGPT — hacker meets AI.",
    price: 159000,
    stock: "In stock",
    imageUrl: "https://ih1.redbubble.net/image.4753142675.8736/ssrco,classic_tee,mens,101010:01c5ca27c6,front_alt,square_product,600x600.jpg",
    isFlag: false,
    flagValue: null,
  },
  {
    title: "CTF VIP Flag",
    description: "A mysterious product. Purchasing returns a hidden flag in the API response.",
    price: 99999,
    stock: "In stock",
    imageUrl: "https://hunghau.vn/wp-content/uploads/2018/05/vhu.jpg",
    isFlag: true,
    flagValue: "vhuCTF{b20k3n_4((355_(0n7201}",
  },
];

async function seed() {
  try {
    console.log("Connecting to MongoDB...", MONGO);
    await mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected.");

    // Xóa sản phẩm cũ (chú ý: nếu bạn có sản phẩm khác trong db, cân nhắc thay đổi)
    await Product.deleteMany({});
    console.log("Cleared products collection.");

    // Insert
    await Product.insertMany(products);
    console.log(`Inserted ${products.length} products.`);

    await mongoose.connection.close();
    console.log("Done — connection closed.");
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    try { await mongoose.connection.close(); } catch(e){}
    process.exit(1);
  }
}

seed();
