import React, {useState} from 'react';
import styles from './contact-form.module.css';

export default function ContactForm(props){
    const [contact, setContact] = useState(props.contact);
    const [loading, setLoading] = useState(false);

    function handleChange(event){
        const { name, value, files, type } = event.target;

        if (type === "file") {
            setContact({
                ...contact,
                image: files[0],
            });
        }
        else if(name === "firstName"){
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

    async function submitForm(didSubmit) {
        if (!didSubmit) {
            props.handleSubmit(contact, didSubmit);
            return;
        }

        let imageUrl = contact.image;
        if (contact.image instanceof File) {
            setLoading(true);
            try {  
                const response = await fetch('http://localhost:8000/s3-url', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        filename: contact.image.name,
                        filetype: contact.image.type,
                    }),
                });


                const { signedUrl, fileKey } = await response.json();

                console.log('Signed URL:', signedUrl);
                const uploadResponse = await fetch(signedUrl, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': contact.image.type,
                    },
                    body: contact.image,
                });
                
                console.log('Upload response:', uploadResponse)
                if (uploadResponse.ok) {
                    console.log('File uploaded successfully');
                    const imageUrl = `https://308-mycontacts1.s3.us-west-1.amazonaws.com/${fileKey}`;
                    const contactData = {
                        ...contact,
                        image: imageUrl,
                    };

                    props.handleSubmit(contactData, didSubmit);
                } else {
                    console.log('Upload failed:', uploadResponse.statusText)
                    throw new Error('Error uploading file to S3');
                }
            } catch (error) {
                console.error('Upload failed:', error.message);
                alert('Upload failed: ' + error.message);
            } finally {
                setLoading(false);
            }
        } else {
            const contactData = { ...contact, image: imageUrl };
            props.handleSubmit(contactData, didSubmit);
        }
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
                id="email" value={contact.email} onChange={handleChange} />
        <div className={styles.inputName}> Upload Image (Optional) </div>
        <input type="file" accept="image/*" name="image" onChange={handleChange}
                className={styles.inputField} />
        <div>
            <input className={styles.submit} type = "submit" value = "Submit"
                   onClick={() => submitForm(true)} />
            <input className={styles.cancel} type = "button" value = "Cancel"
                   onClick={() => submitForm(false)} />
        </div>
        </>
    );
}