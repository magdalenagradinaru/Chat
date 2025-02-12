// Deschide chatbot-ul
document.getElementById('chatbot-icon').addEventListener('click', function () {
    document.getElementById('chatbot-window').style.display = 'block';
});

// Închide chatbot-ul
function closeChatbot() {
    document.getElementById('chatbot-window').style.display = 'none';
}

// Funcție pentru obținerea token-ului CSRF
function getCsrfToken() {
    let name = 'csrftoken=';
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return '';
}

// Trimite mesajul la server și afișează răspunsul chatbot-ului
async function sendMessage() {
    const userInput = document.getElementById('user-input').value;
    if (!userInput) return;

    const chatBox = document.getElementById('chat-box');
    chatBox.innerHTML += `<div class="message user-message">${userInput}</div>`;
    document.getElementById('user-input').value = '';

    try {
        const response = await fetch('/chatbot_backend/chat/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRFToken': getCsrfToken(),
            },
            body: `message=${encodeURIComponent(userInput)}`
        });

        if (!response.ok) {
            throw new Error(`Eroare la server: ${response.statusText}`);
        }

        const data = await response.json();
        const botResponse = data.response || 'Eroare: Răspuns invalid primit.';
        chatBox.innerHTML += `<div class="message bot-message">${botResponse}</div>`;
    } catch (error) {
        chatBox.innerHTML += `<div class="message bot-message">Eroare: ${error.message}</div>`;
    }

    chatBox.scrollTop = chatBox.scrollHeight;
}

// Trimiterea mesajului cu tasta Enter
document.getElementById('user-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});
