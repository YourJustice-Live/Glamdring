import { Box } from '@mui/material';
import Navigation from './Navigation';

/**
 * A component with a header.
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
