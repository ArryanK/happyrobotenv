import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [logs, setLogs] = useState([]);
  const [url, setUrl] = useState('https://xf2vi395e4.execute-api.us-east-2.amazonaws.com/MVP/data');

  const API_KEY = process.env.REACT_APP_AWS_API_KEY;
  console.log(API_KEY);

  const fetchData = async () => {
    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'x-api-key': API_KEY
        }
      });
      const data = await res.json();
      console.log('Fetched data:', data);
      const logsArray = Array.isArray(data) ? data : [data];
      setLogs(logsArray);
    } catch (err) {
      console.error('Failed to fetch logs:', err);
      setLogs([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    fetchData();
  };

  const sentimentData = logs.reduce((acc, cur) => {
    if (cur.sentiment) {
      acc[cur.sentiment] = (acc[cur.sentiment] || 0) + 1;
    }
    return acc;
  }, {});

  const outcomeData = logs.reduce((acc, cur) => {
    if (cur.outcome) {
      acc[cur.outcome] = (acc[cur.outcome] || 0) + 1;
    }
    return acc;
  }, {});

  const sentimentChart = Object.entries(sentimentData).map(([key, value]) => ({ name: key, count: value }));
  const outcomeChart = Object.entries(outcomeData).map(([key, value]) => ({ name: key, count: value }));

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Carrier Sales Dashboard</h1>
      <div className="flex gap-4">
        <input value={url} onChange={(e) => setUrl(e.target.value)} className="border px-2 py-1 w-full" placeholder="API URL" />
        <button onClick={handleRefresh} className="bg-blue-500 text-white px-4 py-2 rounded">Refresh</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">Sentiment Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={sentimentChart}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Call Outcomes</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={outcomeChart}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
