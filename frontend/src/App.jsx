import { getHistory } from "./services/historyService";

import {
  getUsers,
  saveUser,
} from "./services/userService";

import {
  getCompanies,
  saveCompany,
} from "./services/companyService.js";

import {
  useState,
  useEffect,
} from "react";

import { supabase } from "./lib/supabase";

import {
  getMaterialReports,
} from "./services/reportService";

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
import SiteMaterialsPage from "./pages/SiteMaterialsPage";
import SettlementAdjustPage from "./pages/SettlementAdjustPage";
import CreatePage from "./pages/CreatePage";

export default function App() {

  // =========================
  // ログイン
  // =========================

  const [isLoggedIn, setIsLoggedIn] =
    useState(false);



  const [userEmail, setUserEmail] =
    useState("");

  useEffect(() => {
    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        const email = session.user.email;

        console.log("Google Email:", email);

        setUserEmail(email);
        // setIsLoggedIn(true);
      }
      else {
        setUserEmail("");
        setIsLoggedIn(false);
      }
    }

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        const email = session.user.email;

        console.log("Google Email:", email);

        setUserEmail(email);
        // setIsLoggedIn(true);
      }
      else {
        setUserEmail("");
        setIsLoggedIn(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);



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

  const [siteName, setSiteName] =
    useState("");

  const [companyList, setCompanyList] = useState([]);


  useEffect(() => {
    async function loadCompanies() {
      const data = await getCompanies();

      if (data.length > 0) {
        setCompanyList(data);
      }
    }

    loadCompanies();
  }, []);

  const [userList, setUserList] = useState([]);

  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    async function loadUsers() {
      const data = await getUsers();

      if (data.length > 0) {
        setUserList(data);
      }
    }

    loadUsers();
  }, []);

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
    siteName: "",
    orderDate: "",
    materialName: "",
    size: "",
    price: "",
    quantity: "",
    used: "",
    note: "",
  };

  const [rows, setRows] =
    useState(

      Array.from(
        { length: 30 },
        () => ({
          ...EMPTY_ROW
        })
      )

    );

  const [historyRows, setHistoryRows] = useState([]);

  const [

    materialReports,

    setMaterialReports

  ] = useState([]);

  useEffect(() => {
    async function loadHistory() {
      const data = await getHistory();

      if (data.length > 0) {
        setHistoryRows(data);
      }
    }

    loadHistory();
  }, []);

  const loadMaterialReports = async () => {
    const data = await getMaterialReports();

    setMaterialReports(
      data.map((item) => ({
        id: item.id,
        ...item.report,
      }))
    );
  };

  useEffect(() => {
    loadMaterialReports();
  }, []);




  // =========================
  // 保存
  // =========================





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
        setIsLoggedIn={setIsLoggedIn}
      />

    );

  }

  // =========================
  // メイン
  // =========================

  return (

    <div className="min-h-screen bg-slate-100 p-3">

      <div className="w-full space-y-3">

        {/* タイトル */}

        <div className="bg-white rounded-2xl shadow-sm p-4 flex justify-between items-center">

          <div>

            <h1 className="text-4xl font-bold text-slate-800">
              在庫管理システム
            </h1>

            <p className="text-slate-500 mt-2">
              ※入力・入力履歴・設定この3ページは触らないでください！
            </p>


          </div>

          <button
            onClick={async () => {

              await supabase.auth.signOut();

              setIsLoggedIn(false);

            }}
            className="bg-slate-700 hover:bg-slate-800 hover:bg-red-600 text-white px-6 py-3 rounded-2xl font-semibold"
          >
            ログアウト
          </button>
        </div>

        {/* タブ */}

        <div className="bg-white rounded-2xl shadow-sm p-3">

          <div className="flex flex-wrap gap-3">

            {[
              "入力",
              "入力履歴",
              "各現場材料",
              "作成",
              "単価比較",
              "在庫管理",
              "決算在庫",
              "決算調整",
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

            siteName={siteName}
            setSiteName={setSiteName}

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
            setHistoryRows={setHistoryRows}

            companyList={companyList}

          />

        )}

        {/* 各現場材料 */}

        {tab === "各現場材料" && (

          <SiteMaterialsPage

            rows={historyRows}
            companyList={companyList}

          />

        )}


        {/* 作成 */}

        {tab === "作成" && (


          <CreatePage
            companyList={companyList}
            historyRows={historyRows}
            materialReports={materialReports}
            setMaterialReports={setMaterialReports}
            loadMaterialReports={loadMaterialReports}
            userList={userList}
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

        {/* 決算調整 */}

        {tab === "決算調整" && (

          <SettlementAdjustPage

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

            userList={userList}
            setUserList={setUserList}
          />

        )}




      </div>

    </div>

  );

}