import React, { useState } from 'react';
import './contact-info.css';

// Sample data
const contactInfo = {
    firstName: 'John',
    lastName: 'Doe',
    phoneNumber: '(123) 456-7890',
    email: 'JohnDoe@gmail.com',
}



function ContactInfo() {
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };



  function AddToGroup(){
    // To Be Added
    return;
  }

  function EditContact(){
    // To Be Added
    return;
  }

  function DeleteContact(){
    // To Be Added
    return;
  }

  return (
    <div className="card">
      <img
        className="image"
        src = "https://via.placeholder.com/150"
        alt = "profile"
      />
      <div className="body">
        {isEditing ?
        <>
        <input type="text" placeholder="first name"/>
        <input type="text" placeholder="last name"/>
        <input type="text" placeholder="email"/>
        <input type="text" placeholder="phone number"/>
        </>
        :
        <>
        <h2 className="name" > {contactInfo.firstName + ' ' + contactInfo.lastName} </h2>
        <p className="info"> {'Email: ' +  contactInfo.email } </p>
        <p className="info"> {'Phone: ' + contactInfo.phoneNumber} </p>
        </>
        }
      </div>

      <input className="group" type = "button" value = "Add to Group" onClick={AddToGroup} />
      <div className="buttons">
        {isEditing ?
        <input type = "submit" value = "Submit" onClick={toggleEdit} />
        :
        <input type = "button" value = "Edit" onClick={toggleEdit} />
        }

        <input type = "button" value = "Delete" onClick={DeleteContact} />
      </div>
    </div>
  );
}


export default ContactInfo;
