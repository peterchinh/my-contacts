
import React, { useCallback, useState } from 'react'
import ContactCard from '../component/contact-card'
import ContactInfo from '../component/contact-info'
import ContactForm from '../component/contact-form'
import NavBar from '../component/navbar'
import SearchBar from '../component/SearchBar'
import '../style/contacts.css'
import axios from 'axios'
import noImage from '../assets/no_image.jpg'
import useSWR, { preload } from 'swr'
import { fetchContacts } from '../hooks/fetchContacts'
import Pins from '../component/contact-pins'
import { FaSortAlphaDown, FaSortAlphaDownAlt } from 'react-icons/fa'

// Default contact to send to ContactForm
const defaultContact = {
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
}

preload(
    [
        `${process.env.REACT_APP_BASE_URL}/contact/sorted`,
        { firstName: 'asc', lastName: 'asc' },
    ],
    ([url, token]) => fetchContacts(url, token)
)
preload(
    [
        `${process.env.REACT_APP_BASE_URL}/contact/sorted`,
        { firstName: 'desc', lastName: 'asc' },
    ],
    ([url, token]) => fetchContacts(url, token)
)

function Contacts({ setAccessToken }) {
    const [selectedContact, setSelectedContact] = useState(null)
    const [showContactForm, setShowContactForm] = useState(null)
    const [filtered, setFiltered] = useState(null)
    const [order, setOrder] = useState({ firstName: 'asc', lastName: 'asc' })
    const [searchTerm, setSearchTerm] = useState('')

    const { data: contactData, mutate: mutateContact } = useSWR(
        [`${process.env.REACT_APP_BASE_URL}/contact/sorted`, order],
        ([url, token]) => fetchContacts(url, token)
    )

    const { data: pinData, mutate: mutatePin } = useSWR(
        `${process.env.REACT_APP_BASE_URL}/pins`,
        fetchContacts
    )

    const cardClick = (contact) => {
        if (selectedContact === contact) {
            return
        }
        setSelectedContact(contact)
    }

    const toggleContactForm = () => {
        setShowContactForm(!showContactForm)
    }

    const toggleSort = () => {
        if (order.firstName === 'asc')
            setOrder({ firstName: 'desc', lastName: 'asc' })
        else setOrder({ firstName: 'asc', lastName: 'asc' })
        handleSearchResults(searchTerm)
    }

    const handleSearchResults = useCallback(
        (searchInput) => {
            setSearchTerm(searchInput)
            if (searchInput === '') {
                setFiltered(contactData)
            } else {
                const search = searchInput.toLowerCase()
                setFiltered(
                    (contactData || []).filter((contact) =>
                        (contact.firstName + ' ' + contact.lastName)
                            .toLowerCase()
                            .includes(search)
                    )
                )
            }
        },
        [contactData]
    )

    async function AddContact(contact, didSubmit) {
        if (!didSubmit) {
            toggleContactForm()
            return
        }
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BASE_URL}/contact`,
                contact,
                { withCredentials: true }
            )
            toggleContactForm()
            mutateContact()
            return response
        } catch (error) {
            console.log(error)
            // Not handling errors at the moment
            toggleContactForm()
            return false
        }
    }

    // Updates site when Editing and Deleting.
    function updateSite(contact) {
        mutateContact()
        mutatePin()
        console.log(contactData)
        setSelectedContact(contact)
    }

   // const toggleNav = () => {
    //    setIsNavOpen(!isNavOpen);
    //};

    return (
        <div className="contactpage">
            <NavBar setAccessToken={setAccessToken} />
            <div className="contactcontainer">
                <div className="contact-controls">
                    <div className="search-bar">
                        <SearchBar handleSearchResults={handleSearchResults} />
                    </div>
                    <button className="sortButton" onClick={toggleSort}>
                        {order.firstName === 'asc' ? (
                            <FaSortAlphaDown />
                        ) : (
                            <FaSortAlphaDownAlt />
                        )}
                    </button>
                    <button class="addcontact" onClick = {toggleContactForm}>
                      <div class="horizontal"></div>
                      <div class="vertical"></div>
                    </button>
                </div>
                <Pins cardClick={cardClick} contacts={pinData} />
                <div className="contactlist">
                    {contactData &&
                        (filtered ? filtered : contactData).map(
                            (contact, index) => (
                                <div
                                    key={index}
                                    className="contactCard"
                                    onClick={() => cardClick(contact)}
                                >
                                    <ContactCard
                                        name={
                                            contact.firstName +
                                            ' ' +
                                            contact.lastName
                                        }
                                        image={contact.image || noImage}
                                    />
                                </div>
                            )
                        )}
                </div>
            </div>
            {selectedContact && (
                <div
                    className={`contact-info ${selectedContact ? 'active' : ''}`}
                >
                    <ContactInfo
                        contact={selectedContact}
                        defaultContact={defaultContact}
                        updateSite={updateSite}
                    />
                </div>
            )}
            {showContactForm && (
                <div className="modal">
                    <ContactForm
                        handleSubmit={AddContact}
                        contact={defaultContact}
                        isUser={false}
                    />
                </div>
            )}
        </div>
    )
}

export default Contacts
