import { httpJson } from '../../shared/api/http';

export async function sendCode(mobile: string): Promise<void> {
  await httpJson<void>('/reSendCode', {
    method: 'POST',
    body: JSON.stringify({ mobile }),
  });
}

export async function verifyCode(mobile: string, otp: string): Promise<{ token?: string; need_signup?: boolean } | void> {
  return await httpJson<{ token?: string; need_signup?: boolean } | void>('/login', {
    method: 'POST',
    body: JSON.stringify({ mobile, otp }),
  });
}

export type SignupInput = { mobile: string; name: string; password: string };

export async function signup(input: SignupInput): Promise<void> {
  await httpJson<void>('/signup', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}


