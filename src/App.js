import React from 'react';
import ContactCard from './component/contact-card';
import "./style/App.css";
import NavBar from "./component/navbar";

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
    return (
      <div className="container">
        <NavBar />
        <div className="content">
          {sampleContacts.map((contact, index) => (
              <ContactCard
                key={index}
                name={contact.name}
                image={contact.image}
                // onClick= do something later
                />
            ))}
        </div>
      </div>
      );
    } 