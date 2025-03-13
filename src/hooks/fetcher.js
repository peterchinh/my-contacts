import axios from 'axios'

export const fetcher = async (url, order, groupId) => {
    const response = await axios.get(url, {
        params: { ...order, groupId },
        withCredentials: true,
    })
    return response.data
}
