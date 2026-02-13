"use client";

import Form from "next/form";
import { Spinner } from "@heroui/spinner";

import { useAuthStatus } from "~/hooks/use-auth-status";

import { logout } from "./action";

export function LogoutButton() {
  const { isAuth, isLoading } = useAuthStatus();

  if (isLoading) {
    return <Spinner color="default" size="sm" />;
  }

  if (!isAuth) {
    return null;
  }

  return (
    <Form action={logout}>
      <button type="submit">Выйти</button>
    </Form>
  );
}
