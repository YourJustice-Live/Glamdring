import { Box, Container } from "@mui/material";

/**
 * Component: Footer
 */
export default function Footer({ children }) {
  return (
    <Container maxWidth="lg">
      <Box className="footer">
        <div className="inner">
          {children}
        </div>
      </Box>
    </Container>
  )
}