import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { getLoginSettings } from "../services/userService";


export default function LoginPage({
  setIsLoggedIn,
}) {




  const [error, setError] =
    useState("");

  const [googleVerified, setGoogleVerified] =
    useState(false);

  const [id, setId] =
    useState("");

  const [password, setPassword] =
    useState("");

  useEffect(() => {
    const checkGoogleLogin = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) return;

      const email = session.user.email;

      const { data: users, error } = await supabase
        .from("userList")
        .select("email");

      if (error) return;

      const allowed = users.some(
        (user) => user.email === email
      );

      if (allowed) {
        setGoogleVerified(true);
      } else {
        await supabase.auth.signOut();
        setError("このGoogleアe?カウントは利用できません。");
      }
    };

    checkGoogleLogin();
  }, []);

  const login = async () => {
    setError("");

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });
  };

  const checkIdPassword = async () => {
    const settings = await getLoginSettings();



    if (
      id === settings.login_id &&
      password === settings.login_password
    ) {
      setIsLoggedIn(true);
    } else {
      setError("IDまたはパスワードが違います。");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-sm p-10 w-full max-w-md">

        <h1 className="text-3xl font-bold text-center mb-3">
          在庫管理システム
        </h1>

        {!googleVerified ? (
          <>
            <p className="text-center text-slate-500 mb-8">
              Googleアカウントでログインしてください
            </p>

            <button
              onClick={login}
              className="w-full bg-sky-600 hover:bg-sky-700 text-white py-4 rounded-2xl font-semibold"
            >
              Googleでログイン
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="ID"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="w-full border rounded-2xl px-4 py-4 mb-4"
            />

            <input
              type="password"
              placeholder="パスワード"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  checkIdPassword();
                }
              }}
              className="w-full border rounded-2xl px-4 py-4 mb-4"
            />

            <button
              onClick={checkIdPassword}
              className="w-full bg-sky-600 hover:bg-sky-700 text-white py-4 rounded-2xl font-semibold"
            >
              ログイン
            </button>
          </>
        )}

        {error && (
          <p className="text-red-500 text-sm mt-4 text-center">
            {error}
          </p>
        )}

      </div>
    </div>
  );
}