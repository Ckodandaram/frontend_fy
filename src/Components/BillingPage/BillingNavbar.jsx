import React from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutButton from '../Logout/Logout';
import './BillingNavbar.css';

const BillingNavbar = () => {
  const navigate = useNavigate();

  return (
    <nav className='billing-navbar'>
      <button onClick={() => navigate('/')}className='home-button'>Home</button>
      <div className='signUp'>
        <LogoutButton />
      </div>
    </nav>
  );
};

export default BillingNavbar;
