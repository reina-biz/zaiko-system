import { useState } from "react";

import * as XLSX from "xlsx";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function ClosingStockPage({

  rows,

  companyName,
  setCompanyName,

  companyList,

}) {

  // =========================
  // 年
  // =========================

  const currentYear =
    new Date().getFullYear();

  // =========================
  // 月選択
  // =========================

  const [startMonth, setStartMonth] =
    useState(`${currentYear}-01`);

  const [endMonth, setEndMonth] =
    useState(`${currentYear}-12`);

  // =========================
  // groupedRows
  // =========================

  const groupedRows = {};

  rows

    .filter((row) => {

      // 材料名なし除外
      if (!row.materialName) {

        return false;

      }

      // 会社絞り込み
      if (

        companyName &&

        row.companyName !==
          companyName

      ) {

        return false;

      }

      // 月変換
      const rowMonth =
        row.orderDate?.slice(0, 7);

      // 期間絞り込み
      if (

        rowMonth < startMonth ||

        rowMonth > endMonth

      ) {

        return false;

      }

      return true;

    })

    .forEach((row) => {

      // 材料名＋型番
      const key =

        `${row.materialName}_${row.size}`;

      // 初回
      if (!groupedRows[key]) {

        groupedRows[key] = {

          materialName:
            row.materialName,

          size:
            row.size,

          used: 0,

          stock: 0,

          latestPrice:
            row.price,

        };

      }

      // 使用数
      groupedRows[key].used +=

        Number(row.used || 0);

      // 在庫
      groupedRows[key].stock +=

        Number(row.quantity || 0)

        -

        Number(row.used || 0);

      // 単価
      groupedRows[key].latestPrice =
        row.price;

    });

const groupedCompanies =

  rows

    .filter((row) => {

      if (!row.materialName) {

        return false;

      }

      if (

        companyName &&

        row.companyName !==
          companyName

      ) {

        return false;

      }

      const rowMonth =
        row.orderDate?.slice(0, 7);

      return (

        rowMonth >= startMonth

        &&

        rowMonth <= endMonth

      );

    })

    .reduce((acc, row) => {

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

    }, {});

  // =========================
  // 合計
  // =========================

  const totalAmount =

    Object.values(groupedRows)

      .reduce((sum, item) => {

        const used20 =
          item.used * 0.2;

        const stock20 =
          item.stock * 0.2;

        const estimatedStock =
          used20 + stock20;

        const amount =

          estimatedStock *

          Number(
            item.latestPrice || 0
          );

        return sum + amount;

      }, 0);

  // =========================
  // Excel出力
  // =========================

  const exportExcel = () => {

    const excelData =

      Object.values(groupedRows)

        .map((item) => {

          const used20 =
            item.used * 0.2;

          const stock20 =
            item.stock * 0.2;

          const estimatedStock =
            used20 + stock20;

          const amount =

            estimatedStock *

            Number(
              item.latestPrice || 0
            );

          return {

            "材料名":
              item.materialName,

            "型番・サイズ":
              item.size,

            "最新単価":
              item.latestPrice,

            "使用20%":
              Math.round(used20),

            "在庫20%":
              Math.round(stock20),

            "推定決算在庫":
              Math.round(
                estimatedStock
              ),

            "決算在庫金額":
              Math.round(amount),

          };

        });

    const worksheet =

      XLSX.utils.json_to_sheet(
        excelData
      );

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(

      workbook,

      worksheet,

      "決算在庫"

    );

    XLSX.writeFile(

      workbook,

      "決算在庫.xlsx"

    );

  };

  // =========================
  // PDF出力
  // =========================

  const exportPDF = async () => {

    const doc =

      new jsPDF({
        orientation: "portrait",
      });

    // =====================
    // フォント読込
    // =====================

    const response =

      await fetch(
        "/fonts/NotoSansJP-Regular.ttf"
      );

    const font =
      await response.arrayBuffer();

    // =====================
    // バイナリ変換
    // =====================

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

    // =====================
    // フォント登録
    // =====================

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

    // =====================
    // タイトル
    // =====================

    doc.setFontSize(18);

doc.text(

  `決算在庫一覧  ${companyName || "全会社"}`,

  14,

  20

);

    // =====================
    // 表
    // =====================

    autoTable(doc, {

      startY: 30,

      styles: {

  font:
    "NotoSansJP",

  fontStyle:
    "normal",

  fontSize: 8,

  cellPadding: 2,

},

      headStyles: {

        font:
          "NotoSansJP",

        fontStyle:
          "normal",

      },

     margin: {

  left: 6,
  right: 6,

  top: 10,

},



     bodyStyles: {

  font:
    "NotoSansJP",

  fontStyle:
    "normal",

},

columnStyles: {

  0: {
    cellWidth: 62,
  },

  1: {
    cellWidth: 38,
  },

  2: {
    cellWidth: 32,
    halign: "right",
  },

  3: {
    cellWidth: 24,
    halign: "right",
  },

  4: {
    cellWidth: 38,
    halign: "right",
  },

},



theme: "grid",

head: [[

  "材料名",

  "型番サイズ",

  "最新単価",

  "在庫",

  "在庫金額",

]],

body:

  Object.entries(groupedCompanies)

    .flatMap(([company, sites]) => {

      const pdfRows = [];

      // 会社名
      pdfRows.push([

        {

          content: company,

          colSpan: 5,

          styles: {

            font: "NotoSansJP",

            fontStyle: "normal",

            fillColor: [226, 232, 240],

            fontSize: 13,

          },

        },

      ]);

      // 材料一覧
      Object.values(sites)

        .flat()

        .forEach((row) => {

          const stock =

            Math.round(

              (

                Number(row.used || 0)

                * 0.2

              )

              +

              (

                (

                  Number(row.quantity || 0)

                  -

                  Number(row.used || 0)

                )

                * 0.2

              )

            );

          const amount =

            stock *

            Number(row.price || 0);

          pdfRows.push([

            row.materialName,

            row.size,

            `¥${Number(
              row.price || 0
            ).toLocaleString()}`,

            stock.toLocaleString(),

            `¥${amount.toLocaleString()}`,

          ]);

        });

      return pdfRows;
      return pdfRows;

    }),

    });

    // =====================
    // 保存
    // =====================

    doc.save(
      "決算在庫.pdf"
    );

  };

  return (

    <div className="bg-white rounded-3xl shadow-sm p-6">

      {/* 上部 */}

      <div className="grid md:grid-cols-4 gap-4 mb-6 items-end">

        {/* 会社 */}

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

            className="w-full border rounded-2xl px-4 py-3 bg-white"

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

        {/* 開始年月 */}

        <div>

          <label className="block text-sm font-medium mb-2">

            開始年月

          </label>

          <input

            type="month"

            value={startMonth}

            onChange={(e) =>

              setStartMonth(
                e.target.value
              )

            }

            className="w-full border rounded-2xl px-4 py-3"

          />

        </div>

        {/* 終了年月 */}

        <div>

          <label className="block text-sm font-medium mb-2">

            終了年月

          </label>

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

     <div>

  <div className="text-sm font-medium mb-2">

    出力

  </div>

    <div className="flex gap-2">
  

    <button

      onClick={exportExcel}

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

      onClick={exportPDF}

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

      {/* タイトル */}

      <h2 className="text-2xl font-bold mb-6">

        決算在庫

      </h2>

      {/* 表 */}

      <div className="overflow-auto rounded-2xl border bg-white">

        <table className="w-full text-sm min-w-[1400px]">

          <thead className="bg-slate-100">

            <tr>

              <th className="p-4 text-left">
                材料名
              </th>

              <th className="p-4 text-left">
                型番・サイズ
              </th>

              <th className="p-4 text-right">
                最新単価
              </th>

              <th className="p-4 text-right">
                使用20%
              </th>

              <th className="p-4 text-right">
                在庫20%
              </th>

              <th className="p-4 text-right">
                推定決算在庫
              </th>

              <th className="p-4 text-right">
                決算在庫金額
              </th>

            </tr>

          </thead>

          <tbody>

            {Object.values(groupedRows)

              .map((item, index) => {

                const used20 =
                  item.used * 0.2;

                const stock20 =
                  item.stock * 0.2;

                const estimatedStock =
                  used20 + stock20;

                const amount =

                  estimatedStock *

                  Number(
                    item.latestPrice || 0
                  );

                return (

                  <tr

                    key={index}

                    className="
                      border-t
                      hover:bg-slate-50
                    "

                  >

                    <td className="p-4 whitespace-nowrap">

                      {item.materialName}

                    </td>

                    <td className="p-4 whitespace-nowrap">

                      {item.size}

                    </td>

                    <td className="p-4 text-right whitespace-nowrap">

                      ¥{Number(
                        item.latestPrice || 0
                      ).toLocaleString()}

                    </td>

                    <td className="p-4 text-right">

                      {Math.round(
                        used20
                      ).toLocaleString()}

                    </td>

                    <td className="p-4 text-right">

                      {Math.round(
                        stock20
                      ).toLocaleString()}

                    </td>

                    <td className="p-4 text-right font-semibold">

                      {Math.round(
                        estimatedStock
                      ).toLocaleString()}

                    </td>

                    <td className="p-4 text-right font-semibold whitespace-nowrap">

                      ¥{Math.round(
                        amount
                      ).toLocaleString()}

                    </td>

                  </tr>

                );

              })}

          </tbody>

          <tfoot className="bg-slate-100">

            <tr>

              <td
                colSpan="6"
                className="p-4 text-right font-bold"
              >

                決算在庫金額 合計

              </td>

              <td className="p-4 text-right font-bold whitespace-nowrap">

                ¥{Math.round(
                  totalAmount
                ).toLocaleString()}

              </td>

            </tr>

          </tfoot>

        </table>

      </div>

    </div>

  );

}