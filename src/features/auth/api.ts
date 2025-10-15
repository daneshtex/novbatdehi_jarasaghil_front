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

export async function loginWithPassword(mobile: string, password: string): Promise<{ token?: string; need_signup?: boolean } | void> {
  const response = await httpJson<{ 
    code: number; 
    message: string; 
    data: { 
      access_token: string; 
      message: string; 
    } 
  }>('/login', {
    method: 'POST',
    body: JSON.stringify({ mobile, password }),
  });
  
  // Transform the response to match expected format
  if (response.code === 200 && response.data?.access_token) {
    return { token: response.data.access_token };
  }
  
  return undefined;
}

export type SignupInput = { mobile: string; name: string; password: string };

export async function signup(input: SignupInput): Promise<void> {
  await httpJson<void>('/signup', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}


