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

 <div key={company}>

  

{Object.entries(
  sites
).map(([site, items]) => (

        <div
          key={site}
          className="bg-white rounded-3xl shadow-sm p-6 mb-6" 
        >

          <div className="mb-2">

  <div className="text-lg font-semibold text-slate-700">

    {company}

  </div>

  <div className="text-sm text-slate-800">

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

    {selectedCompany}

    {"　"}

    {site}

  </div>

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

        ))}

      </div>

      ))}



    </div>

  );

}