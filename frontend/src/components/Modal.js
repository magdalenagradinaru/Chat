import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Input, Label } from 'reactstrap';


// Componentă cu trei proprietăți
const ChatModal = ({ isOpen, toggle, onSendMessage }) => {
  const [userMessage, setUserMessage] = useState("");           // În input stochează mesajul userului

// Când user introduce mesaj, schimbă starea
  const handleChange = (e) => {
    setUserMessage(e.target.value);
  };

// Funcție de gestoonare a mesajelor
  const handleSend = () => {
    if (userMessage.trim() === "") return;                      // Verifica mesajul să nu fie gol
    onSendMessage(userMessage);                                 // Apelează onSendMessage pentru a trimite mesajul
    toggle();                                                   // Inchide modelul
    setUserMessage("");                                         // Resetează input-ul
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Send Message to Chatbot</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label for="user-message">Your Message</Label>
            <Input
              type="text"
              id="user-message"
              value={userMessage}
              onChange={handleChange}
              placeholder="Type your question here"
            />
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleSend}>
          Send
        </Button>{" "}
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ChatModal;

