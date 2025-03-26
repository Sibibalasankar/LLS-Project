import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.log("❌ MongoDB Connection Error:", err));

const UserSchema = new mongoose.Schema({
  username: String,
  password: String
});
const User = mongoose.model("User", UserSchema);

const createUser = async () => {
  const hashedPassword = await bcrypt.hash("password123", 10);

  const newUser = new User({
    username: "testuser",
    password: hashedPassword
  });

  await newUser.save();
  console.log("✅ User added successfully!");
  mongoose.connection.close();
};

createUser();
