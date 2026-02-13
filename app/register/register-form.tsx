"use client";

import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { addToast } from "@heroui/toast";
import Form from 'next/form';
import { register } from "./actions";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Ошибка регистрации";
}

export function RegisterForm() {
  return (
    <Form
      className="flex flex-col gap-1"
      action={async (formData) => {
        try {
          await register(formData);
          addToast({ color: "success", title: "Пользователь зарегистрирован" });
        } catch (error) {
          addToast({ color: "danger", title: getErrorMessage(error) });
        }
      }}
    >
      <Input type="text" name="login" placeholder="login" />
      <Input type="password" name="password" placeholder="password" />
      <Button type="submit">Зарегистрироваться</Button>
    </Form>
  );
}
