import styles from "./SearchBar.module.css"
const SearchBar = () => {
  return (
    <div className="Container">
    <input
      className={styles.SearchBar}
      id="input"
      type="text"
      placeholder="Search"
    />
    </div>
  );
};


export default SearchBar;

