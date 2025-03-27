import { StrictMode } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Homepage from './Homepage.jsx';
import Information from './Information.jsx';
import Login from './official/Login.jsx';
import Dashboard from './official/Dashboard.jsx';
import Residents from './official/Residents.jsx';
import AnnouncementsPage from './official/AnnouncementsPage.jsx';
import Cases from './official/Cases.jsx';
import EventsCalendar from './official/EventsCalendar.jsx';
import Users from './official/Users.jsx';
import { createRoot } from 'react-dom/client';
import './index.css';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes> 
        <Route path="/" element={<Homepage />} />
        <Route path="/information" element={<Information />} />
        <Route path="/login" element={<Login />} />
        <Route path="/official/dashboard" element={<Dashboard />} />
        <Route path="/official/residents" element={<Residents />} />
        <Route path="/official/announcements" element={<AnnouncementsPage />} />
        <Route path="/official/cases" element={<Cases />} />
        <Route path="/official/events" element={<EventsCalendar />} />
        <Route path="/official/users" element={<Users />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
