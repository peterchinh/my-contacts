import mongoose from "mongoose";
import Contact from "./contact.js";
import User from "./user.js"
import { MongoMemoryServer } from "mongodb-memory-server";

describe("Contact Schema Tests", () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

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

