1. The backend of the application is the part that deals with everything related to logic and data management. This is where the main engine of the chatbot is located, which combines two ways of answering: one based on rules (pre-established answers to clear questions) and another generative, 
which uses an artificial intelligence model trained with **PyTorch** to generate more natural and varied answers. Also in the backend are managed user accounts, authentication, registration, logout and communication with the **PostgreSQL** database. Django, the 
framework used, helps to clearly organize the code and expose functionalities 
through a series of API routes. 

2. The frontend of the application is the part visible to the user, built with React. Here 
the user can see and use the interface for registration, login and, most importantly, to 
discuss with the chatbot. React components allow for fast and enjoyable interaction without reloading the page every time. For example, in the chat window, the user sends a message, and the application automatically sends the message to the server and displays the received response. Everything is built in an intuitive way so that the user experience is as fluent and easy to understand as possible.


