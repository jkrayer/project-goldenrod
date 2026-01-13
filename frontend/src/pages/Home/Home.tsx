import { Box, Typography } from "@mui/material";
import packageJson from "../../../package.json";

export default function Home() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to Project Goldenrod
        </Typography>
        <Typography variant="body1">
          Alpha version {packageJson.version}
        </Typography>
        <Typography variant="body2" marginTop={2}>
          This project is not currently open to the public. If you received an
          invitation to join please follow the instructions in the invitation
          email.
        </Typography>
      </Box>
    </Box>
  );
}
