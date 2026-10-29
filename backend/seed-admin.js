const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const User = require("./models/User");

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const hashed = await bcrypt.hash("Admin@123", 10);
  await User.create({ 
    name: "Admin", 
    email: "admin@smilefoundation.org", 
    password: hashed, 
    role: "admin" 
  });
  console.log("✅ Admin created!");
  process.exit();
});