import { Box } from '@mui/material';
import Image from 'next/image';

/**
 * A component with image.
 */
export default function ImageBox({ url, sx, width, height }) {
  return (
    <Box sx={{ ...sx }}>
      <Image
        src={url}
        layout="responsive"
        loading="lazy"
        width={width || 1080}
        height={height || 675}
        alt="Image"
      />
    </Box>
  );
}
