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

  // This function might need to be refactored.
  async function AddContact(contact, didSubmit){
    if(!didSubmit){
        toggleEdit();
        return;
    }
    try {
        const response = await axios.post("http://localhost:8000/contact", contact);
        toggleEdit();
        return response;
    } catch (error) {
        console.log(error);
        // Not handling errors at the moment
        toggleEdit();
        return false;
    }
  }

  function EditContact(contact, didSubmit){
    if(!didSubmit){
            toggleEdit();
            return;
        }
        try{
            /* BUG NOTE: there is currently a bug where if you change the phone number
               in the form, then the axios call below will not be able to find
               the correct contact by phone number since you just changed it.

               Will be fixed once we correctly map contact cards to their corresponding
               contact info. We will have access to the original phone number and can
               reference that instead by passing the info down in props.
            */
            const initResponse = await axios.get("http://localhost:8000/contact", {
                params: {
                    phone: contact.phone
                }
            });
            const response = axios.put(`http://localhost:8000/contact/${initResponse._id}`, contact);
            toggleEdit();
            return response;
        } catch (error) {
            console.log(error);
            // Not handling errors at the moment
            toggleEdit();
            return false;
        }
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
        <ContactForm handleSubmit={editContact} contact={contactInfo}/>
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
