import { Backdrop, CircularProgress } from '@mui/material';

/**
 * A component with a circular loading progress in full screen.
 */
export default function LoadingBackdrop() {
  return (
    <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open>
      <CircularProgress />
    </Backdrop>
  )
}