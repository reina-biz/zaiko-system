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

// 会社更新
export async function updateCompany(id, companyName) {
  console.log("更新開始", id, companyName);

  const { data, error } = await supabase
    .from("companyList")
    .update({ companyName })
    .eq("id", id)
    .select();

  console.log("更新データ", data);
  console.log("更新エラー", error);

  if (error) {
    console.error(error);
  }
}

// 会社削除
export async function deleteCompany(id) {
  console.log("削除開始", id);

  const { data, error } = await supabase
    .from("companyList")
    .delete()
    .eq("id", id)
    .select();

  console.log("削除データ", data);
  console.log("削除エラー", error);

  if (error) {
    console.error(error);
  }
}