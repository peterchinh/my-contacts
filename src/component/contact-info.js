import React from 'react';

function ContactInfo() {

/* The functions below require a functioning DB/Backend first.
   AddToGroup will likely have shared functionality with the
   initial creation of contacts.
*/
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
    <div style={styles.card}>
      <img
        src = "https://via.placeholder.com/150"
        alt = "profile"
        style = {styles.image}
      />
      <div style = {styles.body}>
        <h2 style = {styles.name}> John Doe </h2>
        <p style = {styles.info}> Email: john.doe@example.com </p>
        <p style = {styles.info}> Phone: (123) 456-7890 </p>
        <p style = {styles.info}> Location: New York, NY </p>
      </div>

      <input style = {styles.group} type = "button" value = "Add to Group" onClick={AddToGroup} />
      <div style = {styles.buttons}>
        <input type = "button" value = "Edit" onClick={EditContact} />
        <input type = "button" value = "Delete" onClick={DeleteContact} />
      </div>
    </div>
  );
}

const styles = {
  card: {
    width: '336px',
    height: '540px',
    padding: '20px 10px',
    borderRadius: '10px',
    boxShadow: '0 0px 8px rgba(0,0,0,0.2)',
    textAlign: 'center',
    backgroundColor: '#ffffff',
    margin: 'auto'
  },
  image: {
    width: '175px',
    height: '175px',
    borderRadius: '50%', // Makes the image circular
    objectFit: 'cover',
  },
  body: {
    marginTop: '20px',
  },
  name: {
    fontSize: '32px',
    fontWeight: 'bold',
    margin: '10px 0',
  },
  info: {
    fontSize: '20px',
    color: '#555555',
    margin: '20px 0',
  },
  group: {
    padding: '10px 20px',
  },
  buttons: {
    padding: '40px 20px',
  },
};

export default ContactInfo;
