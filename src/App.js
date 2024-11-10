import React from 'react';
import "./style/App.css";
import Contacts from "./pages/contacts"
import "./style/contacts.css"
import { BrowserRouter, Routes, Route } from 'react-router-dom';

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
      <BrowserRouter>
        <Routes><Route path='/contacts' element={<Contacts sampleContacts={sampleContacts} />}></Route></Routes>
      </BrowserRouter>
        {/* <NavBar /> */}
        {/* <div className="contacts">
          <Contacts />
        </div>
        <div className="content">
          {sampleContacts.map((contact, index) => (
              <ContactCard
                key={index}
                name={contact.name}
                image={contact.image}
                />
            ))} */}
        {/* </div> */}
      </div>
      );
} 