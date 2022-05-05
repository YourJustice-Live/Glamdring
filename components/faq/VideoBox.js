import { Box } from '@mui/material';
import ReactPlayer from 'react-player';

/**
 * A component with video player.
 */
export default function VideoBox({ url, sx }) {
  return (
    <Box sx={{ ...sx }}>
      <ReactPlayer url={url} controls={true} width="100%" height="100%" />
    </Box>
  );
}
