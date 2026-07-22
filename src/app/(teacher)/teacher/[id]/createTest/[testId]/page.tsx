import { Box } from '@mui/material';

import CreateTestClient from '@views/createTest/CreateTestClient';

import MainTitle from "@/shared/ui/components/MainTitle";

export const metadata = {
  title: 'Создание нового теста'
}

export default function CreateTestPage() {
  return (
    <Box>
      <div className={'sm:px-[1rem]'}>
        <MainTitle title={'Создание нового теста'} />
      </div>

      <CreateTestClient />
    </Box>
  )
}
