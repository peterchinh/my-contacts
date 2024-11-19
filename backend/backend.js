// backend.js
import express from "express";
import cors from "cors";
import connectDB from "./database.js";
import User from "./user.js";
import Contact from "./contact.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
dotenv.config();
app.use(express.json());
app.use(cookieParser());

app.post("/users", async (req, res) => {
  try {
    const { name, email, password: plainTextPassword } = req.body;
    const salt = 10;
    const password = await bcrypt.hash(plainTextPassword, salt);
    const response = await User.create({
      name,
      email,
      password,
    });
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    if (err.code === 11000 && err.keyPattern.email) {
      return res.status(400).json({ error: "Email is already taken" });
    }
    res.status(400).json({ error: err.message });
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post("/users/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).lean();
    if (!user) {
      res.status(404).json({ error: "Email does not have an account" });
    } else {
      if (await bcrypt.compare(password, user.password)) {
        const accessToken = generateAccessToken({ id: user._id });
        const refreshToken = generateRefreshToken({id: user._id });

        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: false, //Make true in production
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(200).json({ accessToken });
      } else {
        res.status(400).json({ error: "Incorrect Password" });
      }
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "Logged out" });
});

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "5m" }); // Short-lived JWT
}

function generateRefreshToken(user) {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" }); // Long-lived refresh token
}

app.post("/refresh", (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const newAccessToken = generateAccessToken({ id: user.id });
    return res.status(200).json({ accessToken: newAccessToken });
  });
});

app.post("/contact", async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Forbidden" });
      }
      req.body.user = user.id;
      const newContact = new Contact(req.body);
      await newContact.save();
      res.status(200).json(newContact);
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/contact", async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Forbidden" });
      }
      const contacts = await Contact.find({ user: user.id });
      res.json(contacts);
    });
    
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put("/contact/:id", async (req, res) => {
  try {
    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    if (!updatedContact) {
      return res.status(404).json({ error: "Contact not found" });
    }
    res.status(200).json(updatedContact);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/contact/:id", async (req, res) => {
  try {
    const deletedContact = await Contact.findByIdAndDelete(req.params.id);
    if (!deletedContact) {
      return res.status(404).json({ error: "Contact not found" });
    }
    res.status(200).json({ message: "Contact deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server is running on port ${PORT}`);
});
