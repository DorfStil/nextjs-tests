"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { BASE_URL } from '../config';

const UserSchema = z.looseObject({
  _id: z.string(),
  email: z.string(),
  createdAt: z.string(),
});

const UsersSchema = z.array(UserSchema);
const CredentialsSchema = z.object({
  login: z.string().trim().min(1, "Логин обязателен"),
  password: z.string().trim().min(1, "Пароль обязателен"),
});

type User = z.infer<typeof UserSchema>;

export async function getUsers(): Promise<{ data: User[] | undefined}> {
  const response = await fetch(`${BASE_URL}/users/`);

  if (!response.ok) {
    console.error("Не удалось получить список пользователей");
  }

  const payload = await response.json();
  const parsedUsers = UsersSchema.safeParse(payload);

  if (!parsedUsers.success) {
    console.error(
      "Неверный формат списка пользователей" + parsedUsers.error.message,
    );
  }

  return {
    data: parsedUsers.data,
  };
}

export async function register(formData: FormData) {
  const parsedCreds = CredentialsSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!parsedCreds.success) {
    const firstIssue = parsedCreds.error.issues[0];
    throw new Error(firstIssue?.message ?? "Неверный формат данных формы");
  }

  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      login: parsedCreds.data.login,
      password: parsedCreds.data.password,
    }),
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as
      | { message?: string }
      | null;
    const message = payload?.message ?? "Ошибка регистрации";
    throw new Error(message);
  }

  revalidatePath("/about");
}
