import React from "react";
import NavBar from "../NavBar/NavBar";
import FormDetails from "../FormDetails/FormDetails";
import Login from "../LoginContainer/Login";
import { useAuth } from "../../auth/AuthProvider";
import { RotatingLines } from "react-loader-spinner";

//console.log("outside checkAuth in CheckAuth");
function CheckAuth() {
  //console.log("inside checkAuth in CheckAuth");
  const { currentUser, isLoading } = useAuth();

  return (
    <>
      {isLoading ? (
        <div className="h-100 w-100 d-flex justify-content-center align-items-center">
          <RotatingLines
            height="50"
            width="50"
            color="blue"
            strokeWidth="5"
            strokeColor="rgba(0, 0, 0, 0.5)"
            animationDuration="0.75"
            ariaLabel="rotating-lines-loading"
            wrapperStyle={{}}
          />
        </div>
      ) : currentUser ? (
        <>
          <NavBar />
          <FormDetails />
        </>
      ) : (
        <Login />
      )}
    </>
  );
}

export default CheckAuth;
