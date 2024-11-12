import React, {useState} from 'react';
import styles from './contact-form.module.css';

export default function ContactForm(props){
    const [contact, setContact] = useState({
        firstName: props.contact.firstName,
        lastName: props.contact.lastName,
        phone: props.contact.phone,
        email: props.contact.email,
    });

    function handleChange(event){
        const { name, value } = event.target;
        if(name === "firstName"){
            setContact({
                ...contact,
                firstName: value,
            });
        }
        else if(name === "lastName"){
            setContact({
                ...contact,
                lastName: value,
            });
        }
        else if(name === "phone"){ // We want this formatted properly
            const input = value.replace(/\D/g, ""); // Remove non-numeric chars
            let formatted = "";
            // Add correct formatting, & remove excess chars
            if (input.length > 0) {
                formatted = `(${input.slice(0, 3)}`;
            }
            if (input.length >= 4) {
                formatted += `) ${input.slice(3, 6)}`;
            }
            if (input.length >= 7) {
                formatted += `-${input.slice(6, 10)}`;
            }

            setContact({
                ...contact,
                phone: formatted,
            });
        }
        else{
            setContact({
                ...contact,
                email: value,
            });
        }
    return;
    }
    function submitForm(didSubmit){
        props.handleSubmit(contact, didSubmit);
    }

    return(
        <>
        <div className={styles.inputName}> First Name... </div>
        <input className={styles.inputField} placeholder="first name" name="firstName"
               id="firstName" value={contact.firstName} onChange={handleChange}/>

        <div className={styles.inputName}> Last Name... </div>
        <input className={styles.inputField} placeholder="last name" name="lastName"
               id="lastName" value={contact.lastName} onChange={handleChange}/>

        <div className={styles.inputName}> Phone Number... </div>
        <input className={styles.inputField} placeholder="phone number" name="phone"
               id="phone" value={contact.phone} onChange={handleChange}/>

        <div className={styles.inputName}> Email... </div>
        <input className={styles.inputField} placeholder="email" name="email"
               id="email" value={contact.email} onChange={handleChange}/>
        <div>
            <input className={styles.submit} type = "submit" value = "Submit"
                   onClick={() => submitForm(true)} />
            <input className={styles.cancel} type = "button" value = "Cancel"
                   onClick={() => submitForm(false)} />
        </div>
        </>
    );
}