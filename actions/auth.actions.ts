'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { InputParseError } from '@/src/entities/errors/common';
import { Cookie } from '@/src/entities/models/cookie';
import { signUpController } from '@/src/interface-adapters/controllers/auth/sign-up.controller';
import {
  AuthenticationError,
  UnauthenticatedError,
} from '@/src/entities/errors/auth';
import { signInController } from '@/src/interface-adapters/controllers/auth/sign-in.controller';
import { SESSION_COOKIE } from '@/config';
import { signOutController } from '@/src/interface-adapters/controllers/auth/sign-out.controller';

export async function signUp(formData: FormData) {
  const username = formData.get('username')?.toString();
  const password = formData.get('password')?.toString();
  const confirmPassword = formData.get('confirm_password')?.toString();

  let sessionCookie: Cookie;
  try {
    const { cookie } = await signUpController({
      username,
      password,
      confirm_password: confirmPassword,
    });
    sessionCookie = cookie;
  } catch (err) {
    if (err instanceof InputParseError) {
      return {
        error:
          'Invalid data. Make sure the Password and Confirm Password match.',
      };
    }
    return {
      error:
        'An error happened. The developers have been notified. Please try again later. Message: ' +
        (err as Error).message,
    };
  }

  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  redirect('/');
}

export async function signIn(formData: FormData) {
  const username = formData.get('username')?.toString();
  const password = formData.get('password')?.toString();

  let sessionCookie: Cookie;
  try {
    sessionCookie = await signInController({ username, password });
  } catch (err) {
    if (err instanceof InputParseError || err instanceof AuthenticationError) {
      return {
        error: 'Incorrect username or password',
      };
    }

    return {
      error:
        'An error happened. The developers have been notified. Please try again later.',
    };
  }

  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  redirect('/');
}

export async function signOut() {
  const cookiesStore = cookies();
  const sessionId = cookiesStore.get(SESSION_COOKIE)?.value;

  let blankCookie: Cookie;
  try {
    blankCookie = await signOutController(sessionId);
  } catch (err) {
    if (err instanceof UnauthenticatedError || err instanceof InputParseError) {
      redirect('/sign-in');
    }

    throw err;
  }

  cookies().set(blankCookie.name, blankCookie.value, blankCookie.attributes);

  redirect('/sign-in');
}
