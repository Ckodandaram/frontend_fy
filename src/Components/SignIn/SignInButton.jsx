import React from 'react'
import { Button } from 'react-bootstrap'
import './SignInButton.css'

function SignInButton() {

    const handleSignIn = () => {
        console.log("Sign in button clicked")
    }
  return (
    <Button className="Rectangle-42" onClick={handleSignIn}>
        <span className="Sign-in">
            Sign in
        </span>
    </Button>
  )
}

export default SignInButton