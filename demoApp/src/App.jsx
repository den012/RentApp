import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import FormPage from './components/FormPage';
import RenderPage from './components/RenderPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FormPage/>} />
        <Route path="/rents" element={<RenderPage/>} />
      </Routes>
    </Router>
  )
}

export default App;