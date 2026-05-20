import { useState } from "react";

export default function LoginPage({

  setIsLoggedIn,

  loginId,
  loginPassword,

}) {

  const [id, setId] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const login = () => {

    if (
      id === loginId
      &&
      password === loginPassword
    ) {

      setIsLoggedIn(true);

      return;

    }

    setError(
      "IDまたはパスワードが違います"
    );

  };

  return (

    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">

      <div className="bg-white rounded-3xl shadow-sm p-10 w-full max-w-md">

        <h1 className="text-3xl font-bold mb-8 text-center">
          ログイン
        </h1>

        <div className="space-y-5">

          <input
            type="text"
            placeholder="ID"
            value={id}
            onChange={(e) =>
              setId(e.target.value)
            }
            className="w-full border rounded-2xl px-4 py-4"
          />

          <input
            type="password"
            placeholder="パスワード"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full border rounded-2xl px-4 py-4"
          />

          {error && (

            <p className="text-red-500 text-sm">
              {error}
            </p>

          )}

          <button
            onClick={login}
            className="w-full bg-sky-600 hover:bg-sky-700 text-white py-4 rounded-2xl font-semibold"
          >
            ログイン
          </button>

        </div>

      </div>

    </div>

  );
}