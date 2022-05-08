import {
  Avatar,
  CircularProgress,
  Divider,
  Input,
  Typography,
} from '@mui/material';
import useIpfs from 'hooks/useIpfs';
import useToasts from 'hooks/useToasts';
import { IconProfile } from 'icons';
import { useState } from 'react';
import { palette } from 'theme/palette';

/**
 * A widget for input a profile picture, upload it to IPFS, and get URI.
 *
 * TODO: Add button to remove picture.
 */
export default function ProfilePictureInput(props) {
  const propsDisabled = props.disabled;
  const propsPicture = props.value;
  const propsOnChange = props.onChange;
  const { showToastSuccessLink, showToastError } = useToasts();
  const { uploadFileToIPFS } = useIpfs();
  const [isLoading, setIsLoading] = useState(false);
  const size = 164;

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
    // Upload file to IPFS
    try {
      // Check file
      if (!isFileValid(file)) {
        throw new Error(
          'Only JPG/PNG/GIF files with size smaller than 2MB are currently supported!',
        );
      }
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
      <Typography variant="h4" sx={{ mb: 2 }}>
        Profile Picture
      </Typography>
      <label htmlFor="input" style={{ width: size, height: size }}>
        <Avatar
          sx={{
            cursor: !isLoading && !propsDisabled ? 'pointer' : null,
            bgcolor: 'grey.50',
            width: size,
            height: size,
            borderRadius: '24px',
          }}
          src={!isLoading ? propsPicture : null}
        >
          {isLoading ? (
            <CircularProgress />
          ) : (
            <IconProfile hexColor={palette.grey[600]} />
          )}
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
      <Divider sx={{ mt: 4 }} />
    </>
  );
}
