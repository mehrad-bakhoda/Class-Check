import { useState } from "react";
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
export default function Home() {
  const theme = createTheme();

  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("/api/roll", {
      method: "POST",
      body: JSON.stringify({
        name: name,
        code: code,
      }),
    }).then((data) => {
      if (data.status == 404) {
        router.replace("/");
      } else if (data.status == 403) {
        alert("already enrolled");
      } else if (data.status == 402) {
        alert("Time span closed");
      } else if (data.status == 401) {
        alert("class does not exist");
      } else {
        alert("enrolled successfully");
        setCode("");
        setName("");
      }
    });
  };

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
            Enroll{" "}
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              onChange={(e) => setName(e.target.value)}
              required
              fullWidth
              id="name"
              label="Name"
              name="name"
              value={name}
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
              Enroll now{" "}
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
