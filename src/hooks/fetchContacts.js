import axios from "axios";

export const fetchContacts = async (url, param) => {
    const response = await axios.get(url, {
      params: param,
      withCredentials: true,
    });
    return response.data;
};