import { Button, Stack, Typography } from '@mui/material';
import Layout from 'components/layout/Layout';
import useWeb3Context from 'hooks/useWeb3Context';

/**
 * Page for sandbox.
 */
export default function Sandbox() {
  const { account } = useWeb3Context();

  async function play() {
    console.log('[Dev] Play start');
    console.log('[Dev] Play complete');
  }

  return (
    <Layout title={'Test'} showAccountNavigation={!!account}>
      <Stack spacing={2}>
        <Typography>Welcome to Sandbox!</Typography>
        <Button variant="contained" onClick={play}>
          Play
        </Button>
      </Stack>
    </Layout>
  );
}
