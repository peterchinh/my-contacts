import React, { useState } from 'react'
import {
    FaAddressBook,
    FaBars,
    FaChevronDown,
    FaChevronUp,
} from 'react-icons/fa'
import { MdPerson, MdGroups, MdLogout } from 'react-icons/md'
import styles from './navbar.module.css'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'
import useSWR from 'swr'
import GroupForm from './group-form'

export default function NavBar({ setAccessToken }) {
    const [groupAdd, setGroupAdd] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [isGroupOpen, setIsGroupOpen] = useState(false)
    const navigate = useNavigate()

    const fetchGroups = async (url) => {
        const response = await axios.get(url, {
            withCredentials: true,
        })
        return response.data
    }
    const { data: groupData, mutate: groupMutate } = useSWR(
        `${process.env.REACT_APP_BASE_URL}/group`,
        fetchGroups
    )

    const toggleNav = () => {
        setIsOpen(!isOpen) // Toggle main nav open state
    }

    const toggleGroup = () => {
        setIsGroupOpen(!isGroupOpen)
    }

    const openGroup = () => {
        setIsOpen(true)
        setIsGroupOpen(true)
    }

    const handleLogout = async () => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BASE_URL}/logout`,
                {},
                { withCredentials: true }
            )

            if (response.status === 200) {
                console.log('Logged out successfully')
                setAccessToken(null)
                navigate('/')
            } else {
                // Handle error
                console.error('Logout failed:', response.statusText)
            }
        } catch (error) {
            console.error('Error during logout:', error)
        }
    }

    return (
        <nav className={`${styles.navbar} ${isOpen ? styles.expanded : ''}`}>
            <button className={styles.menuButton} onClick={toggleNav}>
                <FaBars />
            </button>

            <div className={`${styles.navMenu} ${isOpen ? styles.show : ''}`}>
                <Link to="/profile" className={styles.navItem}>
                    <button className={styles.button}>
                        <MdPerson />
                    </button>
                    <span
                        className={`${styles.navText} ${
                            isOpen ? styles.slideIn : styles.slideOut
                        }`}
                    >
                        Profile
                    </span>
                </Link>
                <Link to="/contacts" className={styles.navItem}>
                    <button className={styles.button}>
                        <FaAddressBook />
                    </button>
                    <span
                        className={`${styles.navText} ${
                            isOpen ? styles.slideIn : styles.slideOut
                        }`}
                    >
                        All Contacts
                    </span>
                </Link>
                <div className={styles.navItem}>
                    <button
                        className={styles.button}
                        onClick={isOpen ? toggleGroup : openGroup}
                    >
                        <MdGroups />
                    </button>
                    <span
                        className={`${styles.navText} ${
                            isOpen ? styles.slideIn : styles.slideOut
                        }`}
                        onClick={toggleGroup}
                    >
                        Groups
                    </span>
                    <span
                        className={`${styles.navText} ${
                            isOpen ? styles.slideIn : styles.slideOut
                        }`}
                        onClick={toggleGroup}
                    >
                        {isGroupOpen ? <FaChevronDown /> : <FaChevronUp />}
                    </span>
                </div>
                {/* Submenu for Groups */}
                {isOpen && isGroupOpen && (
                    <div
                        className={`${styles.subMenu} ${
                            isGroupOpen
                                ? styles.subMenuOpen
                                : styles.subMenuClosed
                        }`}
                    >
                        {[...groupData, { groupName: '+ Add Group' }].map(
                            (group, index) => (
                                <div
                                    key={index}
                                    className={styles.subMenuItem}
                                    style={{
                                        animationDelay: `${index * 0.1}s`,
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        if (index === groupData.length) {
                                            setGroupAdd(true)
                                        } else {
                                            navigate(`/group/${group._id}`)
                                        }
                                    }} // Prevent click from bubbling
                                >
                                    {group.groupName}
                                </div>
                            )
                        )}
                    </div>
                )}
                <div className={styles.navItem} onClick={handleLogout}>
                    <button className={styles.button}>
                        <MdLogout />
                    </button>
                    <span
                        className={`${styles.navText} ${
                            isOpen ? styles.slideIn : styles.slideOut
                        }`}
                    >
                        Logout
                    </span>
                </div>
            </div>
            {groupAdd && (
                <div className={styles.modal}>
                    <GroupForm
                        setGroupAdd={setGroupAdd}
                        groupMutate={groupMutate}
                    />
                </div>
            )}
        </nav>
    )
}
