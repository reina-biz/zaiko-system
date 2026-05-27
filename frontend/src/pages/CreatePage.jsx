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

const [

  companySections,

  setCompanySections

] = useState([

  {

    companyName: "",

    rows: Array.from(
      { length: 10 },
      () => ({
        ...EMPTY_ROW
      })
    )

  }

]);



  const updateRow = (

  sectionIndex,
  rowIndex,
  field,
  value

) => {

  const updatedSections = [

    ...companySections

  ];

  updatedSections[sectionIndex]

    .rows[rowIndex][field] = value;

  const currentRow =

    updatedSections[sectionIndex]

      .rows[rowIndex];

  const matchedRow =

    historyRows

      .slice()

      .reverse()

      .find(

        (row) =>

          row.materialName ===
            currentRow.materialName

          &&

          row.size ===
            currentRow.size

      );

  if (matchedRow) {

    currentRow.price =
      matchedRow.price || "";

  }

  setCompanySections(
    updatedSections
  );

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

  setCompanySections([

    ...companySections,

    {

      companyName: "",

      rows: Array.from(
        { length: 10 },
        () => ({
          ...EMPTY_ROW
        })
      )

    }

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
  {companySections.map(

  (section, sectionIndex) => (

<div
  key={sectionIndex}
  className="
    border
    rounded-3xl
    p-4
    space-y-4
  "
>
  <div className="
  flex
  items-center
  gap-4
">

  <div className="
    text-xl
    font-bold
  ">

    会社 {sectionIndex + 1}

  </div>

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

  <button

  onClick={() => {

    const updatedSections = [

      ...companySections

    ];

    updatedSections[
      sectionIndex
    ].rows.push({

      ...EMPTY_ROW

    });

    setCompanySections(
      updatedSections
    );

  }}

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

    

    {section.rows.map(
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
  sectionIndex,
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
  sectionIndex,
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
  sectionIndex,
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

    現場合計：

{section.rows

  .reduce(

    (total, row) =>

      total +

      (
        Number(row.quantity || 0)
        *
        Number(row.price || 0)
      ),

    0

  )

  .toLocaleString()

} 円

  </div>

  </div>

))

}

</div>

)}

     

</div>

  );

}