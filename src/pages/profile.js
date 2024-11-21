import React, { useState } from "react";
import "../style/profile.css";
import Contacts from "./contacts";
import NavBar from "../component/navbar";
import UserInfo from "../component/user-info"
import axios from "axios";
import ProtectedRoute from "../component/protected-route";
import useSWR, { useSWRConfig } from "swr";

function Profile({setAccessToken}){
  const fetcher = async (url) => {
    const response = await axios.get(url, {withCredentials: true});
    return response.data;
  }
  const {data, error, isLoading, mutate} = useSWR('http://localhost:8000/users', fetcher);


  return(
    <div className="profilepage">
      <NavBar setAccessToken={setAccessToken} />
      <div className="main">
        <UserInfo user={data}/>
      </div>
    </div>
  );
}

export default Profile;