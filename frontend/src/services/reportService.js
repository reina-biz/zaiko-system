import { supabase } from "../lib/supabase";

// 一覧取得
export async function getMaterialReports() {
  const { data, error } = await supabase
    .from("material_reports")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}

// 保存
export async function saveMaterialReport(report) {
  const { data, error } = await supabase
    .from("material_reports")
    .insert([
      {
        report,
      },
    ])
    .select();

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}

// 編集
export async function updateMaterialReport(id, report) {
  const { data, error } = await supabase
    .from("material_reports")
    .update({
      report,
    })
    .eq("id", id)
    .select();

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}

// 削除
export async function deleteMaterialReport(id) {
  const { error } = await supabase
    .from("material_reports")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(error);
    throw error;
  }
}