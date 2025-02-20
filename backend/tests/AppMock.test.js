/* NOTES FOR PROFESSOR:
    These tests are not a direct reflection on App.test.js, because those tests are for
    the schemas themselves. Mocking the schemas in replacement for those tests would
    be redundant. The whole point of testing the schemas is to make the actual calls.
    We are testing the backend instead as that's what uses these calls. Below are some
    examples of endpoints in the backend that make sense to use mocks with.

MOCK TESTS TIME:
Time:        3.978 s, estimated 4 s

ORIGINAL TESTS TIME:
Time:        3.483 s, estimated 4 s

    In comparison, App.test.js has slightly faster runtimes than AppMock.test.js. AppMock
    replaces the database calls with mock calls, and replaces other parts of backend
    calls like the hash function. But it is still slower because it requires the backend to
    start up each time.
*/


// Testing backend.js
import { describe, expect, test, jest } from '@jest/globals';
import express from "express";
import app from "../backend.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../user.js";
import Contact from "../contact.js";
import Group from "../group.js";
import request from "supertest";

// Using a known test user's id, used later for generating valid tokens

const testUser = {
  _id: "6757f3664f07db55be11ca76",
  email: "user@test.com",
  password: "hashpass1",
};

const testContact = {
    firstName: "Lebron",
    lastName: "James",
    phone: "(101)-010-1412",
    email: "LebronJames@example.com",
    user: "mockID",
    _id: "60c72b2f9d1e4f1b8c7e38f2",
};


describe("POST /users", () => {

  /* Need to mock the hash in /users */
  beforeEach(() =>  {
    bcrypt.hash = jest.fn().mockResolvedValueOnce("hashpass1");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should create a new user, returning a 201", async () => {
    /* Mocking the Database call */
    jest.spyOn(User, 'create').mockResolvedValueOnce(testUser);
    const response = await request(app).post("/users").send(testUser);
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("User created successfully");
  });

  it("should return 400", async () => {
    const mockError = {
        code: 400,
        keyPattern: {email: 1}
    };
    jest.spyOn(User, "create").mockRejectedValue(mockError);

    const response = await request(app).post("/users").send("Not a user!");
    expect(response.status).toBe(400);
  });

  it("should return 400 Email is already taken", async () => {
     const mockError = {
         code: 11000,
         keyPattern: {email: 1}
     };
    jest.spyOn(User, "create").mockRejectedValue(mockError);
    const testUser2 = {
      firstName: "Le",
      lastName: "Bron",
      email: "LebronJames@example.com",
      password: "differenthash123",
    };
    const response = await request(app).post("/users").send(testUser2);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Email is already taken");

  });
});

describe ("GET /users", () => {
  let refreshToken;

  it("should return valid user data when given a valid id and token", async () => {
    // We need to use a known test user's id to generate a valid refresh token
    const secret = process.env.REFRESH_TOKEN_SECRET || "secret-key";
    refreshToken = jwt.sign({ id: testUser._id.toString() }, secret, { expiresIn: "7d" });

    const response = await request(app).get("/users").set("Cookie", `refreshToken=${refreshToken}`);
    expect(response.body).toHaveProperty("_id", testUser._id.toString());
  });

  it("should return 404 User not found", async () => {
    // We shall use a randomly generated _id to simulate searching a user that doesn't exist
    const secret = process.env.REFRESH_TOKEN_SECRET || "secret-key";
    refreshToken = jwt.sign({ id: "507f1f77bcf86cd799439011" }, secret, { expiresIn: "7d" });

    const response = await request(app).get("/users").set("Cookie", `refreshToken=${refreshToken}`);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("User not found");
  });

  it("should return 500 with an invalid token", async () => {
    // Ex, an invalid ObjectID format will generate an invalid token.
    const secret = process.env.REFRESH_TOKEN_SECRET || "secret-key";
    refreshToken = jwt.sign({ id: "invalid-format-id"}, secret, {expiresIn: "7d"});

    const response = await request(app).get("/users").set("Cookie", `refreshToken=${refreshToken}`);
    expect(response.status).toBe(500);
  });
});

describe("PUT /users/:id", () => {
  it("should return 404 Contact not found", async () => {
    jest.spyOn(User, "findByIdAndUpdate").mockResolvedValueOnce(false);
    const response = await request(app).put("/users/anyID").send(testUser);
    expect(response.status).toBe(404);
    expect(response.body.error).toBe("User not found");
  });

  it("should return 200 and updated user data", async () => {
    jest.spyOn(User, "findByIdAndUpdate").mockResolvedValueOnce(testUser);
    const response = await request(app).put("/users/validID").send(testUser);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(testUser);
  });

  it("should return 400", async () => {
    jest.spyOn(User, "findByIdAndUpdate").mockRejectedValue({ code: 400 });
    const response = await request(app).put("/users/invalidIdFormat");
    expect(response.status).toBe(400);
  });
});

