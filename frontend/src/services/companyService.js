import {
  getCompanies,
  saveCompany,
  updateCompany,
  deleteCompany,
} from "../services/companyService";

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
  const { error } = await supabase
    .from("companyList")
    .update({ companyName })
    .eq("id", id);

  if (error) {
    console.error(error);
  }
}

// 会社削除
export async function deleteCompany(id) {
  const { error } = await supabase
    .from("companyList")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(error);
  }
}