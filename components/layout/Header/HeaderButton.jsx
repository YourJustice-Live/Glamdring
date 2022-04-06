import { Button } from '@mui/material';

// export const HeaderButton = ({ children, onClick, startIcon }) => (
export const HeaderButton = (props) => (
  <Button variant="outlined"
    // onClick={onClick}
    // startIcon={startIcon}
    {...props}
    sx={{
      ml: 1.5,
      borderRadius: '12px',
      border: 'none',
      height: 36,
      textTransform: 'none',
      backgroundColor: 'rgba(173, 155, 245, 0.08)',
      '&:hover': {
        border: 'none',
      },
    }}
  />
  // {children}
  // </Button>
);
