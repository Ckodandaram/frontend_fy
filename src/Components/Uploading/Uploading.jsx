import React from 'react'
import './Uploading.css'
import fileType from './fileType.svg'

function Uploading({fileName, formState}) {

  // Function to handle the status of the file
  const status = () => {
    if (formState === 0) {
      return "Upload the File"
    }
    else if (formState === 1) {
      return "Uploading..."
    }
    else if (formState === 2) {
      return "Uploaded"
    }
    else if (formState === 3) {
      return "Processing..."
    }
    else if (formState === 4) {
      return "Download"
    }
    else {
      return "Error occured"
    }
  }

  return (
    <div className="Rectangle-3">
        <img src={fileType} alt="fileType" className="fileType" />
        <span className='fileName'>{fileName}</span>
        <span className="uploading">
            {status()}
        </span>
    </div>
  )
}

export default Uploading