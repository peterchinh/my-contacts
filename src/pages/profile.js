import React from 'react'
import '../style/profile.css'
import NavBar from '../component/navbar'
import UserInfo from '../component/user-info'
import axios from 'axios'
import useSWR from 'swr'

function Profile({ setAccessToken }) {
    const fetcher = async (url) => {
        const [userResponse, contactsResponse] = await Promise.all([
            axios.get(`${process.env.REACT_APP_BASE_URL}/users`, {
                withCredentials: true,
            }),
            axios.get(`${process.env.REACT_APP_BASE_URL}/contact`, {
                withCredentials: true,
            }),
        ])
        return {
            user: userResponse.data,
            contacts: contactsResponse.data,
        }
    }
    const { data, mutate } = useSWR('fetch-data', fetcher)

    function updateSite() {
        mutate()
        return
    }
    return (
        <div className="profilepage">
            <NavBar setAccessToken={setAccessToken} />
            <div className="main">
                {data ? (
                    <>
                        <UserInfo user={data.user} updateSite={updateSite} />
                        {/* <div className="contact-info">
              <h2> Number of Contacts : {data.contacts.length} </h2>
            </div> */}
                    </>
                ) : (
                    <p> loading... </p>
                )}
            </div>
        </div>
    )
}

export default Profile
