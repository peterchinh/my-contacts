import React from 'react';
import styles from './user-info.module.css';

export default function UserInfo(props){
    const user = props.user;
    return(
    <div className={styles.profileContainer}>
      <div className={styles.profileCard}>
        <div className={styles.profileInfo}>
          <h1> Profile Info: </h1>
          <hr className={styles.hrLine} />
          <h2 className={styles.profileName}> {user.name} </h2>
          <h3> {user.email} </h3>
        </div>
      </div>
    </div>
    );
}