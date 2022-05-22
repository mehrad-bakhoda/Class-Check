import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import randomstring from "randomstring";

import useSWR from "swr";
import checkAuthClient from "../../functions/checkAuthClient";
import axios from "axios";
import Loader from "../../components/Loader";
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
import { useRouter } from "next/router";

function Protected({ classes }) {
  const router = useRouter();

  const theme = createTheme();

  const [secret, setSecret] = useState(null);
  const [isError, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState("");
  const [title, setTitle] = useState("");
  const token = useSelector((state) => state.token.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("/api/create", {
      method: "POST",
      body: JSON.stringify({
        code: code,
        title: title,
      }),
    }).then((data) => {
      if (data.status == 404) {
        router.replace("/admin");
      } else {
        alert("started successfully");
        setCode("");
        setTitle("");
      }
    });
  };
  const handleGenerate = (e) => {
    e.preventDefault();
    setCode(randomstring.generate(5));
  };
  const handleClass = (e) => {
    e.preventDefault();
    router.replace("/list");
  };

  const fetcher = async () => {
    return await axios.get("/api/protectedRoute", {
      headers: {
        authorization: `Bearer ${token.accessToken}`,
      },
    });
  };

  const { data, error } = useSWR("/api/", fetcher);

  useEffect(() => {
    if (data) setSecret(data.data);
    if (error) setError(error);
    setLoading(false);
  }, [data, error]);

  if (loading) {
    return <Loader />;
  } else {
    if (isError) {
      return <div>NOT AUTHENTICATED</div>;
    } else {
      return (
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
              <Typography component="h1" variant="h5">
                Start A Roll
              </Typography>
              <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ mt: 1 }}
              >
                <TextField
                  margin="normal"
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  fullWidth
                  id="title"
                  label="Class Title"
                  name="title"
                  value={title}
                  autoFocus
                />
                <TextField
                  onChange={(e) => setCode(e.target.value)}
                  margin="normal"
                  required
                  fullWidth
                  name="code"
                  value={code}
                  label="code"
                  id="code"
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Start
                </Button>
                <Button
                  fullWidth
                  onClick={handleGenerate}
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Generate random code
                </Button>
                <Button
                  onClick={handleClass}
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Classes
                </Button>
              </Box>
            </Box>
          </Container>
        </ThemeProvider>
      );
    }
  }
}

export default checkAuthClient(Protected);
