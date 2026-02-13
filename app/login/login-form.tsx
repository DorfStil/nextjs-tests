'use client';

import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { addToast } from "@heroui/toast";
import { login } from './action';
import Form from "next/form";

type Props = {};
type FormAction = (formData: FormData) => Promise<void>;

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Ошибка авторизации";
}

function notify(action: FormAction, successTitle: string): FormAction {
  return async (formData: FormData) => {
    try {
      await action(formData);
      addToast({ color: "success", title: successTitle });
    } catch (error) {
      addToast({ color: "danger", title: getErrorMessage(error) });
    }
  };
}

const LoginForm: React.FC<Props> = (props) => {
  const loginAction = notify(login, "Успешная авторизация");

  return (
    <Form
      className="flex flex-col gap-1"
      action={loginAction}
    >
      <Input type="text" name="login" placeholder="login" />
      <Input type="password" name="password" placeholder="password" />
      <Button type="submit">Войти</Button>
    </Form>
  );
};

export default LoginForm;
