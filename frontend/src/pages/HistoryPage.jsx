import { useEffect, useState } from "react";
import {
  deleteHistory,
  saveHistory,
  updateHistory,
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


  const [editedRows, setEditedRows] =
    useState(rows);

  useEffect(() => {

    setEditedRows(rows);

  }, [rows]);

  const duplicateHistoryRow = (row) => {
    const updated = [...editedRows];

    // 同じ伝票（同じ日付・会社・現場）の最後を探す
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

    const newRow = { ...row };

    delete newRow.id;
    delete newRow.created_at;

    newRow.quantity = "";
    newRow.used = "";

    updated.splice(lastIndex + 1, 0, newRow);

    console.log("複製後", updated);

    setEditedRows(updated);
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


  const filteredRows =

    editedRows.filter((row) => {

      const companyMatch =

        !selectedCompany ||

        selectedCompany === "全て" ||

        row.companyName === selectedCompany;

      const siteMatch =

        row.siteName

          ?.toLowerCase()

          .includes(

            selectedSite.toLowerCase()

          );

      const rowMonth =

        row.orderDate?.slice(0, 7);

      const monthMatch =

        rowMonth >= startMonth &&

        rowMonth <= endMonth;

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

        companyMatch &&

        siteMatch &&

        monthMatch &&

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

                  {isEditing ? (

                    <>
                      <input
                        type="date"
                        value={group.orderDate}
                        onChange={(e) => {
                          const updated = [...editedRows];

                          group.rows.forEach((r) => {
                            const idx = updated.indexOf(r);
                            updated[idx] = {
                              ...updated[idx],
                              orderDate: e.target.value,
                            };
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

                          group.rows.forEach((r) => {
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

                          group.rows.forEach((r) => {
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

                        const targetRows = editedRows.filter(
                          (r) =>
                            r.orderDate === group.orderDate &&
                            r.companyName === group.companyName &&
                            r.siteName === group.siteName
                        );

                        for (const row of targetRows) {
                          if (row.id) {
                            await updateHistory(row);
                          } else {
                            await saveHistory([row]);
                          }
                        }

                        await loadHistory();

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

                    {group.rows.map((row, i) => (

                      <div
                        key={i}
                        className="grid grid-cols-[40px_2fr_1.5fr_100px_100px_100px_2fr] gap-3 border rounded-xl p-3 text-sm"
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
                        </div>

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