describe("POST /users/login", () => {

  it("should return 404 Email does not have account", async () => {
    // Mocking not finding the user by email
    jest.spyOn(User, "findOne").mockReturnValueOnce({
      lean: jest.fn().mockResolvedValueOnce(null),
    });
    const response = await request(app).post("/users/login").send(testUser);

    expect(response.status).toBe(404);
    expect(response.body.error).toEqual("Email does not have an account");
  });

  it("should return 400", async () => {
    // Mock a common error like a database error
    jest.spyOn(User, "findOne").mockReturnValueOnce({
      lean: jest.fn().mockRejectedValue(new Error("Database error")),
    });
    const response = await request(app).post("/users/login").send(testUser);
    expect(response.status).toBe(400);
  });

  it("should return 400 incorrect password", async () => {
    // Mock Password won't match mocked return password
    jest.spyOn(User, "findOne").mockReturnValueOnce({
          lean: jest.fn().mockReturnValue({ password: "mockPassword"}),
    });
    const response = await request(app).post("/users/login").send(testUser);
    expect(response.status).toBe(400);
    expect(response.body.error).toEqual("Incorrect Password");
  });

  it("should return 200 and access token", async () => {
    // Mock Password won't match mocked return password
    jest.spyOn(User, "findOne").mockReturnValueOnce({
      lean: jest.fn().mockResolvedValue({ password: "mockPassword"}),
    });

    bcrypt.compare = jest.fn().mockResolvedValueOnce(true);
    const response = await request(app).post("/users/login").send(testUser);
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  });

});

describe("POST /logout", () => {
  it("should return 200 logged out", async () => {
    const response = await request(app).post("/logout");
    expect(response.status).toBe(200);
    expect(response.body.message).toEqual("Logged out");
  });
});

describe("POST /refresh", () => {
  it("should return 401 unauthorized", async () =>{
     const response = await request(app).post("/refresh").set("Cookie", `refreshToken=`);
     expect(response.status).toBe(401);
     expect(response.body.message).toEqual("Unauthorized");
  });

  it("should return 403 forbidden", async () => {
    const wrongSecret = "wrongSecret";
    const refreshToken = jwt.sign({ id: "invalid-ID" }, wrongSecret, { expiresIn: "7d" });
    const response = await request(app).post("/refresh").set("Cookie", `refreshToken=${refreshToken}`);
    expect(response.status).toBe(403);
    expect(response.body.message).toEqual("Forbidden");
  });

  it("should return 200 and a new accessToken", async () => {
    const secret = process.env.REFRESH_TOKEN_SECRET || "secret-key";
    const refreshToken = jwt.sign({ id: testUser._id }, secret, { expiresIn: "7d" });
    const response = await request(app).post("/refresh").set("Cookie", `refreshToken=${refreshToken}`);
    expect(response.status).toBe(200);
    expect(response.body.accessToken).toBeDefined();
  });
});

