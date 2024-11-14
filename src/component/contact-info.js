import React, { useState } from 'react';
import ContactForm from './contact-form.js';
import styles from './contact-info.module.css';
import axios from "axios";

// Sample data for testing
const contactInfo = {
    firstName: 'John',
    lastName: 'Doe',
    phone: '(333) 333-3333',
    email: 'JohnDoe@gmail.com',
}


export default function ContactInfo() {

  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  function EditContact(contact, didSubmit){
    toggleEdit();
    return;
  }

  function AddToGroup(){
    // To Be Added
    return;
  }

  function DeleteContact(){
    // To Be Added
    return;
  }

  return (
    <div className={styles.card}>
      <img
        className={styles.image}
        src = "https://placehold.co/150x150"
        alt = "profile"
      />
      <div className={styles.body}>
        {isEditing ?
        // Edit contact form
        <ContactForm handleSubmit={EditContact} contact={contactInfo}/>
        :
        // Display
        <>
            <h2 className={styles.name} > {contactInfo.firstName + ' ' + contactInfo.lastName} </h2>
            <p className={styles.info}> {'Email: ' +  contactInfo.email } </p>
            <p className={styles.info}> {'Phone: ' + contactInfo.phone} </p>
            <input className={styles.group} type = "button" value = "Add to Group" onClick={AddToGroup} />
            <div>
                <input className={styles.edit} type = "button" value = "Edit" onClick={toggleEdit} />
                <input className={styles.deleteButton} type = "button" value = "Delete" onClick={DeleteContact} />
            </div>
        </>
        }
      </div>
    </div>
  );
}
