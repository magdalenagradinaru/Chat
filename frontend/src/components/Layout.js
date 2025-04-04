import React from "react";
import { Navbar, Nav, Container, Form, Button } from "react-bootstrap";
import { useLogout } from "../Pages/Logout";
import "../css/cover.css";
import { FaHome, FaUser, FaEnvelope } from "react-icons/fa";


const Layout = ({ children }) => {
  const handleLogout = useLogout();

  return (
    <div className="d-flex min-vh-100">
      {/* Sidebar-ul vertical */}
   <div className="sidebar">
  <Nav className="flex-column">
    <Nav.Link href="/intro" className="nav-link"><FaHome /></Nav.Link>
    <Nav.Link href="/profile" className="nav-link"><FaUser /></Nav.Link>
    <Nav.Link href="/contact" className="nav-link"><FaEnvelope /></Nav.Link>
  </Nav>
</div>

      {/* Conținutul paginii */}
      <div className="flex-grow-1 d-flex flex-column">
        {/* Header-ul (fostul Navbar) */}
        <header className="custom-navbar bg-dark text-white px-3 py-2">
          <Container fluid className="d-flex align-items-center">
            {/* Logo + Nume aplicație */}
            <Navbar.Brand href="#" className="navbar-logo text-white">
              <img src="/mylogo.png" alt="Logo" style={{ height: "40px", marginRight: "10px" }} />
IT Community            </Navbar.Brand>

            {/* Search Field */}
            <Form className="search-bar mx-auto">
              <Form.Control type="text" placeholder="Caută..." />
            </Form>

            {/* Buton Logout */}
            <Button variant="danger" className="logout-button" onClick={handleLogout}>
              Logout
            </Button>
          </Container>
        </header>

        {/* Main Content */}
  <main role="main" className="inner cover flex-grow-1 p-4">{children}</main>

        {/* Footer */}
        <footer className="mastfoot bg-dark text-white text-center p-3">
          <div className="inner">
            <p>
              Cover template for <a href="https://getbootstrap.com/" className="text-white">Bootstrap</a>, by{" "}
              <a href="https://twitter.com/mdo" className="text-white">@mdo</a>.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
