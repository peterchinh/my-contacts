import React, { useEffect, useState } from 'react'
import styles from './contact-form.module.css'
import defaultimage from '../assets/no_image.jpg'
import axios from 'axios'

export default function ContactForm(props) {
    const [contact, setContact] = useState(props.contact)
    const originalContact = props.contact
    // const [loading, setLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false)
    const [hasImageChanged, setHasImageChanged] = useState(false)
    let isFormFilled
    if (props.isUser) {
        isFormFilled =
            contact.phone &&
            contact.phone.length === 14 &&
            contact.firstName &&
            contact.email.includes('@')
    } else {
        isFormFilled =
            contact.phone && contact.phone.length === 14 && contact.firstName
    }

    useEffect(() => {
        if (props.contact && props.contact._id) {
            setIsEditMode(true)
            setHasImageChanged(false)
        } else {
            setIsEditMode(false)
            setHasImageChanged(false)
        }
    }, [props.contact])

    function handleChange(event) {
        const { name, value, files, type } = event.target

        if (type === 'file') {
            setContact({
                ...contact,
                image: files[0],
            })
            setHasImageChanged(true)
        } else if (name === 'name') {
            setContact({
                ...contact,
                name: value,
            })
        } else if (name === 'firstName') {
            setContact({
                ...contact,
                firstName: value,
            })
        } else if (name === 'lastName') {
            setContact({
                ...contact,
                lastName: value,
            })
        } else if (name === 'phone') {
            // We want this formatted properly
            const input = value.replace(/\D/g, '') // Remove non-numeric chars
            let formatted = ''
            // Add correct formatting, & remove excess chars
            if (input.length > 0) {
                formatted = `(${input.slice(0, 3)}`
            }
            if (input.length >= 4) {
                formatted += `) ${input.slice(3, 6)}`
            }
            if (input.length >= 7) {
                formatted += `-${input.slice(6, 10)}`
            }

            setContact({
                ...contact,
                phone: formatted,
            })
        } else if (name === 'email') {
            setContact({
                ...contact,
                email: value,
            })
        } else if (name === 'month' || name === 'day' || name === 'year') {
            // Storing Birthday in format "MM/DD/YY"
            const [month = '', day = '', year = ''] = (
                contact.birthday || ''
            ).split('/')

            const input = value.replace(/\D/g, '') // Remove non-numeric chars

            const updatedBirthday = {
                month: name === 'month' ? input : month,
                day: name === 'day' ? input : day,
                year: name === 'year' ? input : year,
            }
            setContact({
                ...contact,
                birthday: `${updatedBirthday.month}/${updatedBirthday.day}/${updatedBirthday.year}`,
            })
        } else {
            setContact({
                ...contact,
                address: value,
            })
        }
        return
    }

    async function submitForm(didSubmit) {
        if (!didSubmit) {
            // props.handleSubmit(contact, didSubmit);
            props.handleSubmit(originalContact, didSubmit)
            // setContact(props.Contact);
            return
        }
        // Do not allow submission if form is not filled in properly
        if (!isFormFilled) {
            return
        }

        let imageUrl = contact.image
        if (contact.image instanceof File) {
            // setLoading(true);

            if (contact._id && props.contact.image) {
                // BUG: Contacts edited without contact pictures will fail because this
                // line of code will read it as UNDEFINED
                const oldKey = props.contact.image.split('/').pop()
                try {
                    await axios.delete(
                        `${process.env.REACT_APP_BASE_URL}/delete-image/${oldKey}`
                    )
                    console.log('Old image deleted from S3')
                } catch (error) {
                    console.error('Error deleting old image from S3,', error)
                }
            }

            try {
                const response = await fetch(
                    `${process.env.REACT_APP_BASE_URL}/s3-url`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            filename: contact.image.name,
                            filetype: contact.image.type,
                        }),
                    }
                )

                const { signedUrl, fileKey } = await response.json()

                console.log('Signed URL:', signedUrl)
                const uploadResponse = await fetch(signedUrl, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': contact.image.type,
                    },
                    body: contact.image,
                })

                console.log('Upload response:', uploadResponse)
                if (uploadResponse.ok) {
                    console.log('File uploaded successfully')
                    const imageUrl = `https://308-mycontacts1.s3.us-west-1.amazonaws.com/${fileKey}`
                    const contactData = {
                        ...contact,
                        image: imageUrl,
                    }

                    props.handleSubmit(contactData, didSubmit)
                } else {
                    console.log('Upload failed:', uploadResponse.statusText)
                    throw new Error('Error uploading file to S3')
                }
            } catch (error) {
                console.error('Upload failed:', error.message)
                alert('Upload failed: ' + error.message)
            } finally {
                // setLoading(false);
            }
        } else {
            const contactData = { ...contact, image: imageUrl }
            props.handleSubmit(contactData, didSubmit)
        }
    }

    async function handleDeleteImage() {
        // setLoading(true);
        try {
            const fileKey = contact.image.split('/').pop()
            const response = await axios.delete(
                `${process.env.REACT_APP_BASE_URL}/delete-image/${fileKey}`
            )
            console.log('Image deleted successfully:', response.data)
            console.log('imagekey', fileKey)

            setContact({
                ...contact,
                image: defaultimage,
            })
        } catch (error) {
            console.error('Error deleting image:', error)
            alert('Error deleting the image')
        } finally {
            // setLoading(false);
        }
    }

    return (
        // Dynamic form depending on if User or if Contact
        <>
            <div className={styles.inputContainer}>
                <div className={styles.inputName}> First Name </div>
                <input
                    className={styles.inputField}
                    placeholder="first name"
                    name="firstName"
                    value={contact.firstName}
                    onChange={handleChange}
                />
            </div>

            <div className={styles.inputContainer}>
                <div className={styles.inputName}> Last Name </div>
                <input
                    className={styles.inputField}
                    placeholder="last name"
                    name="lastName"
                    value={contact.lastName}
                    onChange={handleChange}
                />
            </div>

            <div className={styles.inputContainer}>
                <div className={styles.inputName}> Phone Number </div>
                <input
                    className={styles.inputField}
                    placeholder="phone number"
                    name="phone"
                    value={contact.phone}
                    onChange={handleChange}
                />
            </div>

            <div className={styles.inputContainer}>
                <div className={styles.inputName}> Email </div>
                <input
                    className={styles.inputField}
                    placeholder="email"
                    name="email"
                    value={contact.email}
                    onChange={handleChange}
                />
            </div>

            {!props.isUser ? (
                <>
                    <div className={styles.inputName}> Birthday </div>
                    <div className={styles.birthdayContainer}>
                        <input
                            className={styles.monthField}
                            type="text"
                            maxlength="2"
                            placeholder="MM"
                            name="month"
                            value={contact.birthday?.split('/')[0] || ''}
                            onChange={handleChange}
                        />
                        <span className={styles.slash}>/</span>
                        <input
                            className={styles.dayField}
                            type="text"
                            maxlength="2"
                            placeholder="DD"
                            name="day"
                            value={contact.birthday?.split('/')[1] || ''}
                            onChange={handleChange}
                        />
                        <span className={styles.slash}>/</span>
                        <input
                            className={styles.yearField}
                            type="text"
                            maxlength="4"
                            placeholder="YYYY"
                            name="year"
                            value={contact.birthday?.split('/')[2] || ''}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={styles.inputContainer}>
                        <div className={styles.inputName}> Address </div>
                        <input
                            className={styles.inputField}
                            placeholder="address"
                            name="address"
                            value={contact.address}
                            onChange={handleChange}
                        />
                    </div>
                </>
            ) : null}
            <div className={styles.imageContainer}>
                <div className={styles.inputImageContainer}>
                    <div className={styles.inputImageName}> Change Image</div>
                    <input
                        type="file"
                        accept="image/*"
                        name="image"
                        onChange={handleChange}
                        className={styles.imageInputField}
                    />
                </div>

                {isEditMode &&
                    contact.image &&
                    contact.image !== defaultimage &&
                    !hasImageChanged && (
                        <button
                            className={styles.deleteImage}
                            onClick={handleDeleteImage}
                        >
                            Delete Image
                        </button>
                    )}
            </div>

            <div className={styles.centeredContainer}>
                {isFormFilled ? null : props.isUser ? (
                    <p className={styles.requirements}>
                        First Name, Full Phone Number and Email (@ symbol)
                        Required.
                    </p>
                ) : (
                    <p className={styles.requirements}>
                        First Name & Full Phone Number Required
                    </p>
                )}
            </div>
            <div className={styles.buttonRow}>
                <input
                    className={styles.submit}
                    type="submit"
                    value="Submit"
                    onClick={() => submitForm(true)}
                />
                <input
                    className={styles.cancel}
                    type="button"
                    value="Cancel"
                    onClick={() => submitForm(false)}
                />
            </div>
        </>
    )
}
