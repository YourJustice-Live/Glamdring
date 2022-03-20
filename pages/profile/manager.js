import { Typography } from '@mui/material';
import Layout from 'components/layout/Layout';

/**
 * Page where account can create (mint) or edit profile (Avatar NFT)
 * 
 * TODO: Show create profile form if account does not have profile
 * 
 * TODO: Show edit profile form if account has profile
 */
export default function ProfileManager() {

  return (
    <Layout title={"YourJustice / Profile Manager"}>
      <Typography gutterBottom>This is page for create or edit profile!</Typography>
    </Layout>
  )
}