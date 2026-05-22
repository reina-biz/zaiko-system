import { useState } from "react";
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

  rows.filter((row) => {

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

  });
  
    const groupedSites =

    filteredRows.reduce(
      (acc, row) => {

        const site =
          row.siteName ||
          "未設定";

        if (!acc[site]) {
          acc[site] = [];
        }

        acc[site].push(row);

        return acc;

      },
      {}
    );

  return (

    <div className="space-y-6">

        <div className="bg-white rounded-3xl shadow-sm p-6">

  <div className="flex flex-wrap gap-4">

    

    <input
  type="month"
  value={startMonth}
  onChange={(e) =>
    setStartMonth(
      e.target.value
    )
  }
  className="border rounded-2xl px-4 py-3"
/>

<input
  type="month"
  value={endMonth}
  onChange={(e) =>
    setEndMonth(
      e.target.value
    )
  }
  className="border rounded-2xl px-4 py-3"
/>
<select
      value={selectedCompany}
      onChange={(e) =>
        setSelectedCompany(
          e.target.value
        )
      }
      className="border rounded-2xl px-4 py-3"
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
    <input
      type="text"
      placeholder="現場名検索"
      value={searchSite}
      onChange={(e) =>
        setSearchSite(
          e.target.value
        )
      }
      className="border rounded-2xl px-4 py-3"
    />

  </div>

</div>

      {Object.entries(
        groupedSites
      ).map(([site, items]) => (

        <div
          key={site}
          className="bg-white rounded-3xl shadow-sm p-6"
        >

          <h2 className="text-2xl font-bold mb-4">

            {site}

          </h2>

          <div className="overflow-hidden rounded-2xl border">

            <div className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr] bg-slate-100 font-semibold text-sm">

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
                  className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr] border-t text-sm"
                >

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
<div className="p-4 text-right font-bold text-lg border-t">

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

              )
            )}

          </div>

        </div>

      ))}

    </div>

  );

}