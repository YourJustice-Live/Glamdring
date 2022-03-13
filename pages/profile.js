import { Typography } from '@mui/material';
import Layout from '../components/layout';
import { Web3Provider } from "../contexts/web3";

export default function Profile() {
  return (
    <Web3Provider>
      <Layout title={"YourJustice / Profile"}>
        <Typography variant='h3'>Welcome to Profile Page!</Typography>
      </Layout>
    </Web3Provider>
  )
}