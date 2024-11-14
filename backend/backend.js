// backend.js
import express from "express";
import cors from "cors";
import connectDB from "./database.js";
import User from "./user.js";
import Contact from "./contact.js"
import bcrypt from "bcrypt";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/users", async (req, res) => {
  try {
    const {name, email, password:plainTextPassword}= req.body;
    const salt = 10;
    const password = await bcrypt.hash(plainTextPassword, salt);
    const response = await User.create({
      name,
      email,
      password
    })
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

app.post('/users/login', async(req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({email}).lean()
    if (!user) {
      res.status(404).json({ error: "Email does not have an account"});
    } else {
      if (await bcrypt.compare(password, user.password)) {
        res.send(200);
      } else {
        res.status(400).json({ error: "Incorrect Password"});
      }
    }
  } catch (err) {
    res.status(400).json({ error: err.message})
  }
});

app.post("/contact", async (req, res) => {
  try {
    const newContact = new Contact(req.body);
    await newContact.save();
    res.status(200).json(newContact);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/contact", async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put("/contact/:id", async (req, res) => {
  try {
    const updatedContact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
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

// skeleton