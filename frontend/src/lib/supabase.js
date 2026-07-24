import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://rghpdahcsmbitgrnybkz.supabase.co";

const supabaseAnonKey =
"sb_publishable_z54X8eAH_hST4f2bzV_AzQ_adi2tiZ5";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);

console.log("Supabase接続OK", supabase);


