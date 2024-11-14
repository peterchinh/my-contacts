import React from "react";
import styles from "./contact-card.module.css";

function ContactCard({ name, image }) {
  return (
    <div className={styles.card}>
      <img src={image} alt={`$(name)'s profilepic`} className={styles.image} />
      <span className={styles.name}>{name}</span>
    </div>
  );
}

export default ContactCard;
