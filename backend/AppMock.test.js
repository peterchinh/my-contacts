/* NOTES FOR PROFESSOR:
    These tests are not a direct reflection on App.test.js, because those tests are for
    the schemas themselves. Mocking the schemas in replacement for those tests would
    be redundant. The whole point of testing the schemas is to make the actual calls.
    We are testing the backend instead as that's what uses these calls.

    In comparison, AppMock.test.js has slightly faster runtimes than App.test.js. AppMock
    replaces some of the database calls with mock calls - database calls are the slowest
    parts of the tests. We also show replacement of a hash function in the first describe.

    Below are some examples of endpoints in the backend that make sense to use mocks
    with.
*/


// Testing backend.js
import { describe, expect, test, jest } from '@jest/globals';
import express from "express";
import app from "./backend.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "./user.js";
import Contact from "./contact.js"
import request from "supertest";



describe("POST /users", () => {

  const testUser = {
    firstName: "Lebron",
     lastName: "James",
     email: "LebronJames@example.com",
     password: "hashedPassword123",
  };

  beforeEach(async () => {
    await User.deleteOne({ email: testUser.email});
  });

  /* Need to mock the hash in /users */
  beforeEach(() =>  {
    bcrypt.hash = jest.fn().mockResolvedValue("hashpass1");
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
    const response = await request(app).post("/users").send("Not a user!");
    expect(response.status).toBe(400);
  });

  it("should return 400 Email is already taken", async () => {
    const response = await request(app).post("/users").send(testUser);
    expect(response.status).toBe(201);
    const testUser2 = {
      firstName: "Le",
      lastName: "Bron",
      email: "LebronJames@example.com",
      password: "differenthash123",
    };
    const response2 = await request(app).post("/users").send(testUser2);
    expect(response2.status).toBe(400);
    expect(response2.body.error).toBe("Email is already taken");

  });
});

describe("PUT /contact:id", () => {

  const testContact = {
    firstName: "Lebron",
    lastName: "James",
    phone: "(101)-010-1412",
    email: "LebronJames@example.com",
    _id: "60c72b2f9d1e4f1b8c7e38f2",
  }

  it("should return 404 Contact not found", async () => {
    const response = await request(app).put("/contact/60c72b2f9d1e4f1b8c7e38f2").send(testContact);
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
    const response = await request(app).put("/contact/invalididformat");
    expect(response.status).toBe(404);
  });
});

describe("DELETE /contact:id", () => {
  it("should return 404 Contact not found", async () => {
    const response = await request(app).delete("/contact/60c72b2f9d1e4f1b8c7e38f2");
    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Contact not found");
  });

  it("should return 200 and the updated contact", async () => {
    /* Here's where we'll need to mock */
    Contact.findByIdAndDelete = jest.fn().mockResolvedValueOnce(1);
    const response = await request(app).delete("/contact/random");
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Contact deleted successfully");
  });

  it("should return 400", async () => {
    const response = await request(app).delete("/contact/invalididformat");
    expect(response.status).toBe(404);
  });
});