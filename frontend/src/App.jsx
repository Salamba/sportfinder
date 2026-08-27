import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useAuth } from './auth';
import NavBar from './components/NavBar';

import Login from './pages/Login';
import Register from './pages/Register';
import Feed from './pages/Feed';
import EventDetail from './pages/EventDetail';
import CreateEvent from './pages/CreateEvent';
import Clubs from './pages/Clubs';
import ClubDetail from './pages/ClubDetail';
import Chats from './pages/Chats';
import ChatWindow from './pages/ChatWindow';
import Profile from './pages/Profile';

function PrivateArea({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="loading-state">Загрузка…</div>;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return (
    <>
      {children}
      <NavBar />
    </>
  );
}

export default function App() {
  return (
    <div className="app-shell">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/"
          element={
            <PrivateArea>
              <Feed />
            </PrivateArea>
          }
        />
        <Route
          path="/events/new"
          element={
            <PrivateArea>
              <CreateEvent />
            </PrivateArea>
          }
        />
        <Route
          path="/events/:id"
          element={
            <PrivateArea>
              <EventDetail />
            </PrivateArea>
          }
        />
        <Route
          path="/clubs"
          element={
            <PrivateArea>
              <Clubs />
            </PrivateArea>
          }
        />
        <Route
          path="/clubs/:id"
          element={
            <PrivateArea>
              <ClubDetail />
            </PrivateArea>
          }
        />
        <Route
          path="/chats"
          element={
            <PrivateArea>
              <Chats />
            </PrivateArea>
          }
        />
        <Route
          path="/chats/:id"
          element={
            <PrivateArea>
              <ChatWindow />
            </PrivateArea>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateArea>
              <Profile />
            </PrivateArea>
          }
        />
      </Routes>
    </div>
  );
}
