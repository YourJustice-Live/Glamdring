import { Save } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Button, Divider, Typography } from '@mui/material';
import Layout from 'components/layout/Layout';
import ProfileForm from "components/profile/ProfileForm";
import useAccount from "hooks/useAccount";
import useAvatarNftContract from 'hooks/useAvatarNftContract';
import useIpfs from 'hooks/useIpfs';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';

/**
 * Page where account inputs personal data and mints Avatar NFT
 * 
 * TODO: Move to manager.js
 */
export default function ProfileCreate() {

  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { uploadJsonToIPFS } = useIpfs();
  const { mint } = useAvatarNftContract();
  const { account } = useAccount();
  const [status, setStatus] = useState("IS_AVAILABLE");
  const [formData, setFormData] = useState({});

  /**
   * Handle form data for mint Avatar NFT for account
   * 
   * TODO: Validate active blockchain network
   */
  async function onSubmit(formData) {
    try {

      console.log("[Dev] formData", formData);

      // Update form data
      setFormData(formData);

      // Upload form data to IPFS
      setStatus("IS_UPLOADING_TO_IPFS");
      const { url } = await uploadJsonToIPFS(formData);

      enqueueSnackbar("Your data uploaded to IPFS!", {
        action: (<Button onClick={() => window.open(url, '_blank').focus()} color="inherit">Open</Button>),
        variant: 'success'
      });

      // Start mint
      setStatus("IS_MINTING_NFT");
      const mintTransaction = await mint(url);
      enqueueSnackbar("Transaction is created!", { variant: 'success' });

      // Wait for transaction to complete
      await mintTransaction.wait();
      enqueueSnackbar("Your NFT is minted!", { variant: 'success' });
      router.push('/home');

    } catch (error) {
      console.error(error);
      enqueueSnackbar(`Oops, error: ${error}`, { variant: 'error' });
      setStatus("IS_AVAILABLE");
    }
  }

  useEffect(() => {
    // Redirect to index page if account not connected
    if (!account) {
      router.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account])

  return (
    <Layout title={"YourJustice / Profile Create"}>

      <Typography variant='h4' gutterBottom>Creating Own Profile</Typography>
      <Divider />

      <ProfileForm
        initData={formData}
        onSubmit={onSubmit}
        disabled={status !== "IS_AVAILABLE" ? true : false}
      >
        {(status === "IS_AVAILABLE") && (
          <Button variant="outlined" type="submit">Create Profile</Button>
        )}
        {(status === "IS_UPLOADING_TO_IPFS") && (
          <LoadingButton loading loadingPosition="start" startIcon={<Save />} variant="outlined">Uploading to IPFS</LoadingButton>
        )}
        {(status === "IS_MINTING_NFT") && (
          <LoadingButton loading loadingPosition="start" startIcon={<Save />} variant="outlined">Minting NFT</LoadingButton>
        )}
      </ProfileForm>

    </Layout>
  )
}