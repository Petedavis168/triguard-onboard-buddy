import React from 'react';
import { Link } from 'react-router-dom';

const Test = () => {
  console.log('TEST PAGE RENDERED!');
  
  return (
    <div style={{ padding: '20px', background: 'yellow' }}>
      <h1>TEST PAGE WORKS!</h1>
      <p>If you can see this, routing is working.</p>
      <Link to="/" style={{ color: 'blue', textDecoration: 'underline' }}>
        Go back to home
      </Link>
    </div>
  );
};

export default Test;