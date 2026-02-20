import { cookies } from "next/headers";
import { logOutgoingRequest } from "~/lib/http-logger";

export async function authFetch(input: string, init: RequestInit = {}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth")?.value;

  const headers = new Headers(init.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const fetchInit: RequestInit = {
    ...init,
    headers,
    cache: "no-store",
  };

  logOutgoingRequest({ source: "authFetch", url: input, init: fetchInit });
  return fetch(input, fetchInit);
}
