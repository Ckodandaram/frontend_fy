import { useState, useEffect } from 'react';

// Function to get a cookie by name
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

export const useAuth = () => {
  //console.log("inside useAuth in AuthProvider");
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    //console.log("inside useEffect in Authprovider");
    // // Check if a token exists in localStorage when the app initializes
    // const token = localStorage.getItem('token');
    
    // Check if a token exists in cookies when the app initializes
    const token = getCookie('token');
   // console.log(token);
    if (token) {
      //console.log("yes there is token (we are inside useEffect in authP)");
      setCurrentUser(token); // Set the user from localStorage
    }
    setLoading(false);
  }, []);

  return { currentUser, isLoading};
};




