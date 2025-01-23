import axios from "axios";

export const fetchContacts = async (url) => {
    const response = await axios.get(url, {
      withCredentials: true,
    });
    return response.data;
};