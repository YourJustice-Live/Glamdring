import { Avatar, CircularProgress, Input } from '@mui/material';
import { Box } from '@mui/system';
import useErrors from 'hooks/useErrors';
import useIpfs from 'hooks/useIpfs';
import useToasts from 'hooks/useToasts';
import { IconPlus } from 'icons/core';
import { useState } from 'react';
import { palette } from 'theme/palette';

/**
 * A widget for input an image, upload it to IPFS, and get URI.
 *
 * TODO: Add button to remove image.
 */
export default function ImageInput(props) {
  const propsDisabled = props.disabled;
  const propsSx = props.options?.sx;
  const propsHeader = props.options?.header;
  const propsImage = props.value;
  const propsOnChange = props.onChange;
  const { handleError } = useErrors();
  const { showToastSuccessLink } = useToasts();
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
      showToastSuccessLink('Your image uploaded to IPFS!', url);
    } catch (error) {
      handleError(error, true);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Box sx={{ ...propsSx }}>
      {propsHeader}
      <label htmlFor="input" style={{ width: size, height: size }}>
        <Avatar
          sx={{
            cursor: !isLoading && !propsDisabled ? 'pointer' : null,
            bgcolor: 'grey.50',
            width: size,
            height: size,
            borderRadius: '24px',
          }}
          src={!isLoading ? propsImage : null}
        >
          {isLoading ? (
            <CircularProgress />
          ) : (
            <IconPlus color={palette.grey[600]} />
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
    </Box>
  );
}
