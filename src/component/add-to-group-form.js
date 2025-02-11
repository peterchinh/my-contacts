import React, { useEffect, useState } from 'react';
import styles from './add-to-group-form.module.css';
import axios from 'axios';
import { MdSignalCellularNoSim } from 'react-icons/md';
export default function AddToGroupForm({ handleSubmit, contact, FindGroups }) {
  // find groups = function to get all groups for user
  // contact = current contact that is being added
  const [groups, setGroups] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState({}); // Track selected groups

  useEffect(() => {
    async function fetchGroups() {
      const result = await FindGroups();
      setGroups(result);
    }
    fetchGroups();
  }, []);

  useEffect(() => {
    if (contact && contact._id) {
      // console.log('Contact ID:', contact._id);
      const initialSelectedGroups = {};

      groups.forEach((group) => {
        // Check if the contact's ID is in the group's contacts array
        if (group.contacts && group.contacts.includes(contact._id)) {
          initialSelectedGroups[group._id] = true; // Mark this group as selected
        }
      });

      setSelectedGroups(initialSelectedGroups);
    }
  }, [contact, groups]);

  function handleChange(event) {
    const { name, value, checked } = event.target;
    setSelectedGroups((prev) => ({
      ...prev,
      [value]: checked,
    }));
    return;
  }

  async function addToGroup(currentContact, group) {
    // adds contact to group
    console.log(group);
    try {
      const response = await axios.put(
        `http://localhost:8000/group/${group}`,
        { newContact: currentContact }, // Send `newContact` in request body
        { withCredentials: true },
      );
      return response;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async function removeFromGroup(currentContact, group) {
    // remvoes contact from group

    try {
      const response = await axios.put(
        `http://localhost:8000/group/${group}/remove`,
        { contactId: currentContact },
        { withCredentials: true },
      );
      return response;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async function submitForm(didSubmit) {
    // add contact to groups
    // add groups to contacts

    if (didSubmit) {
      const selected = Object.keys(selectedGroups).filter((group) =>
        selectedGroups[group]
      );
      // if (!Array.isArray(selected) || selected.length === 0) {
      //   console.log('No groups selected.');
      //   handleSubmit(false);
      //   return;
      // }

      const groupsToAdd = selected.filter((groupId) => {
        const group = groups.find((g) => g._id === groupId);
        return group && !group.contacts.includes(contact._id); // Only add if not already in the group
      });

      const groupsToRemove = groups
        .filter((group) =>
          !selectedGroups[group._id] && group.contacts.includes(contact._id)
        )
        .map((group) => group._id);

      for (const groupId of groupsToAdd) {
        await addToGroup(contact._id, groupId);
      }

      for (const groupId of groupsToRemove) {
        await removeFromGroup(contact._id, groupId);
      }

      handleSubmit(selected);
    } else {
      handleSubmit(false);
    }
    return;
  }

  return (
    <>
      <div className={styles.inputName}>Select Groups To Add Contact To</div>

      <div>
        {groups.map((group, index) => (
          <label key={index} className={styles.checkboxLabel}>
            <input
              className={styles.checkbox}
              type='checkbox'
              value={group._id}
              name={group.groupName}
              checked={selectedGroups[group._id] || false}
              onChange={handleChange}
            />
            {group.groupName}
          </label>
        ))}
      </div>
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
