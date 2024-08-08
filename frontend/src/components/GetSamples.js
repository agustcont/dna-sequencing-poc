// src/components/GetSamples.js
import React, { useState, useEffect } from 'react';

function GetSamples() {
  const [samples, setSamples] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSamples = async () => {
      const response = await fetch('http://172.18.15.155:5000/get_samples', { credentials: 'include' });
      const data = await response.json();
      if (response.ok) {
        setSamples(data);
      } else {
        setError('Error fetching samples');
      }
    };
    fetchSamples();
  }, []);

  return (
    <div className="container">
      <h2>Submitted Samples</h2>
      {error && <p className="error">{error}</p>}
      <table className="samples-table">
        <thead>
          <tr>
            <th>Sample</th>
            <th>Analysis Type</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>
          {samples.map((sample) => (
            <tr key={sample.id}>
              <td>{sample.sample}</td>
              <td>{sample.analysisType}</td>
              <td>{sample.result}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default GetSamples;
