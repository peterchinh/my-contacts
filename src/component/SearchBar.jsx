import styles from "./SearchBar.module.css";
import { useState, useEffect } from "react";

const SearchBar = ({ onSearchResults }) => {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    onSearchResults(searchTerm);
  }, [searchTerm, onSearchResults]);

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

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
