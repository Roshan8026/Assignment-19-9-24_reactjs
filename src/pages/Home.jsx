import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css'; // assuming you have your CSS here!

const Home = ({ token }) => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [totalPages, setTotalPages] = useState(1); // Track total pages
  const postsPerPage = 3; // Number of posts per page
  let user = JSON.parse(localStorage.getItem('user'));
  console.log(user);
    useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/posts', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Ensure we are mapping the likes to each post correctly
        const postsWithLikeStatus = data.map(post => ({
          ...post,
          liked: post.Likes.some(like => like.userId === user.id) // Check if the user has liked this post
        }));

        setPosts(postsWithLikeStatus);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    fetchPosts();
  }, [token]);


  const toggleLikePost = async (postId, isLiked) => {
    try {
      const method = isLiked ? 'delete' : 'post'; // Decide based on the current status
      await axios({
        method,
        url: `http://localhost:5000/api/posts/${postId}/like`,
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update state: If the user liked/unliked, toggle that in the posts array!
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId ? { ...post, liked: !isLiked } : post
        )
      );
    } catch (error) {
      console.error('Error liking/unliking post:', error);
    }
  };

  const followUser = async (userId) => {
    try {
      await axios.post(`http://localhost:5000/api/users/${userId}/follow`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Followed!');
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

   const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login'; // Redirect to login page
  };


  const handlePageChange = (direction) => {
    if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };


 return (
    <div className="container">
      {/* User info section in top-right corner */}
      <div className="user-info">
        <p>{user.firstName} {user.lastName}</p>
        <button onClick={handleLogout}>Logout</button>
        <br/>
        <br/>
        <button onClick={() => followUser(user.id)}>Follow 👤</button>
      </div>

      {/* Posts section */}
      <div>
        <h3>Social App</h3>
        {posts.length === 0 ? <p>No posts to show. Be the first to post! 🎉</p> : null}

        {posts.map(post => (
          <div key={post.id} className="post">
            <h3>{post.User.firstName} {post.User.lastName}</h3>
            <p>{post.content}</p>
            {post.filePath && (
              <img src={`http://localhost:5000/${post.filePath}`} alt="Post" style={{ maxWidth: '100%', borderRadius: '8px' }} />
            )}
            {post.liked ? (
              <button onClick={() => toggleLikePost(post.id, true)}>Unlike ❤️</button>
            ) : (
              <button onClick={() => toggleLikePost(post.id, false)}>Like 💙</button>
            )}
          </div>
        ))}
      </div>
        {/* Pagination controls */}
        <div className="pagination-controls">
          <button
            onClick={() => handlePageChange('prev')}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>{currentPage} of {totalPages}</span>
          <button
            onClick={() => handlePageChange('next')}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
    </div>
  );
};

export default Home;
