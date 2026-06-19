import { useEffect, useState } from "react";

export default function HistoryPage({

  rows,
  setHistoryRows,
  companyList,

}) {

  const [selectedCompany, setSelectedCompany] =
    useState("全て");

  const [search, setSearch] =
    useState("");

  
  const [openIndex, setOpenIndex] =

     useState(null);

  const [editingGroup, setEditingGroup] =
  useState(null);


  const [editedRows, setEditedRows] =
    useState(rows);

  useEffect(() => {

    setEditedRows(rows);

  }, [rows]);

  const filteredRows =

  

  [...editedRows]

    .reverse()

    .filter((row) => {

      const companyMatch =

        selectedCompany === "全て"

        ||

        row.companyName ===
        selectedCompany;

      const keyword =
        search.toLowerCase();

      const searchMatch =

        row.materialName
          ?.toLowerCase()
          .includes(keyword)

        ||

        row.size
          ?.toLowerCase()
          .includes(keyword);

      return (
        companyMatch
        &&
        searchMatch
      );

    });

    const groupedRows = Object.values(

  filteredRows.reduce((acc, row) => {

    const key =

      `${row.orderDate}_${row.companyName}_${row.siteName}`;

    if (!acc[key]) {

      acc[key] = {

        orderDate: row.orderDate,

        companyName: row.companyName,

        siteName: row.siteName,

        rows: [],

      };

    }

    acc[key].rows.push(row);

    return acc;

  }, {})

);

console.log("rows", rows);

console.log("editedRows", editedRows);

console.log("filteredRows", filteredRows);

console.log("groupedRows", groupedRows);

  

  return (

    <div className="w-full space-y-6">

      <div className="bg-white rounded-3xl shadow-sm p-6">

        <div className="flex items-center justify-between">

          

          <div className="flex gap-3">

            <select
              value={selectedCompany}
              onChange={(e) =>
                setSelectedCompany(
                  e.target.value
                )
              }
              className="border rounded-xl px-4 py-2"
            >

              <option value="全て">
                全て
              </option>

              {companyList?.map((company) => (

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
              placeholder="検索"
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="border rounded-xl px-4 py-2"
            />

          </div>

        </div>

      </div>

      <div className="space-y-4">

  {groupedRows.map((group, index) => {

    const isOpen =

      openIndex === index;

      const isEditing =

  editingGroup === index;

    return (

      <div

        key={index}

        className="bg-white rounded-3xl shadow-sm p-6"

      >

        <div className="flex justify-between items-start">

          <div>

            <div className="text-sm text-slate-500">

              {group.orderDate}

            </div>

            <div className="text-lg font-bold">

              {group.companyName}

            </div>

            <div className="text-sm text-slate-600">

              {group.siteName}

            </div>

            <div className="text-xs text-slate-400 mt-1">

              材料 {group.rows.length}件

            </div>

          </div>

          <div className="flex gap-2">

  <button

    onClick={() =>

      setOpenIndex(

        isOpen

        ? null

        : index

      )

    }

    className="bg-slate-700 text-white px-4 py-2 rounded-xl"

  >

    {

      isOpen

      ? "閉じる"

      : "詳細"

    }

  </button>

  <button

  onClick={() => {

    if (isEditing) {

      setHistoryRows(editedRows);

      setEditingGroup(null);

    } else {

      setEditingGroup(index);

    }

  }}

  className="bg-sky-600 text-white px-4 py-2 rounded-xl"

>

    {

      isEditing

      ? "編集終了"

      : "編集"

    }

  </button>

  <button

    onClick={() => {

      const updatedRows =

        editedRows.filter(

          r => !group.rows.includes(r)

        );

      setEditedRows(updatedRows);

      setHistoryRows(updatedRows);

    }}

    className="bg-red-500 text-white px-4 py-2 rounded-xl"

  >

    削除

  </button>

</div>

        </div>

        {
  isOpen && (

    <div className="mt-6 space-y-2">

    <div className="grid grid-cols-[2fr_1.5fr_100px_100px_100px_2fr] gap-3 px-2 text-sm font-bold text-slate-500">

  <div>材料名</div>

  <div>型番・サイズ</div>

  <div className="text-right">
    単価
  </div>

  <div className="text-right">
    注文数
  </div>

  <div className="text-right">
    使用数
  </div>

  <div>
    備考
  </div>

</div>

      {group.rows.map((row, i) => (

        <div
          key={i}
          className="grid grid-cols-[2fr_1.5fr_100px_100px_100px_2fr] gap-3 border rounded-xl p-3 text-sm"
        >

          <input
            value={row.materialName || ""}
            disabled={!isEditing}
            onChange={(e) => {

              const updated = [...editedRows];

              const targetIndex =
                editedRows.indexOf(row);

              updated[targetIndex] = {

                ...updated[targetIndex],

                materialName:
                  e.target.value,

              };

              setEditedRows(updated);

            }}
            className="border rounded px-2 py-1"
          />

          <input
            value={row.size || ""}
            disabled={!isEditing}
            onChange={(e) => {

              const updated = [...editedRows];

              const targetIndex =
                editedRows.indexOf(row);

              updated[targetIndex] = {

                ...updated[targetIndex],

                size:
                  e.target.value,

              };

              setEditedRows(updated);

            }}
            className="border rounded px-2 py-1"
          />

          <input
            type="number"
            value={row.price || ""}
            disabled={!isEditing}
            onChange={(e) => {

              const updated = [...editedRows];

              const targetIndex =
                editedRows.indexOf(row);

              updated[targetIndex] = {

                ...updated[targetIndex],

                price:
                  e.target.value,

              };

              setEditedRows(updated);

            }}
            className="border rounded px-2 py-1 text-right"
          />

          <input
            type="number"
            value={row.quantity || ""}
            disabled={!isEditing}
            onChange={(e) => {

              const updated = [...editedRows];

              const targetIndex =
                editedRows.indexOf(row);

              updated[targetIndex] = {

                ...updated[targetIndex],

                quantity:
                  e.target.value,

              };

              setEditedRows(updated);

            }}
            className="border rounded px-2 py-1 text-right"
          />

          <input
            type="number"
            value={row.used || ""}
            disabled={!isEditing}
            onChange={(e) => {

              const updated = [...editedRows];

              const targetIndex =
                editedRows.indexOf(row);

              updated[targetIndex] = {

                ...updated[targetIndex],

                used:
                  e.target.value,

              };

              setEditedRows(updated);

            }}
            className="border rounded px-2 py-1 text-right"
          />

          <input
            value={row.note || ""}
            disabled={!isEditing}
            onChange={(e) => {

              const updated = [...editedRows];

              const targetIndex =
                editedRows.indexOf(row);

              updated[targetIndex] = {

                ...updated[targetIndex],

                note:
                  e.target.value,

              };

              setEditedRows(updated);

            }}
            className="border rounded px-2 py-1"
          />

        </div>

      ))}

    </div>

  )
}

      </div>

    );

  })}

      </div>

    </div>

  );

}