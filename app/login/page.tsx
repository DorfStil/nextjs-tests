import clsx from "clsx";
import { title } from "~/components/primitives";
import LoginForm from "./login-form";

export default async function AboutPage() {
  return (
    <section className="mb-8">
      <h1 className={clsx(title(), "mb-4")}>Авторизация</h1>
      <LoginForm />
    </section>
  );
}
