import { Box } from '@mui/material';
import Navigation from './Navigation';
import NavBar from './NavBar';

export default function Header({ children }) {
  return (
    <Box className="header">
      <div className="inner">
        {/* <Navigation /> */}
        <NavBar />
        {children}
      </div>
    </Box>
  );
}
