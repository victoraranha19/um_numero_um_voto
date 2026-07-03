'use client';

import { auth } from '@/api/auth';
import { Button, Typography } from '@mui/material';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

export default function Login() {
  async function handleLogin() {
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  }

  return (
    <>
      <Typography variant="h4" component="h1">
        Entre com sua conta
      </Typography>
      <Button variant="contained" onClick={() => handleLogin()}>
        Login com Google
      </Button>
    </>
  );
}
