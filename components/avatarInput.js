import { Add } from '@mui/icons-material';
import { Avatar, CircularProgress, Input } from '@mui/material';
import { useState } from 'react';
import useIpfs from "../hooks/useIpfs";

export default function AvatarInput({ avatarUrl, setAvatarUrl }) {

  const [isAvatarLoading, setIsAvatarLoading] = useState(false);
  const [uploadFileToIPFS] = useIpfs();

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
    try {

      setIsAvatarLoading(true);

      // Get file
      const file = event.target.files[0];

      // Validate file
      if (!isFileValid(file)) {
        throw Error("Sorry, only JPG/PNG/GIF files with size smaller than 2MB are currently supported!");
      }

      // Read file
      const reader = new window.FileReader();
      reader.readAsArrayBuffer(file);
      reader.onloadend = async () => {
        // Upload file to IPFS
        const readerResult = Buffer(reader.result);
        const [cid, url] = await uploadFileToIPFS(file);
        setAvatarUrl(url);
        setIsAvatarLoading(false);
      };
    } catch (error) {
      console.error(error);
      setIsAvatarLoading(false);
    }
  }

  return (
    <label htmlFor="avatarInput" style={{ width: 128, height: 128 }}>
      {isAvatarLoading &&
        <Avatar sx={{ cursor: 'pointer', width: 128, height: 128 }}>
          <CircularProgress />
        </Avatar>
      }
      {!isAvatarLoading &&
        <Avatar sx={{ cursor: 'pointer', width: 128, height: 128 }} src={avatarUrl}>
          <Add />
        </Avatar>
      }
      <Input
        onChange={onChange}
        sx={{ display: 'none' }}
        accept="image/*"
        id="avatarInput"
        type="file"
      />
    </label>
  )

}