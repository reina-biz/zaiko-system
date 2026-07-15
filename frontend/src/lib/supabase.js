import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://rghpdahcsmbitgrnybkz.supabase.co";

const supabaseAnonKey =
"sb_publishable_ROdW8OWrxckBvrMH9RneZA_PruigkJg";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);

console.log("Supabase接続OK", supabase);