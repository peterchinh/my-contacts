import React, { useState } from 'react';
import styles from './group-form.module.css';

export default function GroupForm({ setGroupAdd, handleSubmit }) {
  const [group, setGroup] = useState({
    groupName: '',
  });

  function handleChange(event) {
    const groupName = event.target.value;
    setGroup({
      groupName: groupName,
    });
    return;
  }
  function submitForm(didSubmit) {
    // setGroupAdd(false);
    handleSubmit(group, didSubmit);
    return;
  }

  return (
    <>
      <div className={styles.inputName}>Enter Name of Group</div>
      <input
        className={styles.inputField}
        placeholder='Group Name'
        onChange={handleChange}
      />
      <div>
        <input
          className={styles.submit}
          type='submit'
          value='Submit'
          onClick={() => submitForm(true)}
        />
        <input
          className={styles.cancel}
          type='button'
          value='Cancel'
          onClick={() => submitForm(false)}
        />
      </div>
    </>
  );
}
