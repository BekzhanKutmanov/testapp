import { Box, Typography, Paper } from '@mui/material';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import Image from 'next/image'
import InfoBlock from '@/shared/ui/components/InfoBlock'

export default function DefaultSubject() {
  return (
    <Box
      className='flex items-center justify-center'
      sx={{
        minHeight: '60vh',
        width: '100%',
        p: 3
      }}
    >
      <InfoBlock>
        <>
          <Box
            sx={{
              backgroundColor: 'primary.lighter',
              color: 'primary.main',
              borderRadius: '50%',
              p: 2,
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <LibraryBooksIcon sx={{ fontSize: 48 }} />
          </Box>
          <Typography variant="h4" gutterBottom className="font-bold text-textPrimary">
            Предметы
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mb: 4, maxWidth: 300 }}>
            Пожалуйста, выберите предмет из списка слева, чтобы увидеть доступные тесты или создать новые.
          </Typography>
        </>
      </InfoBlock>
      {/*<Paper*/}
      {/*  elevation={0}*/}
      {/*  variant="outlined"*/}
      {/*  sx={{*/}
      {/*    p: 6,*/}
      {/*    display: 'flex',*/}
      {/*    flexDirection: 'column',*/}
      {/*    alignItems: 'center',*/}
      {/*    textAlign: 'center',*/}
      {/*    maxWidth: 500,*/}
      {/*    borderRadius: 4,*/}
      {/*    backgroundColor: 'background.paper',*/}
      {/*    borderStyle: 'dashed',*/}
      {/*    borderWidth: 2,*/}
      {/*    borderColor: 'divider'*/}
      {/*  }}*/}
      {/*>*/}
      {/*  <Box*/}
      {/*    sx={{*/}
      {/*      backgroundColor: 'primary.lighter',*/}
      {/*      color: 'primary.main',*/}
      {/*      borderRadius: '50%',*/}
      {/*      p: 2,*/}
      {/*      mb: 3,*/}
      {/*      display: 'flex',*/}
      {/*      alignItems: 'center',*/}
      {/*      justifyContent: 'center'*/}
      {/*    }}*/}
      {/*  >*/}
      {/*    <LibraryBooksIcon sx={{ fontSize: 48 }} />*/}
      {/*  </Box>*/}
      {/*  <Typography variant="h4" gutterBottom className="font-bold text-textPrimary">*/}
      {/*    Предметы*/}
      {/*  </Typography>*/}
      {/*  <Typography variant="body1" color="textSecondary" sx={{ mb: 4, maxWidth: 300 }}>*/}
      {/*    Пожалуйста, выберите предмет из списка слева, чтобы увидеть доступные тесты или создать новые.*/}
      {/*  </Typography>*/}
      {/*</Paper>*/}
    </Box>
  );
}
