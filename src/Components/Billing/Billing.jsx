import React from "react";
import Login from "../LoginContainer/Login";
import { useAuth } from "../../auth/AuthProvider";
import { RotatingLines } from "react-loader-spinner";
import BillingPage from "../BillingPage/BillingPage";

function Billing() {
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
          <BillingPage />
        </>
      ) : (
        <Login />
      )}
    </>
  );
}

export default Billing;