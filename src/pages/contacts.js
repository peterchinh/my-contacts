import React, { useState } from 'react';
import ContactCard from '../component/contact-card';
import ContactInfo from '../component/contact-info';
import NavBar from '../component/navbar';
import SearchBar from '../component/SearchBar';
import '../style/contacts.css'


function Contacts({ sampleContacts }) {

    const [selectedContact, setSelectedContact] = useState(null);

    const cardClick = (contact) => {
        setSelectedContact(contact);
    };

    return (
        <div className="contactpage">
            <NavBar />
            <div className="main">
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
        </div>
    );
};




export default Contacts;