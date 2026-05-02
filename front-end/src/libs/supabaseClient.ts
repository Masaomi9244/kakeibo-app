import { createClient } from "@supabase/supabase-js";
import { clientEnv } from "./env";

// Supabase Auth Clientの生成を1か所に閉じ込める。
export const createSupabaseBrowserClient = () => {
  if (!clientEnv.supabaseUrl || !clientEnv.supabaseAnonKey) {
    throw new Error("Supabase client environment variables are not set.");
  }

  return createClient(clientEnv.supabaseUrl, clientEnv.supabaseAnonKey);
};
