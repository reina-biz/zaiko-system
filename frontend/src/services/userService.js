import { supabase } from "../lib/supabase";

// 担当者一覧取得
export async function getUsers() {
  const { data, error } = await supabase
    .from("userList")
    .select("*")
    .order("userName", { ascending: true });

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}

// 担当者追加
export async function saveUser({ userName, email }) {
  const { error } = await supabase
    .from("userList")
    .insert([
      {
        userName,
        email,
      },
    ]);

  if (error) {
    console.error(error);
  }
}

// 担当者削除
export async function deleteUser(id) {
  const { error } = await supabase
    .from("userList")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(error);
  }
}

export const getLoginSettings = async () => {
  const { data, error } = await supabase
    .from("login_settings")
    .select("*");

  console.log("login_settings =", data);
  console.log("error =", error);

  return data?.[0];
};

export const updateLoginSettings = async (loginId, loginPassword) => {
  const { error } = await supabase
    .from("login_settings")
    .update({
      login_id: loginId,
      login_password: loginPassword,
    })
    .eq("id", 1);

  if (error) {
  console.log(error);
  throw error;
}
};

// 担当者更新
export async function updateUser(id, { userName, email }) {
  const { error } = await supabase
    .from("userList")
    .update({
      userName,
      email,
    })
    .eq("id", id);

  if (error) {
    console.error(error);
  }
}