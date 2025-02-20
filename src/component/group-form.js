import React, { useState } from 'react'
import styles from './group-form.module.css'
import axios from 'axios'

export default function GroupForm({ setGroupAdd, groupMutate }) {
    const [group, setGroup] = useState({
        groupName: '',
    })

    function handleChange(event) {
        const groupName = event.target.value
        setGroup({
            groupName: groupName,
        })
        return
    }

    async function AddGroup(didSubmit) {
        console.log(group)
        if (!didSubmit) {
            setGroupAdd(false)
            return
        }
        try {
            const response = await axios.post(
                'http://localhost:8000/group',
                group,
                { withCredentials: true }
            )
            setGroupAdd(false)
            groupMutate()
            return response
        } catch (error) {
            console.log(error)
            // Not handling errors at the moment
            // toggleContactForm();
            return false
        }
    }

    return (
        <>
            <div className={styles.inputName}>Enter Name of Group</div>
            <input
                className={styles.inputField}
                placeholder="Group Name"
                onChange={handleChange}
            />
            <div>
                <input
                    className={styles.submit}
                    type="submit"
                    value="Submit"
                    onClick={() => AddGroup(true)}
                />
                <input
                    className={styles.cancel}
                    type="button"
                    value="Cancel"
                    onClick={() => AddGroup(false)}
                />
            </div>
        </>
    )
}
