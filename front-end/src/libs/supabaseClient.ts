import type { SupabaseClient } from "@supabase/supabase-js";

import { createClient } from "@supabase/supabase-js";

import { clientEnv } from "./env";

/**
 * MVP時点でフロントエンドが参照するSupabase Database型。
 */
type AppDatabase = {
  /** Supabase public schema */
  public: {
    /** Supabase Edge Functions型 */
    Functions: Record<string, never>;
    /** Supabase tables型 */
    Tables: Record<string, never>;
    /** Supabase views型 */
    Views: Record<string, never>;
  };
};

/**
 * アプリで利用するSupabase Browser Client型。
 */
type AppSupabaseClient = SupabaseClient<AppDatabase, "public", "public">;

/**
 * @description Supabase Auth Clientの生成を1か所に閉じ込める。
 * @param なし
 * @returns Supabase Browser Client。
 * @example
 * const supabase = createSupabaseBrowserClient();
 */
export const createSupabaseBrowserClient = (): AppSupabaseClient => {
  if (clientEnv.supabaseUrl === "" || clientEnv.supabaseAnonKey === "") {
    throw new Error("Supabase client environment variables are not set.");
  }

  return createClient<AppDatabase>(clientEnv.supabaseUrl, clientEnv.supabaseAnonKey);
};
