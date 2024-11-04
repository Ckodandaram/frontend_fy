import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import axios from 'axios'
import 'jspdf-autotable'
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import BillingNavbar from './BillingNavbar';
import './BillingPage.css';

// Register the necessary chart components
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);


// Access environment variables
const BACKEND_URL = process.env.REACT_APP_PYTHON_URL;

const BillingPage = () => {
  const [billingData, setBillingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [documentPage, setDocumentPage] = useState(0); // Track current page for documents
  const [apiCallPage, setApiCallPage] = useState(0); // Track current page for API calls
  const pageSize = 10;
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);


  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  }
  
  useEffect(() => {
    const fetchBillingData = async () => {
      try {
        const token = getCookie("token");
        const response = await fetch(`${BACKEND_URL}/billing/`, {
          method: 'GET',
          headers: {
            "Authorization": `Bearer ${token}`, // Include token in Authorization header
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setBillingData(data);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching billing data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBillingData();
  }, []);

  const downloadFile = (type) => {
    const token = getCookie("token");
    const url = `${BACKEND_URL}/billing/${type}/?token=${token}`;
    window.open(url, '_blank');
  };

  const handleNextPage = (type) => {
    if (type === 'documents') {
      if ((documentPage + 1) * pageSize < billingData.documents.length) setDocumentPage(documentPage + 1);
    } else {
      if ((apiCallPage + 1) * pageSize < billingData.api_calls.length) setApiCallPage(apiCallPage + 1);
    }
  };

  const handlePreviousPage = (type) => {
    if (type === 'documents') {
      if (documentPage > 0) setDocumentPage(documentPage - 1);
    } else {
      if (apiCallPage > 0) setApiCallPage(apiCallPage - 1);
    }
  };

  const handleViewClick = (doc) => {
    setSelectedDocument(doc);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedDocument(null);
  };
  const handlePrintDownload = () => {
    const doc = new jsPDF();
    doc.text('Document Details', 20, 10);
    doc.autoTable({
      startY: 20,
      head: [['Field', 'Value']],
      body: [
        ['Document ID', selectedDocument.document_id],
        ['Document Name', selectedDocument.document_name],
        ['Type', selectedDocument.type],
        ['Size', `${(selectedDocument.size / 1024).toFixed(2)} KB`],
        ['Status', selectedDocument.status],
        ['Processing Timestamp', new Date(selectedDocument.processing_timestamp).toLocaleString()],
        ['Processing Duration', `${selectedDocument.processing_duration.toFixed(1)} seconds`],
        ['Number of Pages', selectedDocument.number_of_pages],
      ],
    });

    doc.text('API Calls', 20, doc.autoTable.previous.finalY + 10);
    doc.autoTable({
      startY: doc.autoTable.previous.finalY + 20,
      head: [['API ID', 'API Endpoint', 'Timestamp', 'Status']],
      body: selectedDocument.api_calls.map((apiCall) => [
        apiCall.api_request_id,
        apiCall.api_endpoint,
        new Date(apiCall.timestamp).toLocaleString(),
        apiCall.status,
      ]),
    });

    doc.save(`doc_${selectedDocument.document_id}.pdf`);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="billing-page">
        <BillingNavbar />
        <h1 className="billing-header">Billing Dashboard</h1>
        <p className="error-message">Error: {error}</p>
      </div>
    );
  }

  if (!billingData || !billingData.documents || !billingData.api_calls || 
      (billingData.total_documents_processed === 0 && billingData.total_api_calls === 0)) {
    return (
      <div className="billing-page">
        <BillingNavbar />
        <h1 className="billing-header">Billing Dashboard</h1>
        <p className="no-data">No Data Found</p>
      </div>
    );
  }


  // // chart data that shows all the data at a time
  // const chartData = {
  //   labels: billingData.documents.map(doc => new Date(doc.processing_timestamp).toLocaleDateString()),
  //   datasets: [
  //     {
  //       label: 'Documents Processed',
  //       data: billingData.documents.map(doc => doc.charges || 0),
  //       borderColor: 'rgba(75,192,192,1)',
  //       fill: false,
  //     },
  //     {
  //       label: 'API Calls',
  //       data: billingData.api_calls.map(api => api.charges || 0),
  //       borderColor: 'rgba(153,102,255,1)',
  //       fill: false,
  //     }
  //   ],
  // };

  const chartData = {
    labels: billingData.documents.slice(documentPage * pageSize, (documentPage + 1) * pageSize).map(doc => new Date(doc.processing_timestamp).toLocaleDateString()),
    datasets: [
      {
        label: 'Documents Processed',
        data: billingData.documents.slice(documentPage * pageSize, (documentPage + 1) * pageSize).map(doc => doc.charges || 0),
        borderColor: 'rgba(75,192,192,1)',
        fill: false,
      },
      {
        label: 'API Calls',
        data: billingData.api_calls.slice(apiCallPage * pageSize, (apiCallPage + 1) * pageSize).map(api => api.charges || 0),
        borderColor: 'rgba(153,102,255,1)',
        fill: false,
      }
    ],
  };

  // Helper function to display pagination range
  const getPaginationInfo = (page, data) => {
    const start = page * pageSize + 1;
    const end = Math.min((page + 1) * pageSize, data.length);
    return `${start}-${end} of ${data.length}`;
  };

  return (
    <div className="billing-page">
      <BillingNavbar />
      <h1 className="billing-header">Billing Dashboard</h1>

      {/* Summary View */}
      <div className="billing-summary">
        <h2>Summary</h2>
        <p>Total Documents Processed: {billingData.total_documents_processed}</p>
        <p>Total API Calls: {billingData.total_api_calls}</p>
        <p>Total Charges: ₹{billingData.total_charges.toFixed(2)}</p>
        <p className="billing-period">
          Billing Period: {new Date(billingData.billing_period_start).toLocaleDateString()} to {new Date(billingData.billing_period_end).toLocaleDateString()}
        </p>
        <button onClick={() => downloadFile('pdf')}>Download PDF</button>
        <button onClick={() => downloadFile('csv')}>Download CSV</button>
      </div>

      {/* Detailed View */}
      <div className="billing-detailed">
        <h2>Detailed View</h2>

        <div className="document-summary">
          <h3>Per-Document Summary</h3>
          <table className="billing-table">
            <thead>
              <tr>
                <th>Document Name</th>
                <th>Type</th>
                <th>Size (KB)</th>
                <th>Number of Pages</th>
                <th>Date Processed</th>
                <th>Charges (₹)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {billingData.documents.slice(documentPage * pageSize, (documentPage + 1) * pageSize).map((doc) => (
                <tr key={doc.document_id}>
                  <td>{doc.document_name}</td>
                  <td>{doc.type}</td>
                  <td>{(doc.size / 1024).toFixed(2)}</td>
                  <td>{doc.number_of_pages}</td>
                  <td>{new Date(doc.processing_timestamp).toLocaleDateString()}</td>
                  <td>{doc.charges.toFixed(2)}</td>
                  <td>
                    <button className="view-button" onClick={() => handleViewClick(doc)}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            <span>{getPaginationInfo(documentPage, billingData.documents)}</span>
            <div className="pagination-buttons">
              <button onClick={() => handlePreviousPage('documents')} disabled={documentPage === 0}>Previous</button>
              <button onClick={() => handleNextPage('documents')} disabled={(documentPage + 1) * pageSize >= billingData.documents.length}>Next</button>
            </div>
          </div>
          {dialogOpen && selectedDocument && (
            <DocumentDetailsDialog
              document={selectedDocument}
              onClose={handleCloseDialog}
              onPrintDownload={handlePrintDownload}
            />
          )}
        </div>

        <div className="api-call-summary">
          <h3>Per-API Call Summary</h3>
          <table className="billing-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>API Endpoint</th>
                <th>Status</th>
                <th>Charges (₹)</th>
              </tr>
            </thead>
            <tbody>
              {billingData.api_calls.slice(apiCallPage * pageSize, (apiCallPage + 1) * pageSize).map((apiCall) => (
                <tr key={apiCall.api_request_id}>
                  <td>{new Date(apiCall.timestamp).toLocaleDateString()}</td>
                  <td>{apiCall.api_endpoint}</td>
                  <td>{apiCall.status}</td>
                  <td>{apiCall.charges.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            <span>{getPaginationInfo(apiCallPage, billingData.api_calls)}</span>
            <div className="pagination-buttons">
              <button onClick={() => handlePreviousPage('api_calls')} disabled={apiCallPage === 0}>Previous</button>
              <button onClick={() => handleNextPage('api_calls')} disabled={(apiCallPage + 1) * pageSize >= billingData.api_calls.length}>Next</button>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Graph */}
      <div className="billing-graph">
        <h3>Usage Over Time</h3>
        <Line data={chartData} />
      </div>
    </div>
  );
};

const DocumentDetailsDialog = ({ document, onClose, onPrintDownload }) => {
  return (
    <div className="dialog-overlay">
      <div className="dialog">
        <h3>Document Details</h3>
        <p><strong>Document ID:</strong> {document.document_id}</p>
        <p><strong>Document Name:</strong> {document.document_name}</p>
        <p><strong>Type:</strong> {document.type}</p>
        <p><strong>Size:</strong> {(document.size / 1024).toFixed(2)} KB</p>
        <p><strong>Status:</strong> {document.status}</p>
        <p><strong>Processing Timestamp:</strong> {new Date(document.processing_timestamp).toLocaleString()}</p>
        <p><strong>Processing Duration:</strong> {document.processing_duration.toFixed(1)} seconds</p>
        <p><strong>Number of Pages:</strong> {document.number_of_pages}</p>
        <h4>API Calls</h4>
        <table className="api-calls-table">
          <thead>
            <tr>
              <th>API ID</th>
              <th>API Endpoint</th>
              <th>Timestamp</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {document.api_calls.map((apiCall) => (
              <tr key={apiCall.api_request_id}>
                <td>{apiCall.api_request_id}</td>
                <td>{apiCall.api_endpoint}</td>
                <td>{new Date(apiCall.timestamp).toLocaleString()}</td>
                <td>{apiCall.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className='dialog-buttons'>
          <button className='downld-button' onClick={onPrintDownload}>Download</button>
          <button className='close-button' onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;
