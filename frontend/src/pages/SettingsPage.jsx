import { saveCompany } from "../services/companyService";

import { useState, useEffect } from "react";
import {
  saveUser,
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

      if (
        newCompany &&
        !companyList.includes(
          newCompany
        )
      ) {

        setCompanyList([
          ...companyList,
          newCompany,
        ]);

        await saveCompany(newCompany);

        setNewCompany("");

      }

    }}
    className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-2xl"
  >
    登録
  </button>

</div>

        <div className="space-y-3">

          {companyList.map((company) => (

            <div
              key={company}
              className="flex justify-between items-center border rounded-2xl px-4 py-3"
            >

              <span>
                {company}
              </span>

              <button
                onClick={() => {

                  const updated =
                    companyList.filter(
                      (item) =>
                        item !== company
                    );

                  setCompanyList(
                    updated
                  );

                }}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl"
              >
                削除
              </button>

            </div>

          ))}

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

      if (
  newUser &&
  newEmail &&
  !userList.some(
    (user) => user.email === newEmail
  )
)

         {

          setUserList([
  ...userList,
  {
    userName: newUser,
    email: newEmail,
  },
]);

          await saveUser({
          userName: newUser,
          email: newEmail,
          });

          setNewUser("");
          setNewEmail("");

        }

      }}

      className="
        bg-sky-600
        text-white
        px-6
        py-3
        rounded-2xl
      "
    >

      登録

    </button>

  </div>

  <div className="space-y-3">

    {userList.map((user) => (

      <div
        key={user.id}
        className="
          flex
          justify-between
          items-center
          border
          rounded-2xl
          px-4
          py-3
        "
      >

        <div>
  <div className="font-semibold">
    {user.userName}
  </div>

  <div className="text-sm text-slate-500">
    {user.email}
  </div>
</div>

        <button

         onClick={async () => {

  await deleteUser(user.id);

  setUserList(
    userList.filter(
      (item) =>
        item.id !== user.id
    )
  );

}} 
        

          className="
            bg-red-500
            text-white
            px-4
            py-2
            rounded-xl
          "
        >

          削除

        </button>

      </div>

    ))}

  </div>

</div>
      
      </div>

    </div>

  );

}