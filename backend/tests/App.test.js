import mongoose from "mongoose";
import Contact from "../contact.js";
import Group from "../group.js";
import User from "../user.js";
import { MongoMemoryServer } from "mongodb-memory-server";
import dotenv from "dotenv";
dotenv.config();
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

test("should validate required fields", async () => {
  const contactWithoutRequired = new Contact({
    lastName: "Doe",
    email: "john@example.com",
  });

  await expect(contactWithoutRequired.validate()).rejects.toThrow();
});

describe("Contact Schema Tests", () => {

  afterEach(async () => {
    await Contact.deleteMany({});
  });

  test("should create a contact successfully when all required fields are provided", async () => {
    const validContact = {
      firstName: "Diego",
      lastName: "Nieves",
      email: "diego@gmail.com",
      phone: "1234567890",
      user: new mongoose.Types.ObjectId(),
      groups: [new mongoose.Types.ObjectId()],
    };

    const contact = new Contact(validContact);
    const savedContact = await contact.save();

    expect(savedContact._id).toBeDefined();
    expect(savedContact.firstName).toBe(validContact.firstName);
    expect(savedContact.phone).toBe(validContact.phone);
  });

  test("should throw a validation error if required fields are missing", async () => {
    const invalidContact = {
      lastName: "Nieves",
      email: "diego@gmail.com",
    };

    const contact = new Contact(invalidContact);
    let error;
    try {
      await contact.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.name).toBe("ValidationError");
    expect(error.errors.firstName).toBeDefined();
    expect(error.errors.phone).toBeDefined();
  });

  test("should allow the optional fields to be undefined", async () => {
    const validContact = {
      firstName: "Diego",
      phone: "1234567890",
      user: new mongoose.Types.ObjectId(),
      groups: [new mongoose.Types.ObjectId()],
    };

    const contact = new Contact(validContact);
    const savedContact = await contact.save();

    expect(savedContact._id).toBeDefined();
    expect(savedContact.email).toBeUndefined();
    expect(savedContact.image).toBeUndefined();
  });

  test("should save a user to the database", async () => {
    const user = new User({
      name: "Diego",
      email: "diego@gmail.com",
      password: "123456",
    });

    const savedUser = await user.save();
    expect(savedUser._id).toBeDefined();
    expect(savedUser.email).toBe("diego@gmail.com");
  });

  test("should fail to save a user without an email", async () => {
    const user = new User({
      name: "Diego",
      password: "123456",
    });

    await expect(user.save()).rejects.toThrow(mongoose.Error.ValidationError);
  });

  test("should fail to save a user without a password", async () => {
    const user = new User({
      name: "Diego",
      email: "Diego@gmail.com",
    });

    await expect(user.save()).rejects.toThrow(mongoose.Error.ValidationError);
  });

  test("should fail to save a user with a duplicate email", async () => {
    const user1 = new User({
      name: "Diego",
      email: "diego@example.com",
      password: "123456",
    });

    const user2 = new User({
      name: "Paul",
      email: "diego@example.com",
      password: "654321",
    });

    await user1.save();
    await expect(user2.save()).rejects.toThrow();
  });
});

test("should create contact with all required fields", async () => {
  const user = await User.create({
    username: "testuser",
    email: "example@gmail.com",
    password: "password123",
  });

  const group = await Group.create({
    groupName: "Test Group",
    user: user._id,
  });

  const validContact = {
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "1234567890",
    user: user._id,
    groups: [group._id],
  };

  const contact = new Contact(validContact);
  const savedContact = await contact.save();

  expect(savedContact._id).toBeDefined();
  expect(savedContact.firstName).toBe(validContact.firstName);
  expect(savedContact.lastName).toBe(validContact.lastName);
  expect(savedContact.email).toBe(validContact.email);
  expect(savedContact.phone).toBe(validContact.phone);

  expect(savedContact.firstName).toBe("John");
  expect(savedContact.lastName).toBe("Doe");
  expect(savedContact.email).toBe("john@example.com");
  expect(savedContact.phone).toBe("1234567890");
});

test("create a group will all fields", async () => {
  const user = await User.create({
    username: "testuser1",
    email: "example1@gmail.com",
    password: "password1234",
  });

  const validContact = {
    firstName: "Jack",
    lastName: "Jackson",
    email: "jack@example.com",
    phone: "0987654321",
    user: user._id,
  };

  const contact = new Contact(validContact);

  const validGroup = await Group.create({
    groupName: "Test Group",
    user: user._id,
    contacts: [contact],
  });

  const group = new Group(validGroup);
  const savedGroup = await group.save();

  expect(savedGroup.groupName).toBe(validGroup.groupName);
  expect(savedGroup.user).toBe(validGroup.user);
  expect(savedGroup.contacts[0]).toBe(validGroup.contacts[0]);
});

test("create a user with all fields", async () => {
  const user = await User.create({
    username: "testuser2",
    email: "example2@gmail.com",
    password: "password1234",
  });
  const savedUser = await user.save();

  expect(savedUser.name).toBe(user.name);
  expect(savedUser.email).toBe(user.email);
  expect(savedUser.password).toBe(user.password);
});
