import React from 'react';
import logo from './logo.svg';
import TagRequest from './views/TagRequest';
import ServiceTagRequest from './views/ServiceTagRequest';
import ApproveRequest from './views/ApproveRequest';
import Login from './views/Login';
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas temporariamente públicas */}
        <Route path="/" element={<TagRequest />} />
        <Route path="/service" element={<ServiceTagRequest />} />
        <Route path='/approve' element={<ApproveRequest/>}/>
        <Route path='/login' element={<Login/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
