import React, { useState } from 'react';
import ContactCard from './component/contact-card';
import "./style/App.css";
import NavBar from "./component/navbar";
import ContactInfo from './component/contact-info';

const sampleContacts = [
    {
      name: "John Smith",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/220px-Image_created_with_a_mobile_phone.png"
    },
    {
      name: "Lebron James",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/220px-Image_created_with_a_mobile_phone.png"
    }
];

export default function App() {
    const [selectedContact, setSelectedContact] = useState(null);

    const cardClick = (contact) => {
        setSelectedContact(contact);
    };

    return (
      <div className="container">
        <NavBar />
        <div className="content">
          <div className="contact-list">
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
            <div className="contact-info">
              <ContactInfo/>
            </div>
          )}
        </div>
      </div>
    );
}
