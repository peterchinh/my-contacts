import React, { useState } from "react";
import ContactCard from "../component/contact-card";
import ContactInfo from "../component/contact-info";
import ContactForm from "../component/contact-form";
import NavBar from "../component/navbar";
import SearchBar from "../component/SearchBar";
import "../style/contacts.css";
import axios from "axios";
import noImage from "../assets/no_image.jpg";

// Default contact to send to ContactForm
const defaultContact = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
};

function Contacts({ sampleContacts }) {
  const [selectedContact, setSelectedContact] = useState(null);
  const [showContactForm, setShowContactForm] = useState(null);
  const [contacts, setContacts] = useState(sampleContacts);

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

  const handleSearchResults = (matches) => {
    console.log(matches);
    setContacts(matches);
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
      updateSite(contact); // Render new contact on page
      toggleContactForm();
      return response;
    } catch (error) {
      console.log(error);
      // Not handling errors at the moment
      toggleContactForm();
      return false;
    }
  }

  // Refactor this into useEffect later?
  async function updateSite(newContact) {
    try{
        const response = await axios.get("http://localhost:8000/contact");
        setContacts(response.data);
        setSelectedContact(newContact);
        return;
    } catch(error) {
        console.log(error);
        // Note: Update error handling
        return;
    }
  }

  return (
    <div className="contactpage">
      <NavBar />
      <div className="main">
        <div className="contactcontainer">
          <div className="contact-controls">
            <div className="search-bar">
              <SearchBar onSearchResults={handleSearchResults} />
            </div>

            <button className="addcontact" onClick={toggleContactForm}>
              Add Contact
            </button>
          </div>

          <div className="contactlist">
            {contacts.map((contact, index) => (
              <div
                key={index}
                className="contactCard"
                onClick={() => cardClick(contact)}
              >
                <ContactCard
                  name={contact.firstName + " " + contact.lastName}
                  image={noImage}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={`contact-info ${selectedContact ? "active" : ""}`}>
        <ContactInfo
            contact={selectedContact}
            defaultContact={defaultContact}
            updateSite={updateSite}
        />
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
