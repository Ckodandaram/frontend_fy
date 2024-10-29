import React from 'react'
import { useState, useRef } from 'react'
import './UploadBox.css'
import uploadLogo from './uploadLogo.svg'
import Uploading from '../Uploading/Uploading'
import DownloadJson from '../DownloadJson/DownloadJson'
import download from 'downloadjs';

// Access environment variables
const BACKEND_URL = process.env.REACT_APP_PYTHON_URL;

function UploadBox({ selectedOption, isSignature, setFormState, formState }) {

  const [file, setFile] = useState(null)


  const fileInput = useRef(null);

  const handleClick = () => {
    if (formState >= 4) setFormState(2);
    fileInput.current.click();
  };

  const handleSpinner = () => {
    setFormState(1);
    setTimeout(() => setFormState(2), 2000);
  }

  const handleDrop = (event) => {
    event.preventDefault();
    const { files } = event.dataTransfer;
    if (files.length > 0) {
      handleSpinner();
      setFile(...files);
      console.log("if file length > 0");
      console.log(files);
    }
  }

  const handleDragOver = (event) => {
    event.preventDefault()
  }

  const getResultCallback = async (d_fomat) => {
    handleFileUpload(d_fomat);
  }

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  }

  const token = getCookie("token");

  const handleFileUpload = async (fileType) => {
    try {
      setFormState(3);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("form_number", selectedOption);
      const response = await fetch(`${BACKEND_URL}/upload/`, {
        method: "POST",
        body: formData,
        headers: {
          "Authorization": `Bearer ${token}`, // Include token in Authorization header
        }, 
      });

      if (response.ok) {
        const js_data = await response.text();
        const data = JSON.parse(js_data);
        let type = 'application/json';
        const url = window.URL.createObjectURL(new Blob([data], { type: type }));
        const link = document.createElement('a');
        link.href = url;
        const now = new Date();
        const file_name = file.name.slice(0, -4) + now.toISOString();
        link.setAttribute('download', `${file_name}.json`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      }
      else {
        setFormState(5);
        throw new Error(`Upload request failed: ${response.status}`);
      }
      if (isSignature) {
        try {
          const signature = await fetch(`${BACKEND_URL}/get_signature/`, {
            method: "POST",
            body: formData,
            headers: {
              "Authorization": `Bearer ${token}`, // Include token in Authorization header
            }, 
          });
          if (signature.ok) {
            const data = await signature.blob();
            //console.log(data);
            setFormState(4);
            const content = signature.headers.get('content-type');
            const now = new Date();
            const file_name = file.name.slice(0, -4) + now.toISOString();
            download(data, `${file_name}.pdf`, content);
          } else {
            setFormState(5);
            throw new Error(`Signature request failed: ${signature.status}`);
          }
        } catch (error) {
          setFormState(5);
          //console.log(error);
          alert("Error while downloading Signature", error.message);
        }
      }
      else {
        setFormState(4)
      }
    } catch (error) {
      setFormState(5);
      alert("Error whlie fetching Data", error.message);
    }
  }

  const handleFileChange = (event) => {
    console.log(event.target.files[0]);
    setFile(() => event.target.files[0]);
    handleSpinner();
  };

  const handleDragStart = (event) => {
    event.dataTransfer.setData("text/plain", event.target.id)
  }
  return (
    <>
      <div className="Rectangle-1" onClick={handleClick} onDrop={handleDrop} onDragOver={handleDragOver} onDragStart={handleDragStart} disabled={selectedOption === ''}>
        <input type="file" ref={fileInput} hidden onChange={handleFileChange} />
        <img src={uploadLogo} alt="uploadLogo" className="uploadLogo" />
        <span className="Upload-File">
          Upload File
        </span>
        <span className="Drop-or-select-files-from-device">
          Drop or select files from device
        </span>
        <span className="max-50MB-pdf-file-only">
          max. 50MB, .pdf file only
        </span>
      </div>
      {formState > 0 && <Uploading fileName={file?.name} formState={formState} />}
      <DownloadJson getResultCallback={getResultCallback} selectedOption={selectedOption} />
    </>
  )
}

export default UploadBox
