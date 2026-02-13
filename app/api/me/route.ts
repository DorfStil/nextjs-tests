import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { BASE_URL } from "~/app/config";
import { authFetch } from "~/lib/auth-fetch";
import { MeResponseSchema, MeUserSchema } from "~/lib/schemas/me";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth")?.value;

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    const response = await authFetch(`${BASE_URL}/users/me`, {
      method: "GET",
      cache: "no-store",
    });

    if (response.status === 401 || response.status === 403) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    if (!response.ok) {
      return NextResponse.json(
        { message: "Auth backend unavailable" },
        { status: 502 },
      );
    }

    const payload = await response.json().catch(() => null);
    const parsedUser = MeUserSchema.safeParse(payload);

    if (!parsedUser.success) {
      return NextResponse.json({ message: "Invalid auth payload" }, { status: 502 });
    }

    return NextResponse.json(
      MeResponseSchema.parse({ authenticated: true, user: parsedUser.data }),
      { status: 200 },
    );
  } catch {
    return NextResponse.json({ message: "Auth backend error" }, { status: 502 });
  }
}
