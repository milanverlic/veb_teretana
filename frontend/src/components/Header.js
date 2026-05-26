import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { FaDumbbell, FaUser, FaBook, FaClock, FaUsers } from 'react-icons/fa';

// ... importi ...
const Header = () => {
  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>
              <FaDumbbell className="me-2" /> FitFlow
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-center">
              {/* Dodajemo novu stavku: Baza Vežbi */}
              <LinkContainer to="/exercises">
                <Nav.Link className="me-3">
                  <FaBook className="me-1" /> Baza Vežbi
                </Nav.Link>
              </LinkContainer>
              <LinkContainer to="/history">
                <Nav.Link className="me-3">
                  <FaClock className="me-1" /> Istorija
                </Nav.Link>
              </LinkContainer>
              <LinkContainer to="/community">
                <Nav.Link className="me-3">
                  <FaUsers className="me-1" /> Zajednica
                </Nav.Link>
              </LinkContainer>
              
              <LinkContainer to="/login">
                <Nav.Link>
                  <FaUser className="me-1" /> Prijavi se
                </Nav.Link>
              </LinkContainer>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};
export default Header;