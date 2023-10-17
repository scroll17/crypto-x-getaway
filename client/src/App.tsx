import React from 'react';
import { useRoutes } from 'react-router-dom';
import routes from './router';
import AuthMiddleware from './middleware/AuthMiddleware';

function App() {
  const content = useRoutes(routes);

  return (
    <>
      <AuthMiddleware>{content}</AuthMiddleware>
    </>
  );
}

export default App;
