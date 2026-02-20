type LogOutgoingRequestInput = {
  source: string;
  url: string | URL;
  init?: RequestInit;
};

export function logOutgoingRequest({ source, url, init }: LogOutgoingRequestInput) {
  if (process.env.NODE_ENV === "production") return;

  const method = (init?.method ?? "GET").toUpperCase();
  console.info(`[${source}] ${method} ${url.toString()}`);
}
