import {
  useState
} from "react";

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

  if (lastRow) {

    updatedRows[index].price =

      lastRow.price;

  }

}

    setRows(updatedRows);

  };
const materialSuggestions = [

  ...new Set(

    historyRows

      .filter(
  (row) =>

    row.companyName ===
      companyName

    &&

    row.materialName
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
      onChange={(e) =>
        setCompanyName(
          e.target.value
        )
      }
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

    setHistoryRows([
      ...historyRows,
      ...savedRows
    ]);

    setRows(
      Array.from(
        { length: 30 },
        () => ({
          ...EMPTY_ROW
        })
      )
    );

   setCompanyName("");

   setSiteName("");

   setOrderDate("");

  

  }}
  className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-2xl font-semibold transition"
>
  入力完了

</button>

</div>

      <div className="rounded-2xl border bg-white overflow-hidden">

        <div className="grid grid-cols-[4fr_3fr_0.8fr_0.8fr_0.8fr_2fr] bg-slate-100 text-sm font-semibold">

          
          <div className="p-4">
            材料名
          </div>

          <div className="p-4">
            型番・サイズ
          </div>

          <div className="p-4">
           単価
          </div>

          <div className="p-4">
           注文数
          </div>

          <div className="p-4">
           使用数
          </div>

          <div className="p-4">
            備考
          </div>

        </div>

        <div className="min-h-[1500px]">

          {Array.from({ length: 30 }).map((_, index) => {

  const row =
    inputRows[index] || EMPTY_ROW;
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
              className="grid grid-cols-[4fr_3fr_0.8fr_0.8fr_0.8fr_2fr] border-t"
            >

              

              <div className="p-2">

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
    className="w-full border rounded-xl px-3 py-3"
  />

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

              <div className="p-2">

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
    className="w-full border rounded-xl px-3 py-3"
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
<div className="p-2">
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
    className="w-full border rounded-xl px-3 py-3"
  />
</div>

<div className="p-2">
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
    className="w-full border rounded-xl px-3 py-3"
  
  />
</div>

              <div className="p-2">
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
                  className="w-full border rounded-xl px-3 py-3"
                />
              </div>

              <div className="p-2">
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
                  className="w-full border rounded-xl px-3 py-3"
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