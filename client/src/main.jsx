import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import reportWebVitals from './reportWebVitals.js';
// import './index.css'

const logWebVitals = (metric) => {
  console.log(metric);
  // You can also send these metrics to an analytics service, for example:
  // sendToAnalytics(metric);
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <App />
  </React.StrictMode>,
)
reportWebVitals();