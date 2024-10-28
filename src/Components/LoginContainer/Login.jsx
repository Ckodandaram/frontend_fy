import React, { useState } from "react";
import aeroqubeLogo from "../../assets/images/aeroqube-logo.webp";
import eyeIcon from "../../assets/icons/eye-icon.svg";
import eyeSlashIcon from "../../assets/icons/eye-icon-slash.svg";
import "./Login.css";
import Cookies from 'js-cookie';  // Import js-cookie to handle cookies
import { TailSpin } from "react-loader-spinner";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [invalidErrorVisible, setInvalidErrorVisible] = useState(false);

  async function loginUser(event) {
    event.preventDefault();
    setSigningIn(true);

    const response = await fetch("http://localhost:4000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();
    console.log(data);
    setSigningIn(false);

    if (data.token) {
      Cookies.set('token', data.token, { expires: 1 });
      // alert("Login was successful");
      window.location.reload(); // Reload to trigger authentication check
    } else {
      setInvalidErrorVisible(true);
    }
  }

  const handlePasswordToggle = () => {
    setPasswordVisibility(!passwordVisibility);
  };

  return (
    <div
      className="h-100 w-100 d-flex gap-4 justify-content-center align-items-center"
      id="loginContainer"
    >
      <div className="form-container" id="formContainer">
        <div className="card px-1 py-5" id="innerLoginContainer">
          <img
            src={aeroqubeLogo}
            alt="Login Form Background"
            className="img-fluid w-50 object-fit-contain mx-auto mb-4"
            id="aeroqube-logo"
          />

          <p className="text-center fs-2 fw-bold">Welcome</p>
          <p className="text-center fs-3 mb-4">Login to text extraction</p>

          <form
            onSubmit={loginUser}
            className="w-75 d-flex flex-column gap-3 mx-auto"
          >
            <div className="mb-3">
              <label htmlFor="email" className="form-label fs-4">
                Email address
              </label>
              <input
                type="email"
                className="form-control fs-4"
                id="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (invalidErrorVisible) {
                    setInvalidErrorVisible(false);
                  }
                }}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label fs-4">
                Password
              </label>
              <div className="input-group">
                <input
                  type={passwordVisibility ? "text" : "password"}
                  className="form-control fs-4"
                  id="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (invalidErrorVisible) {
                      setInvalidErrorVisible(false);
                    }
                  }}
                  required
                />
                <div className="input-group-suffix d-flex align-items-center">
                  <img
                    id="passwordToggleIcon"
                    src={passwordVisibility ? eyeSlashIcon : eyeIcon}
                    alt="Password visibility toggle icon"
                    onClick={handlePasswordToggle}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={invalidErrorVisible || signingIn}
              className="btn btn-primary btn-lg fs-4 btn-block py-3 d-flex align-items-center justify-content-center"
            >
              Sign In
              {signingIn && (
                <TailSpin
                  visible={true}
                  height="24"
                  width="24"
                  color="white"
                  ariaLabel="tail-spin-loading"
                  radius="1"
                  wrapperStyle={{ marginLeft: "20px" }}
                  wrapperClass=""
                />
              )}
            </button>
            {invalidErrorVisible && (
              <p className="text-danger text-lg text-bold fs-4">
                Incorrect email or password
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;