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
import AllTags from './views/AllTags';
import Login from './views/Login';
import SignUp from './views/SignUp';
import RegisterdTags from './views/RegisteredTags';
import ServiceTagRegister from './views/ServiceTagRegister';
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas temporariamente públicas */}
        <Route path="/tagRequest" element={<TagRequest />} />
        <Route path="/service" element={<ServiceTagRequest />} />
        <Route path="/eventual" element={<EventualTagRequest />} />
        <Route path="/eventual2" element={<EventualTagRequest2 />} />
        <Route path="/eventual3" element={<EventualTagRequest3 />} />
        <Route path="/temp" element={<TempTagRequest />} />
        <Route path="/temp2" element={<TempTagRequest2 />} />
        <Route path='/approve' element={<ApproveRequest/>}/>
        <Route path='/userRequest' element={<UserRequest/>}/>
        <Route path='/userTag' element={<UserTag/>}/>
        <Route path='/allTags' element={<AllTags/>}/>
        <Route path='/registeredTags' element={<RegisterdTags/>}/>
        <Route path='/serviceTagRegister' element={<ServiceTagRegister/>}/>
        <Route path='/' element={<Login/>}/>
        <Route path='/signup' element={<SignUp/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
