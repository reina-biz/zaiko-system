import { supabase } from "../lib/supabase";

// 履歴取得
export async function getHistory() {
  const { data, error } = await supabase
    .from("history")
    .select("*")
    .order("created_at", { ascending: true });

  console.log("getHistory data", data);
  console.log("getHistory error", error);

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}

// 履歴保存
export async function saveHistory(rows) {
  console.log("保存するデータ", rows);

  const { data, error } = await supabase
    .from("history")
    .insert(rows)
    .select();

  console.log("saveHistory data", data);
  console.log("saveHistory error", error);

  if (error) {
    console.error(error);
  }
}