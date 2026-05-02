const getRequiredClientEnv = (key: string): string => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
};

// API Clientが利用する公開環境変数を1か所で管理する。
export const clientEnv = {
  apiBaseUrl: getRequiredClientEnv("NEXT_PUBLIC_API_BASE_URL"),
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
};
