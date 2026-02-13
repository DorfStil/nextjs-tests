
import clsx from "clsx";
import { title } from "~/components/primitives";
import { RegisterForm } from "./register-form";

export default async function AboutPage() {
  return (
    <div>
      <section className="mb-8">
        <h1 className={clsx(title(), "mb-4")}>Регистрация</h1>
        <RegisterForm />
      </section>
    </div>
  );
}
