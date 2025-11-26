import React from 'react';
import logo from './logo.svg';
import TagRequest from './views/TagRequest';
import ServiceTagRequest from './views/ServiceTagRequest';
import ApproveRequest from './views/ApproveRequest';
import EventualTagRequest from './views/EventualTagRequest';
import EventualTagRequest2 from './views/EventualTagRequest2'; 
import EventualTagRequest3 from './views/EventualTagRequest3'; 
import TempTagRequest from './views/TempTagRequest';
import TempTagRequest2 from './views/TempTagRequest2';
import UserRequest from './views/UserRequest';
import UserTag from './views/UserTag';
import Login from './views/Login';
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas temporariamente públicas */}
        <Route path="/" element={<TagRequest />} />
        <Route path="/service" element={<ServiceTagRequest />} />
        <Route path="/eventual" element={<EventualTagRequest />} />
        <Route path="/eventual2" element={<EventualTagRequest2 />} />
        <Route path="/eventual3" element={<EventualTagRequest3 />} />
        <Route path="/temp" element={<TempTagRequest />} />
        <Route path="/temp2" element={<TempTagRequest2 />} />
        <Route path='/approve' element={<ApproveRequest/>}/>
        <Route path='/userRequest' element={<UserRequest/>}/>
        <Route path='/userTag' element={<UserTag/>}/>
        <Route path='/login' element={<Login/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
