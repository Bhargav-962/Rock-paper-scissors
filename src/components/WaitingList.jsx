import React, { useEffect, useState } from 'react';
import { Paper, Stack, Typography } from '@mui/material';
import { WAIT_QUEUE_KEY } from '../constants';

export default function WaitingList() {
  const [queue, setQueue] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(WAIT_QUEUE_KEY) || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const onStorage = () => {
      try {
        setQueue(JSON.parse(localStorage.getItem(WAIT_QUEUE_KEY) || '[]'));
      } catch {
        setQueue([]);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  if (queue.length === 0) return null;
  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      <Stack spacing={1}>
        <Typography variant="subtitle1">Waiting Queue</Typography>
        {queue.map((q, i) => (
          <Typography key={i}>{q.requester.username} waiting for player ID {q.targetId}</Typography>
        ))}
      </Stack>
    </Paper>
  );
}
