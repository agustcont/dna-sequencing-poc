// src/components/SubmitSample.js
import React, { useState, useEffect } from 'react';

function SubmitSample() {
  const [sample, setSample] = useState('');
  const [analysisType, setAnalysisType] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
      const response = await fetch('http://172.18.15.155:5000/customers', { credentials: 'include' });
      const data = await response.json();
      if (response.ok) {
        setCustomers(data);
      } else {
        setError('Failed to fetch customers');
      }
    };
    fetchCustomers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://172.18.15.155:5000/submit_sample', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sample, analysisType, customerId }),
      credentials: 'include'
    });

    const data = await response.json();

    if (response.ok) {
      alert('Sample submitted successfully!');
      setSample('');
      setAnalysisType('');
      setCustomerId('');
    } else {
      setError(data.message);
    }
  };

  return (
    <div className="container">
      <h2>Submit Sample</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={sample}
          onChange={(e) => setSample(e.target.value)}
          placeholder="Enter sample data"
        />
        <input
          type="text"
          value={analysisType}
          onChange={(e) => setAnalysisType(e.target.value)}
          placeholder="Enter analysis type"
        />
        <select value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
          <option value="">Select Customer</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.username}
            </option>
          ))}
        </select>
        <button type="submit">Submit</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default SubmitSample;
