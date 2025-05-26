import type { Route } from './+types/signup';
import { redirect, data } from 'react-router';
import { Login } from '~/login/login';

export default function Signup() {
  return <Login />;
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const email = String(formData.get('email'));
  const password = String(formData.get('password'));

  const errors: Record<string, string> = {};

  if (!email.includes('@')) {
    errors.email = 'Email is required';
  }

  if (password.length < 12) {
    errors.password = 'Password is required';
  }

  if (Object.keys(errors).length > 0) {
    return data({ errors }, { status: 400 });
  }

  return redirect('/home');
}
