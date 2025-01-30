import React, { useState } from "react";
import ContactCard from "../component/contact-card";
import ContactInfo from "../component/contact-info";
import ContactForm from "../component/contact-form";
import NavBar from "../component/navbar";
import SearchBar from "../component/SearchBar";
import "../style/contacts.css";
import axios from "axios";
import noImage from "../assets/no_image.jpg";
import useSWR from "swr";
import GroupForm from '../component/group-form';
import { fetchContacts } from "../hooks/fetchContacts";
import Pins from "../component/contact-pins";

// Default contact to send to ContactForm
const defaultContact = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
};

function Contacts({ setAccessToken }) {
  const [selectedContact, setSelectedContact] = useState(null);
  const [showContactForm, setShowContactForm] = useState(null);
  const [filter, setFilter] = useState("");
  const [groupAdd, setGroupAdd] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  
  const { data: contactData, error: contactError, isLoading: contactLoading, mutate:  mutateContact } = useSWR(
    `http://localhost:8000/contact?filter=${filter}`,
    fetchContacts,
  );

  const { data: pinData, error: pinError, isLoading: pinLoading, mutate: mutatePin } = useSWR(
    `http://localhost:8000/contact?pin=${true}`,
    fetchContacts,
  );

  const toggleAdd = () => {
    setIsAdding(!isAdding);
  };

  const fetchGroups = async (url) => {
    const response = await axios.get(url, {
      withCredentials: true,
    });
    return response.data;
  };
  const { data: groupData, error: groupError, mutate: groupMutate } = useSWR(
    `http://localhost:8000/group`,
    fetchGroups,
  );

  async function AddGroup(group, didSubmit) {
    console.log(group);
    if (!didSubmit) {
      setGroupAdd(false);
      return;
    }
    try {
      const response = await axios.post(
        'http://localhost:8000/group',
        group,
        { withCredentials: true },
      );
      setGroupAdd(false);
      groupMutate();
      return response;
    } catch (error) {
      console.log(error);
      // Not handling errors at the moment
      // toggleContactForm();
      return false;
    }
  }

  const cardClick = (contact) => {
    if (selectedContact === contact) {
      return;
    }
    setSelectedContact(contact);
  };

  const toggleContactForm = () => {
    setShowContactForm(!showContactForm);
  };

  const handleSearchResults = (matches) => {
    setFilter(matches);
    mutateContact();
  };

  async function AddContact(contact, didSubmit) {
    if (!didSubmit) {
      toggleContactForm();
      return;
    }
    try {
      const response = await axios.post(
        'http://localhost:8000/contact',
        contact,
        { withCredentials: true },
      );
      toggleContactForm();
      mutateContact();
      return response;
    } catch (error) {
      console.log(error);
      // Not handling errors at the moment
      toggleContactForm();
      return false;
    }
  }

  // Updates site when Editing and Deleting.
  function updateSite(contact) {
    mutateContact();
    mutatePin();
    setSelectedContact(contact);
  }

  return (
    <div className="contactpage">
      <NavBar
        setAccessToken={setAccessToken}
        setGroupAdd={setGroupAdd}
        groups={groupData}
      />
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
        <Pins cardClick={cardClick} contacts={pinData} />
          {contactData &&
            contactData.map((contact, index) => (
              <div
                key={index}
                className='contactCard'
                onClick={() => cardClick(contact)}
              >
                <ContactCard
                  name={contact.firstName + " " + contact.lastName}
                  image={contact.image || noImage}
                />
              </div>
            ))}
        </div>
      </div>
      {selectedContact && (
        <div className={`contact-info ${selectedContact ? "active" : ""}`}>
          <ContactInfo
            contact={selectedContact}
            defaultContact={defaultContact}
            updateSite={updateSite}
          />
        </div>
      )}
      {showContactForm && (
        <div className='modal'>
          <ContactForm handleSubmit={AddContact} contact={defaultContact} isUser={false}/>
        </div>
      )}
      {groupAdd && (
        <div className='modal'>
          <GroupForm setGroupAdd={setGroupAdd} handleSubmit={AddGroup} />
        </div>
      )}
    </div>
  );
}

export default Contacts;
