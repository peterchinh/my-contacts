import React from 'react'
import styles from './contact-card.module.css'

function ContactCard({ name, image }) {
<<<<<<< HEAD
  return (
    <div className={styles.card}>
      <img src={image} alt={`${name}'s profile pic`} className={styles.image} />
      <span className={styles.name}>{name}</span>
      <hr className={styles.separator} />
    </div>
  );
=======
    return (
        <div className={styles.card}>
            <img
                src={image}
                alt={`$(name)'s profilepic`}
                className={styles.image}
            />
            <span className={styles.name}>{name}</span>
        </div>
    )
>>>>>>> 6069671e7dae486b40954ced141c58163c4ac3dc
}

export default ContactCard
