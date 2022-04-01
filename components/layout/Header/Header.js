import { Box } from '@mui/material';
import Navigation from './Navigation';

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
