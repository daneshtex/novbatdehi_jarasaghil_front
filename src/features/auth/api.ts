import { httpJson } from "../../shared/api/http";

export async function sendCode(mobile: string): Promise<void> {
  await httpJson<void>("/resend-otp", {
    method: "POST",
    body: JSON.stringify({ mobile }),
  });
}

export async function verifyCode(
  mobile: string,
  otp: string
): Promise<{ token?: string; need_signup?: boolean } | void> {
  return await httpJson<{ token?: string; need_signup?: boolean } | void>(
    "/login",
    {
      method: "POST",
      body: JSON.stringify({ mobile, otp }),
    }
  );
}

export async function loginWithPassword(
  mobile: string,
  password: string
): Promise<{ token?: string; need_signup?: boolean } | void> {
  const response = await httpJson<{
    data: {
      token: string; // 👈 اینجا "token" است نه "access_token"
      user: any;
    };
    message: string;
  }>("/login", {
    method: "POST",
    body: JSON.stringify({ mobile, password }),
  });

  console.log("🔍 [loginWithPassword] Full backend response:", response);
  console.log(
    "🔍 [loginWithPassword] Token from backend:",
    response?.data?.token
  );

  // اصلاح شرط برای تطبیق با ساختار واقعی response
  if (response?.data?.token) {
    console.log("✅ [loginWithPassword] Login successful, token found");
    return { token: response.data.token };
  }

  console.log("❌ [loginWithPassword] No token found in response");
  return undefined;
}

export type SignupInput = { mobile: string; name: string; password: string };

export async function signup(input: SignupInput): Promise<void> {
  await httpJson<void>("/signup", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
