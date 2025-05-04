import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../components/Layout";

const Intro = () => {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access"); // Corect: 'access', nu 'access_token'
    if (!token) {
      console.error("No authentication token found.");
      return;
    }

    // Obține postările existente
    axios.get('http://localhost:8000/api/posts/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        setPosts(response.data);
      })
      .catch(error => {
        console.error('Error fetching posts:', error.response ? error.response.data : error.message);
      });
  }, []);

  const handlePostSubmit = () => {
    const token = localStorage.getItem("access");
    if (!token) {
      console.error("No authentication token found.");
      return;
    }

    axios.post('http://localhost:8000/api/posts/', { content }, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        setPosts([response.data, ...posts]);
        setContent("");
      })
      .catch(error => {
        console.error('Error posting:', error.response ? error.response.data : error.message);
      });
  };

  return (
    <Layout>
      <div>
        <h1>Welcome to the Intro Page</h1>

        <div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write something..."
          />
          <button onClick={handlePostSubmit}>Post</button>
        </div>

        <div>
          <h2>Posts</h2>
          {posts.map(post => (
            <div key={post.id}>
              <p><strong>{post.author}</strong>: {post.content}</p>
              <p>{new Date(post.created_at).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Intro;
