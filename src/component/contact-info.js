import React, { useState } from 'react';
import styles from './contact-info.module.css';

function ContactInfo({ contact, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const [editedContact, setEditedContact] = useState({
    firstName: contact.firstName || '',
    lastName: contact.lastName || '',
    phoneNumber: contact.phoneNumber || '',
    email: contact.email || '',
  });

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setEditedContact((prevContact) => ({
      ...prevContact,
      [name]: value,
    }));
  };

  const DeleteContact = () => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      setIsDeleted(true);
      onDelete(); 
    }
  };

  if (isDeleted) return null; 

  return (
    <div className={styles.card}>
      <img
        className={styles.image}
        src={contact.image}
        alt={`${contact.firstName || contact.name}'s profile`}
      />
      <div className={styles.body}>
        {isEditing ? (
          <>
            <div className={styles.inputName}>First Name...</div>
            <input
              className={styles.inputField}
              placeholder="first name"
              name="firstName"
              id="firstName"
              value={editedContact.firstName}
              onChange={handleChange}
            />

            <div className={styles.inputName}>Last Name...</div>
            <input
              className={styles.inputField}
              placeholder="last name"
              name="lastName"
              id="lastName"
              value={editedContact.lastName}
              onChange={handleChange}
            />

            <div className={styles.inputName}>Phone Number...</div>
            <input
              className={styles.inputField}
              placeholder="phone number"
              name="phoneNumber"
              id="phoneNumber"
              value={editedContact.phoneNumber}
              onChange={handleChange}
            />

            <div className={styles.inputName}>Email...</div>
            <input
              className={styles.inputField}
              placeholder="email"
              name="email"
              id="email"
              value={editedContact.email}
              onChange={handleChange}
            />
          </>
        ) : (
          <>
            <h2 className={styles.name}>
              {editedContact.firstName || contact.firstName}{' '}
              {editedContact.lastName || contact.lastName}
            </h2>
            <p className={styles.info}>{'Email: ' + (editedContact.email || contact.email)}</p>
            <p className={styles.info}>{'Phone: ' + (editedContact.phoneNumber || contact.phoneNumber)}</p>
          </>
        )}
      </div>

      <div>
        {isEditing ? (
          <input
            className={styles.submit}
            value="Submit"
            onClick={toggleEdit}
          />
        ) : (
          <>
            <div>
              <input
                className={styles.group}
                type="button"
                value="Add to Group"
              />
            </div>
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

export default ContactInfo;
