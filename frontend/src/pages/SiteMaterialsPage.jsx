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

const [selectedDate,
  setSelectedDate] =
    useState("全て");

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

    const dateMatch =

      selectedDate === "全て"

      ||

      row.orderDate ===
        selectedDate;

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
        全ての会社
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
      type="date"
      value={
        selectedDate === "全て"
          ? ""
          : selectedDate
      }
      onChange={(e) =>

        setSelectedDate(

          e.target.value ||
          "全て"

        )
      }
      className="border rounded-2xl px-4 py-3"
    />

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

            <div className="grid grid-cols-[2fr_2fr_1fr] bg-slate-100 font-semibold text-sm">

              <div className="p-3">
                材料名
              </div>

              <div className="p-3">
                型番
              </div>

              <div className="p-3 text-right">
                使用数
              </div>

            </div>

            {items.map(
              (row, index) => (

                <div
                  key={index}
                  className="grid grid-cols-[2fr_2fr_1fr] border-t text-sm"
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

                </div>

              )
            )}

          </div>

        </div>

      ))}

    </div>

  );

}