import {
  useState
} from "react";

import InputPage from "./InputPage";

export default function CreatePage({

  companyList

}) {

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

  {page || "作成"}

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
  bg-white
  rounded-3xl
  border
  p-6
  space-y-6
">

  <div className="
    flex
    flex-wrap
    gap-4
  ">

    <input
      type="date"
      className="
        border
        rounded-2xl
        px-4
        py-3
      "
    />

    <select

  className="
    border
    rounded-2xl
    px-4
    py-3
    w-[300px]
  "
>

  <option value="">
    会社選択
  </option>

  {companyList.map((company) => (

    <option
      key={company}
      value={company}
    >

      {company}

    </option>

  ))}

</select>

    <input
      type="text"
      placeholder="現場名"
      className="
        border
        rounded-2xl
        px-4
        py-3
      "
    />

  </div>

  <div className="
    overflow-hidden
    rounded-2xl
    border
  ">

    <div className="
      grid
      grid-cols-[2fr_2fr_1fr_1fr_1fr_2fr]
      bg-slate-100
      font-semibold
      text-sm
    ">

      <div className="p-3">
        材料名
      </div>

      <div className="p-3">
        型番
      </div>

      <div className="p-3 text-right">
        数量
      </div>

      <div className="p-3 text-right">
        単価
      </div>

      <div className="p-3 text-right">
        合計
      </div>

      <div className="p-3">
        備考
      </div>

    </div>

    {Array.from({ length: 10 }).map(
      (_, index) => (

        <div
          key={index}
          className="
            grid
            grid-cols-[2fr_2fr_1fr_1fr_1fr_2fr]
            border-t
          "
        >

          <div className="p-2">

            <input
              type="text"
              className="
                w-full
                border
                rounded-xl
                px-3
                py-2
              "
            />

          </div>

          <div className="p-2">

            <input
              type="text"
              className="
                w-full
                border
                rounded-xl
                px-3
                py-2
              "
            />

          </div>

          <div className="p-2">

            <input
              type="number"
              className="
                w-full
                border
                rounded-xl
                px-3
                py-2
                text-right
              "
            />

          </div>

          <div className="p-2">

            <input
              type="number"
              className="
                w-full
                border
                rounded-xl
                px-3
                py-2
                text-right
              "
            />

          </div>

          <div className="
            p-3
            text-right
            flex
            items-center
            justify-end
          ">

            0 円

          </div>

          <div className="p-2">

            <input
              type="text"
              className="
                w-full
                border
                rounded-xl
                px-3
                py-2
              "
            />

          </div>

        </div>

      )
    )}

  </div>

  <div className="
    flex
    justify-end
    text-xl
    font-bold
  ">

    現場合計：0 円

  </div>

  <div className="
    flex
    justify-end
    gap-2
  ">

    <button
      className="
        bg-emerald-500
        text-white
        px-5
        py-3
        rounded-2xl
        font-semibold
      "
    >
      保存
    </button>

    <button
      className="
        bg-rose-500
        text-white
        px-5
        py-3
        rounded-2xl
        font-semibold
      "
    >
      PDF
    </button>

  </div>

</div>

)}

     

</div>

  );

}