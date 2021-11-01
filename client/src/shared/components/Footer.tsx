import React from 'react';

// Page Footer component
const Footer = () => {
  return (
    <footer className='page-footer fixed-bottom font-small white'>
      <div
        className='footer-copyright text-center py-3 text-white'
        style={ { background: '#1a253b' } }
      >
        Copyright © 2020 Tokenizer™ all rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
