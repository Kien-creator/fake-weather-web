require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path'); // Import path module

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// User Schema
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});
const User = mongoose.model('User', UserSchema);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Route for register.html
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

// Route for login.html
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Route for dashboard.html
const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");

  if (!token) return res.status(401).json({ message: "Access denied" });

  try {
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      req.user = verified;
      next();
  } catch (err) {
      res.status(400).json({ message: "Invalid token" });
  }
};

// Get user info
app.get("/user", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
});

// Register Endpoint
app.post('/register', async (req, res) => {
  try {
      console.log("🔹 Register request received:", req.body);

      const { name, email, password } = req.body;

      // Kiểm tra xem có thiếu trường nào không
      if (!name || !email || !password) {
          return res.status(400).json({ message: "All fields are required" });
      }

      // Regex kiểm tra email (chỉ chứa chữ cái, số, ., -, _ và không có khoảng trắng)
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
          return res.status(400).json({ message: "Invalid email format" });
      }

      // Kiểm tra mật khẩu (không có dấu cách và ít nhất 6 ký tự)
      if (password.length < 6 || /\s/.test(password)) {
          return res.status(400).json({ message: "Password must be at least 6 characters and cannot contain spaces" });
      }

      // Kiểm tra email đã tồn tại chưa
      const existingUser = await User.findOne({ email });
      if (existingUser) {
          return res.status(400).json({ message: "Email already exists" });
      }

      console.log("🔹 Creating new user:", email);
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ name, email, password: hashedPassword });

      await newUser.save();
      console.log("✅ User registered successfully");

      res.status(201).json({ message: "User registered successfully" });

  } catch (err) {
      console.error("❌ Error in /register:", err);
      res.status(500).json({ error: err.message });
  }
});


// Login Endpoint
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "User not found" });

    console.log("Stored Hashed Password:", user.password);  // 🔍 Debugging

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password Match:", isMatch);  // 🔍 Debugging

    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
