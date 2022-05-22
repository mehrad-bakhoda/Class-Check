import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAccessToken, setUser } from "../../app/features/tokenSlice";
import { useRouter } from "next/router";

import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const LoginPage = ({ path }) => {
  const theme = createTheme();

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [auth, setAuth] = useState(false);
  const token = useSelector((state) => state.token.value);
  const dispatch = useDispatch();
  useEffect(() => {
    if (token.accessToken !== null) {
      setAuth(true);
    } else {
      setAuth(false);
    }
  }, [token.accessToken]);
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("/api/signIn", {
      method: "POST",
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    }).then((data) => {
      if (data.status == 404) {
        router.replace("/register");
      } else {
        dispatch(setAccessToken(data.accessToken));
        dispatch(setUser(data.user));
        router.replace(path);
      }
    });
  };
  return auth === true ? (
    <div>you are authenticated</div>
  ) : (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default LoginPage;

export async function getServerSideProps(context) {
  if (context.req.headers.referer) {
    return {
      props: {
        path: context.req.headers.referer,
      },
    };
  } else {
    return {
      props: {
        path: "/admin",
      },
    };
  }
}
