const backendUrl = import.meta.env.VITE_BACKEND_URL;

if (!backendUrl) {
  throw new Error(
    "Missing VITE_BACKEND_URL environment variable. Copy .env.example to .env and set it.",
  );
}

export const env = {
  backendUrl,
} as const;
