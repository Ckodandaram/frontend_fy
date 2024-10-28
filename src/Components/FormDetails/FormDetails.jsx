import React, { useState } from 'react';
import './FormDetails.css';
import UploadBox from '../UploadBox/UploadBox';
import Form from 'react-bootstrap/Form';
import { Spinner } from 'react-bootstrap';

export default function FormDetails() {
  const [selectedOption, setSelectedOption] = useState('');
  const [isSignature, setIsSignature] = useState(false);
  const [formState, setFormState] = useState(0);

  const handleDropdownChange = (event) => {
    console.log('Selected option:', event.target.value);
    setSelectedOption(event.target.value);
  };

  const handleCheckboxChange = (event) => {
    setIsSignature(event.target.checked);
  };

  return (
    <>
    { formState===3 && 
      <div className='loading-div'> 
        Please Wait while we are processing your request...
        <Spinner animation="border" role="status"/> 
      </div>
    }
      <div className='UI-page' disabled={formState===3}>
      <Form>
      <div style={{ display: 'flex', alignItems: 'center', width: '500px' }}>
          <label style={{ marginRight: '10px', width:'200px' }}>Select a Form Type:</label>
          <select value={selectedOption} onChange={handleDropdownChange}>
              <option value=''>--Please select Form Type--</option>
              <option value={1}>ATAC Form</option>
              <option value={2}>OKS Account Form</option>
              <option value={3}>Payroll Account Opening Form</option>
          </select>
      </div>

        <br />
        <Form.Check // prettier-ignore
          type="switch"
          id="custom-switch"
          checked={isSignature}
          onChange={handleCheckboxChange}
          label="scanned signature"
        />
        <br />
        </Form>
        <UploadBox selectedOption={selectedOption} isSignature={isSignature} setFormState={setFormState} formState={formState}/>
        </div>
    </>
  );
}