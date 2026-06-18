const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

async function seed() {
  await mongoose.connect("mongodb://admin:admin@127.0.0.1:27017/store2?authSource=admin");

  const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  });

  const User = mongoose.models.User || mongoose.model("User", UserSchema);

  const hashed = await bcrypt.hash("password123", 10);

  await User.create({ email: "test@test.com", password: hashed });

  console.log("User created: test@test.com / password123");
  await mongoose.disconnect();
}

seed();