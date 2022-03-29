import { Save } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Button, Divider, Typography } from '@mui/material';
import LoadingBackdrop from 'components/extra/LoadingBackdrop';
import Layout from 'components/layout/Layout';
import ProfileForm from 'components/profile/ProfileForm';
import useAvatarNftContract from 'hooks/useAvatarNftContract';
import useIpfs from 'hooks/useIpfs';
import useToasts from 'hooks/useToasts';
import useWeb3Context from 'hooks/useWeb3Context';
import Link from 'next/link';
import { useEffect, useState } from 'react';

/**
 * Page where account can create (mint) or edit profile (Avatar NFT).
 */
export default function ProfileManager() {

  const statuses = {
    isAvailable: "isAvailable",
    isUploadingToIpfs: "isUploadingToIpfs",
    isMintingOrUpdating: "isMintingOrUpdating",
    isMintingOrUpdatingSuccessed: "isMintingOrUpdatingSuccessed"
  }

  const { showToastSuccessLink, showToastError } = useToasts();
  const { accountProfile, runProfileUpdater } = useWeb3Context();
  const { uploadJsonToIPFS } = useIpfs();
  const { mint, update } = useAvatarNftContract();
  const [status, setStatus] = useState(statuses.isAvailable);
  const [formData, setFormData] = useState(null);

  async function submit(formData) {
    try {
      // Update form data
      setFormData(formData);
      // Upload json with form data to IPFS
      setStatus(statuses.isUploadingToIpfs);
      const { url } = await uploadJsonToIPFS({
        image: formData.image,
        attributes: formData.attributes,
        lastUpdatedTime: new Date().getTime()
      });
      showToastSuccessLink("Your data uploaded to IPFS!", url);
      setStatus(statuses.isMintingOrUpdating);
      // Update token if account has profile otherwise mint token
      if (accountProfile) {
        await update(accountProfile.avatarNftId, url);
      }
      else {
        await mint(url);
      }
      // Show sucess message and run worker for update profile
      setStatus(statuses.isMintingOrUpdatingSuccessed);
      runProfileUpdater();
    } catch (error) {
      showToastError(error);
    }
  }

  useEffect(() => {
    setFormData(accountProfile?.avatarNftMetadata ? accountProfile.avatarNftMetadata : []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Layout title={"YourJustice / Profile Manager"} showAccountNavigation={true}>

      {/* Form for mint or update profile */}
      {formData && status !== statuses.isMintingOrUpdatingSuccessed && (
        <>
          <Typography variant='h4' gutterBottom>{accountProfile ? "Editing Own Profile" : "Creating Own Profile"}</Typography>
          <Divider sx={{ mb: 1 }} />
          <ProfileForm
            initData={formData}
            onSubmit={submit}
            disabled={status !== statuses.isAvailable ? true : false}
          >
            {status === statuses.isAvailable && (
              <Button variant="outlined" type="submit">{accountProfile ? "Save" : "Create Profile"}</Button>
            )}
            {status === statuses.isUploadingToIpfs && (
              <LoadingButton loading loadingPosition="start" startIcon={<Save />} variant="outlined">Uploading to IPFS</LoadingButton>
            )}
            {status === statuses.isMintingOrUpdating && (
              <LoadingButton loading loadingPosition="start" startIcon={<Save />} variant="outlined">
                {accountProfile ? "Updating NFT" : "Minting NFT"}
              </LoadingButton>
            )}
          </ProfileForm>
        </>
      )}

      {/* Message that the minting or updating was successful */}
      {formData && status === statuses.isMintingOrUpdatingSuccessed && (
        <>
          <Typography variant='h4' gutterBottom>Transaction is created!</Typography>
          <Typography gutterBottom>
            {accountProfile ? "Your profile will be updated soon." : "Your profile will be minted soon."}
          </Typography>
          <Link href='/' passHref>
            <Button variant="contained" type="submit" sx={{ mt: 2 }}>Go to Home</Button>
          </Link>
        </>
      )}

      {/* Loading if form data is not already defined */}
      {!formData && (<LoadingBackdrop />)}

    </Layout >
  )
}
