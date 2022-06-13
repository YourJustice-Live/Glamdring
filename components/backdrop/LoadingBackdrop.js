import { Backdrop } from '@mui/material';
import { LogoAnimated } from 'icons/logo';

/**
 * A component with a loading backdrop.
 */
export default function LoadingBackdrop() {
  return (
    <Backdrop
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        background: '#FFFFFF',
      }}
      open
    >
      <LogoAnimated width="64px" heigth="64px" />
    </Backdrop>
  );
}
