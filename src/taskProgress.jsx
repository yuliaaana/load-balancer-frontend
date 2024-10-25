import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const TaskProgress = () => {
  const [progress, setProgress] = useState(null);
  const [result, setResult] = useState(null);
  const userId = '3';

  useEffect(() => {
    const socket = io('http://localhost:3000'); 

    socket.on('taskProgressUpdate', (data) => {
      setProgress(data.progress);
      setResult(data.result);
      console.log(`Task ${data.taskId} progress updated to ${data.progress}%`);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h2>Task Progress</h2>
      {progress !== null ? (
        <div>
          <p>Progress: {progress}%</p>
          {result && <p>Result: {JSON.stringify(result)}</p>}
        </div>
      ) : (
        <p>No progress updates yet.</p>
      )}
    </div>
  );
};

export default TaskProgress;
