import { Box, Typography } from "@mui/material";

export default function FourOFour() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Box>
        <Typography variant="h2" component="h1" gutterBottom>
          404 - Page Not Found
        </Typography>
      </Box>
    </Box>
  );
}
