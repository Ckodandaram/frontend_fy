import React from 'react'
import './DownloadJson.css'

function DownloadJson({getResultCallback, selectedOption}) {

  const d_JSON = () => {
    getResultCallback("JSON");
  }

  return (
    <div className='download-button' disabled={selectedOption===''}>
        <div className='download-json' onClick={d_JSON}>Download DATA</div>
    </div>
  )
}

export default DownloadJson