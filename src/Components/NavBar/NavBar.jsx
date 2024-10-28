import React from 'react';
import { useNavigate } from 'react-router-dom';
import appLogo from './appLogo.svg';
import './NavBar.css';
import LogoutButton from '../Logout/Logout';

function NavBar() {
  const navigate = useNavigate();
  return (
    <div className="navbar">
      <img src={appLogo} alt="appLogo" className="appLogo" />
      <div className="nav-actions">
        <button onClick={() => navigate('/billing')} className="nav-link">Billing</button>
        <div className='signUp'>
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}

export default NavBar;