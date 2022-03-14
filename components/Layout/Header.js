import { Box, Link, Container } from "@mui/material";
import Navigation from "components/Layout/navigation";

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
  )
}