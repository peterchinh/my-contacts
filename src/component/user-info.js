import React, { useState } from "react";
import styles from "./user-info.module.css";
import axios from "axios";
import ContactForm from "./contact-form";
import defaultimage from "../assets/no_image.jpg";

export default function UserInfo(props) {
  const user = props.user;
  const [isEditing, setIsEditing] = useState(false);
  const [showInputForm, setShowInputForm] = useState(false);
  const [shareCode, setShareCode] = useState('');
  const [contacts, setContacts] = useState(props.contacts || []);

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };
  async function EditContact(updatedUser, didSubmit) {
    if (!didSubmit) {
      toggleEdit();
    }
    const updatedTheUser = {
      ...user,
      ...updatedUser,
      image: updatedUser.image || user.image,
    };
    try {
      console.log(user._id);
      const response = await axios.put(
        `http://localhost:8000/users/${user._id}`,
        updatedTheUser,
      );
      props.updateSite();
      toggleEdit();
      return response;
    } catch (err) {
      console.log(err);
      toggleEdit();
      return false;
    }
  }


  async function CopyShareCode() {
    navigator.clipboard.writeText(
      "firstName=" + user.firstName +
      "\nlastName=" + user.lastName +
      "\nphone=" + user.phone +
      "\nemail=" + user.email +
      "\nimage=" + user.image);
    var confirm = document.getElementById("confirmtext");
    confirm.style.display = "block";

    setTimeout(function() {
      confirm.style.display = "none";
    }, 3000);
  } 

  function toggleInputForm() {
    setShowInputForm(!showInputForm);
  }

  function parseShareCode(shareCode) {
    const lines = shareCode.split('\n');
    const contact = {};
    lines.forEach(line => {
      const [key, value] = line.split('=');
      contact[key.trim()] = value.trim();
    });
    if (contact.image === "undefined") {
      contact.image = defaultimage;
    }
    return contact;
  }

  function validateContact(contact) {
    const requiredFields = ['firstName', 'lastName', 'phone', 'email', 'image'];

    for (const field of requiredFields) {
      if (!(field in contact)) {
        return true;
      }
    }

    const phoneFormat = /^\(\d{3}\) \d{3}-\d{4}$/; 
    if (!contact.firstName || contact.phone == 'undefined') {
      return true;
    }
    if (!phoneFormat.test(contact.phone)) {
      return 'Phone number format is incorrect.';
    }
    return null;
  }


  async function InputShareCode() {
    try {
      const newContact = parseShareCode(shareCode);
      console.log("parsed new contact:", newContact)
      const validationError = validateContact(newContact);
      if (validationError) {

        var failShare = document.getElementById("failsharetext");
        failShare.style.display = "block";
    
        setTimeout(function() {
          failShare.style.display = "none";
        }, 3000);
        return;
      }
      const response = await axios.post(`http://localhost:8000/contact`, newContact, {withCredentials: true});
      setContacts([...contacts, response.data]); 
      setShowInputForm(false);
      setShareCode('');
      props.updateSite();
    } catch (err) {
      console.error('Invalid share code', err);
      var failShare = document.getElementById("failsharetext");
      failShare.style.display = "block";
  
      setTimeout(function() {
        failShare.style.display = "none";
      }, 3000);
      return;
    }
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileCard}>
        {isEditing ? (
          // Edit contact form
          <ContactForm
            handleSubmit={EditContact}
            contact={user}
            isUser={true}
          />
        ) : (
          // Display
          <>
            <img
              className={styles.image}
              src={user.image || defaultimage}
              alt="profile"
            />
            <div className={styles.profileInfo}>
              <h1> Profile Info: </h1>
              <hr className={styles.hrLine} />
              <h2 className={styles.profileName}> {user.firstName} {user.lastName} </h2>
              <h3> {user.email} </h3>
                {user.phone && <h3> {user.phone} </h3>}
                <div id="confirmtext" style={{ display: 'none' }}>Share code copied!</div>
              <input
                className={styles.edit}
                type="button"
                value="Edit"
                onClick={toggleEdit}
                />
              <input
                className={styles.copyShare}
                type="button"
                value="Copy Share Code"
                onClick={CopyShareCode}
                />
              <input
                className={styles.inputShare}
                type="button"
                value="Input Share Code"
                onClick={toggleInputForm}
                />
            </div>
          </>
        )}
      </div>
      {showInputForm && (
        <div className={styles.inputFormContainer}>
          <div className={styles.inputForm}>
            <textarea
              value={shareCode}
              onChange={(e) => setShareCode(e.target.value)}
              placeholder="Enter share code here"
            />
            <div id="failsharetext" style={{ display: 'none' }}>Incorrect share code format!</div>
            <input
              className={styles.submitShareButton}
              type="button"
              value="Submit"
              onClick={InputShareCode}
            />
            <input
              className={styles.cancelShareButton}
              type="button"
              value="Cancel"
              onClick={toggleInputForm}
            />
          </div>
        </div>
      )}
    </div>
  );
}
