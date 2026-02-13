import { z } from "zod";

import { BASE_URL } from "../config";
import { unpackAllSettled } from "~/lib/unpackAllSettled";
import { authFetch } from '~/lib/auth-fetch';

const userSchema = z.object({
  _id: z.string(),
  email: z.string(),
  createdAt: z.string(),
});

const usersResponseSchema = z.array(userSchema);

export default async function UsersPage() {
  const [usersResult] = await Promise.allSettled([authFetch(BASE_URL + "/users")]);
  const users = await unpackAllSettled(usersResult, usersResponseSchema);

  return (
    <section>
      <h2 className="text-2xl mb-4">Пользователи</h2>
      {Array.isArray(users) ? (
        <ul>
          {users.map((user) => (
            <li key={user._id} className="bg-gray-500 rounded-md p-2 mb-2">
              <p>Логин: {user.email}</p>
              <p>Создан: {new Date(user.createdAt).toDateString()}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Нет доступа</p>
      )}
    </section>
  );
}
