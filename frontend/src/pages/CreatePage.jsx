import {
  useState
} from "react";

import * as XLSX from "xlsx";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import InputPage from "./InputPage";

export default function CreatePage({

  companyList,
  historyRows,

  materialReports,
  setMaterialReports,

  userList

}) {

  const [page, setPage] =
    useState("");

  const [
  startMonth,
  setStartMonth
] = useState("");

const [
  endMonth,
  setEndMonth
] = useState("");

const [
  reportDate,
  setReportDate
] = useState("");

  const [
    siteName,
    setSiteName
  ] = useState("");

  const [

    userName,

    setUserName

  ] = useState("");

  const [

    selectedReport,

    setSelectedReport

  ] = useState(null);

  const [
  selectedUser,
  setSelectedUser
] = useState("");

const [

  searchSiteName,

  setSearchSiteName

] = useState("");


   const [
   editIndex,
   setEditIndex
  ] = useState(null);



  const EMPTY_ROW = {

    materialName: "",
    size: "",
    quantity: "",
    price: "",
    note: "",

  };

  const [

    companySections,

    setCompanySections

  ] = useState([

    {

      companyName: "",

      rows: Array.from(
        { length: 10 },
        () => ({
          ...EMPTY_ROW
        })
      )

    }

  ]);



  const updateRow = (

    sectionIndex,
    rowIndex,
    field,
    value

  ) => {

    const updatedSections = [

      ...companySections

    ];

    updatedSections[sectionIndex]

      .rows[rowIndex][field] = value;

    const currentRow =

      updatedSections[sectionIndex]

        .rows[rowIndex];

    const matchedRow =

      historyRows

        .slice()

        .reverse()

        .find(

          (row) =>

            row.materialName ===
            currentRow.materialName

            &&

            row.size ===
            currentRow.size

        );

    if (matchedRow) {

      currentRow.price =
        matchedRow.price || "";

    }

    setCompanySections(
      updatedSections
    );

  };

const getMaterialSuggestions = (

  companyName

) => [

  ...new Set(

    historyRows

      .filter(

  (history) =>

    history.companyName

      ?.trim()

      ===

    companyName

      ?.trim()

    &&

    history.materialName

)

      .map(

        (history) =>

          history.materialName

      )

  )

];

const exportExcel = (

  report

) => {

  const data = [];

  let grandTotal = 0;

  report.sections.forEach(

    (section) => {

      const companyTotal =

  section.rows.reduce(

    (total, row) =>

      total +

      (

        Number(

          row.quantity || 0

        )

        *

        Number(

          row.price || 0

        )

      ),

    0

  );


  grandTotal +=

  companyTotal;

data.push([

  section.companyName

]);

data.push([

  "材料名",

  "型番",

  "数量",

  "単価",

  "合計"

]);

section.rows.forEach(

  (row) => {

    data.push([

      row.materialName,

      row.size,

      row.quantity,

      row.price,

      Number(

        row.quantity || 0

      )

      *

      Number(

        row.price || 0

      )

    ]);

  }

);

data.push([]);

data.push([

  "会社合計",

  "",

  "",

  "",

  companyTotal

]);

data.push([]);
    }

  );

  data.push([]);

data.push([

  "総合計",

  "",

  "",

  "",

  grandTotal

]);

  const ws =

    XLSX.utils

      .aoa_to_sheet(

        data

      );

  const wb =

    XLSX.utils

      .book_new();

  XLSX.utils

    .book_append_sheet(

      wb,

      ws,

      "現場材料"

    );

  XLSX.writeFile(

    wb,

    `${report.siteName}.xlsx`

  );

};



const exportPDF = async (

  report

) => {

  const doc =

    new jsPDF({

      orientation:

        "portrait",

    });



  const response =

    await fetch(

      "/fonts/NotoSansJP-Regular.ttf"

    );



  const font =

    await response

      .arrayBuffer();



  let binary = "";



  const bytes =

    new Uint8Array(

      font

    );



  const chunkSize =

    8192;



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

    window.btoa(

      binary

    );



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

doc.setFontSize(18);

doc.text(

  report.siteName,

  20,

  20

);


  let grandTotal = 0;

const body = [];

report.sections.forEach(

  (section) => {

    const companyTotal =

      section.rows.reduce(

        (sum, row) =>

          sum +

          (

            Number(

              row.quantity || 0

            )

            *

            Number(

              row.price || 0

            )

          ),

        0

      );

    grandTotal +=

      companyTotal;



    body.push([

  {

    content:

      section.companyName,

    colSpan: 5,

    styles: {

      font:

        "NotoSansJP",

      fontStyle:

        "normal",

      fillColor:

        [255,255,255],

      textColor:

        [0,0,0],

      fontSize:

        13,

    },

  },

]);



    section.rows.forEach(

      (row) => {

        body.push([

          row.materialName,

          row.size,

          row.quantity,

          `${Number(

            row.price || 0

          ).toLocaleString()}円`,

          `${(

            Number(

              row.quantity || 0

            )

            *

            Number(

              row.price || 0

            )

          ).toLocaleString()}円`

        ]);

      }

    );



    body.push([

      {

        content:

          `会社合計 : ¥${companyTotal.toLocaleString()}`,

        colSpan: 5,

        styles: {

          halign:

            "right",

        },

      },

    ]);

  }

);



body.push([

  {

    content:

      `総合計 : ¥${grandTotal.toLocaleString()}`,

    colSpan: 5,

    styles: {

      halign:

        "right",

      fontSize:

        14,

    },

  },

]);



autoTable(

  doc,

  {

    startY: 30,

    styles: {

  font:

    "NotoSansJP",

  fontStyle:

    "normal",

},

    headStyles: {

  font:

    "NotoSansJP",

  fillColor:

    [255,255,255],

  textColor:

    [0,0,0],

},

bodyStyles: {

  font:

    "NotoSansJP",

  fontStyle:

    "normal",

},


    head: [[

      "材料名",

      "型番",

      "数量",

      "単価",

      "合計",

    ]],



    body,

didParseCell:(data)=>{

  data.cell.styles.font=

    "NotoSansJP";

  data.cell.styles.fontStyle=

    "normal";

},

    theme:

      "grid",

      

  }

);


  doc.save(

    `${report.siteName}.pdf`

  );

};

  return (

    <div className="
      bg-white
      rounded-3xl
      shadow-sm
      p-6
      space-y-6
    ">

      <h2 className="
      text-2xl
      font-bold
      ">

        {page || "作成"}

      </h2>

      {/* ボタン */}

      <div className="
        flex
        flex-wrap
        md:grid-cols-4
        gap-2
      ">

        <button
          onClick={() =>
            setPage("現場材料作成")
          }
          className="
            bg-emerald-500
           text-white
           py-2
           w-28
           rounded-2xl
           font-semibold
          text-sm
          "
        >
          現場材料作成
        </button>

        <button
          onClick={() =>
            setPage("現場材料一覧")
          }
          className="
         bg-red-500
         text-white
         py-2
         w-28
         rounded-2xl
         font-semibold
         text-sm
         "
        >
          現場材料一覧
        </button>

      </div>

      {/* 表示切替 */}



      {page === "現場報告書作成" && (

        <div className="
          border
          rounded-2xl
          p-6
        ">

          現場報告書作成ページ

        </div>

      )}

      {page === "現場報告書一覧" && (

        <div className="
          border
          rounded-2xl
          p-6
        ">

          現場報告書一覧ページ

        </div>

      )}

      {page === "現場材料作成" && (

        <div className="
  bg-white
  rounded-3xl
  border
  p-6
  space-y-6
">

          <div className="
    flex
    flex-wrap
    gap-4
  ">

            <input
              type="date"

              value={reportDate}

              onChange={(e) =>
                setReportDate(
                  e.target.value
                )
              }

              className="
    border
    rounded-2xl
    px-4
    py-3
  "
            />





            <input
              type="text"

              placeholder="現場名"

              value={siteName}

              onChange={(e) =>
                setSiteName(
                  e.target.value
                )
              }

              className="
    border
    rounded-2xl
    px-4
    py-3
    w-[300px]
  "
            />

            <select

  value={userName}

  onChange={(e) =>
    setUserName(
      e.target.value
    )
  }

  className="
    border
    rounded-2xl
    px-4
    py-3
    w-[200px]
  "
>

  <option value="">
    入力者選択
  </option>

  {userList.map((user) => (

    <option
      key={user}
      value={user}
    >

      {user}

    </option>

  ))}

</select>


            <button
              onClick={() =>

                setCompanySections([

                  ...companySections,

                  {

                    companyName: "",

                    rows: Array.from(
                      { length: 10 },
                      () => ({
                        ...EMPTY_ROW
                      })
                    )

                  }

                ])

              }
              className="
    bg-indigo-500
    text-white
    px-5
    py-3
    rounded-2xl
    font-semibold
  "
            >

              会社追加

            </button>

            <button

              onClick={() => {

                const report = {

                  createdAt:
                    new Date()
                      .toISOString(),

                  reportDate,
                  siteName,
                  userName,

                  sections:

                    companySections.map(

                      (section) => ({

                        ...section,

                        rows:

                          section.rows.filter(

                            (row) =>

                              row.materialName ||

                              row.size ||

                              row.quantity ||

                              row.price ||

                              row.note

                          )

                      })

                    )

                };

                if (editIndex !== null) {

  const updated = [
    ...materialReports
  ];

  updated[editIndex] =
    report;

  setMaterialReports(
    updated
  );

} else {

  setMaterialReports([
    ...materialReports,
    report
  ]);

}

                // リセット

                setCompanySections([

                  {

                    companyName: "",

                    rows: Array.from(
                      { length: 10 },
                      () => ({
                        ...EMPTY_ROW
                      })
                    )

                  }

                ]);

                setReportDate("");

                setSiteName("");

                setUserName("");

                setEditIndex(null);

              }}

              className="
    bg-emerald-500
    text-white
    px-5
    py-3
    rounded-2xl
    font-semibold
  "
            >

              保存

            </button>



          </div>
          {companySections.map(

            (section, sectionIndex) => (

              <div
                key={sectionIndex}
                className="
    border
    rounded-3xl
    p-4
    space-y-4
  "
              >
                <div className="
  flex
  items-center
  gap-4
">

                  <div className="
    text-xl
    font-bold
  ">

                    会社 {sectionIndex + 1}

                  </div>

                  <select

                    value={section.companyName}

                    onChange={(e) => {

                      const updatedSections = [

                        ...companySections

                      ];

                      updatedSections[
                        sectionIndex
                      ].companyName =
                        e.target.value;

                      setCompanySections(
                        updatedSections
                      );

                    }}

                    className="
    border
    rounded-2xl
    px-4
    py-3
    w-[300px]
  "
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

                  <button

                    onClick={() => {

                      const updatedSections = [

                        ...companySections

                      ];

                      updatedSections[
                        sectionIndex
                      ].rows.push({

                        ...EMPTY_ROW

                      });

                      setCompanySections(
                        updatedSections
                      );

                    }}

                    className="
    bg-sky-500
    text-white
    px-5
    py-3
    rounded-2xl
    font-semibold
  "
                  >

                    行追加

                  </button>

                </div>

                <div className="
    overflow-hidden
    rounded-2xl
    border
  ">

                  <div className="
      grid
      grid-cols-[2fr_2fr_1fr_1fr_1fr_2fr]
      bg-slate-100
      font-semibold
      text-sm
    ">

                    <div className="p-3">
                      材料名
                    </div>

                    <div className="p-3">
                      型番
                    </div>

                    <div className="p-3 text-right">
                      数量
                    </div>

                    <div className="p-3 text-right">
                      単価
                    </div>

                    <div className="p-3 text-right">
                      合計
                    </div>

                    <div className="p-3">
                      備考
                    </div>

                  </div>



                  {section.rows.map(
                    (row, index) => (

                      <div
                        key={index}
                        className="
            grid
            grid-cols-[2fr_2fr_1fr_1fr_1fr_2fr]
            border-t
          "
                      >

                        <div className="p-2">

                          <input
                            list={`material-list-${sectionIndex}-${index}`}
                            type="text"

                            value={row.materialName}

                            onChange={(e) =>

                              updateRow(
                                sectionIndex,
                                index,
                                "materialName",
                                e.target.value
                              )

                            }

                            className="
    w-full
    border
    rounded-xl
    px-3
    py-2
  "
                          />

                          <datalist
  id={`material-list-${sectionIndex}-${index}`}
>

                            {getMaterialSuggestions(

  section.companyName

).map(

  (name) => (

    <option

      key={name}

      value={name}

    />

  )

)}

                          </datalist>

                        </div>

                        <div className="p-2">

                          <input
  list={`size-list-${sectionIndex}-${index}`}
                            type="text"

                            value={row.size}

                            onChange={(e) =>

                              updateRow(
                                sectionIndex,
                                index,
                                "size",
                                e.target.value
                              )

                            }

                            className="
    w-full
    border
    rounded-xl
    px-3
    py-2
  "
                          />

                          <datalist
                            id={`size-list-${sectionIndex}-${index}`}
                          >

                            {[

  ...new Set(

    historyRows

      .filter(

        (history) =>

          history.materialName ===

          row.materialName

      )

      .map(

        (history) =>

          history.size

      )

  )

].map((size) => (

  <option

    key={size}

    value={size}

  />

))}

                          </datalist>

                        </div>

                        <div className="p-2">

                          <input

  type="text"

  inputMode="numeric"

  value={row.quantity}

                            onChange={(e) =>

                              updateRow(
                                sectionIndex,
                                index,
                                "quantity",
                                e.target.value
                              )

                            }

                            onWheel={(e) =>
  e.target.blur()
}

                            className="
      w-full
      border
      rounded-xl
      px-3
      py-2
      text-right
    "
                          />

                        </div>

                        <div className="p-2">

                          <input
                            type="number"

                            value={row.price}

                            readOnly

                            className="
      w-full
      border
      rounded-xl
      px-3
      py-2
      text-right
      bg-slate-100
    "
                          />

                        </div>



                        <div className="
            p-3
            text-right
            flex
            items-center
            justify-end
          ">

                          {(
                            Number(row.quantity || 0)
                            *
                            Number(row.price || 0)
                          ).toLocaleString()} 円

                        </div>

                        <div className="p-2">

                          <input
                            type="text"
                            className="
                w-full
                border
                rounded-xl
                px-3
                py-2
              "
                          />

                        </div>

                      </div>

                    )
                  )}

                </div>

                <div className="
    flex
    justify-end
    text-xl
    font-bold
  ">

                  現場合計：

                  {section.rows

                    .reduce(

                      (total, row) =>

                        total +

                        (
                          Number(row.quantity || 0)
                          *
                          Number(row.price || 0)
                        ),

                      0

                    )

                    .toLocaleString()

                  } 円

                </div>

              </div>

            )
          )}

        </div>

      )}

      {page === "現場材料一覧" && (

        <div className="
  bg-white
  rounded-3xl
  border
  p-6
  space-y-6
">

  <div className="
  flex
  gap-4
  flex-wrap
  items-end
">

  <div>

    <div className="
      text-sm
      font-medium
      mb-1
    ">
      担当者
    </div>

    <select

      value={selectedUser}

      onChange={(e) =>
        setSelectedUser(
          e.target.value
        )
      }

      className="
        border
        rounded-2xl
        px-4
        py-3
        w-[200px]
      "
    >

      <option value="">
        全担当者
      </option>

      {userList.map((user) => (

        <option
          key={user}
          value={user}
        >

          {user}

        </option>

      ))}

    </select>

  </div>

  <div>

    <div className="
      text-sm
      font-medium
      mb-1
    ">
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
        border
        rounded-2xl
        px-4
        py-3
      "
    />

  </div>

  <div>

    <div className="
      text-sm
      font-medium
      mb-1
    ">
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

      className="
        border
        rounded-2xl
        px-4
        py-3
      "
    />

  </div>

</div>        
          
          
<input

  type="text"

  placeholder="現場名検索"

  value={searchSiteName}

  onChange={(e)=>

    setSearchSiteName(

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

          

          <div className="
    space-y-4
  ">

            {materialReports

  .filter((report) => {

  const reportMonth =
    report.reportDate?.slice(0, 7);

  if (

  !selectedUser

  &&

  !startMonth

  &&

  !endMonth

  &&

  !searchSiteName

) {

  return false;

}

return (

  (

    !selectedUser ||

    report.userName ===

    selectedUser

  )

  &&

  (

    !startMonth ||

    reportMonth >=

    startMonth

  )

  &&

  (

    !endMonth ||

    reportMonth <=

    endMonth

  )

  &&

  (

    !searchSiteName ||

    report.siteName

      ?.includes(

        searchSiteName

      )

  )

);

})

  .map(

              (report, index) => {

                const total =

                  report.sections.reduce(

                    (sectionTotal, section) =>

                      sectionTotal +

                      section.rows.reduce(

                        (rowTotal, row) =>

                          rowTotal +

                          (
                            Number(
                              row.quantity || 0
                            )

                            *

                            Number(
                              row.price || 0
                            )

                          ),

                        0

                      ),

                    0

                  );

                return (

                 <div
  key={index}
  className="
    border
    rounded-2xl
    p-4
  "
>

  <div className="
  flex
  items-center
  justify-between
  gap-4
">

 <div className="
  flex
  flex-wrap
  items-center
  gap-6
  text-sm
  font-medium
">

                      <div className="w-[120px]">
                        {report.reportDate || "-"}
                      </div>

                      <div className="w-[220px]">
                        {report.siteName || "-"}
                      </div>

                      <div className="w-[120px]">
                        {report.userName || "-"}
                      </div>

                      <div className="w-[120px]">

                        会社
                        {report.sections.length}
                        件

                      </div>

                      <div className="
    w-[140px]
    font-bold
    text-right
  ">

                        ¥
                        {total.toLocaleString()}

                      </div>

                    </div>


                    <div className="
  flex
  gap-2
">

                      <button

                        onClick={() =>

                          setSelectedReport(

                            selectedReport === report
                              ? null
                              : report

                          )

                        }

                        className="
      bg-sky-500
      text-white
      px-4
      py-2
      rounded-xl
    "
                      >

                        詳細

                      </button>

                      <button

                      onClick={() => {

  setReportDate(
    report.reportDate
  );

  setSiteName(
    report.siteName
  );

  setUserName(
    report.userName
  );

  setCompanySections(
    report.sections
  );

  setEditIndex(index);

  setPage(
    "現場材料作成"
  );

}}

                        className="
                        bg-amber-500
                        text-white
                        px-4
                        py-2
                        rounded-xl
                        "
                      >

                        編集

                       </button>

                       <button

  onClick={() =>

    exportPDF(
      report
    )

  }

  className="
    bg-rose-500
    text-white
    px-4
    py-2
    rounded-xl
  "

>

  PDF

</button>

<button

  onClick={() =>

    exportExcel(
      report
    )

  }

  className="
    bg-emerald-500
    text-white
    px-4
    py-2
    rounded-xl
  "

>

  Excel

</button>

                      <button

                        onClick={() => {

  if (
    !window.confirm(
      "本当に削除しますか？"
    )
  ) {
    return;
  }

  const updated =

    materialReports.filter(

      (_, i) => i !== index

    );

  setMaterialReports(
    updated
  );

  if (
    selectedReport === report
  ) {

    setSelectedReport(
      null
    );

  }

}}

                        className="
      bg-red-500
      text-white
      px-4
      py-2
      rounded-xl
    "
                      >

                        削除

                      </button>

                    </div>

</div>

{selectedReport === report && (
  <div className="
    mt-4
    border-t
    pt-4
    space-y-4
  ">

    {report.sections.map(
      (section, sectionIndex) => (

        <div
          key={sectionIndex}
          className="
            border
            rounded-2xl
            p-4
          "
        >

          <div className="
            font-bold
            text-lg
            mb-3
          ">
            {section.companyName}
          </div>

<div
  className="
    grid
    grid-cols-5
    gap-4
    bg-slate-100
    font-bold
    p-2
    rounded-xl
  "
>

  <div>材料名</div>

  <div>型番</div>

  <div>数量</div>

  <div>単価</div>

  <div>合計</div>

</div>
<div className="
  text-right
  font-bold
  mt-3
">

  会社合計：

  ¥

  {section.rows
    .reduce(
      (total, row) =>
        total +
        (
          Number(row.quantity || 0)
          *
          Number(row.price || 0)
        ),
      0
    )
    .toLocaleString()
  }

</div>
          {section.rows.map(
            (row, rowIndex) => (

              <div
                key={rowIndex}
                className="
                  grid
                  grid-cols-5
                  gap-4
                  py-1
                  border-b
                "
              >

                <div>
                  {row.materialName}
                </div>

                <div>
                  {row.size}
                </div>

                <div>
                  {row.quantity}
                </div>

                <div>
                  ¥{Number(row.price).toLocaleString()}
                </div>

                <div>
                  ¥{(
                    Number(row.quantity || 0)
                    *
                    Number(row.price || 0)
                  ).toLocaleString()}
                </div>

              </div>

            )
          )}

        </div>

      )
    )}

<div className="
  text-right
  text-xl
  font-bold
  border-t
  pt-3
">

  総額：

  ¥

  {report.sections
    .reduce(
      (grandTotal, section) =>
        grandTotal +
        section.rows.reduce(
          (sectionTotal, row) =>
            sectionTotal +
            (
              Number(row.quantity || 0)
              *
              Number(row.price || 0)
            ),
          0
        ),
      0
    )
    .toLocaleString()
  }

</div>

  </div>

)}

                  </div>


                );
              }

            )}

          </div>

        </div>

            )}

    </div>

  );

}