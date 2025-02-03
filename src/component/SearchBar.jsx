import styles from "./SearchBar.module.css";
import { useState, useEffect } from "react";

const SearchBar = ({ onSearchResults }) => {

  const handleChange = (e) => {
    console.log(e.target.value);
    onSearchResults(e.target.value);
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
