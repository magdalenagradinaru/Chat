import React, { useEffect, useState } from 'react';
import '../css/cover.css';  // Importă fișierul CSS
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

          // Calculează câte sunt necitite
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

  // Marchează un mesaj ca citit
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
        // Actualizează mesajul local în listă
        setMessages(prevMessages =>
          prevMessages.map(msg =>
            msg.id === msgId ? { ...msg, is_read: true } : msg
          )
        );

        // Scade contorul
        setNewMessagesCount(prevCount => Math.max(prevCount - 1, 0));
      } else {
        console.error('Eroare la actualizarea mesajului ca citit');
      }
    } catch (error) {
      console.error('Eroare rețea la marcarea mesajului ca citit:', error);
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
  onClick={() => {
    if (!msg.is_read) {
      handleMarkAsRead(msg.id);
    }
  }}
  style={{ cursor: 'pointer', padding: '10px', borderBottom: '1px solid #ddd' }}
>
  <strong>De la:</strong> {msg.sender_email}<br />
  <strong>Mesaj:</strong> {msg.content}<br />
  {msg.post_title && (
    <div>
      <strong>Postare:</strong> {msg.post_title}
    </div>
  )}
  <small>{new Date(msg.created_at).toLocaleString()}</small>
</li>

          ))}
        </ul>
      )}
    </div>
    </Layout>
  );
};

export default Inbox;
