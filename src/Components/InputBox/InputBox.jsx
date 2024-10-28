import React from 'react'
import './InputBox.css'

function InputBox({text}) {
  return (
    <div className="Rectangle-4">
        <p className="Enter-Email-address">
            {text}
        </p>
    </div>
  )
}

export default InputBox