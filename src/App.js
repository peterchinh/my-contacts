import React from 'react';
import "./style/App.css";
import Login from  "./pages/login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signup from './pages/signup';
import "./style/contacts.css"

export default function App() {
    return (
      <div className="container">
        <div className="content">
          <BrowserRouter>
            <Routes>
              <Route path='/login' element={<Login />} />
              <Route path='/signup' element={<Signup />} />
            </Routes>
          </BrowserRouter>
        </div>
      </div>
      );
} 
