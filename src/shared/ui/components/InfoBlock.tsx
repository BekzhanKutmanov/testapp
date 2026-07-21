import type { ReactNode } from 'react';

import Paper from '@mui/material/Paper'

export default function InfoBlock ({children}: {children: ReactNode}) {
  return <div className={'max-w-5xl m-auto'}>
    <Paper
      elevation={0}
      variant='outlined'
      sx={{
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        borderRadius: 4,
        backgroundColor: 'background.paper',
        borderStyle: 'dashed',
        borderWidth: 2,
        borderColor: 'divider'
      }}
    >
      {children}
    </Paper>
  </div>
};
