import {
  getCompanies,
  saveCompany,
  updateCompany,
  deleteCompany,
} from "../services/companyService";

import { useState, useEffect } from "react";

import {
  getUsers,
  saveUser,
  updateUser,
  deleteUser,
  getLoginSettings,
  updateLoginSettings,
} from "../services/userService";

export default function SettingsPage({

  companyList,
  setCompanyList,

  userList,
  setUserList,

}) {
  const [newCompany, setNewCompany] =
    useState("");
  const [newUser, setNewUser]
    = useState("");

  const [newEmail, setNewEmail] = useState("");
  const [editCompanyId, setEditCompanyId] = useState(null);
  const [editUserId, setEditUserId] = useState(null);


  const [loginId, setLoginId] = useState("");
  const [loginPassword, setLoginPassword] = useState("");



  useEffect(() => {
    async function loadLoginSettings() {
      const data = await getLoginSettings();

      setLoginId(data.login_id);
      setLoginPassword(data.login_password);
    }

    loadLoginSettings();
  }, []);

  return (

    <div className="space-y-6">

      <div className="bg-white rounded-3xl shadow-sm p-6">

        <h2 className="text-2xl font-bold mb-6">
          ログイン設定
        </h2>

        <div className="grid md:grid-cols-2 gap-4">

          <div>

            <label className="block text-sm font-medium mb-2">
              ログインID
            </label>

            <input
              type="text"
              value={loginId}

              onChange={(e) => {
                setLoginId(e.target.value);
              }}

              className="w-full border rounded-2xl px-4 py-3"
            />

          </div>

          <div>

            <label className="block text-sm font-medium mb-2">
              パスワード
            </label>

            <input
              type="text"
              value={loginPassword}

              onChange={(e) => {
                setLoginPassword(e.target.value);
              }}

              className="w-full border rounded-2xl px-4 py-3"
            />

          </div>

        </div>

      </div>

      <div className="mt-4">
        <button
          onClick={async () => {
            await updateLoginSettings(loginId, loginPassword);
            alert("ログイン情報を保存しました。");
          }}
          className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-2xl"
        >
          保存
        </button>
      </div>


      <div className="bg-white rounded-3xl shadow-sm p-6">

        <h2 className="text-2xl font-bold mb-6">
          会社管理
        </h2>
        <div className="flex gap-3 mb-6">

          <input
            type="text"
            placeholder="新しい会社名"
            value={newCompany}
            onChange={(e) =>
              setNewCompany(
                e.target.value
              )
            }
            className="flex-1 border rounded-2xl px-4 py-3"
          />

          <button

            onClick={async () => {

              if (!newCompany) return;

              if (editCompanyId) {

                await updateCompany(
                  editCompanyId,
                  newCompany
                );

              } else {

                await saveCompany(newCompany);

              }

              const data = await getCompanies();
              setCompanyList(data);

              setNewCompany("");
              setEditCompanyId(null);

            }}

            className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-2xl"
          >
            {editCompanyId ? "更新" : "登録"}
          </button>

        </div>

        <div className="space-y-3">

          {companyList.map((company) => (

            <div
              key={company.id}
              className="flex justify-between items-center border rounded-2xl px-4 py-3"
            >

              <span>{company.companyName}</span>

              <div className="flex gap-2">



                <button
                  onClick={() => {
                    console.log("編集する会社", company);

                    setNewCompany(company.companyName);
                    setEditCompanyId(company.id);
                  }}
                  className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl"
                >
                  編集
                </button>

                <button
                  onClick={async () => {

                    console.log("削除ボタン押した");

                    if (!window.confirm("この会社を削除しますか？")) return;

                    console.log("はいを押した");

                    await deleteCompany(company.id);

                    const data = await getCompanies();

                    setCompanyList(data);

                  }}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl"
                >
                  削除
                </button>



              </div>

            </div>

          ))}

        </div>

      </div>

      <div className="bg-white rounded-3xl shadow-sm p-6">

        <h2 className="text-2xl font-bold mb-6">
          担当者管理
        </h2>

        <div className="flex gap-3 mb-6">

          <input
            type="text"
            placeholder="担当者名"



            value={newUser}
            onChange={(e) =>
              setNewUser(
                e.target.value
              )
            }
            className="flex-1 border rounded-2xl px-4 py-3"
          />

          <input
            type="email"
            placeholder="Googleメールアドレス"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="flex-1 border rounded-2xl px-4 py-3"
          />

          <button

            onClick={async () => {

              if (!newUser || !newEmail) return;

              if (editUserId) {

                await updateUser(editUserId, {
                  userName: newUser,
                  email: newEmail,
                });

              } else {

                if (userList.some(user => user.email === newEmail)) {
                  alert("このメールアドレスは既に登録されています。");
                  return;
                }

                await saveUser({
                  userName: newUser,
                  email: newEmail,
                });

              }

              const data = await getUsers();
              setUserList(data);

              setNewUser("");
              setNewEmail("");
              setEditUserId(null);

            }}

            className="
        bg-sky-600
        text-white
        px-6
        py-3
        rounded-2xl
      "
          >

            {editUserId ? "更新" : "登録"}

          </button>

        </div>

        <div className="space-y-3">

          {userList.map((user) => (

            <div
              key={user.id}
              className="flex justify-between items-center border rounded-2xl px-4 py-3"
            >

              <div>
                <div className="font-semibold">
                  {user.userName}
                </div>

                <div className="text-sm text-slate-500">
                  {user.email}
                </div>
              </div>

              <div className="flex gap-2">

                <button
                  onClick={() => {
                    setNewUser(user.userName);
                    setNewEmail(user.email);
                    setEditUserId(user.id);
                  }}
                  className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl"
                >
                  編集
                </button>

                <button
                  onClick={async () => {

                    if (!window.confirm("この担当者を削除しますか？")) return;

                    await deleteUser(user.id);

                    const data = await getUsers();

                    setUserList(data);

                  }}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl"
                >
                  削除
                </button>

              </div>

            </div>

          ))}



        </div>

      </div>

    </div >

  );

}