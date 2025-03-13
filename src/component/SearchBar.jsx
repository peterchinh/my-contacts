import { useState, useEffect } from 'react'
import styles from './SearchBar.module.css'
import { FaSearch } from 'react-icons/fa' // Import search icon

const SearchBar = ({ handleSearchResults }) => {
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        handleSearchResults(searchTerm)
    }, [searchTerm, handleSearchResults])

    const handleChange = (e) => {
        setSearchTerm(e.target.value)
    }

    return (
        <div className={styles.SearchContainer}>
            <FaSearch className={styles.SearchIcon} />
            <input
                className={styles.SearchBar}
                type="text"
                placeholder="Search"
                onChange={handleChange}
            />
        </div>
    )
}

export default SearchBar
