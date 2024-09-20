import axios from 'axios';

// Create an Axios instance to interact with the API
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Replace with your backend API base URL
  headers: {
    'Content-Type': 'multipart/form-data', // For file uploads
    'Authorization': `Bearer ${localStorage.getItem('token')}` // Optionally handle auth tokens
  }
});

export default api;
