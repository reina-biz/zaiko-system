import { supabase } from "../lib/supabase";

// 履歴取得
// 履歴取得
export async function getHistory() {

  const allData = [];
  const pageSize = 1000;
  let from = 0;

  while (true) {

    const { data, error } = await supabase
      .from("history")
      .select("*")
      .order("created_at", { ascending: true })
      .range(from, from + pageSize - 1);

    if (error) {

      console.error(error);

      return [];

    }

    if (!data || data.length === 0) {
      break;
    }

    allData.push(...data);

    console.log(
      `履歴取得: ${from} ～ ${from + data.length - 1}件`
    );

    if (data.length < pageSize) {
      break;
    }

    from += pageSize;

  }

  console.log("getHistory 全件数", allData.length);

  console.log("1件目", allData?.[0]);

  console.log("1件目のid", allData?.[0]?.id);

  console.log(
    "最後のid",
    allData?.[allData.length - 1]?.id
  );

  return allData;

}

// 履歴保存
export async function saveHistory(rows) {
  console.table(rows);
  console.log("保存予定件数", rows.length);

  const { data, error } = await supabase
    .from("history")
    .insert(rows)
    .select();

  console.log("保存成功件数", data?.length);
  console.log("saveHistory data", data);
  console.log("saveHistory error", error);
  console.log("error message", error?.message);
  console.log("error details", error?.details);
  console.log("error hint", error?.hint);

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}

// 履歴削除
export async function deleteHistory(ids) {
  const { error } = await supabase
    .from("history")
    .delete()
    .in("id", ids);

  console.log("削除するID:", ids);
  console.log("delete error:", error);

  if (error) {
    console.error(error);
    throw error;
  }

  console.log("削除成功");
}

// 履歴更新
export async function updateHistory(row) {
  console.log("row.id =", row.id, "型 =", typeof row.id);

  const { data, error } = await supabase
    .from("history")
    .update({
      orderDate: row.orderDate,
      companyName: row.companyName,
      siteName: row.siteName,
      materialName: row.materialName,
      size: row.size,
      price: row.price === "" ? null : Number(row.price),
      quantity: row.quantity === "" ? null : Number(row.quantity),
      used: row.used === "" ? null : Number(row.used),
      note: row.note,
    })
    .eq("id", row.id)
    .select();



  if (error) {
    console.error(error);
    throw error;
  }

  return data;
}