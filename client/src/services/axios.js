import axios from 'axios';


const axiosWithHeader = axios.create({
  baseURL: import.meta.env.VITE_API_URL , // Replace with your API base URL
});

// Optionally, you can set the token here if it exists in local storage
const token = localStorage.getItem(import.meta.env.VITE_JWT_COOKIE_NAME);
console.log("THis IS FROM AXIOS FILE",token);

if (token) {
    axiosWithHeader.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default axiosWithHeader;