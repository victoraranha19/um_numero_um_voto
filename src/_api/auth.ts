// Import the functions you need from the SDKs you need
import {
  adicionarNovoUsuario,
  verificarEmailCadastrado,
} from '@app/api/usuario/actions';
import { IUsuario } from '@lib/types';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  User,
} from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FB_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FB_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FB_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FB_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FB_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FB_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FB_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export async function loginComGoogle() {
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);
  await registrarUsuario(userCredential.user);
}

async function registrarUsuario(user: User) {
  if (!user.email) {
    throw new Error('Não foi possível identificar email do usuário!');
  }
  const usuario: IUsuario = {
    nome: user.displayName ?? '',
    email: user.email,
    whatsapp: '',
  };

  const temEmailCadastrado = await verificarEmailCadastrado(usuario.email);
  if (!temEmailCadastrado) await adicionarNovoUsuario(usuario);
}
