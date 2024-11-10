import React from 'react';
import ContactCard from '../component/contact-card';
import ContactInfo from '../component/contact-info';
import NavBar from '../component/navbar';
import SearchBar from '../component/SearchBar';
import '../style/contacts.css'


function Contacts({ sampleContacts }) {
    return (
        <div className="contactpage">
            <NavBar />
            <div className="main">
                <SearchBar />
                <div className="contactcontainer">
                    <div className="contactlist">
                        {sampleContacts.map((contact, index) => (
                        <ContactCard
                        key={index}
                        name={contact.name}
                        image={contact.image}
                        />
                    ))}
                    </div>
                    <ContactInfo />
                </div>
            </div>
        </div>
    );
};




export default Contacts;