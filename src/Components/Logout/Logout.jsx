import React from "react";
import { Button } from "react-bootstrap";

const LogoutButton = () => {
  // console.log("inside LogoutButton in Logout");
  // Function to delete a cookie
  function deleteCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }
  const logoutBtnOnClick = () => {
    // console.log("inside LogoutBtnOnClick in Logout");
    try {
      // // Remove the token from localStorage
      // localStorage.removeItem('token');
      
      // Remove the token from cookies
      deleteCookie('token');
      
      // Optional: Make an API call to invalidate the token on the server if needed
      // await fetch('http://localhost:4000/api/logout', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   }
      // });

      // Redirect the user to the login page after logout
      window.location.href = '/';
    } catch (error) {
      console.log(JSON.stringify(error, null, 2));
    }
  };

  return <Button onClick={logoutBtnOnClick}>Log Out</Button>;
};

export default LogoutButton;