describe("POST /contact", () => {
  it("should return 403 forbidden", async () => {
    const wrongSecret = "wrongSecret";
    const refreshToken = jwt.sign({ id: "invalid-ID" }, wrongSecret, { expiresIn: "7d" });
    const response = await request(app).post("/contact").set("Cookie", `refreshToken=${refreshToken}`);
    expect(response.status).toBe(403);
    expect(response.body.message).toEqual("Forbidden");
  });

  it("should return 400 for other errors", async () => {
    // Send in a valid token
    const secret = process.env.REFRESH_TOKEN_SECRET || "secret-key";
    const refreshToken = jwt.sign({ id: testUser._id }, secret, { expiresIn: "7d" });

    // We don't send a user nor a contact, so an error should occur
    const response = await request(app).post("/contact").set("Cookie", `refreshToken=${refreshToken}`);
    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });

  it("should return 200 and the new contact", async () => {
    jest.spyOn(Contact, "create").mockResolvedValueOnce(testContact);
    const secret = process.env.REFRESH_TOKEN_SECRET || "secret-key";
    const refreshToken = jwt.sign({ id: testUser._id }, secret, { expiresIn: "7d" });
    const response = await request(app).post("/contact")
      .send(testContact)
      .set("Cookie", `refreshToken=${refreshToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  });
});

describe("GET /contact", () => {
  it("should return 403 forbidden", async () => {
    const wrongSecret = "wrongSecret";
    const refreshToken = jwt.sign({ id: "invalid-ID" }, wrongSecret, { expiresIn: "7d" });
    const response = await request(app).get("/contact").set("Cookie", `refreshToken=${refreshToken}`);
    expect(response.status).toBe(403);
    expect(response.body.message).toEqual("Forbidden");
  });

  it("should return a list of contacts", async () => {
    // No mocks will be used, a real list of contacts will be generated
    const secret = process.env.REFRESH_TOKEN_SECRET;
    const refreshToken = jwt.sign({ id: testUser._id }, secret, { expiresIn: "7d" });
    // Note that no filter is used.
    const response = await request(app).get("/contact")
    .set("Cookie", `refreshToken=${refreshToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  });

  it("should return 400 for invalid token issues", async () => {
    // Send in a valid token
    const secret = process.env.REFRESH_TOKEN_SECRET || "secret-key";
    const refreshToken = jwt.sign({}, secret, { expiresIn: "7d" });
    jest.spyOn(Contact, "find").mockRejectedValueOnce(new Error("Database error"));
    // We will use a filter to trigger a mock DB error
    const response = await request(app).get(`/contact?filter='John'`)
      .set("Cookie", `refreshToken=${refreshToken}`);
    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });

  it("should return a filtered list of contacts", async () => {
    // Send in a valid token
    const secret = process.env.REFRESH_TOKEN_SECRET || "secret-key";
    const refreshToken = jwt.sign({}, secret, { expiresIn: "7d" });
    const response = await request(app).get(`/contact?filter='John'`)
      .set("Cookie", `refreshToken=${refreshToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  });
});

describe("PUT /contact/:id", () => {

  it("should return 404 Contact not found", async () => {
    jest.spyOn(Contact, "findByIdAndUpdate").mockResolvedValueOnce(false);
    const response = await request(app).put("/contact/anyID").send(testContact);
    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Contact not found");
  });

  it("should return 200 and the updated contact", async () => {
    /* Here's where we'll need to mock */
    Contact.findByIdAndUpdate = jest.fn().mockResolvedValueOnce(testContact);
    const response = await request(app).put("/contact/random").send(testContact);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(testContact);

  });

  it("should return 400", async () => {
    jest.spyOn(Contact, "findByIdAndUpdate").mockRejectedValue({ code: 400 });
    const response = await request(app).put("/contact/invalidIdFormat");
    expect(response.status).toBe(400);
  });
});

describe("DELETE /contact:id", () => {
  it("should return 404 Contact not found", async () => {
    jest.spyOn(Contact, "findByIdAndDelete").mockResolvedValueOnce(0);
    const response = await request(app).delete("/contact/validID");
    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Contact not found");
  });

  it("should return 200 and the updated contact", async () => {
    Contact.findByIdAndDelete = jest.fn().mockResolvedValueOnce(1);
    const response = await request(app).delete("/contact/random");
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Contact deleted successfully");
  });

  it("should return 400", async () => {
    jest.spyOn(Contact, "findByIdAndDelete").mockRejectedValue({ code: 400 });
    const response = await request(app).delete("/contact/invalidIdFormat");
    expect(response.status).toBe(400);
  });
});

describe("GET /group", () => {
  it("should return 404 Contact not found", async () => {
    jest.spyOn(Contact, "findByIdAndUpdate").mockResolvedValueOnce(null);
    const response = await request(app).get("/group");
    expect(response.status).toBe(404);
    expect(response.body.error).toEqual("Contact not found");
  });

  it("should return 400 for other errors", async () => {
    jest.spyOn(Contact, "findByIdAndUpdate").mockRejectedValueOnce(new Error("Database error"));
    const response = await request(app).get("/group");
    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });

  it("should return 200 and groups", async () => {
    jest.spyOn(Contact, "findByIdAndUpdate").mockResolvedValueOnce(testContact);
    // A user not having any groups yet is not an error.
    jest.spyOn(Group, "find").mockResolvedValueOnce({group: "randomGroup"});
    const response = await request(app).get("/group");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({group: "randomGroup"});
  });
});

describe("POST /group", () => {
  it("should return 200 and the new group", async () => {
    jest.spyOn(Group, "create").mockResolvedValueOnce({group: "newGroup"});
    // Nothing needs to be sent, but this is how the call would be made
    const response = await request(app).post("/group")
      .send({group: "newGroup"});
    expect(response.status).toBe(200);
    expect(response.body).toEqual({group: "randomGroup"});
  });

  it("should return 400 for other errors", async () => {
    // Will mock a DB error
    jest.spyOn(Group, "create").mockRejectedValueOnce(new Error("Database Error"));
    const response = await request(app).post("/group").send({});
    expect(response.status).toBe(400);
    expect(response.body.error).toEqual("Database Error");
  });
});

describe("PUT /group/:id", () => {
  it("should return 404 Group not found", async () => {
    jest.spyOn(Group, "findById")
  });
});