import { useState } from "react";

export default function InputPage({

  rows,
  setRows,

  companyName,
  setCompanyName,

  companyList,
  setCompanyList,

  orderDate,
  setOrderDate,

}) {

 const [selectedRows, setSelectedRows] =
  useState([]);

  const [activeInput, setActiveInput] =
  useState(null);

 const EMPTY_ROW = {

  companyName: "",
  orderDate: "",

  materialName: "",
  size: "",

  price: "",

  quantity: "",
  used: "",

  note: "",

};

  const updateRow = (
  index,
  field,
  value
) => {

  const updatedRows =
    [...rows];

  const realIndex =
    Math.max(
      rows.length - 30 + index,
      0
    );

  updatedRows[realIndex] = {

    ...updatedRows[realIndex],

    companyName,
    orderDate,

    [field]: value,

  };

  setRows(updatedRows);

};

  

  const sizeSuggestions = [

    ...new Set(

      rows

        .filter(
          (row) =>

            row.companyName === companyName

            &&

            row.size
        )

        .map(
          (row) =>
            row.size
        )

    )

  ];

  const materialSuggestions = [

    ...new Set(

      rows

        .filter(
          (row) =>

            row.companyName === companyName

            &&

            row.materialName
        )

        .map(
          (row) =>
            row.materialName
        )

    )

  ];

  const inputRows =
    rows.slice(-30);

  return (

    <div className="bg-white rounded-3xl shadow-sm p-6">

      <div className="flex flex-wrap items-end gap-4 mb-6">

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

            onChange={(e) => {

              setCompanyName(
                e.target.value
              );

            }}

            className="w-[350px] border rounded-2xl px-4 py-3 bg-white"
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

        </div>

        <button
          onClick={() => {
if (

  companyName

  &&

  !companyList.includes(
    companyName
  )

) {

  setCompanyList([

    ...companyList,

    companyName,

  ]);

}
            setRows([

              ...rows,

             {
  ...EMPTY_ROW,

  companyName,
  orderDate,

}

            ]);

          }}
          className="bg-slate-100 hover:bg-slate-200 px-6 py-3 rounded-2xl font-semibold transition"
        >
          + 行追加
        </button>

        <button
          onClick={() => {

            const savedRows =
              rows.filter(
                (row) =>
                  row.materialName?.trim()
              );

            const emptyRows =
              Array.from(
                { length: 30 },
                () => ({
                  ...EMPTY_ROW
                })
              );

            setRows([
              ...savedRows,
              ...emptyRows,
            ]);

            setCompanyName("");

            setOrderDate("");

            setSelectedRows([]);

          }}
          className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-2xl font-semibold transition"
        >
          入力完了
        </button>

        <button
          onClick={() => {

            const updatedRows =
              rows.filter(
                (_, index) =>
                  !selectedRows.includes(index)
              );

            setRows(updatedRows);

            setSelectedRows([]);

          }}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-2xl font-semibold transition"
        >
          選択削除
        </button>

      </div>

      <div className="rounded-2xl border bg-white overflow-hidden">

        <div className="grid grid-cols-[80px_4fr_3fr_1.1fr_0.9fr_0.9fr_1.5fr] bg-slate-100 text-sm font-semibold">

          <div className="p-4 text-center">
            選択
          </div>

          <div className="p-4">
            材料名
          </div>

          <div className="p-4">
            型番・サイズ
          </div>

          <div className="p-4 text-right">
            単価
          </div>

          <div className="p-4 text-right">
            注文数
          </div>

          <div className="p-4 text-right">
            使用数
          </div>

          <div className="p-4">
            備考
          </div>

        </div>

        <div className="max-h-[700px] overflow-y-auto">

          {inputRows.map((row, index) => (

            <div
              key={index}
              className="grid grid-cols-[80px_4fr_3fr_1.1fr_0.9fr_0.9fr_1.5fr] border-t hover:bg-slate-50 transition"
            >

              <div className="p-2 flex items-center justify-center">

                <input
                  type="checkbox"
                  checked={selectedRows.includes(index)}
                  onChange={(e) => {

                    if (e.target.checked) {

                      setSelectedRows([
                        ...selectedRows,
                        index,
                      ]);

                    } else {

                      setSelectedRows(
                        selectedRows.filter(
                          (i) => i !== index
                        )
                      );

                    }

                  }}
                  className="w-5 h-5"
                />

              </div>

              <div className="p-2 relative">

                <input
                  type="text"
                  onFocus={() =>
  setActiveInput(
    `material-${index}`
  )
}

onBlur={() =>
  setTimeout(
    () => setActiveInput(null),
    150
  )
}



                  placeholder="材料名"
                  value={row.materialName}
                  onChange={(e) => {

                    updateRow(
                      index,
                      "materialName",
                      e.target.value
                    );

                  }}
                  className="w-full border rounded-xl px-3 py-3"
                />

                {activeInput ===
  `material-${index}`

  &&

  row.materialName && (

                  <div className="absolute z-50 bg-white border rounded-xl shadow-lg w-full mt-1 max-h-48 overflow-y-auto">

                    {materialSuggestions

                      .filter((name) =>

                        name
                          .toLowerCase()
                          .includes(
                            row.materialName.toLowerCase()
                          )

                      )

                      .map((name) => (

                        <button
                          key={name}
                          type="button"
                          onClick={() => {
                            setActiveInput(null);

                            updateRow(
                              index,
                              "materialName",
                              name
                            );

                          }}
                          className="block w-full text-left px-4 py-2 hover:bg-slate-100"
                        >
                          {name}
                        </button>

                      ))}

                  </div>

                )}

              </div>

              <div className="p-2 relative">

                <input
  type="text"

  onFocus={() =>
    setActiveInput(
      `size-${index}`
    )
  }

  onBlur={() =>
  setTimeout(
    () => setActiveInput(null),
    150
  )
}

  placeholder="型番"
                  
                  value={row.size}
                  onChange={(e) => {

                    updateRow(
                      index,
                      "size",
                      e.target.value
                    );

                  }}
                  className="w-full border rounded-xl px-3 py-3"
                />

                {activeInput ===
  `size-${index}`

  &&

  row.size && (

                  <div className="absolute z-50 bg-white border rounded-xl shadow-lg w-full mt-1 max-h-48 overflow-y-auto">

                    {sizeSuggestions

                      .filter((size) =>

                        size
                          .toLowerCase()
                          .includes(
                            row.size.toLowerCase()
                          )

                      )

                      .map((size) => (

                        <button
                          key={size}
                          type="button"
                          onClick={() => {
                            setActiveInput(null);

                            updateRow(
                              index,
                              "size",
                              size
                            );

                          }}
                          className="block w-full text-left px-4 py-2 hover:bg-slate-100"
                        >
                          {size}
                        </button>

                      ))}

                  </div>

                )}

              </div>

              <div className="p-2">

                <input
                  type="text"
                  placeholder="0"
                  value={
                    row.price
                      ? Number(
                          row.price
                        ).toLocaleString()
                      : ""
                  }
                  onChange={(e) => {

                    updateRow(
                      index,
                      "price",
                      e.target.value.replace(
                        /,/g,
                        ""
                      )
                    );

                  }}
                  className="w-full border rounded-xl px-3 py-3 text-right"
                />

              </div>

              <div className="p-2">

                <input
                  type="number"
                  placeholder="0"
                  value={row.quantity}
                  onChange={(e) => {

                    updateRow(
                      index,
                      "quantity",
                      e.target.value
                    );

                  }}
                  className="w-full border rounded-xl px-3 py-3 text-right"
                />

              </div>

              <div className="p-2">

                <input
                  type="number"
                  placeholder="0"
                  value={row.used}
                  onChange={(e) => {

                    updateRow(
                      index,
                      "used",
                      e.target.value
                    );

                  }}
                  className="w-full border rounded-xl px-3 py-3 text-right"
                />

              </div>

              <div className="p-2">

                <input
                  type="text"
                  placeholder="備考"
                  value={row.note}
                  onChange={(e) => {

                    updateRow(
                      index,
                      "note",
                      e.target.value
                    );

                  }}
                  className="w-full border rounded-xl px-3 py-3"
                />

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>

  );

}