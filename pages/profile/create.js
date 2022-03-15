import { Save } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Button, Divider, Stack, TextField, Typography } from '@mui/material';
import Layout from 'components/layout/Layout';
import PictureInput from "components/profile/PictureInput";
import useAccount from "hooks/useAccount";
import useIpfs from 'hooks/useIpfs';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";

export default function ProfileCreate() {

  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { uploadFileToIPFS, uploadJsonToIPFS } = useIpfs();
  const { account } = useAccount();
  const [pictureFile, setPictureFile] = useState(null);
  const [stage, setStage] = useState("NOT_BUSY");

  /**
   * Handle form data for mint Profile NFT for account.
   */
  async function onSubmit(formData) {
    try {

      console.log("[Dev] formData", formData);
      console.log("[Dev] pictureFile", pictureFile);

      // TODO: Validate active blockchain network
      // TODO: Validate form data

      // Upload picture and data to IPFS
      setStage("UPLOADING_TO_IPFS");
      const { cid: pictureIpfsCid, url: pictureIpfsUrl } = await uploadFileToIPFS(pictureFile);
      const { url: metadataIpfsUrl } = await uploadJsonToIPFS({
        firstName: formData.firstName,
        secondName: formData.secondName,
        email: formData.email,
        pictureIpfsCid: pictureIpfsCid,
        pictureIpfsUrl: pictureIpfsUrl,
      });

      console.log("[Dev] pictureIpfsUrl", pictureIpfsUrl);
      console.log("[Dev] metadataIpfsUrl", metadataIpfsUrl);

      enqueueSnackbar("Your matadata uploaded to IPFS!", {
        action: (<Button onClick={() => window.open(metadataIpfsUrl, '_blank').focus()} color="inherit">Open</Button>),
        variant: 'success'
      });

      // TODO: Mint NFT using metadata url

    } catch (error) {
      console.error(error);
      enqueueSnackbar(`Oops, error: ${error}`, { variant: 'error' });
    } finally {
      setStage("NOT_BUSY");
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

      <form onSubmit={handleSubmit(onSubmit)}>

        <Stack spacing={2} sx={{ marginTop: "2rem" }}>

          <Typography variant='h5'>Profile Picture</Typography>
          <PictureInput file={pictureFile} setFile={setPictureFile} disabled={stage !== "NOT_BUSY"} />

          <Typography variant='h5'>Public Profile</Typography>
          <TextField id="outlined-basic" label="First Name" {...register("firstName")} variant="outlined" disabled={stage !== "NOT_BUSY"} />
          <TextField id="outlined-basic" label="Second Name" {...register("secondName")} variant="outlined" disabled={stage !== "NOT_BUSY"} />

          <Typography variant='h5'>Public Contacts</Typography>
          <TextField id="outlined-basic" label="Email " {...register("email")} variant="outlined" disabled={stage !== "NOT_BUSY"} />

          {/* Buttons */}
          {(stage === "NOT_BUSY") && (
            <Button variant="outlined" type="submit">Create Profile</Button>
          )}
          {(stage === "UPLOADING_TO_IPFS") && (
            <LoadingButton loading loadingPosition="start" startIcon={<Save />} variant="outlined">Uploading to IPFS</LoadingButton>
          )}

        </Stack>

      </form>
    </Layout>
  )
}