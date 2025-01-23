import React, { useState } from "react";
import ContactForm from "./contact-form.js";
import styles from "./contact-info.module.css";
import axios from "axios";
import defaultimage from "../assets/no_image.jpg";

export default function ContactInfo({ contact, defaultContact, updateSite }) {
  contact = contact || defaultContact;
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  async function EditContact(updatedContact, didSubmit) {
    if (!didSubmit) {
      toggleEdit();
      return;
    }

    const updatedTheContact = {
      ...contact,
      ...updatedContact,
      image: updatedContact.image || contact.image,
    };

    try {
      const response = await axios.put(
        `http://localhost:8000/contact/${contact._id}`,
        updatedTheContact,
      );
      updateSite(response.data); // Render edits on site.
      toggleEdit();
      return response;
    } catch (err) {
      console.log(err);
      // Not handling errors at the moment
      toggleEdit();
      return false;
    }
  }

  function AddToGroup() {
    // To Be Added
    return;
  }

  async function Pin() {
    if (!contact || !contact._id) {
      console.error("No contact selected to pin.");
      return;
    }

    try {
      await axios.put(`http://localhost:8000/contact/${contact._id}`, { pin: !contact.pin});
      updateSite();
    } catch (err) {
      console.error(err);
    }
  }

  async function DeleteContact() {
    if (!contact || !contact._id) {
      console.error("No contact selected to delete.");
      return;
    }

    try {
      if (contact.image !== undefined) {
        const fileKey = contact.image.split("/").pop();
        await axios.delete(`http://localhost:8000/delete-image/${fileKey}`);
      }
      await axios.delete(`http://localhost:8000/contact/${contact._id}`);
      updateSite();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className={styles.card}>
      <img
        className={styles.image}
        src={contact.image || defaultimage}
        alt="profile"
      />
      <div className={styles.body}>
        {isEditing ? (
          // Edit contact form
          <ContactForm handleSubmit={EditContact} contact={contact} />
        ) : (
          // Display
          <>
            <h2 className={styles.name}>
              {" "}
              {contact.firstName + " " + contact.lastName}{" "}
            </h2>
            <p className={styles.info}> {"Email: " + contact.email} </p>
            <p className={styles.info}> {"Phone: " + contact.phone} </p>
            <input
              className={styles.group}
              type="button"
              value="Add to Group"
              onClick={AddToGroup}
            />
            <input
              className={contact.pin ? styles.unpin : styles.pin} 
              
              type="button"
              value={contact.pin ? "Unpin Contact" : "Pin Contact"}
              onClick={Pin}
            />
            <div>
              <input
                className={styles.edit}
                type="button"
                value="Edit"
                onClick={toggleEdit}
              />
              <input
                className={styles.deleteButton}
                type="button"
                value="Delete"
                onClick={DeleteContact}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
