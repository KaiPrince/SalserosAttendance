import React from 'react';
import { Link } from 'react-router-dom';
import { Nav, Navbar, NavItem } from 'reactstrap';
import { LinkContainer } from 'react-router-bootstrap';
import './NavMenu.css';

export default props => (
    <Navbar inverse fixedTop fluid collapseOnSelect>
        <Navbar.Header>
            <Navbar.Brand>
                <Link to={'/'}>SalserosAttendance</Link>
            </Navbar.Brand>
            <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
            <Nav>
                <LinkContainer to={'/'} exact>
                    <NavItem>
                        {/* <Glyphicon glyph='home' / */}> Home
                    </NavItem>
                </LinkContainer>
                <LinkContainer to={'/counter'}>
                    <NavItem>
                        {/* <Glyphicon glyph='education' /> */} Counter
                    </NavItem>
                </LinkContainer>
                <LinkContainer to={'/fetchdata'}>
                    <NavItem>
                        {/* <Glyphicon glyph='th-list' /> */} Fetch data
                    </NavItem>
                </LinkContainer>
                <LinkContainer to={'/attendance'}>
                    <NavItem>
                        {/* <Glyphicon glyph='th-list' /> */} Attendance
                    </NavItem>
                </LinkContainer>
                <LinkContainer to={'/test'}>
                    <NavItem>
                        {/* <Glyphicon glyph='education' /> */} Tutorial
                    </NavItem>
                </LinkContainer>
            </Nav>
        </Navbar.Collapse>
    </Navbar>
);
