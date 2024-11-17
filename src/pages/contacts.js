import React, { useState } from "react";
import ContactCard from "../component/contact-card";
import ContactInfo from "../component/contact-info";
import ContactForm from "../component/contact-form";
import NavBar from "../component/navbar";
import SearchBar from "../component/SearchBar";
import "../style/contacts.css";
import axios from "axios";

// Default contact to send to ContactForm
const defaultContact = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
};

// Sample contacts for initial display
const sampleContactsData = [
  {
    id: 1,
    firstName: "John",
    lastName: "Smith",
    email: "johnsmith@example.com",
    phone: "(123) 456-7890",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/220px-Image_created_with_a_mobile_phone.png",
  },
  {
    id: 2,
    firstName: "Lebron",
    lastName: "James",
    email: "lebron@example.com",
    phone: "(987) 654-3210",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/220px-Image_created_with_a_mobile_phone.png",
  },
];

function Contacts() {
  const [contacts, setContacts] = useState(sampleContactsData); // Use sample contacts as initial state
  const [selectedContact, setSelectedContact] = useState(null);
  const [showContactForm, setShowContactForm] = useState(false);

  const cardClick = (contact) => {
    if (selectedContact === contact) {
      return;
    }
    setSelectedContact(null); // Temporarily reset the selected contact
    setTimeout(() => {
      setSelectedContact(contact); // Set the new contact after a brief delay
    }, 350);
  };

  const toggleContactForm = () => {
    setShowContactForm(!showContactForm);
  };

  async function AddContact(contact, didSubmit) {
    if (!didSubmit) {
      toggleContactForm();
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:8000/contact",
        contact,
      );
      toggleContactForm();
      return response;
    } catch (error) {
      console.log(error);
      // Not handling errors at the moment
      toggleContactForm();
      return false;
    }
  }

  const deleteContact = (contactToDelete) => {
    setContacts((prevContacts) =>
      prevContacts.filter((contact) => contact !== contactToDelete)
    );
    setSelectedContact(null); // Clear selected contact if it was deleted
  };

  return (
    <div className="contactpage">
      <NavBar />
      <div className="main">
        <div className="contactcontainer">
          <div className="contact-controls">
            <div className="search-bar">
              <SearchBar />
            </div>
            
            <button className="addcontact" onClick={toggleContactForm}>
              Add Contact
            </button>
          </div>

          <div className="contactlist">
            {contacts.map((contact) => (
              <div
                key={contact.id} // Use unique ID for key
                className="contactCard"
                onClick={() => cardClick(contact)}
              >
                <ContactCard
                  name={`${contact.firstName} ${contact.lastName}`}
                  image={contact.image}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={`contact-info ${selectedContact ? "active" : ""}`}>
        {selectedContact && (
          <ContactInfo
            contact={selectedContact}
            onDelete={() => deleteContact(selectedContact)}
          />
        )}
      </div>
      {showContactForm && (
        <div className="modal">
          <ContactForm handleSubmit={AddContact} contact={defaultContact} />
        </div>
      )}
    </div>
  );
}

export default Contacts;
