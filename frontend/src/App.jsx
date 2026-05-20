import {
  useState,
  useEffect,
} from "react";

import Papa from "papaparse";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


import InputPage from "./pages/InputPage";
import PricePage from "./pages/PricePage";
import StockPage from "./pages/StockPage";
import ClosingStockPage from "./pages/ClosingStockPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import HistoryPage from "./pages/HistoryPage";

export default function App() {

  // =========================
  // ログイン
  // =========================

  const [isLoggedIn, setIsLoggedIn] =
    useState(false);

  const [loginId, setLoginId] =
    useState(() => {

      return (
        localStorage.getItem(
          "loginId"
        ) || "admin"
      );

    });

  const [loginPassword, setLoginPassword] =
    useState(() => {

      return (
        localStorage.getItem(
          "loginPassword"
        ) || "1234"
      );

    });

  // =========================
  // タブ
  // =========================

  const [tab, setTab] =
    useState("入力");

  // =========================
  // 会社名
  // =========================

  const [companyName, setCompanyName] =
    useState("");

  const [companyList, setCompanyList] =
    useState(() => {

      const saved =
        localStorage.getItem(
          "companyList"
        );

      return saved
        ? JSON.parse(saved)
        : [];

    });

  // =========================
  // 日付
  // =========================

  const [orderDate, setOrderDate] =
    useState("");

  // =========================
  // rows
  // =========================

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

const [rows, setRows] =
  useState(() => {

    const savedRows =
      localStorage.getItem(
        "zaikoRows"
      );

    return savedRows
      ? JSON.parse(savedRows)
      : [];

  });

  const [historyRows, setHistoryRows] =
  useState(() => {

    const saved =
      localStorage.getItem(
        "historyRows"
      );

    return saved
      ? JSON.parse(saved)
      : [];

  });

useEffect(() => {

  localStorage.setItem(
    "historyRows",
    JSON.stringify(historyRows)
  );

}, [historyRows]);

  useEffect(() => {

  localStorage.setItem(

    "zaikoRows",

    JSON.stringify(rows)

  );

}, [rows]);

  // =========================
  // 保存
  // =========================

  useEffect(() => {

    localStorage.setItem(
      "rows",
      JSON.stringify(rows)
    );

  }, [rows]);

  useEffect(() => {

    localStorage.setItem(
      "companyList",
      JSON.stringify(companyList)
    );

  }, [companyList]);

  // =========================
  // CSV出力
  // =========================

  const exportCSV = () => {

    const csv =
      Papa.unparse(rows);

    const blob =
      new Blob(
        [csv],
        {
          type:
            "text/csv;charset=utf-8;",
        }
      );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      "zaiko-data.csv";

    link.click();

  };

  // =========================
  // CSV読込
  // =========================

  const importCSV = (event) => {

    const file =
      event.target.files[0];

    if (!file) return;

    Papa.parse(file, {

      header: true,

      complete: (result) => {

        const importedRows =
          result.data.filter(
            (row) =>
              row.materialName
          );

        setRows(importedRows);

        const companies = [

          ...new Set(

            importedRows

              .map(
                (row) =>
                  row.companyName
              )

              .filter(Boolean)

          ),

        ];

        setCompanyList(
          companies
        );

      },

    });

  };

  // =========================
  // Excel出力
  // =========================

  const exportExcel = () => {

    const worksheet =
      XLSX.utils.json_to_sheet(rows);

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "在庫データ"
    );

    const excelBuffer =
      XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

    const blob =
      new Blob(
        [excelBuffer],
        {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
        }
      );

    saveAs(
      blob,
      "zaiko-data.xlsx"
    );

  };

  // =========================
  // PDF出力
  // =========================

  const exportPDF = async () => {

    const doc =
      new jsPDF({
        orientation: "landscape",
      });

    const font =
      await fetch(fontFile)
        .then((res) =>
          res.arrayBuffer()
        );

    const binary =
      Array.from(
        new Uint8Array(font)
      )
        .map((byte) =>
          String.fromCharCode(byte)
        )
        .join("");

    const base64Font =
      btoa(binary);

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
      "NotoSansJP",
      "normal"
    );

    autoTable(doc, {

      head: [[
        "会社名",
        "日付",
        "材料名",
        "型番",
        "単価",
        "注文数",
        "使用数",
      ]],

      body: rows.map((row) => ([

        row.companyName || "",
        row.orderDate || "",
        row.materialName || "",
        row.size || "",
        row.price || "",
        row.quantity || "",
        row.used || "",

      ])),

    });

    doc.save(
      "zaiko-data.pdf"
    );

  };

  // =========================
  // ログイン前
  // =========================

  if (!isLoggedIn) {

    return (

      <LoginPage

        setIsLoggedIn={
          setIsLoggedIn
        }

        loginId={loginId}

        loginPassword={
          loginPassword
        }

      />

    );

  }

  // =========================
  // メイン
  // =========================

  return (

    <div className="min-h-screen bg-slate-100 p-3">

      <div className="w-full space-y-6">

        {/* タイトル */}

        <div className="bg-white rounded-3xl shadow-sm p-6 flex justify-between items-center">

          <div>

            <h1 className="text-4xl font-bold text-slate-800">
              在庫管理システム
            </h1>

            <p className="text-slate-500 mt-2">
              入力・単価比較・在庫管理・決算在庫
            </p>
            <div className="flex flex-wrap gap-2 mt-4">

  <button
    onClick={exportCSV}
    className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-semibold"
  >
    CSV
  </button>

  <label className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer">

    CSV読込

    <input
      type="file"
      accept=".csv"
      onChange={importCSV}
      className="hidden"
    />

  </label>

  <button
    onClick={exportExcel}
    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-semibold"
  >
    Excel
  </button>

  <button
    onClick={exportPDF}
    className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-xl text-sm font-semibold"
  >
    PDF
  </button>

</div>

          </div>

          <button
            onClick={() =>
              setIsLoggedIn(false)
            }
            className="bg-slate-700 hover:bg-slate-800 hover:bg-red-600 text-white px-6 py-3 rounded-2xl font-semibold"
          >
            ログアウト
          </button>

        </div>

        {/* タブ */}

        <div className="bg-white rounded-3xl shadow-sm p-4">

          <div className="flex flex-wrap gap-3">

            {[
              "入力",
              "入力履歴",
              "単価比較",
              "在庫管理",
              "決算在庫",
              "設定",
            ].map((item) => (

              <button
                key={item}
                onClick={() =>
                  setTab(item)
                }
                className={`px-6 py-3 rounded-2xl font-semibold transition

                ${tab === item

                  ? "bg-sky-600 text-white"

                  : "bg-slate-100 hover:bg-slate-200"

                }
                `}
              >
                {item}
              </button>

            ))}

          </div>

        </div>

        
        {/* 入力 */}

        {tab === "入力" && (

<InputPage

  rows={rows}
  setRows={setRows}

  historyRows={historyRows}
  setHistoryRows={setHistoryRows}

  companyName={companyName}
  setCompanyName={setCompanyName}

  companyList={companyList}
  setCompanyList={setCompanyList}

  orderDate={orderDate}
  setOrderDate={setOrderDate}
/>

        )}

        {/* 履歴 */}

        {tab === "入力履歴" && (

          <HistoryPage

            rows={historyRows}
            setRows={setRows}

            companyList={companyList}

          />

        )}

        {/* 単価比較 */}

        {tab === "単価比較" && (

          <PricePage

            rows={historyRows}

            companyName={companyName}
            setCompanyName={setCompanyName}

            companyList={companyList}

          />

        )}

        {/* 在庫管理 */}

        {tab === "在庫管理" && (

          <StockPage

            rows={historyRows}

            companyName={companyName}
            setCompanyName={setCompanyName}

            companyList={companyList}

          />

        )}

        {/* 決算在庫 */}

        {tab === "決算在庫" && (

          <ClosingStockPage

            rows={historyRows}

            companyName={companyName}
            setCompanyName={setCompanyName}

            companyList={companyList}

          />

        )}

        {/* 設定 */}

        {tab === "設定" && (

          <SettingsPage

            companyList={companyList}
            setCompanyList={setCompanyList}

            loginId={loginId}
            setLoginId={setLoginId}

            loginPassword={loginPassword}
            setLoginPassword={setLoginPassword}

          />

        )}

      </div>

    </div>

  );

}