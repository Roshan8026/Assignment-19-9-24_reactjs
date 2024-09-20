import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify'; // Import toast and ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS
import './styles.css';  // Make sure to import your CSS file
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        ...formData,
      });
      console.log('res',res.data);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      toast.success('Login successful');
      setFormData({
        email: '',
        password: '',
      })
        setTimeout(()=> {
        navigate('/home');
      },2000)    
    } catch (error) {
      if (error.response && error.response.status === 403) {
        // Handle 403 error from backend
        const { message } = error.response.data;
        toast.error(message);
      } else {
        toast.error('Login failed. Please try again.');
      }
    }
  };

  
  return (
    <div className="container">
      <div className="form-box">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <button type="submit">Login</button>
           {/* Add ToastContainer to the component */}
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar />
        </form>
      </div>
    </div>
  );
};

export default Login;
