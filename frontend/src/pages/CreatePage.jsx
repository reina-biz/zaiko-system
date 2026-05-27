import {
  useState
} from "react";

import InputPage from "./InputPage";

export default function CreatePage({

  companyList,
  historyRows

}) {

  const [page, setPage] =
    useState("");

const EMPTY_ROW = {

  materialName: "",
  size: "",
  quantity: "",
  price: "",
  note: "",

};

const [rows, setRows] =

  useState(

    Array.from(
      { length: 10 },
      () => ({
        ...EMPTY_ROW
      })
    )

  );

  const [

  companyBlocks,

  setCompanyBlocks

] = useState([0]);

  const updateRow = (
  index,
  field,
  value
) => {

  const updated = [...rows];

  updated[index] = {

    ...updated[index],
    [field]: value,

  };

  // 材料名 + 型番
  // 一致単価取得

  const materialName =
    updated[index]
      .materialName;

  const size =
    updated[index]
      .size;

  const matchedRow =

    historyRows

      .slice()

      .reverse()

      .find(

        (row) =>

          row.materialName ===
            materialName

          &&

          row.size === size

      );

  if (matchedRow) {

    updated[index].price =
      matchedRow.price || "";

  }

  setRows(updated);

};

    const materialSuggestions = [

  ...new Set(

    historyRows

      .filter(
        (row) => row.materialName
      )

      .map(
        (row) =>
          row.materialName
      )

  )

];

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

{companyBlocks.map((block) => (

  <select

    key={block}

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

))}



<input
  type="text"
  placeholder="現場名"
  className="
    border
    rounded-2xl
    px-4
    py-3
    w-[300px]
  "
/>

<input
  type="text"
  placeholder="入力者名"
  className="
    border
    rounded-2xl
    px-4
    py-3
    w-[200px]
  "
/>

<button
onClick={() =>

  setRows([

    ...rows,

    {
      ...EMPTY_ROW
    }

  ])

}

  className="
    bg-sky-500
    text-white
    px-5
    py-3
    rounded-2xl
    font-semibold
  "
>

  

  行追加

</button>

<button
onClick={() =>

  setCompanyBlocks([

    ...companyBlocks,

    companyBlocks.length

  ])

}
  className="
    bg-indigo-500
    text-white
    px-5
    py-3
    rounded-2xl
    font-semibold
  "
>

  会社追加

</button>

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

    

    {rows.map(
      (row, index) => (

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
  list={`material-list-${index}`}
  type="text"

  value={row.materialName}

  onChange={(e) =>

    updateRow(
      index,
      "materialName",
      e.target.value
    )

  }

  className="
    w-full
    border
    rounded-xl
    px-3
    py-2
  "
/>

<datalist
  id={`material-list-${index}`}
>

  {materialSuggestions.map(
    (name) => (

      <option
        key={name}
        value={name}
      />

    )
  )}

</datalist>

          </div>

          <div className="p-2">

           <input
  list={`size-list-${index}`}
  type="text"

  value={row.size}

  onChange={(e) =>

    updateRow(
      index,
      "size",
      e.target.value
    )

  }

  className="
    w-full
    border
    rounded-xl
    px-3
    py-2
  "
/>

<datalist
  id={`size-list-${index}`}
>

  {[

    ...new Set(

      historyRows

        .filter(
          (row) => row.size
        )

        .map(
          (row) => row.size
        )

    )

  ].map((size) => (

    <option
      key={size}
      value={size}
    />

  ))}

</datalist>

          </div>

          <div className="p-2">

  <input
    type="number"

    value={row.quantity}

    onChange={(e) =>

      updateRow(
        index,
        "quantity",
        e.target.value
      )

    }

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

    value={row.price}

    readOnly

    className="
      w-full
      border
      rounded-xl
      px-3
      py-2
      text-right
      bg-slate-100
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

            {(
            Number(row.quantity || 0)
            *
            Number(row.price || 0)
            ).toLocaleString()} 円

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

  

</div>

)}

     

</div>

  );

}