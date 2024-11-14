import React from 'react';
import "./style/App.css";
import Contacts from "./pages/contacts"
import Login from  "./pages/login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signup from './pages/signup';
import "./style/contacts.css"

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
        <div className="content">
          <BrowserRouter>
            <Routes>
              <Route path='/contacts' element={<Contacts sampleContacts={sampleContacts} />} />
              <Route path='/login' element={<Login />} />
              <Route path='/signup' element={<Signup />} />
            </Routes>
          </BrowserRouter>
        </div>
      </div>
      );
} 
