import { useEffect, useState } from "react";

export default function HistoryPage({

  rows,
  setHistoryRows,
  companyList,

}) {

  const [selectedCompany, setSelectedCompany] =
    useState("全て");

  const [search, setSearch] =
    useState("");

  
  const [openIndex, setOpenIndex] =

     useState(null);


  const [editedRows, setEditedRows] =
    useState(rows);

  useEffect(() => {

    setEditedRows(rows);

  }, [rows]);

  const filteredRows =

  

  [...editedRows]

    .reverse()

    .filter((row) => {

      const companyMatch =

        selectedCompany === "全て"

        ||

        row.companyName ===
        selectedCompany;

      const keyword =
        search.toLowerCase();

      const searchMatch =

        row.materialName
          ?.toLowerCase()
          .includes(keyword)

        ||

        row.size
          ?.toLowerCase()
          .includes(keyword);

      return (
        companyMatch
        &&
        searchMatch
      );

    });

    const groupedRows = Object.values(

  filteredRows.reduce((acc, row) => {

    const key =

      `${row.orderDate}_${row.companyName}_${row.siteName}`;

    if (!acc[key]) {

      acc[key] = {

        orderDate: row.orderDate,

        companyName: row.companyName,

        siteName: row.siteName,

        rows: [],

      };

    }

    acc[key].rows.push(row);

    return acc;

  }, {})

);

  

  

  return (

    <div className="w-full space-y-6">

      <div className="bg-white rounded-3xl shadow-sm p-6">

        <div className="flex items-center justify-between">

          

          <div className="flex gap-3">

            <select
              value={selectedCompany}
              onChange={(e) =>
                setSelectedCompany(
                  e.target.value
                )
              }
              className="border rounded-xl px-4 py-2"
            >

              <option value="全て">
                全て
              </option>

              {companyList?.map((company) => (

                <option
                  key={company}
                  value={company}
                >
                  {company}
                </option>

              ))}

            </select>

            <input
              type="text"
              placeholder="検索"
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="border rounded-xl px-4 py-2"
            />

          </div>

        </div>

      </div>

      <div className="space-y-4">

  {groupedRows.map((group, index) => {

    const isOpen =

      openIndex === index;

    return (

      <div

        key={index}

        className="bg-white rounded-3xl shadow-sm p-6"

      >

        <div className="flex justify-between items-center">

          <div>

            <div className="text-sm text-slate-500">

              {group.orderDate}

            </div>

            <div className="text-lg font-bold">

              {group.companyName}

            </div>

            <div className="text-sm text-slate-600">

              {group.siteName}

            </div>

            <div className="text-xs text-slate-400 mt-1">

              材料 {group.rows.length}件

            </div>

          </div>

          <button

            onClick={() =>

              setOpenIndex(

                isOpen

                  ? null

                  : index

              )

            }

            className="bg-slate-700 text-white px-4 py-2 rounded-xl"

          >

            {

              isOpen

              ? "閉じる"

              : "詳細"

            }

          </button>

        </div>

        {

          isOpen && (

            <div className="mt-6 space-y-2">

              {

                group.rows.map(

                  (row, i) => (

                    <div

                      key={i}

                      className="grid grid-cols-[2fr_1.5fr_80px_80px_100px_2fr] gap-4 border rounded-xl p-3 text-sm"

                    >

                      <div>

                        {row.materialName}

                      </div>

                      <div>

                        {row.size}

                      </div>

                      <div className="text-right">

                        {row.quantity}

                      </div>

                      <div className="text-right">

                        {row.used}

                      </div>

                      <div className="text-right">

                        ¥{row.price}

                      </div>

                      <div>

                        {row.note}

                      </div>

                    </div>

                  )

                )

              }

            </div>

          )

        }

      </div>

    );

  })}

      </div>

    </div>

  );

}