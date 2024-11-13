import React, { useState } from 'react';

function App() {
  const [data, setData] = useState('');

  const fetchData = async (url) => {
    const response = await fetch(url);
    const result = await response.json();
    setData(result);
  };

  return (
    <div>
      <button onClick={() => fetchData('http://localhost:3000/endpoint1')}>
        Fetch Data from Endpoint 1
      </button>
      <button onClick={() => fetchData('http://localhost:3000/endpoint2')}>
        Fetch Data from Endpoint 2
      </button>
      <div>{data}</div>
    </div>
  );
}

export default App;
