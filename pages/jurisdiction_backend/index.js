import { Box, Divider, Typography } from '@mui/material';
import RoleManager from 'components/jurisdiction_backend/RoleManager';
import Layout from 'components/layout/Layout';
import useWeb3Context from 'hooks/useWeb3Context';

/**
 * Page with a backend of the jurisdiction.
 */
export default function JurisdictionBackend() {

  const { account } = useWeb3Context();

  return (
    <Layout title={"YourJustice / Jurisdiction Backend"} showAccountNavigation={!!account}>
      <Box sx={{ mb: 5 }}>
        <Typography variant='h1' gutterBottom>Jurisdiction Backend</Typography>
        <Divider />
      </Box>
      <Box sx={{ mb: 5 }}>
        <Typography variant='h4' gutterBottom>Roles</Typography>
        <Divider sx={{ mb: 2.5 }} />
        <RoleManager />
      </Box>
      <Box sx={{ mb: 5 }}>
        <Typography variant='h4' gutterBottom>Actions</Typography>
        <Divider sx={{ mb: 2.5 }} />
        <Typography variant='h4'>...</Typography>
      </Box>
      <Box sx={{ mb: 5 }}>
        <Typography variant='h4' gutterBottom>Rules</Typography>
        <Divider sx={{ mb: 2.5 }} />
        <Typography variant='h4'>...</Typography>
      </Box>
    </Layout >
  )

}