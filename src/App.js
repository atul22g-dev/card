import React from 'react'
import Main from './components/Cards/Main';
import { Routes, Route } from "react-router-dom";
import Signup from './components/Auth/Signup';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './components/Auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import AuthUser from './components/common/authUser';
import Logout from './components/Signout';
function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        {/* Auth */}
        <Route index element={<AuthUser authentication={false}> <Login /> </AuthUser>} />
        <Route path='/signup' element={<AuthUser authentication={false}> <Signup /> </AuthUser>} />
        {/* Card */}
        <Route path='/card' element={<AuthUser authentication={true}><Main /></AuthUser>} />
        {/* Dashboard */}
        <Route path='/dashboard' element={<AuthUser> <Dashboard /> </AuthUser>} />
        {/* Log out */}
        <Route path='/logout' element={<AuthUser authentication={true}><Logout /></AuthUser>} />
        {/*  */}
        <Route path="*" element={<AuthUser authentication={false}> <Login /> </AuthUser>} />
      </Routes>
    </>
  );
}

export default App;
