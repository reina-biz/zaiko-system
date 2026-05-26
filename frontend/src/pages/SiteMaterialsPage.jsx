import { useState } from "react";

import * as XLSX from "xlsx";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
export default function SiteMaterialsPage({
  rows,
  companyList,
}) {
  
    const [selectedCompany,
  setSelectedCompany] =
    useState("全て");

const [searchSite,
  setSearchSite] =
    useState("");


    const siteSuggestions = [

  ...new Set(

    rows

      .filter(
        (row) =>

          row.siteName
      )

      .map(
        (row) =>
          row.siteName
      )

  )

];

const [startMonth,
  setStartMonth] =
    useState("");

const [endMonth,
  setEndMonth] =
    useState("");

    const [editingSite,
  setEditingSite] =
    useState(null);

const [selectedEditor,
  setSelectedEditor] =
    useState("");

const [companyStockItems,
  setCompanyStockItems] =
    useState([]);

const [newStockItem,
  setNewStockItem] =
    useState({
      materialName: "",
      size: "",
      stock: "",
      used: "",
      price: "",
    });

    const filteredRows =

  rows

  .filter((row) => {

    const companyMatch =

      selectedCompany === "全て"

      ||

      row.companyName ===
        selectedCompany;

    const siteMatch =

      row.siteName
        ?.includes(searchSite);

    const rowMonth =

  row.orderDate
    ?.slice(0, 7);

const dateMatch =

  (!startMonth ||

    rowMonth >=
      startMonth)

  &&

  (!endMonth ||

    rowMonth <=
      endMonth);

    return (
      companyMatch
      &&
      siteMatch
      &&
      dateMatch
    );

    })

  .sort(

  (a, b) =>

    new Date(a.orderDate)
    -
    new Date(b.orderDate)

)
  
const handleExcelExport = () => {

  const exportData = [];

Object.entries(groupedCompanies)

  .forEach(([company, sites]) => {

    // 会社名
    exportData.push({
      日付: company,
      材料名: "",
      型番: "",
      使用数: "",
      単価: "",
      合計: "",
    });

    Object.entries(sites)

      .forEach(([site, items]) => {

        // 現場名
        exportData.push({
          日付: `現場：${site}`,
          材料名: "",
          型番: "",
          使用数: "",
          単価: "",
          合計: "",
        });

        // データ
        items.forEach((row) => {

          exportData.push({

            日付: row.orderDate,
            材料名: row.materialName,
            型番: row.size,
            使用数: row.used,

            単価:
              Number(
                row.price || 0
              ).toLocaleString(),

            合計:
              (
                Number(row.price || 0)
                *
                Number(row.used || 0)
              ).toLocaleString(),

          });

        });

        // 現場合計
        

      });

  });

  exportData.push({

  日付: "",
  材料名: "",
  型番: "",
  使用数: "",
  単価: "総合計",

  合計:

    filteredRows

      .reduce(
        (sum, row) =>

          sum +

          (
            Number(row.price || 0)
            *
            Number(row.used || 0)
          ),

        0
      )

      .toLocaleString(),

});

  const worksheet =
    XLSX.utils.json_to_sheet(
      exportData
    );

  const workbook =
    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "各現場材料"
  );

  XLSX.writeFile(
    workbook,
    "各現場材料.xlsx"
  );

};

