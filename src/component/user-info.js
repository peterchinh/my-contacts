import React from 'react';
import styles from './user-info.module.css';

export default function UserInfo(props){
    const user = props.user;
    return(
    <div className={styles.profileContainer}>
      <div className={styles.profileCard}>
        <div className={styles.profileInfo}>
          <h1> {user.name} </h1>
          <h2> {user.email} </h2>
          <h2> {user.phone} </h2>
        </div>
      </div>
    </div>
    );
}