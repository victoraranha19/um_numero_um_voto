'use client';

import { auth } from '@/_api/auth';
import { Button } from '@mui/material';
import { signOut } from 'firebase/auth';

export default function Logout() {
  async function logout() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  return (
    <>
      <Button variant="outlined" onClick={() => logout()}>
        Deslogar
      </Button>
    </>
  );
}
