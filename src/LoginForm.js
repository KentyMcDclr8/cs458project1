import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { GoogleLogin } from "@react-oauth/google";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Card,
  CardContent,
  CssBaseline,
} from "@mui/material";
import { onSignIn } from "./onSignIn";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return regex.test(email);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrorMessage(""); // Reset error messages on new submission

    if (!email || !password) {
      setErrorMessage("Please fill in all fields.");
      return;
    }
    if (!validateEmail(email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    if (onSignIn(email, password)) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userEmail", email);
      navigate("/distance-to-sun"); // Navigate to success page
    } else {
      setErrorMessage("Invalid email address or password. Please try again.");
    }
  };

  const handleGoogleLogin = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      if (decoded.email_verified && onSignIn(decoded.email)) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userEmail", decoded.email);
        navigate("/distance-to-sun"); // Navigate to success page
      } else {
        setErrorMessage(
          "User account does not exist for this Gmail. Please try again."
        );
      }
    } catch (error) {
      console.error("Login Failed: ", error);
      setErrorMessage("Login Failed. Please try again.");
    }
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CssBaseline />
      <Card sx={{ minWidth: 275, width: "100%" }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Typography variant="h4" component="h1" gutterBottom>
              Login
            </Typography>
            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
            <form onSubmit={handleSubmit} noValidate>
              <TextField
                label="Email Address"
                type="email"
                id="email"
                fullWidth
                variant="outlined"
                margin="normal"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                label="Password"
                type="password"
                id="password"
                fullWidth
                variant="outlined"
                margin="normal"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="submit"
                id="login"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2, mb: 2 }}
              >
                Login
              </Button>
            </form>
            <GoogleLogin
              onSuccess={(credentialResponse) =>
                handleGoogleLogin(credentialResponse)
              }
              onError={() =>
                setErrorMessage("Google login failed. Please try again.")
              }
              useOneTap
            />
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}

export default LoginForm;
