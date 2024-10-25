// jacobi.jsx

import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import {jwtDecode} from 'jwt-decode'; 

const Jacobi = () => {
  const [size, setSize] = useState(2000); 
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [userId, setUserId] = useState(null); 

  useEffect(() => {
    const token = localStorage.getItem('token'); 
    const decodedToken = jwtDecode(token); 
    setUserId(decodedToken.userId); 

    const socket = io('http://localhost:4000', {
      query: { 
        token, 
        userId: decodedToken.userId 
      }
    }); 

    socket.on('taskProgressUpdate', (data) => {
      setProgress(data.progress);
      if (data.result) {
        setResult(data.result); 
      }
    });

    return () => {
      socket.disconnect(); 
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token'); 
    const data = {
      size: size,
      tolerance: 1e-10,
      maxIterations: 10000,
      userId: userId 
    };

    try {
      const response = await fetch('https://localhost/api/jacobi', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      setResult(result);
      setError(null); 
      setProgress(0);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h2>Jacobi Method</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Matrix Size: </label>
          <input
            type="number"
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            min="1"
          />
        </div>
        <button type="submit">Calculate</button>
      </form>

      {error ? (
        <p style={{ color: 'red' }}>Error: {error}</p>
      ) : result ? (
        <div>
          <h3>Result:</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      ) : (
        <p>Enter matrix size and submit to calculate.</p>
      )}

      <div>
        <h3>Progress:</h3>
        <progress value={progress} max="100" />
        <p>{progress}%</p>
      </div>
    </div>
  );
};

export default Jacobi;
