import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import SendMessageButton from "../components/SendMessageButton";
import { Link } from "react-router-dom";


const Intro = () => {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [postId, setPostId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      console.error("No authentication token found.");
      return;
    }

    axios.get("http://localhost:8000/api/posts/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        setPosts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error.response ? error.response.data : error.message);
      });
  }, []);

  const handlePostSubmit = () => {
    const token = localStorage.getItem("access");
    if (!token) {
      console.error("No authentication token found.");
      return;
    }

    axios.post("http://localhost:8000/api/posts/", { content }, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        setPosts([response.data, ...posts]);
        setContent("");
      })
      .catch((error) => {
        console.error("Error posting:", error.response ? error.response.data : error.message);
      });
  };

  const openEmailModal = (email, id) => {
    setRecipientEmail(email);
    setPostId(id);
    setEmailModalOpen(true);
  };

  const closeEmailModal = () => {
    setEmailModalOpen(false);
    setRecipientEmail("");
    setPostId(null);
  };

  return (
    <Layout>
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
        <div style={{ marginBottom: "20px" }}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Scrie anunțul tău aici..."
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "16px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              resize: "vertical",
            }}
            rows={4}
          />
          <button
            onClick={handlePostSubmit}
            style={{
              marginTop: "10px",
              padding: "10px 20px",
              backgroundColor: "#007BFF",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Postează
          </button>
        </div>

        <div>
          <h2 style={{ marginBottom: "15px" }}>Postări</h2>
          {posts.map((post) => (
            <div
              key={post.id}
              style={{
                backgroundColor: "#f9f9f9",
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "15px",
                marginBottom: "15px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
              }}
            >
              <p style={{ marginBottom: "8px" }}>
  <strong>
    <Link
      to={`/profile/${post.author}`}
      style={{ textDecoration: "none", color: "#007bff" }}
    >
      {post.author}
    </Link>
  </strong>
</p>

              <p style={{ marginBottom: "12px" }}>{post.content}</p>
              <button
                onClick={() => openEmailModal(post.author_email, post.id)}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#28a745",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Trimite Mesaj
              </button>
            </div>
          ))}
        </div>

        {/* Modal pentru trimitere mesaj */}
        {emailModalOpen && (
          <div style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}>
            <div style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "12px",
              width: "90%",
              maxWidth: "400px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
            }}>
              <SendMessageButton
                postId={postId}
                recipientEmail={recipientEmail}
                onCloseModal={closeEmailModal}
              />
              <button
                onClick={closeEmailModal}
                style={{
                  marginTop: "10px",
                  padding: "6px 12px",
                  backgroundColor: "#dc3545",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Închide
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Intro;
