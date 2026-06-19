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

  const [editingIndex, setEditingIndex] =
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

    const displayRows =

  filteredRows.slice(

    0,

    100

  );

  const updateField = (
    index,
    field,
    value
  ) => {

    const updated =
      [...editedRows];

    updated[index][field] =
      value;

    setEditedRows(updated);

  };

  const saveRow = () => {

  const updatedRows =
    [...editedRows];

  setEditedRows(
    updatedRows
  );

  setHistoryRows(
    updatedRows
  );

  setEditingIndex(null);

};

  const cancelEdit = () => {

    setEditedRows(rows);

    setEditingIndex(null);

  };

  const deleteRow = (index) => {

  const updatedRows =
    editedRows.filter(
      (_, i) =>
        i !== index
    );

  setEditedRows(updatedRows);

  setHistoryRows(updatedRows);

};

  

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

      <div className="bg-white rounded-3xl shadow-sm overflow-hidden">

        <div className="grid grid-cols-[120px_120px_120px_2fr_2fr_80px_80px_100px_1.5fr_90px] bg-slate-100 text-xs font-bold border-b">

          <div className="p-2">
            日付
          </div>

          <div className="p-2">
            会社名
          </div>

          <div className="p-2">
            現場名
          </div>

          <div className="p-2">
            材料名
          </div>

          <div className="p-2">
            型番
          </div>

          <div className="p-2 text-right">
            注文数
          </div>

          <div className="p-2 text-right">
            使用数
          </div>

          <div className="p-2 text-right">
            単価
          </div>

          <div className="p-2">
            備考
          </div>

          <div className="p-2 text-center">
            操作
          </div>

        </div>

        {displayRows.map((row) => {

  const index =
    editedRows.indexOf(row);

    const isEditing =
  editingIndex === index;

          return (

            <div
              key={index}
              className="grid grid-cols-[120px_120px_120px_2fr_2fr_80px_80px_100px_1.5fr_90px] border-t"
            >

              <div className="p-2">

                <input
                  type="date"
                  value={row.orderDate}
                  readOnly={!isEditing}
                  onChange={(e) =>
                    updateField(
                      index,
                      "orderDate",
                      e.target.value
                    )
                  }
                  className="w-full border rounded px-2 py-1 text-xs"
                />

              </div>

<div className="p-2">

  <input
    value={row.companyName || ""}
    readOnly={!isEditing}
    onChange={(e) =>
      updateField(
        index,
        "companyName",
        e.target.value
      )
    }
    className="w-full border rounded px-2 py-1 text-xs"
  />

</div>

<div className="p-2">

  <input
    value={row.siteName || ""}
    readOnly={!isEditing}
    onChange={(e) =>
      updateField(
        index,
        "siteName",
        e.target.value
      )
    }
    className="w-full border rounded px-2 py-1 text-xs"
  />

</div>

              <div className="p-2">

                <input
                  value={row.materialName}
                  readOnly={!isEditing}
                  onChange={(e) =>
                    updateField(
                      index,
                      "materialName",
                      e.target.value
                    )
                  }
                  className="w-full border rounded px-2 py-1 text-xs"
                />

              </div>

              <div className="p-2">

                <input
                  value={row.size}
                  readOnly={!isEditing}
                  onChange={(e) =>
                    updateField(
                      index,
                      "size",
                      e.target.value
                    )
                  }
                  className="w-full border rounded px-2 py-1 text-xs"
                />

              </div>

              <div className="p-2">

                <input
                  value={row.quantity}
                  readOnly={!isEditing}
                  onChange={(e) =>
                    updateField(
                      index,
                      "quantity",
                      e.target.value
                    )
                  }
                  className="w-full border rounded px-2 py-1 text-xs text-right"
                />

              </div>

              <div className="p-2">

                <input
                  value={row.used}
                  readOnly={!isEditing}
                  onChange={(e) =>
                    updateField(
                      index,
                      "used",
                      e.target.value
                    )
                  }
                  className="w-full border rounded px-2 py-1 text-xs text-right"
                />

              </div>

              <div className="p-2">

                <input
                  value={row.price}
                  readOnly={!isEditing}
                  onChange={(e) =>
                    updateField(
                      index,
                      "price",
                      e.target.value
                    )
                  }
                  className="w-full border rounded px-2 py-1 text-xs text-right"
                />

              </div>

              <div className="p-2">

                <input
                  value={row.note}
                  readOnly={!isEditing}
                  onChange={(e) =>
                    updateField(
                      index,
                      "note",
                      e.target.value
                    )
                  }
                  className="w-full border rounded px-2 py-1 text-xs"
                />

              </div>

              <div className="p-2 flex items-center justify-center gap-1">

                {isEditing ? (

                  <>

                    <button
                      onClick={saveRow}
                      className="bg-emerald-600 text-white px-2 py-1 rounded text-[10px]"
                    >
                      保存
                    </button>

                    <button
                      onClick={cancelEdit}
                      className="bg-slate-400 text-white px-2 py-1 rounded text-[10px]"
                    >
                      取消
                    </button>

                  </>

                ) : (

                  <>

                    <button
                      onClick={() =>
                        setEditingIndex(index)
                      }
                      className="bg-sky-600 text-white px-2 py-1 rounded text-[10px]"
                    >
                      編集
                    </button>

                    <button
                      onClick={() =>
                        deleteRow(index)
                      }
                      className="bg-red-500 text-white px-2 py-1 rounded text-[10px]"
                    >
                      削除
                    </button>

                  </>

                )}

              </div>

            </div>

          );

        })}

      </div>

    </div>

  );

}