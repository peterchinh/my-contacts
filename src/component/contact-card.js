import React from 'react';
import styles from './contact-card.module.css';

function ContactCard({ name, image }) {
  return (
    <div className={styles.card}>
      <img src={image} alt={`${name}'s profile pic`} className={styles.image} />
      <span className={styles.name}>{name}</span>
      <hr className={styles.separator} />
    </div>
  );
}

export default ContactCard;
