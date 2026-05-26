import { useState } from "react";

export default function CreatePage() {

  const [page, setPage] =
    useState("");

  return (

    <div className="
      bg-white
      rounded-3xl
      shadow-sm
      p-6
      space-y-6
    ">

      <h2 className="
        text-2xl
        font-bold
      ">
        作成
      </h2>

      {/* ボタン */}

      <div className="
        flex
        flex-wrap
        md:grid-cols-4
        gap-2
      ">

        <button
          onClick={() =>
            setPage("現場報告書作成")
          }
          className="
            bg-sky-500
        text-white
         py-2
         w-28
         rounded-2xl
         font-semibold
         text-sm
          "
        >
          現場報告書作成
        </button>

        <button
          onClick={() =>
            setPage("現場報告書一覧")
          }
          className="
            bg-indigo-500
           text-white
         py-2
         w-28
         rounded-2xl
         font-semibold
         text-sm
         "
        >
          現場報告書一覧
        </button>

        <button
          onClick={() =>
            setPage("現場材料作成")
          }
          className="
            bg-emerald-500
           text-white
           py-2
           w-28
           rounded-2xl
           font-semibold
          text-sm
          "
        >
          現場材料作成
        </button>

        <button
          onClick={() =>
            setPage("現場材料一覧")
          }
         className="
         bg-red-500
         text-white
         py-2
         w-28
         rounded-2xl
         font-semibold
         text-sm
         "
        >
          現場材料一覧
        </button>

      </div>

      {/* 表示切替 */}

      {page === "現場報告書作成" && (

        <div className="
          border
          rounded-2xl
          p-6
        ">

          現場報告書作成ページ

        </div>

      )}

      {page === "現場報告書一覧" && (

        <div className="
          border
          rounded-2xl
          p-6
        ">

          現場報告書一覧ページ

        </div>

      )}

      {page === "現場材料作成" && (

        <div className="
          border
          rounded-2xl
          p-6
        ">

          現場材料作成ページ

        </div>

      )}

      {page === "現場材料一覧" && (

        <div className="
          border
          rounded-2xl
          p-6
        ">

          現場材料一覧ページ

        </div>

      )}

    </div>

  );

}