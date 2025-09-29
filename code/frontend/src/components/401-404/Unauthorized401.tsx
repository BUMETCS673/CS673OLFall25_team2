/* src/components/401-404/Unauthorized401.tsx
 src/tests/Login.test.tsx

 AI-generated code: 80% Tool: GPT

 Human code: 20% Logic

 Framework-generated code: 0%
*/


import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized401 = () => {
  return (
    <div className="text-center p-5">
      {/* Accessible heading for screen readers */}
      <h1 className="display-4">Unauthorized Access</h1>
      
      {/* The role="alert" makes screen readers announce this message immediately */}
      <p className="lead" role="alert">
        Your session has expired or you do not have permission to view this page.
      </p>
      <hr />
      <p>Please sign in to continue.</p>
      
      {/* Link that navigates to the login page */}
      <Link to="/login" className="btn btn-primary">
        Sign in
      </Link>
    </div>
  );
};

export default Unauthorized401;