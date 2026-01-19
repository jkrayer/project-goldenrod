import { useState } from "react";
// import { useNavigate } from "react-router";
import { type ValidationError } from "yup";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  // Link,
  Card as MuiCard,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import { userValidation } from "@project_goldenrod/shared";
import { login, type LoginPayload } from "./api/login";
import { useAuthContext } from "./AuthContext";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "450px",
  },
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

export default function Login() {
  // STATE
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<keyof LoginPayload, string>>({
    email: "",
    password: "",
  });
  const [serverErrors, setServerErrors] = useState<string>("");

  // Context
  const { login: setUser } = useAuthContext();

  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");

  // const dispatch = useDispatch<AppDispatch>();
  // const navigate = useNavigate();

  // how do I deal with errors in a sane way?
  // 1. Show error messages in the UI
  //   A. Field validation errors
  //   B. General errors
  // 2. Log errors to an external service
  // 3. Ensure sensitive information is not exposed
  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   try {
  //     // await dispatch(login({ email, password }));
  //     // Handle successful login (e.g., redirect to dashboard)
  //     navigate("/lobby");
  //   } catch (error) {
  //     // Handle login error (e.g., show error message)
  //     console.error("Login failed:", error);
  //   }
  // };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    userValidation
      .validate(
        { email, password },
        {
          strict: false,
          abortEarly: false,
          stripUnknown: false,
          recursive: true,
        },
      )
      .then(() => {
        setIsLoading(true);

        login({ email, password })
          .then((response) => response.data)
          .then(setUser)
          .catch((err) => {
            setIsLoading(false);
            setServerErrors(err.message || "Login failed");
          });
      })
      .catch((e: Required<ValidationError>) => {
        setErrors(
          e.inner.reduce(
            (acc, curr) => {
              if (curr.path) {
                acc[curr.path] = curr.message;
              }
              return acc;
            },
            {} as Record<string, string>,
          ),
        );
      });
  };

  return (
    <Card variant="outlined">
      <Typography
        component="h1"
        variant="h4"
        sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
      >
        Sign in
      </Typography>
      <Typography color="error" variant="body1">
        {serverErrors}
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          gap: 2,
        }}
      >
        <FormControl>
          <FormLabel htmlFor="email">Email</FormLabel>
          <TextField
            autoComplete="email"
            autoFocus
            color={errors.email ? "error" : "primary"}
            disabled={isLoading}
            error={!!errors.email}
            fullWidth
            helperText={errors.email}
            id="email"
            name="email"
            onBlur={(
              e: React.FocusEvent<
                HTMLInputElement | HTMLTextAreaElement,
                Element
              >,
            ) => {
              userValidation
                .validateAt("email", { email: e.target.value })
                .then(() => {
                  setErrors((prev) => ({ ...prev, email: "" }));
                })
                .catch((err) => {
                  setErrors((prev) => ({ ...prev, email: err.message }));
                });
            }}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            placeholder="your@email.com"
            required
            type="email"
            value={email}
            variant="outlined"
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="password">Password</FormLabel>
          <TextField
            autoComplete="current-password"
            color={errors.password ? "error" : "primary"}
            disabled={isLoading}
            error={!!errors.password}
            fullWidth
            helperText={errors.password}
            id="password"
            name="password"
            onBlur={(
              e: React.FocusEvent<
                HTMLInputElement | HTMLTextAreaElement,
                Element
              >,
            ) => {
              userValidation
                .validateAt("password", { password: e.target.value })
                .then(() => {
                  setErrors((prev) => ({ ...prev, password: "" }));
                })
                .catch((err) => {
                  setErrors((prev) => ({ ...prev, password: err.message }));
                });
            }}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder="••••••"
            required
            type="password"
            value={password}
            variant="outlined"
          />
        </FormControl>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={isLoading}
        >
          Sign in
        </Button>
        {/* <Typography sx={{ textAlign: "center" }}>
          Don&apos;t have an account?
          <Link href="/register" variant="body2" sx={{ alignSelf: "center" }}>
            Sign up
          </Link>
        </Typography> */}
      </Box>
    </Card>
  );
}
