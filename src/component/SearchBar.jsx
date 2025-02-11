import styles from "./SearchBar.module.css";
import { useState, useEffect } from "react";

const SearchBar = ({ handleSearchResults }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    handleSearchResults(searchTerm);
  }, [searchTerm, handleSearchResults])

  return (
    <div className="Container">
      <input
        className={styles.SearchBar}
        id="input"
        type="text"
        placeholder="Search"
        onChange={handleChange}
      />
    </div>
  );
};

export default SearchBar;
