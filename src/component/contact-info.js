import React, { useState } from 'react'
import ContactForm from './contact-form.js'
import AddToGroupForm from './add-to-group-form.js'
import styles from './contact-info.module.css'
import axios from 'axios'
import defaultimage from '../assets/no_image.jpg'

export default function ContactInfo({ contact, defaultContact, updateSite }) {
    contact = contact || defaultContact
    const [isEditing, setIsEditing] = useState(false)
    const [isAddingToGroup, setIsAddingToGroup] = useState(false)

    const toggleEdit = () => {
        setIsEditing(!isEditing)
    }

    const toggleAddToGroup = () => {
        setIsAddingToGroup(!isAddingToGroup)
    }

    async function EditContact(updatedContact, didSubmit) {
        if (!didSubmit) {
            toggleEdit()
            return
        }

        const updatedTheContact = {
            ...contact,
            ...updatedContact,
            image: updatedContact.image || contact.image,
        }

        try {
            const response = await axios.put(
                `${process.env.REACT_APP_BASE_URL}/contact/${contact._id}`,
                updatedTheContact
            )
            updateSite(response.data) // Render edits on site.
            toggleEdit()
            return response
        } catch (err) {
            console.log(err)
            // Not handling errors at the moment
            toggleEdit()
            return false
        }
    }

    function AddToGroup(didAdd) {
        if (!didAdd) {
            toggleAddToGroup()
            return
        }
        toggleAddToGroup()
        return
    }

    async function Pin() {
        if (!contact || !contact._id) {
            console.error('No contact selected to pin.')
            return
        }

        try {
            await axios.put(
                `${process.env.REACT_APP_BASE_URL}/contact/${contact._id}`,
                {
                    pin: !contact.pin,
                }
            )
            updateSite()
        } catch (err) {
            console.error(err)
        }
    }

    async function FindGroups() {
        try {
            const groups = await axios.get(
                `${process.env.REACT_APP_BASE_URL}/group`,
                {
                    withCredentials: true, // This ensures cookies (tokens) are sent
                }
            )
            return groups.data
        } catch (err) {
            console.error(err)
        }

        return []
    }

    async function DeleteContact() {
        if (!contact || !contact._id) {
            console.error('No contact selected to delete.')
            return
        }

        try {
            const groups = await FindGroups()

            for (const group of groups) {
                console.log(group._id)
                console.log(contact._id)
                if (group.contacts.includes(contact._id)) {
                    console.log('deleted from group')
                    await removeFromGroup(contact._id, group._id)
                }
            }
            if (contact.image !== undefined) {
                const fileKey = contact.image.split('/').pop()
                await axios.delete(
                    `${process.env.REACT_APP_BASE_URL}/delete-image/${fileKey}`
                )
            }
            await axios.delete(
                `${process.env.REACT_APP_BASE_URL}/contact/${contact._id}`
            )
            updateSite()
        } catch (err) {
            console.error(err)
        }
    }

    async function removeFromGroup(currentContact, group) {
        // remvoes contact from group

        try {
            const response = await axios.put(
                `${process.env.REACT_APP_BASE_URL}/group/${group}/remove`,
                { contactId: currentContact },
                { withCredentials: true }
            )
            updateSite()
            return response
        } catch (error) {
            console.error(error)
            return false
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
                    <ContactForm
                        handleSubmit={EditContact}
                        contact={contact}
                        isUser={false}
                    />
                ) : isAddingToGroup ? (
                    // Add to group form
                    <AddToGroupForm
                        handleSubmit={toggleAddToGroup}
                        contact={contact}
                        FindGroups={FindGroups}
                    />
                ) : (
                    // Display
                    <>
                        <h2 className={styles.name}>
                            {' '}
                            {contact.firstName + ' ' + contact.lastName}{' '}
                        </h2>
                        <p className={styles.info}>
                            {'Email: ' + contact.email}
                        </p>
                        <p className={styles.info}>
                            {'Phone: ' + contact.phone}
                        </p>
                        <p className={styles.info}>
                            {' '}
                            {contact.birthday
                                ? 'Birthday: ' + contact.birthday
                                : 'Birthday: '}{' '}
                        </p>
                        <p className={styles.info}>
                            {' '}
                            {contact.address
                                ? 'Address: ' + contact.address
                                : 'Address: '}{' '}
                        </p>
                        <input
                            className={styles.group}
                            type="button"
                            value="Add to Group"
                            onClick={AddToGroup}
                        />
                        <input
                            className={contact.pin ? styles.unpin : styles.pin}
                            type="button"
                            value={
                                contact.pin ? 'Unpin Contact' : 'Pin Contact'
                            }
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
    )
}
