import { Box } from '@mui/material';

import CreateTestClient from '@views/createTest/CreateTestClient';

import MainTitle from "@/shared/ui/components/MainTitle";

export const metadata = {
  title: 'Создание нового теста'
}

export default function CreateTest() {
  return (
    <Box>
      <CreateTestClient />
    </Box>
  )
}
