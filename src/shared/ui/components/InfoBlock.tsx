import type { ReactNode } from 'react';

import Paper from '@mui/material/Paper'

export default function InfoBlock ({border ,children}: {border: boolean , children: ReactNode}) {
  const bg = {
    border: border
  };

  return <div className={'max-w-5xl m-auto'}>
    <Paper
      elevation={0}
      variant='outlined'
      className={border ? 'shadow' : ''}
      sx={{
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        border: border ? '1px solid' : 'none',
        borderRadius: 4,
        backgroundColor: 'background.paper',
      }}
    >
      {children}
    </Paper>
  </div>
};
