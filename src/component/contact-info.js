import React, { useState } from 'react';
import ContactForm from './contact-form.js';
import styles from './contact-info.module.css';
import axios from "axios";



export default function ContactInfo(props) {


  const contact = props.contact || props.defaultContact;
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  async function EditContact(contact, didSubmit){
    if(!didSubmit){
            toggleEdit();
            return;
    }
    try{
        const response = await axios.put(`http://localhost:8000/contact/${contact._id}`, contact);
        props.updateSite(response.data); // Render edits on site.
        toggleEdit();
        return response;
    } catch (err) {
        console.log(err);
        // Not handling errors at the moment
        toggleEdit();
        return false;
    }
  }

  function AddToGroup(){
    // To Be Added
    return;
  }

  async function DeleteContact() {
    if (!contact || !contact._id) {
      console.error("No contact selected to delete.");
      return;
    }

    try {
      await axios.delete(`http://localhost:8000/contact/${contact._id}`);
      props.updateSite(); 
    } catch (err) {
      console.error(err);
    }
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
        <ContactForm handleSubmit={EditContact} contact={contact}/>
        :
        // Display
        <>
            <h2 className={styles.name} > {contact.firstName + ' ' + contact.lastName} </h2>
            <p className={styles.info}> {'Email: ' +  contact.email } </p>
            <p className={styles.info}> {'Phone: ' + contact.phone} </p>
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