const handlePdfExport = async () => {

  const doc =
  new jsPDF({
    orientation: "portrait",
  });

  

const response =

  await fetch(
    "/fonts/NotoSansJP-Regular.ttf"
  );

const font =
  await response.arrayBuffer();

let binary = "";

const bytes =
  new Uint8Array(font);

const chunkSize = 8192;

for (

  let i = 0;

  i < bytes.length;

  i += chunkSize

) {

  binary +=

    String.fromCharCode(

      ...bytes.subarray(
        i,
        i + chunkSize
      )

    );

}

const base64Font =
  window.btoa(binary);

doc.addFileToVFS(

  "NotoSansJP-Regular.ttf",

  base64Font

);

doc.addFont(

  "NotoSansJP-Regular.ttf",

  "NotoSansJP",

  "normal"

);

doc.setFont(
  "NotoSansJP"
);

const grandTotal =

  filteredRows.reduce(

    (sum, row) =>

      sum +

      (
        Number(row.price || 0)
        *
        Number(row.used || 0)
      ),

    0
  );
  
  autoTable(doc, {
    styles: {

  font: "NotoSansJP",

  fontStyle: "normal",

  },

  headStyles: {

    font: "NotoSansJP",

    fontStyle: "normal",

    fillColor: [15, 23, 42],

    textColor: 255,

  },

  margin: {

left: 6,
right: 10,

  top: 10,

},

tableWidth: "wrap",



  columnStyles: {

 0: {
  cellWidth: 30,
},

1: {
  cellWidth: 54,
},

2: {
  cellWidth: 32,
},

3: {
  cellWidth: 24,
  halign: "right",
},

4: {
  cellWidth: 30,
  halign: "right",
},

5: {
  cellWidth: 28,
  halign: "right",
},

},

  bodyStyles: {

  font: "NotoSansJP",

},

  theme: "grid",

    head: [[
      "日付",
      "材料名",
      "型番",
      "使用数",
      "単価",
      "合計",
    ]],

    body: Object.entries(groupedCompanies)

  .flatMap(([company, sites]) => {

    const rows = [];

    // 会社タイトル
    rows.push([

      {
        content: company,
        colSpan: 6,
        styles: {

  font: "NotoSansJP",

  fontStyle: "normal",

  fillColor: [226, 232, 240],

  fontSize: 13,

},
      },

    ]);

    Object.entries(sites)

      .forEach(([site, items]) => {

        // 現場名
        rows.push([

          {
            content: `現場: ${site}`,
            colSpan: 6,
            styles: {

  font: "NotoSansJP",

  fontStyle: "normal",

  fillColor: [241, 245, 249],

},
          },

        ]);

        // データ
        items.forEach((row) => {

          rows.push([

            row.orderDate,

             row.materialName,

            row.size,

            row.used,

            `${Number(
              row.price || 0
            ).toLocaleString()}円`,

            `${(
  Number(row.price || 0)
  *
  Number(row.used || 0)
).toLocaleString()}円`,

            

          ]);

        });

      });

      

const companyTotal =

  Object.values(sites)

    .flat()

    .reduce(

      (sum, row) =>

        sum +

        (
          Number(row.price || 0)
          *
          Number(row.used || 0)
        ),

      0
    );

rows.push([

  {
    content:

      `会社合計 : ¥${companyTotal.toLocaleString()}`,

    colSpan: 6,

    styles: {

      font: "NotoSansJP",

      fontStyle: "normal",

      halign: "right",

      fillColor: [248, 250, 252],

      fontSize: 12,

    },

  },

]);

if (

  company ===

  Object.keys(groupedCompanies)

    .slice(-1)[0]

) {

  

  rows.push([

    {

      content:

        `総合計 : ¥${grandTotal.toLocaleString()}`,

      colSpan: 6,

      styles: {

        font: "NotoSansJP",

        fontStyle: "normal",

        halign: "right",

        fillColor: [226, 232, 240],

        fontSize: 14,

      },

    },

  ]);

}

    return rows;

  }),

  });





  doc.save(
    "各現場材料.pdf"
  );

};

