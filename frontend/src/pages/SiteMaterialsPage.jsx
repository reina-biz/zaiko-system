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

const [startMonth,
  setStartMonth] =
    useState("");

const [endMonth,
  setEndMonth] =
    useState("");

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
        exportData.push({

          日付: "",
          材料名: "",
          型番: "",
          使用数: "",
          単価: "現場合計",

          合計:
            items

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

      });

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

    fontStyle: "normal",

    cellPadding: 2,

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

    <button
      onClick={handleExcelExport}
      className="
        bg-emerald-500
        hover:bg-emerald-600
        text-white
        px-4
        py-3
        rounded-2xl
        font-semibold
        whitespace-nowrap
      "
    >
      Excel
    </button>

    <button
      onClick={handlePdfExport}
      className="
        bg-rose-500
        hover:bg-rose-600
        text-white
        px-4
        py-3
        rounded-2xl
        font-semibold
        whitespace-nowrap
      "
    >
      PDF
    </button>

  </div>

</div>


</div>

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

      {Object.entries(
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

  

  <div className="mb-4">

    <div className="mb-2 ml-1 flex items-center gap-3 text-sm text-black font-semibold">

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

    <div className="overflow-hidden rounded-2xl border">

            <div className="grid grid-cols-[140px_2fr_1.5fr_120px_120px_140px] bg-slate-100 font-semibold text-sm">

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
                  className="grid grid-cols-[140px_2fr_1.5fr_120px_120px_140px] border-t text-sm"
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
  {row.used}
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

            <div className="p-4 flex justify-end font-bold text-lg border-t">

  現場合計：

  {items

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

  </div>

          </div>

        ))}

      </div>

      ))}



    </div>

  );

}