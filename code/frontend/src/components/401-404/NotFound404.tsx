/* src/components/401-404/NotFound404.tsx
 src/tests/Login.test.tsx

 AI-generated code: 80% Tool: GPT

 Human code: 20% Logic

 Framework-generated code: 0%
*/


import React from 'react';
import { Link } from 'react-router-dom';

const NotFound404 = () => {
  return (
    <div className="text-center p-5">
      {/* Accessible heading */}
      <h1 className="display-1">404</h1>
      <h2 className="display-4">Page Not Found</h2>
      <p className="lead">
        The page you are looking for does not exist.
      </p>
      <hr />
      
      {/* Link that navigates to the main page (we'll assume it's "/") */}
      <Link to="/" className="btn btn-dark">
        Go Home
      </Link>
    </div>
  );
};

export default NotFound404;