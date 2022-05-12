import { Box } from '@mui/material';
import Image from 'next/image';

/**
 * A component with image.
 */
export default function ImageBox({ url, sx }) {
  return (
    <Box sx={{ ...sx }}>
      <Image
        src={url}
        layout="responsive"
        loading="lazy"
        width={1080}
        height={675}
        alt="Image"
      />
    </Box>
  );
}
