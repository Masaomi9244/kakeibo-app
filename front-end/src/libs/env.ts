/**
 * Next.jsがclient bundleへ静的展開する公開環境変数。
 */
type ClientProcessEnv = {
  /** API base URL */
  readonly NEXT_PUBLIC_API_BASE_URL: string | undefined;
  /** Supabase anon key */
  readonly NEXT_PUBLIC_SUPABASE_ANON_KEY: string | undefined;
  /** Supabase project URL */
  readonly NEXT_PUBLIC_SUPABASE_URL: string | undefined;
};

/** Next.js client bundleに展開される公開環境変数。 */
const clientProcessEnv = process.env as unknown as ClientProcessEnv;

/**
 * @description 必須の公開環境変数を検証し、未設定なら起動時に失敗させる。
 * @param key - エラーメッセージに表示する環境変数名。
 * @param value - Next.jsが直接参照で展開する公開環境変数の値。
 * @returns 検証済みの環境変数値。
 * @example
 * getRequiredClientEnv("NEXT_PUBLIC_API_BASE_URL", process.env.NEXT_PUBLIC_API_BASE_URL);
 */
const getRequiredClientEnv = (key: string, value: string | undefined): string => {
  if (value === undefined || value === "") {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
};

/**
 * API ClientとSupabase Clientが利用する公開環境変数。
 */
export const clientEnv = {
  apiBaseUrl: getRequiredClientEnv(
    "NEXT_PUBLIC_API_BASE_URL",
    clientProcessEnv.NEXT_PUBLIC_API_BASE_URL,
  ),
  supabaseUrl: clientProcessEnv.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: clientProcessEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
};
