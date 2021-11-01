import React from 'react';
import {
  Link,
} from 'react-router-dom';

import {
  Nav,
  Navbar,
} from 'react-bootstrap';

// Page header component
const Header = () => {
  return (
    <Navbar variant='dark' style={ { background: '#1a253b' } }>
      <Navbar.Brand as={ Link } to='/'>
        <img
          src='https://cdn2.bytetrade.io/2e4add5483abf2ff/c7763b7a907c172c7c5eb5cbb59447f2.png'
          width='100'
          height='50'
          className='d-inline-block align-center'
          alt='Tokenizer'
        />
      </Navbar.Brand>
      <Nav className='ml-auto'>
        <Link className='nav-link' to='/'>Home</Link>
        <Link className='nav-link' to='/'>About</Link>
        <Link className='nav-link' to='/'>Features</Link>
        <Link className='nav-link' to='/'>Pricing</Link>
        <Link className='nav-link' to='/'>Contact Us</Link>
      </Nav>
    </Navbar>
  );
};

export default Header;
