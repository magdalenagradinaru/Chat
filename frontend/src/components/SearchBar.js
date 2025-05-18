import { useState } from "react";
import { Form, Button } from "react-bootstrap";

export default function SearchBar({ onSearch }) {
  const [term, setTerm] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();          // împiedică reîncărcarea paginii
    onSearch(term.trim());       // propagă termenul către părinte
  };

  return (
    <Form className="search-bar mx-auto" onSubmit={handleSubmit}>
      <Form.Control
        type="text"
        placeholder="Caută..."
        value={term}
        onChange={(e) => setTerm(e.target.value)}
      />
      {/* buton ascuns (enter) sau vizibil – cum preferi */}
      <Button type="submit" className="d-none" />
    </Form>
  );
}
