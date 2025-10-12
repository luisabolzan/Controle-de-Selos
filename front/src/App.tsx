import React from 'react';
import logo from './logo.svg';
import TagRequest from './views/TagRequest';
import ServiceTagRequest from './views/ServiceTagRequest';
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas temporariamente públicas */}
        <Route path="/" element={<TagRequest />} />
        <Route path="/service" element={<ServiceTagRequest />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
