import { useState } from "react";
import { Button, TextField, Typography, Box } from "@mui/material";
import styles from "./AuthForms.module.css";
import { authApi } from "../api/authApi";

interface Props {
  onSwitch: () => void;
}

export const LoginForm = ({ onSwitch }: Props) => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (login === "admin" && password === "admin") {
      window.location.href = "http://localhost:5175";
      return;
    }
    try {
      const data = await authApi.login({
        login,
        password,
      });

      const targetUrl = data.user.isSeller
        ? "http://localhost:5172"
        : "http://localhost:5171";

      window.location.href = `${targetUrl}?token=${data.token}`;
    } catch (e: any) {
      alert(e.response?.data?.detail || "Login failed");
    }
  };

  return (
    <Box className={styles.form}>
      <Box className={styles.logoContainer}>
        <img
          src="/mainlogo.png"
          alt="Marketplace Logo"
          className={styles.logo}
        />
      </Box>

      <Box className={styles.content}>
        <Typography variant="h4" className={styles.title}>
          Sign In
        </Typography>

        <Typography className={styles.subtitle}>Welcome back!</Typography>

        <TextField
          label="Login"
          fullWidth
          value={login}
          onChange={(e) => setLogin(e.target.value)}
        />

        <TextField
          label="Password"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={handleLogin}
        >
          Login
        </Button>

        <Typography className={styles.switch}>
          Don't have an account?{" "}
          <Box
            component="span"
            onClick={onSwitch}
            className={styles.switchLink}
          >
            Register
          </Box>
        </Typography>
      </Box>
    </Box>
  );
};
