import React from 'react';
import '../style/contact-card.css';


function ContactCard({name, image})
{
    return (
        <div className="contact-card">
            <img src={image} alt={`$(name)'s profilepic`}
                className="contact-image"/>
            <span className="contact-name">{name}</span>
        </div>
    );
}


export default ContactCard;