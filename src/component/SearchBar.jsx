import styles from "./SearchBar.module.css";
import { useState, useEffect } from "react";
import axios from "axios";

async function fetchAll() {
  try {
    const response = await axios.get("http://localhost:8000/contact");
    return response.data;
  } catch (error) {
    console.log(error);
    return false;
  }
}

// function nameComp(a, b){
//   let i = 0;
//   let j = 0;

//   while ( i < a.length && j < b.length ){
//     if (a[i] < b[j]){
//       return True
//     }
//     else if (a[i] > b[j]){
//       return False
//     }
//     i++;
//     j++;

//   }
//   return (a.length < b.length);
// }

function compare(a, b) {
  if (a.lastName.toLowerCase() < b.lastName.toLowerCase()) {
    return -1;
  } else if (a.lastName.toLowerCase() > b.lastName.toLowerCase()) {
    return 1;
  } else {
    // Equal last names, check first names

    if (a.firstName.toLowerCase() < b.firstName.toLowerCase()) {
      return -1;
    } else {
      return 1;
    }
  }
}

const SearchBar = ({ onSearchResults }) => {
  const [searchTerm, setSearchTerm] = useState("");

  function search(name) {
    const namesPromise = fetchAll();
    namesPromise.then((names) => {
      const matches = []; // all contact names that match search input

      for (let i = 0; i < names.length; i++) {
        // if contact first or last name matches, add to array
        if (
          names[i].firstName.toLowerCase().includes(name.toLowerCase()) ||
          names[i].lastName.toLowerCase().includes(name.toLowerCase())
        ) {
          matches.push(names[i]);
        }
      }
      matches.sort(compare);
      onSearchResults(matches);
    });
  }

  useEffect(() => {
    search("");
  }, []);
  useEffect(() => {
    const input = document.getElementById("input");
    // search("")

    const handleKeyPress = (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        const arr = search(searchTerm);
        return arr;
      }
    };

    if (input) {
      // Calls handleKeyPress when Enter Pressed
      input.addEventListener("keypress", handleKeyPress);
    }

    // Cleanup function to remove event listener
    return () => {
      if (input) {
        // Calls function only  time
        input.removeEventListener("keypress", handleKeyPress);
      }
    };
  }, [searchTerm]);

  const handleChange = (e) => {
    if (e.target.value === "") {
      //when user deletes input, show all
      search("");
    }
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
