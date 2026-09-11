import { useEffect, useState } from "react";
import {
  deleteHistory,
  saveHistory,
  updateHistory,
  getHistory,
} from "../services/historyService";

export default function HistoryPage({

  rows,
  setHistoryRows,
  loadHistory,
  companyList,

}) {

  const [selectedCompany, setSelectedCompany] =
    useState("");

  const [search, setSearch] =
    useState("");

  const currentYear = new Date().getFullYear();

  const [startMonth, setStartMonth] =
    useState("");

  const [endMonth, setEndMonth] =
    useState("");

  const [selectedSite, setSelectedSite] =
    useState("");


  const [openIndex, setOpenIndex] =

    useState(null);

  const [editingGroup, setEditingGroup] =
    useState(null);

  const [editingRows, setEditingRows] =
    useState([]);

  const [editingGroupRows, setEditingGroupRows] =
    useState([]);


  const [editedRows, setEditedRows] =
    useState(rows);

  const [groupIds, setGroupIds] =
    useState({});

  const [deletedIds, setDeletedIds] =
    useState([]);

  useEffect(() => {

    const newGroupIds = {};
    const groupKeyMap = {};

    const normalizedRows = rows.map((row) => {

      const originalKey =
        row.entryId ??
        `${row.orderDate}_${row.companyName}_${row.siteName}`;

      if (!groupKeyMap[originalKey]) {
        groupKeyMap[originalKey] =
          row.entryId
            ? `entry-${row.entryId}`
            : `group-${originalKey}`;
      }

      const groupId = groupKeyMap[originalKey];

      if (row.id) {
        newGroupIds[row.id] = groupId;
      }

      return {
        ...row,
        __groupId: groupId,
      };

    });

    setGroupIds(newGroupIds);
    setEditedRows(normalizedRows);

  }, [rows]);

  const duplicateHistoryRow = (row) => {
    const updated = [...editedRows];

    const targetRows = editingGroupRows.length > 0
      ? editingGroupRows
      : [row];

    const lastIndex = updated.reduce((last, r, index) => {
      if (targetRows.includes(r)) {
        return index;
      }
      return last;
    }, -1);

    const newRow = {
      ...row,
      __groupId: row.__groupId,
    };

    delete newRow.id;
    delete newRow.created_at;

    newRow.quantity = "";
    newRow.used = "";

    updated.splice(lastIndex + 1, 0, newRow);

    setEditedRows(updated);

    setEditingGroupRows((prev) => [
      ...prev,
      newRow,
    ]);
  };

  const addHistoryRow = (row) => {

    const updated = [...editedRows];

    const lastIndex = updated.reduce((last, r, index) => {

      if (
        r.orderDate === row.orderDate &&
        r.companyName === row.companyName &&
        r.siteName === row.siteName
      ) {
        return index;
      }

      return last;

    }, -1);

    const newRow = {
      entryId: row.entryId,
      __groupId: row.__groupId,

      orderDate: row.orderDate,
      companyName: row.companyName,
      siteName: row.siteName,

      materialName: "",
      size: "",
      price: "",
      quantity: "",
      used: "",
      note: "",

      isReturn: false,
    };



    updated.splice(lastIndex + 1, 0, newRow);

    setEditedRows(updated);

  };

  const deleteEditedRow = (row) => {

    // 保存済みなら削除IDを記録
    if (row.id) {
      setDeletedIds((prev) => [...prev, row.id]);
    }

    // 画面から消す
    const updated = editedRows.filter((r) => r !== row);

    setEditedRows(updated);

    setEditingGroupRows((prev) =>
      prev.filter((r) => r !== row)
    );

  };

  const siteList = [

    ...new Set(

      rows

        .filter(

          row =>

            !selectedCompany ||

            selectedCompany === "全て" ||

            row.companyName === selectedCompany

        )

        .map(row => row.siteName)

        .filter(Boolean)

    )

  ];

  const materialSuggestions = [

    ...new Set(

      rows
        .filter(
          (row) =>
            (!selectedCompany ||
              row.companyName === selectedCompany) &&
            row.materialName &&
            !row.isReturn
        )
        .map((row) => row.materialName)

    )

  ];


  const hasSearch =
    startMonth ||
    endMonth ||
    selectedCompany ||
    selectedSite ||
    search;

  const filteredRows = editedRows.filter((row) => {

    if (!hasSearch) {
      return false;
    }

    if (
      selectedCompany &&
      selectedCompany !== "全て" &&
      row.companyName !== selectedCompany
    ) {
      return false;
    }

    if (
      selectedSite &&
      !row.siteName?.toLowerCase().includes(selectedSite.toLowerCase())
    ) {
      return false;
    }

    if (startMonth) {
      const rowMonth = row.orderDate?.slice(0, 7);
      if (rowMonth < startMonth) {
        return false;
      }
    }

    if (endMonth) {
      const rowMonth = row.orderDate?.slice(0, 7);
      if (rowMonth > endMonth) {
        return false;
      }
    }

    if (
      search &&
      !(
        row.materialName?.toLowerCase().includes(search.toLowerCase()) ||
        row.size?.toLowerCase().includes(search.toLowerCase())
      )
    ) {
      return false;
    }

    return true;
  });


  const groupedRows = Object.values(

    filteredRows.reduce((acc, row) => {

      const key =
        row.__groupId ??
        row.entryId ??
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

  groupedRows.sort((a, b) => {
    const aTime = a.rows[0]?.created_at || "";
    const bTime = b.rows[0]?.created_at || "";
    return new Date(bTime) - new Date(aTime);
  });

  console.log("rows", rows);

  console.log("editedRows", editedRows);

  console.log("filteredRows", filteredRows);

  console.log("groupedRows", groupedRows);



  return (

    <div className="w-full space-y-6">

      <div className="bg-white rounded-3xl shadow-sm p-6">

        <div className="flex items-center justify-between">


          <div className="grid md:grid-cols-5 gap-4 w-full">

            <input
              type="month"
              value={startMonth}
              onChange={(e) => setStartMonth(e.target.value)}
              className="border rounded-xl px-4 py-2"
            />

            <input
              type="month"
              value={endMonth}
              onChange={(e) => setEndMonth(e.target.value)}
              className="border rounded-xl px-4 py-2"
            />

            <select
              value={selectedCompany}
              onChange={(e) => {
                setSelectedCompany(e.target.value);
                setSelectedSite("");
              }}
              className="border rounded-xl px-4 py-2"
            >
              <option value="">会社を選択</option>

              <option value="全て">全て</option>

              {companyList.map((company) => (
                <option
                  key={company.id}
                  value={company.companyName}
                >
                  {company.companyName}
                </option>
              ))}

            </select>

            <input
              type="text"
              placeholder="現場名検索"
              value={selectedSite}
              onChange={(e) => setSelectedSite(e.target.value)}
              className="border rounded-xl px-4 py-2"
            />

            <input
              type="text"
              placeholder="材料名検索"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded-xl px-4 py-2"
            />

          </div>


        </div>

      </div>

      <div className="space-y-4">

        {!hasSearch ? (

          <div className="bg-white rounded-3xl p-10 text-center text-slate-400">
            検索条件を入力してください
          </div>

        ) : (

          groupedRows.map((group, index) => {

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

                    {isEditing ? (

                      <>
                        <input
                          type="date"
                          value={group.orderDate}
                          onChange={(e) => {
                            const updated = [...editedRows];

                            editingGroupRows.forEach((r) => {
                              const idx = updated.indexOf(r);

                              if (idx !== -1) {
                                updated[idx] = {
                                  ...updated[idx],
                                  orderDate: e.target.value,
                                };
                              }
                            });

                            setEditedRows(updated);
                          }}
                          className="border rounded px-2 py-1 mb-2"
                        />

                        <input
                          type="text"
                          value={group.companyName}
                          onChange={(e) => {
                            const updated = [...editedRows];

                            editingGroupRows.forEach((r) => {
                              const idx = updated.indexOf(r);
                              updated[idx] = {
                                ...updated[idx],
                                companyName: e.target.value,
                              };
                            });

                            setEditedRows(updated);
                          }}
                          className="border rounded px-2 py-1 mb-2 w-full"
                        />

                        <input
                          type="text"
                          value={group.siteName}
                          onChange={(e) => {
                            const updated = [...editedRows];

                            editingGroupRows.forEach((r) => {
                              const idx = updated.indexOf(r);
                              updated[idx] = {
                                ...updated[idx],
                                siteName: e.target.value,
                              };
                            });

                            setEditedRows(updated);
                          }}
                          className="border rounded px-2 py-1 w-full"
                        />

                      </>

                    ) : (

                      <>
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
                      </>

                    )}

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

                      onClick={async () => {

                        if (isEditing) {

                          const targetRows = editedRows.filter((row) => {

                            // 編集開始時に存在していた行
                            if (row.id) {
                              return editingRows.some(
                                (original) => original.id === row.id
                              );
                            }

                            // 編集中に追加した新規行
                            if (row.entryId) {
                              return editingGroupRows.some(
                                (original) => original.entryId === row.entryId
                              );
                            }

                            return false;

                          });

                          const savedNewRows = [];

                          for (const row of targetRows) {

                            // 材料名が空の行は保存しない
                            if (!row.materialName?.trim()) {
                              continue;
                            }

                            const { __groupId, ...rowData } = row;

                            const saveData = {
                              ...rowData,
                              price:
                                row.price === ""
                                  ? null
                                  : Number(row.price),
                              quantity:
                                row.quantity === ""
                                  ? null
                                  : Number(row.quantity),
                              used:
                                row.used === ""
                                  ? null
                                  : Number(row.used),
                            };

                            if (row.id) {

                              // 既存行 → 更新
                              await updateHistory(saveData);

                            } else {

                              // 新しく追加した行 → 新規保存
                              const inserted = await saveHistory([
                                saveData,
                              ]);

                              if (inserted?.length > 0) {
                                savedNewRows.push(inserted[0]);
                              }

                            }
                          }

                          // 削除された行をDBから削除
                          if (deletedIds.length > 0) {
                            await deleteHistory(deletedIds);
                            setDeletedIds([]);
                          }

                          // DBから最新の履歴を取得
                          const latestRows = await getHistory();

                          // 画面の履歴も最新状態にする
                          setHistoryRows(latestRows);
                          setEditedRows(latestRows);

                          setEditingGroup(null);
                          setEditingRows([]);
                          setEditingGroupRows([]);

                        }

                        else {

                          setEditingGroup(index);
                          setEditingRows([...group.rows]);
                          setEditingGroupRows([...group.rows]);

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



                      onClick={async () => {
                        const ids = group.rows.map((r) => {
                          console.log("row =", r);
                          return r.id;
                        });

                        await deleteHistory(ids);

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

                      <div className="grid grid-cols-[40px_2fr_1.5fr_100px_100px_100px_2fr] gap-3 px-2 text-sm font-bold text-slate-500">

                        <div className="text-center">📋</div>

                        <div>材料名</div>
                        <div>型番・サイズ</div>
                        <div>単価</div>
                        <div>注文数</div>
                        <div>使用数</div>
                        <div>備考</div>

                      </div>

                      {[...group.rows]
                        .sort((a, b) => {
                          if (a.id && b.id) {
                            return a.id - b.id;
                          }
                          return 0;
                        })
                        .map((row, i) => {
                          const sizeSuggestions = [

                            ...new Set(

                              rows
                                .filter(
                                  (historyRow) =>

                                    (!selectedCompany ||
                                      historyRow.companyName === selectedCompany) &&

                                    historyRow.materialName === row.materialName &&

                                    historyRow.size &&

                                    !historyRow.isReturn
                                )

                                .map((historyRow) => historyRow.size)

                            )

                          ];

                          return (

                            <div
                              key={row.id ?? `new-${i}`}
                              className={`grid grid-cols-[40px_2fr_1.5fr_100px_100px_100px_2fr] gap-3 border rounded-xl p-3 text-sm ${row.isReturn ? "bg-red-100" : ""
                                }`}
                            >

                              <div className="flex items-center justify-center">
                                <button
                                  disabled={!isEditing}
                                  onClick={() => duplicateHistoryRow(row)}
                                  className="hover:scale-110 disabled:opacity-40"
                                  title="この行を複製"
                                >
                                  📋
                                </button>

                                <button
                                  disabled={!isEditing}
                                  onClick={() => addHistoryRow(row)}
                                  className="hover:scale-110 disabled:opacity-40"
                                  title="空白行を追加"
                                >
                                  ➕
                                </button>
                                <button
                                  disabled={!isEditing}
                                  onClick={() => deleteEditedRow(row)}
                                  className="hover:scale-110 disabled:opacity-40"
                                  title="この行を削除"
                                >
                                  🗑️
                                </button>
                              </div>

                              <div className="flex flex-col">

                                <input
                                  list={`history-material-list-${i}`}
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

                                {row.materialName?.length >= 2 && (
                                  <datalist id={`history-material-list-${i}`}>
                                    {materialSuggestions
                                      .filter((name) =>
                                        name.includes(row.materialName)
                                      )
                                      .map((name) => (
                                        <option
                                          key={name}
                                          value={name}
                                        />
                                      ))}
                                  </datalist>
                                )}

                                {row.isReturn && (
                                  <div className="text-red-600 text-xs font-bold mt-1">
                                    【返品】
                                  </div>
                                )}

                              </div>

                              <input
                                list={`history-size-list-${i}`}
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

                              {row.materialName && (
                                <datalist id={`history-size-list-${i}`}>
                                  {sizeSuggestions
                                    .filter((size) =>
                                      size.includes(row.size || "")
                                    )
                                    .map((size) => (
                                      <option
                                        key={size}
                                        value={size}
                                      />
                                    ))}
                                </datalist>
                              )}

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

                          );

                        })}

                    </div>

                  )
                }

              </div>

            );

          })

        )}

      </div>

    </div>

  );

}