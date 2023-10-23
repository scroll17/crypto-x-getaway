import React from 'react';

import { useRoutes } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import 'react-toastify/dist/ReactToastify.min.css';
import { ToastContainer } from 'react-toastify';

import routes from './router';

function App() {
  const content = useRoutes(routes);

  return (
    <>
      <ToastContainer />
      {content}
    </>
  );
}

export default App;
