import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
});

const Contact = mongoose.model("Contact", contactSchema);
export default Contact;
