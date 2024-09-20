import React, { useState, useEffect } from 'react';
import api from '../services/api'; // Import the API service for making HTTP requests
import { toast, ToastContainer } from 'react-toastify'; // Import toast and ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS
import './styles.css';  // Make sure to import your CSS file


const Post = () => {
  const [posts, setPosts] = useState([]);
  const [heading, setHeading] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);

  // Fetch all posts when the component mounts
  useEffect(() => {
    api.get('/posts')
      .then(response => {
        setPosts(response.data);
      })
      .catch(err => console.error(err));
  }, []);

  // Handle post submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('heading', heading);
    formData.append('title', title);
    formData.append('content', content);
    if (file) formData.append('file', file);

    api.post('/posts', formData)
      .then(response => {
          toast.success('post creat successfull');
        setPosts([response.data, ...posts]); // Add new post to the list
      })
      .catch(err => {
        toast.error('something went wrong')
        console.error(err)
      })
  };

  return (
    <>
    <div className="container">
      <div className="form-box">
        <h2> Create a Post</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="Heading">Heading</label>
            <input
              id="Heading"
              name="Heading"
              type="text"
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="Title">Title</label>
            <input
              id="Title"
              name="Title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="Content">Content</label>
            <input
              id="content"
              name="content"
              type="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="file">file</label>
            <input
              id="file"
              name="file"
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              required
            />
          </div>
          
          <button type="submit">Create Post</button>
           {/* Add ToastContainer to the component */}
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar />
        </form>
            <h3>Posts</h3>
          <ul>
            {posts.map(post => (
              <li key={post.id}>
                <h4>{post.heading}</h4>
                <p>{post.title}</p>
                <p>{post.content}</p>
              </li>
            ))}
          </ul>
      </div>
    </div>
    </>
  );
};

export default Post;
