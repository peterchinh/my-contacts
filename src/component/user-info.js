import React, { useState } from 'react';
import styles from './user-info.module.css';
import axios from 'axios';
import ContactForm from './contact-form';
import defaultimage from "../assets/no_image.jpg"

export default function UserInfo(props){
    const user = props.user;
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => {
      setIsEditing(!isEditing);
    };
    async function EditContact(updatedUser, didSubmit){
      if(!didSubmit){
        toggleEdit();
      }
      const updatedTheUser = {
            ...user,
            ...updatedUser,
            image: updatedUser.image || user.image,
      }
      try{
        console.log(user._id);
        const response = await axios.put(`http://localhost:8000/users/${user._id}`, updatedTheUser);
        props.updateSite();
        toggleEdit();
        return response;
      } catch (err) {
        console.log(err);
        toggleEdit();
        return false;
      }
    }

    return(
    <div className={styles.profileContainer}>
      <div className={styles.profileCard}>
        {isEditing ?
    // Edit contact form
    <ContactForm handleSubmit={EditContact} contact={user} isUser={true}/>
    :
    // Display
        <>
        <img
                className={styles.image}
                src = {user.image || defaultimage}
                alt = "profile"
        />
        <div className={styles.profileInfo}>
          <h1> Profile Info: </h1>
          <hr className={styles.hrLine} />
          <h2 className={styles.profileName}> {user.name} </h2>
          <h3> {user.email} </h3>
          {user.phone && <h3> {user.phone} </h3>}
          <input className={styles.edit} type = "button" value = "Edit" onClick={toggleEdit} />
        </div>
        </>
    }
      </div>
    </div>
    );
}