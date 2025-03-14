import React, { useState } from 'react'
import styles from './user-info.module.css'
import axios from 'axios'
import ContactForm from './contact-form'
import defaultimage from '../assets/no_image.jpg'

export default function UserInfo(props) {
    const user = props.user
    // const [showInputForm, setShowInputForm] = useState(false);
    const [shareCode, setShareCode] = useState('')
    const [showPopup, setShowPopup] = useState(false)
    const [activeForm, setActiveForm] = useState(null)
    const [contacts, setContacts] = useState(props.contacts || [])

    function toggleEdit() {
        setActiveForm(activeForm === 'edit' ? null : 'edit')
    }

    async function EditContact(updatedUser, didSubmit) {
        if (!didSubmit) {
            toggleEdit()
        }
        const updatedTheUser = {
            ...user,
            ...updatedUser,
            image: updatedUser.image || user.image,
        }
        try {
            console.log(user._id)
            const response = await axios.put(
                `${process.env.REACT_APP_BASE_URL}/users/${user._id}`,
                updatedTheUser
            )
            props.updateSite()
            toggleEdit()
            return response
        } catch (err) {
            console.log(err)
            toggleEdit()
            return false
        }
    }

    async function CopyShareCode() {
        navigator.clipboard.writeText(
            'firstName=' +
                user.firstName +
                '\nlastName=' +
                user.lastName +
                '\nphone=' +
                user.phone +
                '\nemail=' +
                user.email +
                '\nimage=' +
                user.image
        )
        var confirm = document.getElementById('confirmtext')
        confirm.style.display = 'block'

        setTimeout(function () {
            confirm.style.display = 'none'
        }, 3000)
    }

    function toggleInputForm() {
        setActiveForm(activeForm === 'inputShareCode' ? null : 'inputShareCode')
    }

    function togglePopup() {
        setShowPopup(!showPopup)
    }

    function toggleViewShareCode() {
        setActiveForm(activeForm === 'viewShareCode' ? null : 'viewShareCode')
    }

    function parseShareCode(shareCode) {
        const lines = shareCode.split('\n')
        const contact = {}
        lines.forEach((line) => {
            const [key, value] = line.split('=')
            contact[key.trim()] = value.trim()
        })
        if (contact.image === 'undefined') {
            contact.image = defaultimage
        }
        return contact
    }

    function validateContact(contact) {
        const requiredFields = [
            'firstName',
            'lastName',
            'phone',
            'email',
            'image',
        ]

        for (const field of requiredFields) {
            if (!(field in contact)) {
                return true
            }
        }

        const phoneFormat = /^\(\d{3}\) \d{3}-\d{4}$/
        if (!contact.firstName || contact.phone === 'undefined') {
            return true
        }
        if (!phoneFormat.test(contact.phone)) {
            return 'Phone number format is incorrect.'
        }
        return null
    }

    async function InputShareCode() {
        try {
            const newContact = parseShareCode(shareCode)
            console.log('parsed new contact:', newContact)
            const validationError = validateContact(newContact)
            let failShare
            if (validationError) {
                failShare = document.getElementById('failsharetext')
                failShare.style.display = 'block'

                setTimeout(function () {
                    failShare.style.display = 'none'
                }, 3000)
                return
            }
            var confirm = document.getElementById('confirminputtext')
            confirm.style.display = 'block'

            setTimeout(function () {
                confirm.style.display = 'none'
            }, 3000)
            const response = await axios.post(
                `${process.env.REACT_APP_BASE_URL}/contact`,
                newContact,
                { withCredentials: true }
            )
            setContacts([...contacts, response.data])
            // setShowInputForm(false);
            setShareCode('')
            props.updateSite()
        } catch (err) {
            console.error('Invalid share code', err)
            var failShare = document.getElementById('failsharetext')
            failShare.style.display = 'block'

            setTimeout(function () {
                failShare.style.display = 'none'
            }, 3000)
            return
        }
    }

    return (
        <div className={styles.profileContainer}>
            <div className={styles.profileCard}>
                <div className={styles.profileContent}>
                    <div className={styles.leftSide}>
                        <img
                            className={styles.image}
                            src={user.image || defaultimage}
                            alt="profile"
                        />
                        <div className={styles.profileInfo}>
                            <h2 className={styles.profileName}>
                                {' '}
                                {user.firstName} {user.lastName}{' '}
                            </h2>
                            <h3>{user.email}</h3>
                            {user.phone && <h3>{user.phone}</h3>}
                        </div>
                        <div className={styles.textContainer}>
                            <div
                                id="confirmtext"
                                className={styles.confirmText}
                            >
                                Share code copied to clipboard!
                            </div>
                            <div
                                id="confirminputtext"
                                className={styles.confirmText}
                            >
                                Successfully added contact!
                            </div>
                        </div>
                        <div className={styles.buttonRow}>
                            <input
                                className={styles.edit}
                                type="button"
                                value="Edit"
                                onClick={toggleEdit}
                            />
                            <div className={styles.popupContainer}>
                                <input
                                    className={styles.shareButton}
                                    type="button"
                                    value="Share"
                                    onClick={togglePopup}
                                />
                                {showPopup && (
                                    <div className={styles.popup}>
                                        <input
                                            className={styles.popupButton}
                                            type="button"
                                            value="Copy Share Code"
                                            onClick={() => {
                                                CopyShareCode()
                                                togglePopup()
                                            }}
                                        />
                                        <input
                                            className={styles.popupButton}
                                            type="button"
                                            value="Input Share Code"
                                            onClick={() => {
                                                toggleInputForm()
                                                togglePopup()
                                            }}
                                        />
                                        <input
                                            className={styles.popupButton}
                                            type="button"
                                            value="View Share Code"
                                            onClick={() => {
                                                toggleViewShareCode()
                                                togglePopup()
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    {activeForm && (
                        <>
                            <div className={styles.splitLine}></div>
                            <div className={styles.rightSide}>
                                {activeForm === 'edit' && (
                                    <ContactForm
                                        handleSubmit={EditContact}
                                        contact={user}
                                        isUser={true}
                                    />
                                )}
                                {activeForm === 'inputShareCode' && (
                                    <div className={styles.inputForm}>
                                        <textarea
                                            value={shareCode}
                                            onChange={(e) =>
                                                setShareCode(e.target.value)
                                            }
                                            placeholder="Enter share code here"
                                        />
                                        <div className={styles.textContainer}>
                                            <div
                                                id="failsharetext"
                                                style={{
                                                    display: 'none',
                                                    color: 'red',
                                                }}
                                            >
                                                Share code validation failed!
                                            </div>
                                        </div>
                                        <div className={styles.buttonRow}>
                                            <input
                                                type="button"
                                                value="Submit"
                                                onClick={() => {
                                                    InputShareCode()
                                                    toggleInputForm()
                                                }}
                                                className={
                                                    styles.submitShareButton
                                                }
                                            />
                                            <input
                                                type="button"
                                                value="Cancel"
                                                onClick={toggleInputForm}
                                                className={
                                                    styles.cancelShareButton
                                                }
                                            />
                                        </div>
                                    </div>
                                )}
                                {activeForm === 'viewShareCode' && (
                                    <div>
                                        <pre
                                            style={{
                                                fontSize: '20px',
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            {`firstName=${user.firstName} \n lastName=${user.lastName}
                   phone=${user.phone} \n email=${user.email} \n image=${user.image}`
                                                .split('\n')
                                                .map((line) => line.trim())
                                                .join('\n')}
                                        </pre>
                                        <input
                                            type="button"
                                            value="Copy"
                                            onClick={() => {
                                                CopyShareCode()
                                            }}
                                            className={styles.submitShareButton}
                                        />
                                        <input
                                            type="button"
                                            value="Cancel"
                                            onClick={toggleViewShareCode}
                                            className={styles.cancelShareButton}
                                        />
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
