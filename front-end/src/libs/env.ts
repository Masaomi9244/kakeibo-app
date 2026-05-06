/**
 * @description 必須の公開環境変数を取得し、未設定なら起動時に失敗させる。
 * @param key - 取得する環境変数名。
 * @returns 環境変数の値。
 * @example
 * getRequiredClientEnv("NEXT_PUBLIC_API_BASE_URL");
 */
const getRequiredClientEnv = (key: string): string => {
  const value = process.env[key];

  if (value === undefined || value === "") {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
};

/**
 * API ClientとSupabase Clientが利用する公開環境変数。
 */
export const clientEnv = {
  apiBaseUrl: getRequiredClientEnv("NEXT_PUBLIC_API_BASE_URL"),
  supabaseUrl: process.env["NEXT_PUBLIC_SUPABASE_URL"] ?? "",
  supabaseAnonKey: process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"] ?? "",
};
