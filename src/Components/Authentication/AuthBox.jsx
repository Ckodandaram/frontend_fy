import React from 'react'
import './AuthBox.css'
import InputBox from '../InputBox/InputBox.jsx'
import SignInButton from '../SignIn/SignInButton'
// import SignUpButton from '../SignUpButton/SignUpButton.jsx'
import mailLogo from './mailLogo.svg'
import passwordLogo from './passwordLogo.svg'

function AuthBox() {

  return (
    <center className="Rectangle-3">
        <div className="fieldheading">
            <img src={mailLogo} className="mailLogo" alt="mailLogo" />
            <p className="Email-address">
                Email address
            </p>
        </div>
        <InputBox text={"Enter Email Address"}/>
        <div className="fieldheading">
            <img src={passwordLogo} className="passwordLogo" alt="passwordLogo" />
            <p className="Password">
                Password
            </p>
        </div>
        <InputBox text={"Enter Password"}/>
        <SignInButton />
        
         {/* <SignUpButton/> */}
    </center>
  )
}

export default AuthBox