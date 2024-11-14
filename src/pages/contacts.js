import React, { useState } from 'react';
import ContactCard from '../component/contact-card';
import ContactInfo from '../component/contact-info';
import ContactForm from '../component/contact-form';
import NavBar from '../component/navbar';
import SearchBar from '../component/SearchBar';
import '../style/contacts.css'
import axios from 'axios';

// Default contact to send to ContactForm
const defaultContact = {
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
}

function Contacts({ sampleContacts }) {

    const [selectedContact, setSelectedContact] = useState(null);
    const [showContactForm, setShowContactForm] = useState(null);

    const cardClick = (contact) => {
        setSelectedContact(contact);
    };

    const toggleContactForm = () => {
        setShowContactForm(!showContactForm);
    }

    async function AddContact(contact, didSubmit){
        if(!didSubmit){
            toggleContactForm();
            return;
        }
        try {
            const response = await axios.post("http://localhost:8000/contact", contact);
            toggleContactForm();
            return response;
        } catch (error) {
            console.log(error);
            // Not handling errors at the moment
            toggleContactForm();
            return false;
        }
    }

    return (
        <div className="contactpage">
            <NavBar />
            <div className="main">
                <button className="addcontact" onClick={toggleContactForm}>Add Contact</button>
                <SearchBar />
                <div className="contactcontainer">
                    <div className="contactlist">
                        {sampleContacts.map((contact, index) => (
                            <div key={index} className="contactCard" onClick={() => cardClick(contact)}>
                            <ContactCard
                                name={contact.name}
                                image={contact.image}
                            />
                            </div>
                    ))}
                    </div>
                    {selectedContact && (
                        <ContactInfo/>
                    )}
                </div>
            </div>
        {showContactForm && (
            <div className="modal">
                <ContactForm handleSubmit={AddContact} contact={defaultContact} />
            </div>
         )}
        </div>
    );
};




export default Contacts;