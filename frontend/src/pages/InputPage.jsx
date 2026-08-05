import {
  useState
} from "react";


import { saveHistory } from "../services/historyService";

export default function InputPage({
  rows,
  setRows,
  historyRows,
  setHistoryRows,
  companyName,
  setCompanyName,
  companyList,
  setCompanyList,
  siteName,
  setSiteName,
  orderDate,
  setOrderDate,
}) {





  const EMPTY_ROW = {
    companyName: "",
    orderDate: "",
    materialName: "",
    size: "",
    price: "",
    quantity: "",
    used: "",
    note: "",
    isReturn: false,
  };

  const updateRow = (
    index,
    field,
    value
  ) => {

    const updatedRows = [...rows];

    while (updatedRows.length < 30) {
      updatedRows.push({
        ...EMPTY_ROW,
      });
    }

    updatedRows[index] = {
      ...updatedRows[index],
      companyName,
      siteName,
      orderDate,
      [field]: value,
    };

    if (
      field === "materialName"
      ||
      field === "size"
    ) {

      const material =

        field === "materialName"

          ? value

          : updatedRows[index].materialName;

      const size =

        field === "size"

          ? value

          : updatedRows[index].size;

      const lastRow =

        historyRows

          .slice()

          .reverse()

          .find(

            h =>

              h.companyName === companyName

              &&

              h.materialName === material

              &&

              h.size === size

          );



    }

    setRows(updatedRows);

  };

  const duplicateRow = (index) => {
    const updatedRows = [...rows];

    let lastFilledIndex = -1;

    for (let i = 0; i < updatedRows.length; i++) {
      if (
        updatedRows[i].materialName ||
        updatedRows[i].size ||
        updatedRows[i].price ||
        updatedRows[i].quantity ||
        updatedRows[i].used ||
        updatedRows[i].note
      ) {
        lastFilledIndex = i;
      }
    }

    const insertIndex = Math.min(lastFilledIndex + 1, 29);

    updatedRows[insertIndex] = {
      ...updatedRows[index],
      quantity: "",
      used: "",
    };

    setRows(updatedRows);
  };

  const materialSuggestions = [

    ...new Set(

      historyRows

        .filter(
          (row) =>

            row.companyName === companyName &&

            row.materialName &&

            ![
              "値引き",
              "送料",
              "運搬費",
              "諸経費",
              "処分費",
            ].includes(row.materialName)
        )

        .map(
          (row) =>
            row.materialName
        )

    )

  ];


  const inputRows = [...rows];

  while (inputRows.length < 30) {
    inputRows.push({
      ...EMPTY_ROW,
    });
  }

  return (

    <div className="bg-white rounded-3xl shadow-sm p-6">

      <div className="flex items-end gap-4 mb-6">

        <div>
          <label className="block text-sm font-medium mb-2">
            日付
          </label>

          <input
            type="date"
            value={orderDate}
            onChange={(e) =>
              setOrderDate(
                e.target.value
              )
            }
            className="w-[250px] border rounded-2xl px-4 py-3 bg-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            会社名
          </label>

          <select
            value={companyName}
            onChange={(e) =>
              setCompanyName(
                e.target.value
              )
            }
            className="w-[280px] border rounded-2xl px-4 py-3 bg-white"
          >

            <option value="">
              会社選択
            </option>

            {companyList.map((company) => (
              <option
                key={company.id}
                value={company.companyName}
              >
                {company.companyName}
              </option>
            ))}

          </select>
        </div>

        <div>

          <label className="block text-sm font-medium mb-2">
            現場名
          </label>

          <input
            list="site-list"
            type="text"
            value={siteName}
            onChange={(e) =>
              setSiteName(
                e.target.value
              )
            }
            className="w-[350px] border rounded-2xl px-4 py-3 bg-white"
          />

          <datalist id="site-list">

            <option value="会社在庫" />

          </datalist>

        </div>

        <button
          onClick={() => {
            setRows([
              ...rows,
              {
                ...EMPTY_ROW,
                companyName,
                orderDate,
              },
            ]);
          }}
          className="bg-slate-100 hover:bg-slate-200 px-4 py-3 min-w-[95px] whitespace-nowrap rounded-2xl font-semibold transition"
        >
          + 行追加
        </button>

        <button
          onClick={() => {

            const updatedRows = [...rows];

            let lastFilledIndex = -1;

            for (let i = 0; i < updatedRows.length; i++) {
              if (
                updatedRows[i].materialName ||
                updatedRows[i].size ||
                updatedRows[i].price ||
                updatedRows[i].quantity ||
                updatedRows[i].used ||
                updatedRows[i].note
              ) {
                lastFilledIndex = i;
              }
            }

            const insertIndex = Math.min(lastFilledIndex + 1, 29);

            updatedRows[insertIndex] = {
              ...EMPTY_ROW,
              companyName,
              siteName,
              orderDate,
              isReturn: true,
            };

            setRows(updatedRows);

          }}
          className="bg-orange-100 hover:bg-orange-200 px-4 py-3 min-w-[95px] whitespace-nowrap rounded-2xl font-semibold transition"
        >
          + 返品
        </button>

        <button
          onClick={async () => {
            const entryId = crypto.randomUUID();

            const savedRows =
              rows
                .filter((row) => row.materialName?.trim())
                .map((row) => ({
                  ...row,

                  entryId,

                  isReturn: row.isReturn ?? false,

                  price:
                    row.price === "" ? null : Number(row.price),

                  quantity:
                    row.quantity === ""
                      ? null
                      : row.isReturn
                        ? -Math.abs(Number(row.quantity))
                        : Number(row.quantity),

                  used:
                    row.used === ""
                      ? null
                      : row.isReturn
                        ? -Math.abs(Number(row.used))
                        : Number(row.used),
                }));

            const insertedRows =
              await saveHistory(savedRows);

            if (!insertedRows || insertedRows.length !== savedRows.length) {
              alert("保存に失敗しました。入力内容は残っています。");
              return;
            }

            setHistoryRows((prev) => [
              ...prev,
              ...insertedRows,
            ]);

            setRows(
              Array.from(
                { length: 30 },
                () => ({
                  ...EMPTY_ROW,
                })
              )
            );

            setCompanyName("");
            setSiteName("");
            setOrderDate("");

          }}
          className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-3 min-w-[95px] whitespace-nowrap rounded-2xl font-semibold transition"
        >
          入力完了
        </button>

      </div>

      <div className="rounded-2xl border bg-white overflow-hidden">

        <div className="grid grid-cols-[50px_4fr_3fr_1fr_1fr_0.8fr_0.8fr_2fr] bg-slate-100 text-sm font-semibold">

          <div className="p-2 text-center">
            📋 ❌
          </div>

          <div className="p-4">材料名</div>

          <div className="p-4">型番・サイズ</div>

          <div className="p-4">前回単価</div>

          <div className="p-4">単価</div>

          <div className="p-4">注文数</div>

          <div className="p-4">使用数</div>

          <div className="p-4">備考</div>

        </div>

        <div className="min-h-[1500px]">

          {inputRows.map((row, index) => {


            const sizeSuggestions = [

              ...new Set(

                historyRows

                  .filter(
                    (historyRow) =>

                      historyRow.companyName ===
                      companyName

                      &&

                      historyRow.materialName ===
                      row.materialName

                      &&

                      historyRow.size
                  )

                  .map(
                    (historyRow) =>
                      historyRow.size
                  )

              )

            ];

            return (

              <div
                key={index}
                className={`grid grid-cols-[50px_4fr_3fr_1fr_1fr_0.8fr_0.8fr_2fr] border-t ${row.isReturn ? "bg-red-100" : ""
                  }`}
              >
                <div className="p-1 flex items-center justify-center gap-1">

                  <button
                    onClick={() => duplicateRow(index)}
                    className="hover:scale-110"
                    title="この行を複製"
                  >
                    📋
                  </button>

                  <button
                    onClick={() => {
                      const updatedRows = [...rows];

                      updatedRows[index] = {
                        ...EMPTY_ROW,
                      };

                      setRows(updatedRows);
                    }}
                    className="text-red-600 hover:scale-110"
                    title="この行を削除"
                  >
                    ❌
                  </button>

                </div>


                <div className="p-1">

                  <input
                    list={`material-list-${index}`}
                    type="text"
                    value={row.materialName || ""}
                    onChange={(e) =>
                      updateRow(
                        index,
                        "materialName",
                        e.target.value
                      )
                    }
                    className="w-full border rounded-xl px-2 py-2"

                  />

                  {row.isReturn && (
                    <div className="text-red-600 text-xs font-bold mt-1">
                      【返品】
                    </div>
                  )}

                  {row.materialName?.length >= 2 && (

                    <datalist
                      id={`material-list-${index}`}
                    >

                      {materialSuggestions

                        .filter(

                          (name) =>

                            name.includes(
                              row.materialName
                            )
                        )

                        .map((name) => (

                          <option
                            key={name}
                            value={name}
                          />

                        ))}

                    </datalist>

                  )}

                </div>

                <div className="p-1">

                  <input
                    list={`size-list-${index}`}
                    type="text"
                    value={row.size || ""}
                    onChange={(e) =>
                      updateRow(
                        index,
                        "size",
                        e.target.value
                      )
                    }
                    className="w-full border rounded-xl px-2 py-2"
                  />

                  {row.materialName && (

                    <datalist
                      id={`size-list-${index}`}
                    >

                      {sizeSuggestions
                        .filter(
                          (size) =>
                            size.includes(
                              row.size || ""
                            )
                        )
                        .map((size) => (

                          <option
                            key={size}
                            value={size}
                          />

                        ))}

                    </datalist>

                  )}


                </div>

                <div className="p-1">

                  <div className="w-full border rounded-xl px-2 py-2 bg-slate-50">

                    {
                      historyRows
                        .filter(
                          (h) =>
                            h.companyName === companyName &&
                            h.materialName === row.materialName &&
                            h.size === row.size &&
                            ![
                              "値引き",
                              "送料",
                              "運搬費",
                              "諸経費",
                              "処分費",
                            ].includes(h.materialName)
                        )
                        .sort(
                          (a, b) =>
                            new Date(b.orderDate) - new Date(a.orderDate)
                        )[0]?.price || "-"
                    }

                  </div>

                </div>


                <div className="p-1">
                  <input
                    type="text"
                    value={row.price || ""}
                    onChange={(e) =>
                      updateRow(
                        index,
                        "price",
                        e.target.value
                      )
                    }
                    className="w-full border rounded-xl px-2 py-2"
                  />
                </div>

                <div className="p-1">
                  <input
                    type="number"
                    value={row.quantity || ""}
                    onChange={(e) =>
                      updateRow(
                        index,
                        "quantity",
                        e.target.value
                      )
                    }
                    className="w-full border rounded-xl px-2 py-2"

                  />
                </div>

                <div className="p-1">
                  <input
                    type="number"
                    value={row.used}
                    onChange={(e) =>
                      updateRow(
                        index,
                        "used",
                        e.target.value
                      )
                    }
                    className="w-full border rounded-xl px-2 py-2"
                  />
                </div>

                <div className="p-1">
                  <input
                    type="text"
                    value={row.note}
                    onChange={(e) =>
                      updateRow(
                        index,
                        "note",
                        e.target.value
                      )
                    }
                    className="w-full border rounded-xl px-2 py-2"
                  />
                </div>

              </div>

            );

          })}

        </div>

      </div>

    </div>

  );

}