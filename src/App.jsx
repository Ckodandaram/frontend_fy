import React, { useRef } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import "./App.css";
import CheckAuth from "./Components/CheckAuth/CheckAuth";
import ErrorPage from "./Components/ErrorPage/ErrorPage";
import Billing from "./Components/Billing/Billing";

// console.log("p")

function App() {
  // console.log("app")
  return (
    <div className="screen-body">
      <Router>
        <Routes>
          <Route path="/" element={<CheckAuth />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/*" element={<ErrorPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;