import { InsertPhotoOutlined } from '@mui/icons-material';
import { Avatar, Input } from '@mui/material';
import { useSnackbar } from 'notistack';

/**
 * Component: PictureInput
 */
export default function PictureInput({ file, setFile, disabled, size = 128 }) {

  const { enqueueSnackbar } = useSnackbar();

  function isFileValid(file) {
    if (!file) {
      return false;
    }
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif' || file.type === 'image/svg+xml';
    if (!isJpgOrPng) {
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      return false;
    }
    return true;
  }

  function onChange(event) {
    // Get file
    const file = event.target.files[0];
    // Ignore not existing file
    if (!file) {
      return;
    }
    // Show error if file is not valid
    if (!isFileValid(file)) {
      event.target.value = null;
      setFile(null);
      enqueueSnackbar("Sorry, only JPG/PNG/GIF files with size smaller than 2MB are currently supported!", { variant: 'error' });
      return;
    }
    setFile(file);
  }

  return (
    <>
      <label htmlFor="input" style={{ width: size, height: size }}>
        <Avatar sx={{ cursor: !disabled ? 'pointer' : null, width: size, height: size }} src={file ? URL.createObjectURL(file) : ""}>
          <InsertPhotoOutlined />
        </Avatar>
        <Input
          onChange={onChange}
          sx={{ display: 'none' }}
          accept="image/*"
          id="input"
          type="file"
          disabled={disabled}
        />
      </label>
    </>
  )

}