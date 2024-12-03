import React, { useState } from "react";
import styles from "./group-form.module.css"

export default function GroupForm(props){
  const [group, setGroup] = useState([]);

  function handleChange(event){
        const { name, value } = event.target;
        if(name === "firstName"){
            setGroup({
                ...group,
                firstName: value,
            });
        }
        
    return;
    }
  function submitForm(didSubmit){
        props.handleSubmit(group, didSubmit);
        return;
    }

  return (
        <>
        <div className={styles.inputName}> First Name... </div>
        <input className={styles.inputField} placeholder="first name" name="firstName"
               id="firstName" value={"Title"} onChange={handleChange}/>
        <div>
            <input className={styles.submit} type = "submit" value = "Submit"
                   onClick={() => submitForm(true)} />
            <input className={styles.cancel} type = "button" value = "Cancel"
                   onClick={() => submitForm(false)} />
        </div>
        </>
);

}
