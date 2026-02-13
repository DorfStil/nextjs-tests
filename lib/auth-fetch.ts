import { cookies } from "next/headers";

export async function authFetch(input: string, init: RequestInit = {}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth")?.value;

  const headers = new Headers(init.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);

  return fetch(input, {
    ...init,
    headers,
    cache: "no-store",
  });
}
