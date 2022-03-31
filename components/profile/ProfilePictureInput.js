import { InsertPhotoOutlined } from '@mui/icons-material';
import {
  Avatar,
  CircularProgress,
  Divider,
  Input,
  Typography,
} from '@mui/material';
import useIpfs from 'hooks/useIpfs';
import useToasts from 'hooks/useToasts';
import { useState } from 'react';

/**
 * A component for selecting a profile picture.
 */
export default function ProfilePictureInput(props) {
  const propsSize = props.options.size || 128;
  const propsDisabled = props.disabled;
  const propsPicture = props.value;
  const propsOnChange = props.onChange;
  const { showToastSuccessLink, showToastError } = useToasts();
  const { uploadFileToIPFS } = useIpfs();
  const [isLoading, setIsLoading] = useState(false);

  function isFileValid(file) {
    if (!file) {
      return false;
    }
    const isJpgOrPng =
      file.type === 'image/jpeg' ||
      file.type === 'image/png' ||
      file.type === 'image/gif' ||
      file.type === 'image/svg+xml';
    if (!isJpgOrPng) {
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      return false;
    }
    return true;
  }

  async function onChange(event) {
    // Get file
    const file = event.target.files[0];
    // Ignore not existing file
    if (!file) {
      return;
    }
    // Show error if file is not valid
    if (!isFileValid(file)) {
      event.target.value = null;
      showToastError(
        'Sorry, only JPG/PNG/GIF files with size smaller than 2MB are currently supported!',
      );
      return;
    }
    // Upload file to IPFS
    try {
      setIsLoading(true);
      const { url } = await uploadFileToIPFS(file);
      propsOnChange(url);
      showToastSuccessLink('Your picture uploaded to IPFS!', url);
    } catch (error) {
      showToastError(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Typography variant="h5">Profile Picture</Typography>
      <Divider sx={{ mb: 2 }} />
      <label htmlFor="input" style={{ width: propsSize, height: propsSize }}>
        <Avatar
          sx={{
            cursor: !isLoading && !propsDisabled ? 'pointer' : null,
            width: propsSize,
            height: propsSize,
          }}
          src={!isLoading ? propsPicture : null}
        >
          {isLoading ? <CircularProgress /> : <InsertPhotoOutlined />}
        </Avatar>
        <Input
          onChange={onChange}
          sx={{ display: 'none' }}
          accept="image/*"
          id="input"
          type="file"
          disabled={isLoading || propsDisabled}
        />
      </label>
    </>
  );
}
