// backend.js
import express from 'express';
import cors from 'cors';
import connectDB from './database.js';
import User from './user.js';
import Contact from './contact.js';
import Group from './group.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import s3 from './amazons3.js';
import { v4 as uuidv4 } from 'uuid';

const app = express();
app.use(
  cors({
    origin: `${process.env.BASE_URL}`,
    credentials: true,
  }),
);
dotenv.config();
app.use(express.json());
app.use(cookieParser());

app.post('/users', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password: plainTextPassword,
    } = req.body;
    const salt = 10;
    const password = await bcrypt.hash(plainTextPassword, salt);
    await User.create({
      firstName,
      lastName,
      email,
      password,
    });
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    if (err.code === 11000 && err.keyPattern.email) {
      return res.status(400).json({ error: 'Email is already taken' });
    }
    res.status(400).json({ error: err.message });
  }
});

app.get('/users', async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      try {
        const userData = await User.findById(user.id);
        if (!userData) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.json(userData);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    },
  );
});

app.put('/users/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      },
    );
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() }).lean();
    if (!user) {
      res.status(404).json({ error: 'Email does not have an account' });
    } else {
      if (await bcrypt.compare(password, user.password)) {
        const accessToken = generateAccessToken({ id: user._id });
        const refreshToken = generateRefreshToken({ id: user._id });

        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: true, //Make true in production
          sameSite: 'None',
          maxAge: 7 * 24 * 60 * 60 * 1000,
          domain: 'lecontacts.azurewebsites.net',
          path: '/',
        });
        res.status(200).json({ accessToken });
      } else {
        res.status(400).json({ error: 'Incorrect Password' });
      }
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/logout', (req, res) => {
  res.cookie('refreshToken', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    domain: 'lecontacts.azurewebsites.net',
    path: '/',
    expires: new Date(0), // This sets the cookie to expire immediately
  });
  res.status(200).json({ message: 'Logged out' });
});

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1m' }); // Short-lived JWT
}

function generateRefreshToken(user) {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' }); // Long-lived refresh token
}

app.post('/refresh', (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const newAccessToken = generateAccessToken({ id: user.id });
    return res.status(200).json({ accessToken: newAccessToken });
  });
});

app.post('/contact', async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, user) => {
      try {
        if (err) {
          return res.status(403).json({ message: 'Forbidden' });
        }
        req.body.user = user.id;
        const newContact = new Contact(req.body);
        await newContact.save();
        res.status(200).json(newContact);
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
    },
  );
});

app.get('/contact', async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, user) => {
        if (err) {
          return res.status(403).json({ message: 'Forbidden' });
        }
        const contacts = await Contact.find({ user: user.id });
        res.json(contacts);
      },
    );
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/pins', async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, user) => {
        if (err) {
          return res.status(403).json({ message: 'Forbidden' });
        }
        const groupId = req.query.groupId;
        let contacts;
        if (groupId) {
          contacts = await Contact.find({ user: user.id, pin: true,  groups: { "$in" : [groupId]}}).sort({
            firstName: 'asc',
            lastName: 'asc',
          });
        } else {
          contacts = await Contact.find({ user: user.id, pin: true }).sort({
            firstName: 'asc',
            lastName: 'asc',
          });
        }
        res.json(contacts);
      },
    );
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/contact/sorted', async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, user) => {
        if (err) {
          return res.status(403).json({ message: 'Forbidden' });
        }
        const firstOrder = req.query.firstName;
        const lastOrder = req.query.lastName;
        const order = {firstName: firstOrder, lastName: lastOrder}
        const groupId = req.query.groupId;
        let contacts;
        if (groupId) {
          contacts = await Contact.find({ user: user.id, groups: { "$in" : [groupId]} }).sort(order);
        } else {
          contacts = await Contact.find({ user: user.id }).sort(order);
        }
        res.json(contacts);
      },
    );
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/contact/:id', async (req, res) => {
  try {
    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    if (!updatedContact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.status(200).json(updatedContact);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/contact/:id', async (req, res) => {
  try {
    const deletedContact = await Contact.findByIdAndDelete(req.params.id);
    if (!deletedContact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.status(200).json({ message: 'Contact deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/group', async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, user) => {
      try {
        if (err) {
          return res.status(403).json({ message: 'Forbidden' });
        }
        req.body.user = user.id;
        const groups = await Group.find({ user: user.id });
        res.json(groups);
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
    },
  );
});

app.get('/group/:id', async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, user) => {
      try {
        if (err) {
          return res.status(403).json({ message: 'Forbidden' });
        }
        const groupId = req.params.id;
        const group = await Group.findOne({ user: user.id, _id: groupId });
        res.json(group);
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
    },
  );
});

app.post('/group', async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, user) => {
      try {
        if (err) {
          return res.status(403).json({ message: 'Forbidden' });
        }
        req.body.user = user.id;
        const newGroup = new Group(req.body);
        await newGroup.save();
        res.status(200).json(newGroup);
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
    },
  );
});

app.put('/group/:id', async (req, res) => {
  try {
    const groupId = req.params.id;
    const { groupName, newContact } = req.body;
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    if (groupName) {
      group.groupName = groupName;
    }
    if (newContact) {
      if (!group.contacts.includes(newContact)) {
        group.contacts.push(newContact);
        await Contact.updateOne({_id: newContact}, {$push: {groups: groupId}})
      } else {
        return res.status(400).json({ error: 'Contact already in group' });
      }
    }
    const updatedGroup = await group.save();
    res.status(200).json(updatedGroup);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/group/:id/remove', async (req, res) => {
  try {
    const groupId = req.params.id;
    const { contactId } = req.body; // Expecting `contactId` in the request body

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    // Check if the contact is actually in the group
    if (!group.contacts.includes(contactId)) {
      return res
        .status(400)
        .json({ error: 'Contact is not in the group' });
    }

    // Remove the contact from the group's contacts array
    group.contacts = group.contacts.filter((id) => id.toString() !== contactId);
    
    const updatedGroup = await group.save();
    await Contact.updateOne({_id: contactId}, {$pull: {groups: groupId}})
    res.status(200).json(updatedGroup);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/s3-url', async (req, res) => {
  try {
    const { filename, filetype } = req.body;
    const fileKey = `${uuidv4()}-${filename}`;
    const s3Params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileKey,
      Expires: 60,
      ContentType: filetype,
    };
    const signedUrl = await s3.getSignedUrlPromise('putObject', s3Params);
    res.status(200).json({
      signedUrl,
      fileUrl:
        `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`,
      fileKey,
    });
  } catch (err) {
    console.error('Error generating signed URL:', err);
    res.status(500).json({ error: 'Error generating signed URL' });
  }
});

app.get('/s3-url', async (req, res) => {
  const params = {
    Bucket: '308-mycontacts1',
  };

  try {
    s3.listObjectsV2(params, (err, data) => {
      if (err) {
        return res.status(500).json({
          error: 'Error fetching files from S3',
          details: err.message,
        });
      }
      const files = data.Contents.map((file) => file.Key);
      res.json({ files });
    });
  } catch (err) {
    res.status(500).json({
      error: 'Error fetching files from S3',
      details: err.message,
    });
  }
});

app.delete('/delete-image/:fileKey', async (req, res) => {
  const { fileKey } = req.params;
  const s3Params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: fileKey,
  };

  try {
    await s3.deleteObject(s3Params).promise();
    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image', error);
    res.status(500).json({ error: 'Error deleting image' });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server is running on port ${PORT}`);
});


export default app;
