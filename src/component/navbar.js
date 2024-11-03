import './navbar.module.css';
import React, { useState } from 'react';

export default function NavBar() {
    const [isOpen, setIsOpen] = useState(true);

    const toggleNav = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="navbar">
            <button className="nav-toggler" onClick={toggleNav}>X</button>
            <div className={`nav-menu ${isOpen ? 'is-active' : ''}`}>
                <div className="nav-item">
                    <span className="nav-text">All Contacts</span>
                </div>
                <div className="nav-item">
                    <span className="nav-text">Groups</span>
                </div>
            </div>
            
        </nav>
    )
}