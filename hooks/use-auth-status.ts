"use client";

import { useEffect, useState } from "react";

import { AnyMeResponseSchema } from "~/lib/schemas/me";

export function useAuthStatus() {
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        const res = await fetch("/api/me", {
          credentials: "same-origin",
          cache: "no-store",
        });

        if (!mounted) return;
        if (!res.ok) {
          setIsAuth(false);
          return;
        }

        const raw = await res.json();
        const parsed = AnyMeResponseSchema.safeParse(raw);
        setIsAuth(parsed.success && parsed.data.authenticated === true);
      } catch (err) {
        if (mounted) {
          setIsAuth(false);
        }
        console.debug(err);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    checkAuth();

    return () => {
      mounted = false;
    };
  }, []);

  return { isAuth, isLoading };
}
