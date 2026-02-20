import { BASE_URL } from "~/app/config";
import { logOutgoingRequest } from "~/lib/http-logger";

type QueryValue = string | number | boolean | null | undefined;
type QueryParam = QueryValue | QueryValue[];

export type QueryParams = Record<string, QueryParam>;

export type ApiFetchInit = RequestInit & {
  params?: QueryParams;
};

export async function apiFetch(path: string, init: ApiFetchInit = {}) {
  const { params, ...fetchInit } = init;
  const baseUrl = new URL(BASE_URL.endsWith("/") ? BASE_URL : `${BASE_URL}/`);
  const normalizedPath = path.replace(/^\/+/, "");
  const basePath = baseUrl.pathname.replace(/\/+$/, "");
  const baseHasApiPrefix = basePath.endsWith("/api");
  const pathHasApiPrefix = normalizedPath === "api" || normalizedPath.startsWith("api/");

  let effectivePath = normalizedPath;

  if (baseHasApiPrefix && pathHasApiPrefix) {
    effectivePath = normalizedPath.replace(/^api\/?/, "");
  } else if (!baseHasApiPrefix && !pathHasApiPrefix) {
    effectivePath = normalizedPath.length > 0 ? `api/${normalizedPath}` : "api";
  }

  const url = new URL(effectivePath, baseUrl);

  if (params) {
    for (const [key, rawValue] of Object.entries(params)) {
      if (Array.isArray(rawValue)) {
        url.searchParams.delete(key);

        for (const value of rawValue) {
          if (value === undefined || value === null) continue;
          url.searchParams.append(key, String(value));
        }

        continue;
      }

      if (rawValue === undefined || rawValue === null) {
        url.searchParams.delete(key);
        continue;
      }

      url.searchParams.set(key, String(rawValue));
    }
  }

  logOutgoingRequest({ source: "apiFetch", url, init: fetchInit });
  return fetch(url.toString(), fetchInit);
}
