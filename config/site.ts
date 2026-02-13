export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Next.js + HeroUI",
  description: "Make beautiful websites regardless of your design experience.",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Users",
      href: "/users",
    },
    {
      label: "Register",
      href: "/register",
    },
    {
      label: "Login",
      href: "/login",
    },
  ],
};
