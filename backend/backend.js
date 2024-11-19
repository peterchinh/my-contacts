// backend.js
import express from "express";
import cors from "cors";
import connectDB from "./database.js";
import User from "./user.js";
import Contact from "./contact.js"
import bcrypt from "bcrypt";
import Group from "./group.js";

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

app.get("/group", async (req, res) => {
  try {
    const { user } = req.body;
    const groups = await Group.find({user: user});
    res.json(groups);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post("/group", async (req, res) => {
  try {
    const newGroup = new Group(req.body);
    await newGroup.save();
    res.status(200).json(newGroup);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
})

app.put("/group/:id", async (req, res) => {
  try {
    const groupId = req.params.id;
    const { groupName, newContact } = req.body;
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({error: "Group not found"})
    }

    if (groupName) {
      group.groupName = groupName;
    }
    if (newContact) {
      if (!group.contacts.includes(newContact)) {
        group.contacts.push(newContact);
      } else {
        return res.status(400).json({error: "Contact already in group"});
      }
    }
    const updatedGroup = await group.save();
    res.status(200).json(updatedGroup);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
})

const PORT = process.env.PORT || 8000;
app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server is running on port ${PORT}`);
});

