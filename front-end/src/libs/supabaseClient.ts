import type { SupabaseClient } from "@supabase/supabase-js";

import { createClient } from "@supabase/supabase-js";

import { clientEnv } from "./env";

type AppDatabase = {
  public: {
    Functions: Record<string, never>;
    Tables: Record<string, never>;
    Views: Record<string, never>;
  };
};

type AppSupabaseClient = SupabaseClient<AppDatabase, "public", "public">;

// Supabase Auth Clientの生成を1か所に閉じ込める。
export const createSupabaseBrowserClient = (): AppSupabaseClient => {
  if (clientEnv.supabaseUrl === "" || clientEnv.supabaseAnonKey === "") {
    throw new Error("Supabase client environment variables are not set.");
  }

  return createClient<AppDatabase>(clientEnv.supabaseUrl, clientEnv.supabaseAnonKey);
};
