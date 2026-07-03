'use client';

import { auth } from '@/api/auth';
import { Button, Typography } from '@mui/material';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

export default function LoginPage() {
  async function handleLogin() {
    const provider = new GoogleAuthProvider();

    try {
      const userCredential = await signInWithPopup(auth, provider);
      const token = await userCredential.user.getIdToken();
      sessionStorage.setItem('token', token);
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  }

  return (
    <>
      <Typography variant="h4" component="h1">
        Entre com sua conta
      </Typography>
      <Button variant="contained" onClick={handleLogin}>
        Login com Google
      </Button>
    </>
  );
}
