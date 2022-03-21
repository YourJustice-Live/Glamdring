import { Save } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Button, Divider, Typography } from '@mui/material';
import LoadingBackdrop from 'components/extra/LoadingBackdrop';
import Layout from 'components/layout/Layout';
import ProfileForm from 'components/profile/ProfileForm';
import useAccount from 'hooks/useAccount';
import useAvatarNftContract from 'hooks/useAvatarNftContract';
import useIpfs from 'hooks/useIpfs';
import useProfile from 'hooks/useProfile';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';

/**
 * Page where account can create (mint) or edit profile (Avatar NFT).
 */
export default function ProfileManager() {

  const statuses = {
    isLoading: "isLoading",
    isAvailable: "isAvailable",
    isUploadingToIpfs: "isUploadingToIpfs",
    isMintingNft: "isMintingNft",
    isUpdatingNft: "isUpdatingNft",
  }

  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { account } = useAccount();
  const { getProfile } = useProfile();
  const { uploadJsonToIPFS } = useIpfs();
  const { mint, update } = useAvatarNftContract();
  const [status, setStatus] = useState(statuses.isLoading);
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState(true);

  async function loadData() {
    try {
      const loadedProfile = await getProfile(account);
      setProfile(loadedProfile);
      setFormData(loadedProfile?.avatarNftMetadata ? loadedProfile.avatarNftMetadata : []);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(`Oops, error: ${error}`, { variant: 'error' });
    } finally {
      setStatus(statuses.isAvailable)
    }
  }

  async function onSubmit(formData) {
    try {
      // Update form data
      setFormData(formData);
      // Upload form data to IPFS
      setStatus(statuses.isUploadingToIpfs);
      const { url } = await uploadJsonToIPFS(formData);
      // Show snackbar
      enqueueSnackbar("Your data uploaded to IPFS!", {
        action: (<Button onClick={() => window.open(url, '_blank').focus()} color="inherit">Open</Button>),
        variant: 'success'
      });
      // Update token if account has profile
      if (profile) {
        // Start update token
        setStatus(statuses.isUpdatingNft);
        const transaction = await update(profile.avatarNftId, url);
        enqueueSnackbar("Transaction is created!", { variant: 'success' });
        // Wait for transaction to complete
        await transaction.wait();
        enqueueSnackbar("Your NFT is updated!", { variant: 'success' });
      }
      // Mint token if account has no profile
      else {
        // Start mint
        setStatus(status.isMintingNft);
        const transaction = await mint(url);
        enqueueSnackbar("Transaction is created!", { variant: 'success' });
        // Wait for transaction to complete
        await transaction.wait();
        enqueueSnackbar("Your NFT is minted!", { variant: 'success' });
      }
      // Redirect to profile page
      router.push('/profile');
    } catch (error) {
      console.error(error);
      enqueueSnackbar(`Oops, error: ${error}`, { variant: 'error' });
      setStatus(statuses.isAvailable);
    }
  }

  useEffect(() => {
    if (account) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account])

  return (
    <Layout title={"YourJustice / Profile Manager"} showAccountNavigation={true}>
      {status === statuses.isLoading ? (<LoadingBackdrop />) : (
        <>
          <Typography variant='h4' gutterBottom>{profile ? "Editing Own Profile" : "Creating Own Profile"}</Typography>
          <Divider sx={{ marginBottom: '0.5rem' }} />
          <ProfileForm
            initData={formData}
            onSubmit={onSubmit}
            disabled={status !== statuses.isAvailable ? true : false}
          >
            {status === statuses.isAvailable && (
              <Button variant="outlined" type="submit">{profile ? "Save" : "Create Profile"}</Button>
            )}
            {status === statuses.isUploadingToIpfs && (
              <LoadingButton loading loadingPosition="start" startIcon={<Save />} variant="outlined">Uploading to IPFS</LoadingButton>
            )}
            {status === statuses.isMintingNft && (
              <LoadingButton loading loadingPosition="start" startIcon={<Save />} variant="outlined">Minting NFT</LoadingButton>
            )}
            {status === statuses.isUpdatingNft && (
              <LoadingButton loading loadingPosition="start" startIcon={<Save />} variant="outlined">Updating NFT</LoadingButton>
            )}
          </ProfileForm>
        </>
      )}
    </Layout >
  )
}
