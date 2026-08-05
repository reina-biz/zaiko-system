import { useState } from "react";

import * as XLSX from "xlsx";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function SettlementAdjustPage({

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
    useState("");

  const [endMonth, setEndMonth] =
    useState("");

  const [targetAmount, setTargetAmount] =
    useState("");

  const excludedMaterials = [
    "値引き",
    "送料",
    "運搬費",
    "諸経費",
    "処分費",
  ];

  const [adjustedRows, setAdjustedRows] =
    useState(null);

  // =========================
  // groupedRows
  // =========================

  const groupedRows = {};

  rows

    .filter((row) => {

      // 材料名なし除外
      if (
        !row.materialName ||
        excludedMaterials.includes(row.materialName)
      ) {
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

        if (
          !row.materialName ||
          excludedMaterials.includes(row.materialName)
        ) {
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

          Math.round(
            used20 + stock20
          );

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

    const companyRows = {};

    rows

      .filter((row) => {

        if (
          !row.materialName ||
          excludedMaterials.includes(row.materialName)
        ) {
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

      .forEach((row) => {

        const key =

          `${row.materialName}_${row.size}`;

        if (!companyRows[key]) {

          companyRows[key] = {

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

        companyRows[key].used +=

          Number(row.used || 0);

        companyRows[key].stock +=

          Number(row.quantity || 0)

          -

          Number(row.used || 0);

        companyRows[key].latestPrice =
          row.price;

      });

    const excelData = [];

    Object.entries(groupedCompanies)

      .forEach(([company, sites]) => {

        const companyRows = {};

        Object.values(sites)

          .flat()

          .forEach((row) => {

            const key =

              `${row.materialName}_${row.size}`;

            if (!companyRows[key]) {

              companyRows[key] = {

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

            companyRows[key].used +=

              Number(row.used || 0);

            companyRows[key].stock +=

              Number(row.quantity || 0)

              -

              Number(row.used || 0);

            companyRows[key].latestPrice =
              row.price;

          });

        // 会社名行
        excelData.push({

          "材料名": company,

          "型番・サイズ": "",

          "最新単価": "",

          "在庫": "",

          "在庫金額": "",

        });

        // 材料一覧
        Object.values(companyRows)

          .forEach((item) => {

            const used20 =
              item.used * 0.2;

            const stock20 =
              item.stock * 0.2;

            const estimatedStock =

              Math.round(
                used20 + stock20
              );

            const amount =

              Math.round(

                estimatedStock *

                Number(
                  item.latestPrice || 0
                )

              );

            excelData.push({

              "材料名":
                item.materialName,

              "型番・サイズ":
                item.size,

              "最新単価":
                Number(
                  item.latestPrice || 0
                ),

              "在庫":
                estimatedStock,

              "在庫金額":
                amount,

            });

          });

        // 会社合計
        const companyTotal =

          Object.values(companyRows)

            .reduce((sum, item) => {

              const used20 =
                item.used * 0.2;

              const stock20 =
                item.stock * 0.2;

              const estimatedStock =

                Math.round(
                  used20 + stock20
                );

              const amount =

                estimatedStock *

                Number(
                  item.latestPrice || 0
                );

              return sum + amount;

            }, 0);

        excelData.push({

          "材料名":
            `会社合計 : ¥${companyTotal.toLocaleString()}`,

          "型番・サイズ": "",

          "最新単価": "",

          "在庫": "",

          "在庫金額": "",

        });

        // 空行
        excelData.push({

          "材料名": "",

          "型番・サイズ": "",

          "最新単価": "",

          "在庫": "",

          "在庫金額": "",

        });

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

      `${companyName || "全会社"}`

    );

    XLSX.writeFile(

      workbook,

      `決算在庫_${startMonth}-${endMonth}_${companyName || "全会社"}.xlsx`

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

      `決算在庫一覧  ${startMonth}〜${endMonth}  ${companyName || "全会社"}`,

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

            const companyRows = {};

            Object.values(sites)

              .flat()

              .forEach((row) => {

                const key =

                  `${row.materialName}_${row.size}`;

                if (!companyRows[key]) {

                  companyRows[key] = {

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

                companyRows[key].used +=

                  Number(row.used || 0);

                companyRows[key].stock +=

                  Number(row.quantity || 0)

                  -

                  Number(row.used || 0);

                companyRows[key].latestPrice =
                  row.price;

              });

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


            Object.values(companyRows)

              .forEach((item) => {

                const used20 =
                  item.used * 0.2;

                const stock20 =
                  item.stock * 0.2;

                const estimatedStock =

                  Math.round(
                    used20 + stock20
                  );

                const amount =

                  estimatedStock *

                  Number(
                    item.latestPrice || 0
                  );

                pdfRows.push([

                  item.materialName,

                  item.size,

                  `¥${Number(
                    item.latestPrice || 0
                  ).toLocaleString()}`,

                  estimatedStock.toLocaleString(),

                  `¥${Math.round(
                    amount
                  ).toLocaleString()}`,

                ]);

              });



            // 会社合計
            const companyTotal =

              Object.values(companyRows)

                .reduce((sum, item) => {

                  const used20 =
                    item.used * 0.2;

                  const stock20 =
                    item.stock * 0.2;

                  const estimatedStock =

                    Math.round(
                      used20 + stock20
                    );

                  const amount =

                    estimatedStock *

                    Number(
                      item.latestPrice || 0
                    );

                  return sum + amount;

                }, 0);



            pdfRows.push([

              {

                content:

                  `会社合計 : ¥${companyTotal.toLocaleString()}`,

                colSpan: 5,

                styles: {

                  font: "NotoSansJP",

                  fontStyle: "normal",

                  halign: "right",

                  fillColor: [241, 245, 249],

                  fontSize: 11,

                },

              },

            ]);


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

  const adjustInventory = () => {

    const baseRows = Object.values(groupedRows).map((item) => {

      const used20 = item.used * 0.2;

      const stock20 = item.stock * 0.2;

      const estimatedStock =
        Math.round(used20 + stock20);

      const amount =
        estimatedStock *
        Number(item.latestPrice || 0);

      return {
        ...item,
        estimatedStock,
        amount,
      };

    });

    const currentTotal =
      baseRows.reduce(
        (sum, item) => sum + item.amount,
        0
      );

    const ratio =
      Number(targetAmount) / currentTotal;

    const adjusted =
      baseRows.map((item) => {

        const newStock =
          Math.round(
            item.estimatedStock * ratio
          );

        return {

          ...item,

          estimatedStock: newStock,

          amount:
            newStock *
            Number(item.latestPrice || 0),

        };

      });

    setAdjustedRows(adjusted);

  };



  return (

    <div className="bg-white rounded-3xl shadow-sm p-6">

      {/* 上部 */}

      <div className="grid md:grid-cols-5 gap-4 mb-6 items-end">

        {/* 会社 */}



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
            目標金額
          </label>

          <input
            type="number"
            value={targetAmount}
            onChange={(e) =>
              setTargetAmount(e.target.value)
            }
            placeholder="例：5000000"
            className="w-full border rounded-2xl px-4 py-3"
          />

        </div>

        <div>

          <div>

            <label className="block text-sm font-medium mb-2">
              自動調整
            </label>

            <button
              onClick={adjustInventory}
              className="
      w-full
      bg-blue-600
      hover:bg-blue-700
      text-white
      px-4
      py-3
      rounded-2xl
      font-semibold
    "
            >
              自動調整
            </button>

          </div>

        </div>

      </div>


      {/* 表 */}

      {Object.entries(
        groupedCompanies
      ).map(([company, sites]) => {

        const companyRows = {};

        Object.values(sites)

          .flat()

          .forEach((row) => {

            const key =

              `${row.materialName}_${row.size}`;

            if (!companyRows[key]) {

              companyRows[key] = {

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

            companyRows[key].used +=

              Number(row.used || 0);

            companyRows[key].stock +=

              Number(row.quantity || 0)

              -

              Number(row.used || 0);

            companyRows[key].latestPrice =
              row.price;

          });

        return (

          <div
            key={company}
            className="
      bg-white
      rounded-3xl
      shadow-sm
      p-6
      mb-6
    "
          >

            {/* 会社名 */}

            <div className="text-2xl font-bold text-black mb-4 ml-1">

              {company}

            </div>

            {/* テーブル */}

            <div className="overflow-hidden rounded-2xl border">

              {/* ヘッダー */}

              <div className="grid grid-cols-[2fr_1fr_120px_120px_140px] bg-slate-100 font-semibold text-sm">

                <div className="p-3">
                  材料名
                </div>

                <div className="p-3">
                  型番・サイズ
                </div>

                <div className="p-3 text-right">
                  最新単価
                </div>

                <div className="p-3 text-right">
                  推定決算在庫
                </div>

                <div className="p-3 text-right">
                  決算在庫金額
                </div>

              </div>

              {/* データ */}

              {(adjustedRows ?? Object.values(companyRows))

                .map((item, index) => {


                  const used20 =
                    item.used * 0.2;

                  const stock20 =
                    item.stock * 0.2;

                  const estimatedStock =

                    Math.round(
                      used20 + stock20
                    );

                  const amount =

                    estimatedStock *

                    Number(
                      item.latestPrice || 0
                    );

                  return (

                    <div

                      key={index}

                      className="
          grid
          grid-cols-[2fr_1fr_120px_120px_140px]
          border-t
          text-sm
        "

                    >

                      <div className="p-3">

                        {item.materialName}

                      </div>

                      <div className="p-3">

                        {item.size}

                      </div>

                      <div className="p-3 text-right">

                        ¥{Number(
                          item.latestPrice || 0
                        ).toLocaleString()}

                      </div>

                      <div className="p-3 text-right font-semibold">

                        {(
                          item.estimatedStock ??
                          estimatedStock
                        ).toLocaleString()}

                      </div>

                      <div className="p-3 text-right font-semibold">

                        ¥{Math.round(
                          item.amount ?? amount
                        ).toLocaleString()}

                      </div>

                    </div>

                  );

                })}



              {/* 会社合計 */}

              <div className="p-4 flex justify-end font-bold text-lg border-t bg-slate-50">

                会社合計：

                ¥{

                  (adjustedRows ?? Object.values(companyRows)).reduce(
                    (sum, item) => {

                      const used20 =
                        item.used * 0.2;

                      const stock20 =
                        item.stock * 0.2;

                      const estimatedStock =

                        Math.round(
                          used20 + stock20
                        );

                      const amount =

                        estimatedStock *

                        Number(
                          item.latestPrice || 0
                        );

                      return sum + (item.amount ?? amount);

                    }, 0)

                    .toLocaleString()

                }

              </div>

            </div>

          </div>

        );

      })}

      <div className="bg-slate-100 rounded-2xl p-6 mt-6">

        <div className="text-xl font-bold">

          目標金額：
          ¥{Number(targetAmount || 0).toLocaleString()}

        </div>

        <div className="text-xl font-bold mt-2">

          調整後金額：
          ¥{
            adjustedRows
              ? adjustedRows
                .reduce(
                  (sum, item) =>
                    sum + item.amount,
                  0
                )
                .toLocaleString()
              : "0"
          }

        </div>

        <div className="text-xl font-bold mt-2 text-blue-600">

          差額：
          ¥{
            adjustedRows
              ? (
                adjustedRows.reduce(
                  (sum, item) =>
                    sum + item.amount,
                  0
                ) -
                Number(targetAmount || 0)
              ).toLocaleString()
              : "0"
          }

        </div>

      </div>

    </div>

  );

}