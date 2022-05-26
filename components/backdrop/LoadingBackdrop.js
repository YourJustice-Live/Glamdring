import { Backdrop, CircularProgress } from '@mui/material';

export default function LoadingBackdrop() {
  return (
    <Backdrop
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        background: '#FFFFFF',
      }}
      open
    >
      <CircularProgress size={64} />
    </Backdrop>
  );
}
