import React, { useEffect, useState } from 'react';
import '../css/cover.css';
import Layout from "../components/Layout";

const Inbox = () => {
  const [messages, setMessages] = useState([]);
  const [newMessagesCount, setNewMessagesCount] = useState(0);
  const token = localStorage.getItem('access');

  // Obține mesajele la încărcarea componentei
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/messages/inbox/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setMessages(data);

          const newMessages = data.filter(msg => !msg.is_read);
          setNewMessagesCount(newMessages.length);
        } else {
          console.error('Eroare la încărcarea mesajelor');
        }
      } catch (error) {
        console.error('Eroare rețea:', error);
      }
    };

    fetchMessages();
  }, [token]);

  // Aduce conținutul postărilor pentru fiecare mesaj care are post_id
const [fetchedPostContents, setFetchedPostContents] = useState(false);

useEffect(() => {
  const fetchPostContents = async () => {
    const updatedMessages = await Promise.all(messages.map(async (msg) => {
      if (msg.post_id && !msg.post_content) {
        try {
          const res = await fetch(`http://localhost:8000/api/posts/${msg.post_id}/`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (res.ok) {
            const postData = await res.json();
            return { ...msg, post_content: postData.content };
          }
        } catch (err) {
          console.error("Eroare la încărcarea conținutului postării:", err);
        }
      }
      return msg;
    }));
    setMessages(updatedMessages);
    setFetchedPostContents(true);
  };

  if (!fetchedPostContents && messages.some(m => m.post_id && !m.post_content)) {
    fetchPostContents();
  }
}, [messages, token, fetchedPostContents]);


  const handleMarkAsRead = async (msgId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/messages/${msgId}/mark_read/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ is_read: true }),
      });

      if (response.ok) {
        setMessages(prevMessages =>
          prevMessages.map(msg =>
            msg.id === msgId ? { ...msg, is_read: true } : msg
          )
        );
        setNewMessagesCount(prevCount => Math.max(prevCount - 1, 0));
      } else {
        console.error('Eroare la actualizarea mesajului ca citit');
      }
    } catch (error) {
      console.error('Eroare rețea la marcarea mesajului ca citit:', error);
    }
  };


const handleDeleteMessage = async (msgId) => {
  try {
    const response = await fetch(`http://localhost:8000/api/messages/${msgId}/`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      setMessages(prevMessages => prevMessages.filter(msg => msg.id !== msgId));
    } else {
      console.error('Eroare la ștergerea mesajului');
    }
  } catch (error) {
    console.error('Eroare rețea la ștergerea mesajului:', error);
  }
};

  return (
    <Layout>
      <div className="inbox-container">
        <h1>
          Mesaje primite{' '}
          {newMessagesCount > 0 && (
            <span className="notification-badge">{newMessagesCount}</span>
          )}
        </h1>

        {messages.length === 0 ? (
          <p className="no-messages">Nu ai niciun mesaj.</p>
        ) : (
          <ul>
            {messages.map((msg) => (
             <li
  key={msg.id}
  className={msg.is_read ? 'read' : 'unread'}
  style={{ cursor: 'pointer', padding: '10px', borderBottom: '1px solid #ddd' }}
>
  <div onClick={() => !msg.is_read && handleMarkAsRead(msg.id)}>
    <strong>De la:</strong> {msg.sender_email}<br />
    <strong>Mesaj:</strong> {msg.content}<br />
    {msg.post && (
  <div>
    <strong>Postare:</strong><br />
    <span><em>{msg.post_content?.split('. ')[0]}.</em></span> {/* Doar prima propoziție */}
  </div>
)}

    <br />
    <small>{new Date(msg.created_at).toLocaleString()}</small>
  </div>
  <button
    onClick={() => handleDeleteMessage(msg.id)}
    style={{ marginTop: '5px', backgroundColor: 'red', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}
  >
    Șterge
  </button>
</li>

            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
};

export default Inbox;