const hasSearch =

  startMonth ||
  endMonth ||
  selectedCompany !== "全て" ||
  searchSite;

    const groupedCompanies =

  filteredRows.reduce(
    (acc, row) => {

      const company =
        row.companyName ||
        "未設定";

      const site =
        row.siteName ||
        "未設定";

      if (!acc[company]) {
        acc[company] = {};
      }

      if (!acc[company][site]) {
        acc[company][site] = [];
      }

      acc[company][site].push(row);

      return acc;

    },
    {}
  );

  return (

    <div className="space-y-3">

        <div className="bg-white rounded-3xl shadow-sm p-6">

 <div className="grid grid-cols-1 md:grid-cols-11 gap-1 items-end">

<div className="md:col-span-2">

  <div className="text-sm font-semibold mb-2">

    開始年月

  </div>

    <input
  type="month"
  value={startMonth}
  onChange={(e) =>
    setStartMonth(
      e.target.value
    )
  }
  
 className="
  w-full
  border
  rounded-2xl
  px-4
  py-3
"

  />

</div>

<div className="md:col-span-2">

  <div className="text-sm font-semibold mb-2">

    終了年月

  </div>

<input
  type="month"
  value={endMonth}
  onChange={(e) =>
    setEndMonth(
      e.target.value
    )
  }
  className="w-full border rounded-2xl px-4 py-3"
/>

</div>

<div className="md:col-span-3">

  <div className="text-sm font-semibold mb-2">

    会社名

  </div>

<select
      value={selectedCompany}
      onChange={(e) =>
        setSelectedCompany(
          e.target.value
        )
      }
      className="w-full border rounded-2xl px-4 py-3"
    >

      <option value="全て">
        全て
    
      </option>

      {(companyList || []).map((company) => (

        <option
          key={company}
          value={company}
        >
          {company}
        </option>

      ))}

    </select>

</div>


<div className="md:col-span-4">

  <div className="text-sm font-semibold mb-2">

    現場名

  </div>

  <div className="flex gap-2">

    <input
  list="site-search-list"
  type="text"
  placeholder="現場名検索"
      value={searchSite}
      onChange={(e) =>
        setSearchSite(
          e.target.value
        )
      }
      className="
        flex-1
        border
        rounded-2xl
        px-4
        py-3
      "
    />

    {searchSite?.length >= 2 && (

  <datalist id="site-search-list">

    {siteSuggestions

      .filter(
        (site) =>

          site.includes(
            searchSite
          )
      )

      .map((site) => (

        <option
          key={site}
          value={site}
        />

      ))}

  </datalist>

)}

    

  </div>

</div>


</div>

</div>

<div className="flex gap-2 mt-3 flex-wrap">

  <button
    className="
      bg-indigo-500
      text-white
      px-3
      py-2
      rounded-2xl
      font-semibold
      text-sm
    "
  >
    新規現場入力
  </button>

  <button
    className="
      bg-cyan-600
      text-white
      px-3
      py-2
      rounded-2xl
      font-semibold
      text-sm
    "
  >
    新規会社入力
  </button>

  <button
    onClick={handleExcelExport}
    className="
      bg-emerald-500
      text-white
      px-3
      py-2
      rounded-2xl
      font-semibold
      text-sm
    "
  >
    Excel
  </button>

  <button
    onClick={handlePdfExport}
    className="
      bg-rose-500
      text-white
      px-3
      py-2
      rounded-2xl
      font-semibold
      text-sm
    "
  >
    PDF
  </button>

</div>

<div className="bg-white rounded-3xl shadow-sm px-4 py-0.5">
  <div className="text-right text-2xl font-bold">

    総合計：

    {filteredRows

      .reduce(
        (sum, row) =>

          sum +

          (
            Number(row.price || 0)
            *
            Number(row.used || 0)
          ),

        0
      )

      .toLocaleString()}

    円

  </div>

</div>
{hasSearch &&
  Object.entries(
        groupedCompanies
      ).map(([company, sites]) => (

 <div
  key={company}
  className="bg-white rounded-3xl shadow-sm p-6 mb-6"
>

  <div className="text-2xl font-bold text-black mb-2 ml-1">

  {company}

</div>

  

{Object.entries(
  sites
).map(([site, items]) => (

      <div key={site} className="mb-3">

  

  <div className="mb-1">

   <div className="
  mb-1
  ml-1
  flex
  items-start
  justify-between
">

  <div className="
    text-base
    text-black
    font-semibold
  ">

    {startMonth
      ?.replace(
        /(\d{4})-(\d{2})/,
        "$1年$2月"
      )}

    {" ～ "}

    {endMonth
      ?.replace(
        /(\d{4})-(\d{2})/,
        "$1年$2月"
      )}

    {"　"}

    {site}

  </div>

  {editingSite === site ? (

    <div className="flex gap-2">

  <select
    value={selectedEditor}
    onChange={(e) =>
      setSelectedEditor(
        e.target.value
      )
    }
    className="
      border
      rounded-2xl
      px-3
      py-2
    "
  >

    <option value="">
      編集者
    </option>

  </select>

  <button
    onClick={() =>
      setEditingSite(null)
    }
    className="
      bg-emerald-500
      text-white
      px-4
      py-2
      rounded-2xl
    "
  >
    保存
  </button>

</div>

  ) : (

    <button
      onClick={() =>
        setEditingSite(site)
      }
      className="
        bg-amber-500
        text-white
        px-4
        py-2
        rounded-2xl
      "
    >
      編集
    </button>

  )}

</div>

 

    <div className="overflow-hidden rounded-2xl border">

            <div className="grid grid-cols-[140px_2fr_1.5fr_120px_120px_120px_140px] bg-slate-100 font-semibold text-sm">

              <div className="p-3">
               日付
              </div>

              <div className="p-3">
                材料名
              </div>

              <div className="p-3">
                型番
              </div>

              <div className="p-3 text-right">
              注文数
              </div>

              <div className="p-3 text-right">
                使用数
              </div>

              <div className="p-3 text-right">
                単価
              </div>

              <div className="p-3 text-right">
                合計
              </div>

            </div>

            {items.map(
              (row, index) => (

                <div
                  key={index}
                  className="grid grid-cols-[140px_2fr_1.5fr_120px_120px_120px_140px] border-t text-sm"
                >

                 <div className="p-3">
  {row.orderDate}
</div>

<div className="p-3">
  {row.materialName}
</div>

<div className="p-3">
  {row.size}
</div>

<div className="p-3 text-right">

  {row.orderCount || 0}

</div>

<div className="
  p-2
  flex
  flex-col
  items-end
">

  <input
    type="number"
    defaultValue={row.used}
    disabled={
      editingSite !== site
    }
    className="
      w-16
      border
      rounded-xl
      px-2
      py-1
      text-right
      bg-white
    "
  />

  <div className="
    text-xs
    text-slate-500
    mt-1
    text-right
    leading-tight
  ">

    2026/05/26 14:32

    <br />

    {selectedEditor || "-"}

  </div>

</div>

<div className="p-3 text-right">

  {Number(
    row.price || 0
  ).toLocaleString()} 円

</div>

<div className="p-3 text-right font-semibold">

  {(
    Number(row.price || 0)
    *
    Number(row.used || 0)
  ).toLocaleString()}

  円

</div>


                </div>

              )
            )}

<div className="
  bg-sky-100
  px-4
  py-3
  font-bold
  text-sky-800
  border-t
">

  ▼ 会社在庫から追加した材料

  </div>

 {editingSite === `${site}-stock` ? (

  <div className="
    flex
    justify-end
    gap-2
    p-3
    border-t
    bg-sky-50
  ">

    <button
      onClick={() =>
        setCompanyStockItems([
          ...companyStockItems,
          {
            materialName: "",
            size: "",
            stock: "",
            used: "",
            price: "",
          },
        ])
      }
      className="
        bg-sky-500
        text-white
        px-4
        py-2
        rounded-2xl
        text-sm
      "
    >
      ＋材料追加
    </button>

    <select
      value={selectedEditor}
      onChange={(e) =>
        setSelectedEditor(
          e.target.value
        )
      }
      className="
        border
        rounded-2xl
        px-3
        py-2
      "
    >

      <option value="">
        編集者
      </option>

    </select>

    <button
      onClick={() =>
        setEditingSite(null)
      }
      className="
        bg-emerald-500
        text-white
        px-4
        py-2
        rounded-2xl
      "
    >
      保存
    </button>

  </div>

) : (

  <div className="
    flex
    justify-end
    p-3
    border-t
    bg-sky-50
  ">

    <button
      onClick={() =>
        setEditingSite(
          `${site}-stock`
        )
      }
      className="
        bg-amber-500
        text-white
        px-4
        py-2
        rounded-2xl
      "
    >
      編集
    </button>

  </div>

)}



{companyStockItems.length === 0 ? (

  <div className="
    p-4
    text-sm
    text-slate-500
  ">

    まだ材料は追加されていません

  </div>

) : (

  companyStockItems.map(
    (item, index) => (

      <div
        key={index}
        className="
          grid
          grid-cols-[2fr_1.5fr_120px_120px_120px_140px_80px]
          gap-2
          p-4
          border-t
        "
      >

        <input
          placeholder="材料名"
          value={item.materialName}
          onChange={(e) => {

            const updated =
              [...companyStockItems];

            updated[index]
              .materialName =
                e.target.value;

            setCompanyStockItems(
              updated
            );

          }}
          className="
            border
            rounded-xl
            px-3
            py-2
          "
        />

        <input
          placeholder="型番"
          value={item.size}
          onChange={(e) => {

            const updated =
              [...companyStockItems];

            updated[index]
              .size =
                e.target.value;

            setCompanyStockItems(
              updated
            );

          }}
          className="
            border
            rounded-xl
            px-3
            py-2
          "
        />

        <input
          type="number"
          placeholder="在庫数"
          value={item.stock}
          onChange={(e) => {

            const updated =
              [...companyStockItems];

            updated[index]
              .stock =
                e.target.value;

            setCompanyStockItems(
              updated
            );

          }}
          className="
            border
            rounded-xl
            px-3
            py-2
            text-right
          "
        />

        <input
          type="number"
          placeholder="使用数"
          value={item.used}
          onChange={(e) => {

            const updated =
              [...companyStockItems];

            updated[index]
              .used =
                e.target.value;

            setCompanyStockItems(
              updated
            );

          }}
          className="
            border
            rounded-xl
            px-3
            py-2
            text-right
          "
        />

        <input
          type="number"
          placeholder="単価"
          value={item.price}
          onChange={(e) => {

            const updated =
              [...companyStockItems];

            updated[index]
              .price =
                e.target.value;

            setCompanyStockItems(
              updated
            );

          }}
          className="
            border
            rounded-xl
            px-3
            py-2
            text-right
          "
        />

        <div className="
  flex
  items-center
  justify-end
  px-3
  text-right
  font-semibold
">

  {(
    Number(item.price || 0)
    *
    Number(item.used || 0)
  ).toLocaleString()}

  円

</div>

<button
  onClick={() => {

    const updated =
      companyStockItems.filter(
        (_, i) =>
          i !== index
      );

    setCompanyStockItems(
      updated
    );

  }}
  className="
    bg-red-500
    text-white
    rounded-xl
    px-3
    py-2
    text-sm
  "
>

  削除

</button>

      </div>

    )

  )

)}



<div className="
  p-4
  flex
  justify-end
  font-bold
  text-base
  border-t
  bg-sky-50
">

  会社在庫追加合計：

  {companyStockItems

    .reduce(
      (sum, item) =>

        sum +

        (
          Number(item.price || 0)
          *
          Number(item.used || 0)
        ),

      0
    )

    .toLocaleString()}

  円

</div>

<div className="
  p-4
  flex
  justify-end
  font-bold
  text-lg
  border-t
">

  現場合計：

  {

  (

    items.reduce(
      (sum, row) =>

        sum +

        (
          Number(row.price || 0)
          *
          Number(row.used || 0)
        ),

      0
    )

    +

    companyStockItems.reduce(
      (sum, item) =>

        sum +

        (
          Number(item.price || 0)
          *
          Number(item.used || 0)
        ),

      0
    )

  ).toLocaleString()

}

  

</div>

    </div>

  </div>

          </div>

        ))}

        

      </div>

          ))
}

    </div>

  );

}