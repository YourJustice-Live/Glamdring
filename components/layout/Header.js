import { Box } from '@mui/material';
import Navigation from 'components/layout/Navigation';

/**
 * Component: Header
 */
export default function Header({ children }) {
  return (
    <Box className="header">
      <div className="inner">
        <Navigation />
        {children}
      </div>
    </Box>
  );
}
