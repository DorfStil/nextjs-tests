// app/login/action.ts
"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import z from "zod";

const BASE_URL = "http://localhost:3000/api";

const CredentialsSchema = z.object({
  login: z.string().trim().min(1, "Логин обязателен"),
  password: z.string().trim().min(1, "Пароль обязателен"),
});

export async function login(formData: FormData) {
  const parsed = CredentialsSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );
  if (!parsed.success)
    throw new Error(parsed.error.issues[0]?.message ?? "Неверные данные");

  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parsed.data),
    cache: "no-store",
  });

  const payload = (await response.json().catch(() => null)) as null | {
    access_token?: string;
    message?: string;
  };

  if (!response.ok) {
    throw new Error(payload?.message ?? "Ошибка авторизации");
  }

  const token = payload?.access_token;
  if (!token) throw new Error("Сервер не вернул access_token");

  const cookieStore = await cookies();
  cookieStore.set("auth", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    secure: process.env.NODE_ENV === "production",
  });

  redirect("/");
}
