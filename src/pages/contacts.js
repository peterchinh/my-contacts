import React, { useCallback, useEffect, useState } from "react";
import ContactCard from "../component/contact-card";
import ContactInfo from "../component/contact-info";
import ContactForm from "../component/contact-form";
import NavBar from "../component/navbar";
import SearchBar from "../component/SearchBar";
import "../style/contacts.css";
import axios from "axios";
import noImage from "../assets/no_image.jpg";
import useSWR, { preload } from "swr";
import GroupForm from '../component/group-form';
import { fetchContacts } from "../hooks/fetchContacts";
import Pins from "../component/contact-pins";
import { FaSortAlphaDown, FaSortAlphaDownAlt } from "react-icons/fa";
import { useParams } from "react-router-dom";

// Default contact to send to ContactForm
const defaultContact = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
};

preload([`http://localhost:8000/contact`, {firstName:  'asc', lastName: 'asc'}],
  ([url, token]) => fetchContacts(url, token),
)
preload([`http://localhost:8000/contact`, {firstName:  'desc', lastName: 'asc'}],
  ([url, token]) => fetchContacts(url, token),
)

function Contacts({ setAccessToken }) {
  const [selectedContact, setSelectedContact] = useState(null);
  const [showContactForm, setShowContactForm] = useState(null);
  const [filtered, setFiltered] = useState(null);
  const [groupAdd, setGroupAdd] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [order, setOrder] = useState({firstName: 'asc', lastName: 'asc'});
  const [searchTerm, setSearchTerm] = useState("");

  const params = useParams();

  const { data: contactData, error: contactError, isLoading: contactLoading, mutate:  mutateContact } = useSWR(
    [`http://localhost:8000/contact/sorted`, order, params.groupId || ""],
    ([url, order, groupId]) => fetchContacts(url, order, groupId),
  );

  const { data: pinData, error: pinError, isLoading: pinLoading, mutate: mutatePin } = useSWR(
    `http://localhost:8000/pins`,
    fetchContacts,
  );

  const toggleAdd = () => {
    setIsAdding(!isAdding);
  };

  const fetchGroups = async (url) => {
    const response = await axios.get(url, {
      withCredentials: true,
    });
    return response.data
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

  const toggleSort = () => {
    if (order.firstName === 'asc') setOrder({firstName: 'desc', lastName: 'asc'});
    else setOrder({firstName: 'asc', lastName: 'asc'});
    handleSearchResults(searchTerm);
  }

  const handleSearchResults = useCallback( (searchInput) => {
    setSearchTerm(searchInput);
    if (searchInput === "") {
      setFiltered(contactData);
    } else {
      const search = searchInput.toLowerCase();
      setFiltered((contactData || []).filter((contact) => (contact.firstName + " " + contact.lastName).toLowerCase().includes(search)))
    }
  }, [contactData]);

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
    console.log(contactData);
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
            <SearchBar handleSearchResults={handleSearchResults}/>
          </div>
          <button className="sortButton" onClick={toggleSort}>
            {order.firstName === 'asc' ? <FaSortAlphaDown /> : <FaSortAlphaDownAlt />}
          </button>
          <button className="addcontact" onClick={toggleContactForm}>
            Add Contact
          </button>
        </div>
        <Pins cardClick={cardClick} contacts={pinData} />
        <div className="contactlist">
          
          {contactData &&
            (filtered ? filtered : contactData).map((contact, index) => (
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
          <ContactForm handleSubmit={AddContact} contact={defaultContact} />
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
