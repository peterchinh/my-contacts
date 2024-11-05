import { useState, useEffect } from "react";
import '../App.css'

const SearchBar = () => {
  return (
    <div className="Container">
    <input
      className="SearchBar"
      id="input"
      type="text"
      placeholder="Search"
    />
    </div>
  );
};


export default SearchBar;

