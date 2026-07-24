import { supabase } from "../lib/supabase";

// 会社一覧取得
export async function getCompanies() {
  const { data, error } = await supabase
    .from("companyList")
    .select("*")
    .order("companyName", { ascending: true });

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}

// 会社追加
export async function saveCompany(companyName) {
  const { error } = await supabase
    .from("companyList")
    .insert([
      {
        companyName,
      },
    ]);

  if (error) {
    console.error(error);
  }
}